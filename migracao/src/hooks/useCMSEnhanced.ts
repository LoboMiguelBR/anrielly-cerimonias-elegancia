import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  CMSPage, 
  CMSSection, 
  CMSTemplate,
  CMSVersion,
  CMSRevision,
  MediaAsset,
  CMSForm,
  FormSubmission,
  CMSAnalytics,
  CMSFilters,
  CMSSearchResult,
  PageStatus,
  SectionType,
  CreatePageData,
  UpdatePageData,
  CreateSectionData,
  UpdateSectionData
} from '@/types/cms';
import { useAuth } from '@/hooks/useAuthEnhanced';

// Chaves de query para cache
export const cmsKeys = {
  all: ['cms'] as const,
  pages: () => [...cmsKeys.all, 'pages'] as const,
  pagesList: (filters: CMSFilters) => [...cmsKeys.pages(), 'list', { filters }] as const,
  page: (id: string) => [...cmsKeys.pages(), 'detail', id] as const,
  pageBySlug: (slug: string) => [...cmsKeys.pages(), 'slug', slug] as const,
  sections: () => [...cmsKeys.all, 'sections'] as const,
  sectionsList: (pageId?: string) => [...cmsKeys.sections(), 'list', { pageId }] as const,
  section: (id: string) => [...cmsKeys.sections(), 'detail', id] as const,
  templates: () => [...cmsKeys.all, 'templates'] as const,
  template: (id: string) => [...cmsKeys.templates(), 'detail', id] as const,
  versions: (pageId: string) => [...cmsKeys.page(pageId), 'versions'] as const,
  analytics: (pageId: string) => [...cmsKeys.page(pageId), 'analytics'] as const,
  media: () => [...cmsKeys.all, 'media'] as const,
  forms: () => [...cmsKeys.all, 'forms'] as const,
};

// Serviços CMS
class CMSService {
  static async getPages(filters?: CMSFilters): Promise<CMSSearchResult> {
    let query = supabase
      .from('website_pages')
      .select('*', { count: 'exact' });

    // Aplicar filtros
    if (filters?.status?.length) {
      query = query.in('status', filters.status);
    }

    if (filters?.page_type?.length) {
      query = query.in('page_type', filters.page_type);
    }

    if (filters?.author_id) {
      query = query.eq('author_id', filters.author_id);
    }

    if (filters?.date_range) {
      query = query
        .gte('created_at', filters.date_range.start)
        .lte('created_at', filters.date_range.end);
    }

    if (filters?.search_query) {
      query = query.or(`
        title.ilike.%${filters.search_query}%,
        content.ilike.%${filters.search_query}%,
        meta_description.ilike.%${filters.search_query}%
      `);
    }

    if (filters?.tags?.length) {
      query = query.contains('tags', filters.tags);
    }

    query = query.order('order_index', { ascending: true });

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      pages: data || [],
      total_count: count || 0,
      page: 1,
      per_page: 50,
      total_pages: Math.ceil((count || 0) / 50),
      filters_applied: filters || {},
    };
  }

  static async getPageById(id: string): Promise<CMSPage | null> {
    const { data, error } = await supabase
      .from('website_pages')
      .select(`
        *,
        sections:website_sections(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data;
  }

  static async getPageBySlug(slug: string): Promise<CMSPage | null> {
    const { data, error } = await supabase
      .from('website_pages')
      .select(`
        *,
        sections:website_sections(*)
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data;
  }

  static async createPage(pageData: CreatePageData): Promise<CMSPage> {
    const { data, error } = await supabase
      .from('website_pages')
      .insert([{
        ...pageData,
        version: 1,
        analytics: {
          views: 0,
          unique_views: 0,
          bounce_rate: 0,
          avg_time_on_page: 0,
        },
      }])
      .select()
      .single();

    if (error) throw error;

    // Criar versão inicial
    await CMSService.createVersion(data.id, 'Versão inicial', data);

    return data;
  }

  static async updatePage(id: string, updates: UpdatePageData): Promise<CMSPage> {
    // Buscar página atual para versionamento
    const currentPage = await CMSService.getPageById(id);
    if (!currentPage) throw new Error('Página não encontrada');

    const { data, error } = await supabase
      .from('website_pages')
      .update({
        ...updates,
        version: currentPage.version + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Criar nova versão
    await CMSService.createVersion(id, 'Atualização', data);

    // Registrar revisão
    await CMSService.createRevision(id, null, 'update', updates);

    return data;
  }

  static async deletePage(id: string): Promise<void> {
    // Deletar seções primeiro
    await supabase
      .from('website_sections')
      .delete()
      .eq('page_id', id);

    // Deletar versões
    await supabase
      .from('cms_versions')
      .delete()
      .eq('page_id', id);

    // Deletar revisões
    await supabase
      .from('cms_revisions')
      .delete()
      .eq('page_id', id);

    // Deletar página
    const { error } = await supabase
      .from('website_pages')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  static async publishPage(id: string): Promise<CMSPage> {
    const updates = {
      status: 'published' as PageStatus,
      publish_at: new Date().toISOString(),
    };

    const updatedPage = await CMSService.updatePage(id, updates);
    await CMSService.createRevision(id, null, 'publish', updates);

    return updatedPage;
  }

  static async unpublishPage(id: string): Promise<CMSPage> {
    const updates = {
      status: 'draft' as PageStatus,
      unpublish_at: new Date().toISOString(),
    };

    const updatedPage = await CMSService.updatePage(id, updates);
    await CMSService.createRevision(id, null, 'unpublish', updates);

    return updatedPage;
  }

  static async getSections(pageId?: string): Promise<CMSSection[]> {
    let query = supabase
      .from('website_sections')
      .select('*');

    if (pageId) {
      query = query.eq('page_id', pageId);
    }

    query = query.order('order_index', { ascending: true });

    const { data, error } = await query;

    if (error) throw error;
    return data || [];
  }

  static async getSectionById(id: string): Promise<CMSSection | null> {
    const { data, error } = await supabase
      .from('website_sections')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data;
  }

  static async createSection(sectionData: CreateSectionData): Promise<CMSSection> {
    const { data, error } = await supabase
      .from('website_sections')
      .insert([{
        ...sectionData,
        version: 1,
        structured_content: {
          blocks: [],
          schema_version: '1.0',
        },
      }])
      .select()
      .single();

    if (error) throw error;

    // Registrar revisão
    if (sectionData.page_id) {
      await CMSService.createRevision(sectionData.page_id, data.id, 'create', sectionData);
    }

    return data;
  }

  static async updateSection(id: string, updates: UpdateSectionData): Promise<CMSSection> {
    // Buscar seção atual
    const currentSection = await CMSService.getSectionById(id);
    if (!currentSection) throw new Error('Seção não encontrada');

    const { data, error } = await supabase
      .from('website_sections')
      .update({
        ...updates,
        version: currentSection.version + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Registrar revisão
    if (currentSection.page_id) {
      await CMSService.createRevision(currentSection.page_id, id, 'update', updates);
    }

    return data;
  }

  static async deleteSection(id: string): Promise<void> {
    // Buscar seção para registrar revisão
    const section = await CMSService.getSectionById(id);

    const { error } = await supabase
      .from('website_sections')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Registrar revisão
    if (section?.page_id) {
      await CMSService.createRevision(section.page_id, id, 'delete', { deleted: true });
    }
  }

  static async reorderSections(pageId: string, sectionIds: string[]): Promise<void> {
    const updates = sectionIds.map((id, index) => ({
      id,
      order_index: index,
    }));

    for (const update of updates) {
      await supabase
        .from('website_sections')
        .update({ order_index: update.order_index })
        .eq('id', update.id);
    }

    // Registrar revisão
    await CMSService.createRevision(pageId, null, 'update', { reordered_sections: sectionIds });
  }

  static async getTemplates(): Promise<CMSTemplate[]> {
    const { data, error } = await supabase
      .from('cms_templates')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async getTemplateById(id: string): Promise<CMSTemplate | null> {
    const { data, error } = await supabase
      .from('cms_templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    return data;
  }

  static async createPageFromTemplate(templateId: string, pageData: Partial<CreatePageData>): Promise<CMSPage> {
    const template = await CMSService.getTemplateById(templateId);
    if (!template) throw new Error('Template não encontrado');

    // Criar página baseada no template
    const newPageData: CreatePageData = {
      ...pageData,
      template_id: templateId,
      settings: {
        ...template.page_structure,
        ...pageData.settings,
      },
    } as CreatePageData;

    const page = await CMSService.createPage(newPageData);

    // Criar seções baseadas no template
    for (const templateSection of template.default_sections) {
      await CMSService.createSection({
        page_id: page.id,
        section_type: templateSection.section_type,
        content: templateSection.default_content,
        settings: templateSection.default_settings,
        styling: templateSection.default_styling,
        order_index: templateSection.order_index,
        is_active: true,
        tenant_id: page.tenant_id,
        responsive_settings: {
          desktop: { visible: true },
          tablet: { visible: true },
          mobile: { visible: true },
        },
        animations: {
          entrance: { enabled: false, type: '', duration: 0, delay: 0, easing: '', repeat: false },
          scroll: { enabled: false, type: '', duration: 0, delay: 0, easing: '', repeat: false },
          hover: { enabled: false, type: '', duration: 0, delay: 0, easing: '', repeat: false },
        },
        structured_content: {
          blocks: [],
          schema_version: '1.0',
        },
        custom_attributes: {},
      });
    }

    return page;
  }

  static async getVersions(pageId: string): Promise<CMSVersion[]> {
    const { data, error } = await supabase
      .from('cms_versions')
      .select('*')
      .eq('page_id', pageId)
      .order('version_number', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async createVersion(pageId: string, changeSummary: string, contentSnapshot: any): Promise<CMSVersion> {
    // Buscar última versão
    const { data: lastVersion } = await supabase
      .from('cms_versions')
      .select('version_number')
      .eq('page_id', pageId)
      .order('version_number', { ascending: false })
      .limit(1)
      .single();

    const versionNumber = (lastVersion?.version_number || 0) + 1;

    const { data, error } = await supabase
      .from('cms_versions')
      .insert([{
        page_id: pageId,
        version_number: versionNumber,
        title: `Versão ${versionNumber}`,
        content_snapshot: contentSnapshot,
        change_summary: changeSummary,
        created_by: '', // Será preenchido pelo RLS
        is_published: false,
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async restoreVersion(versionId: string): Promise<CMSPage> {
    const { data: version, error: versionError } = await supabase
      .from('cms_versions')
      .select('*')
      .eq('id', versionId)
      .single();

    if (versionError) throw versionError;

    // Restaurar página com o conteúdo da versão
    const restoredPage = await CMSService.updatePage(version.page_id, version.content_snapshot);

    // Marcar versão como publicada
    await supabase
      .from('cms_versions')
      .update({ is_published: true })
      .eq('id', versionId);

    return restoredPage;
  }

  static async createRevision(
    pageId: string, 
    sectionId: string | null, 
    action: CMSRevision['action'], 
    changes: Record<string, any>
  ): Promise<CMSRevision> {
    const { data, error } = await supabase
      .from('cms_revisions')
      .insert([{
        page_id: pageId,
        section_id: sectionId,
        action,
        changes,
        created_by: '', // Será preenchido pelo RLS
        ip_address: '', // Será preenchido pelo cliente se necessário
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getAnalytics(pageId: string): Promise<CMSAnalytics> {
    // Implementar lógica de analytics
    // Por enquanto, retornar dados mock
    return {
      page_id: pageId,
      period: 'month',
      metrics: {
        page_views: 0,
        unique_visitors: 0,
        bounce_rate: 0,
        avg_session_duration: 0,
        conversion_rate: 0,
        form_submissions: 0,
        social_shares: 0,
      },
      traffic_sources: [],
      popular_content: [],
      user_behavior: [],
      generated_at: new Date().toISOString(),
    };
  }

  static async getMediaAssets(): Promise<MediaAsset[]> {
    const { data, error } = await supabase
      .from('media_assets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  static async uploadMediaAsset(file: File, metadata: Partial<MediaAsset>): Promise<MediaAsset> {
    // Upload do arquivo para o storage
    const fileName = `${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('media')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Obter URL pública
    const { data: urlData } = supabase.storage
      .from('media')
      .getPublicUrl(fileName);

    // Criar registro no banco
    const { data, error } = await supabase
      .from('media_assets')
      .insert([{
        filename: fileName,
        original_filename: file.name,
        file_path: uploadData.path,
        file_url: urlData.publicUrl,
        file_size: file.size,
        mime_type: file.type,
        ...metadata,
        uploaded_by: '', // Será preenchido pelo RLS
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async deleteMediaAsset(id: string): Promise<void> {
    // Buscar asset para obter o path
    const { data: asset } = await supabase
      .from('media_assets')
      .select('file_path')
      .eq('id', id)
      .single();

    if (asset) {
      // Deletar arquivo do storage
      await supabase.storage
        .from('media')
        .remove([asset.file_path]);
    }

    // Deletar registro do banco
    const { error } = await supabase
      .from('media_assets')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}

// Hook principal para páginas CMS (compatível com código existente)
export function useWebsitePages(filters?: CMSFilters) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Aplicar filtro de tenant automaticamente
  const effectiveFilters = {
    ...filters,
    tenant_id: user?.tenant_id,
  };

  const {
    data: pagesResult,
    isLoading,
    error,
    refetch: fetchPages,
  } = useQuery({
    queryKey: cmsKeys.pagesList(effectiveFilters),
    queryFn: () => CMSService.getPages(effectiveFilters),
    enabled: !!user,
    staleTime: 2 * 60 * 1000,
  });

  const createPageMutation = useMutation({
    mutationFn: CMSService.createPage,
    onSuccess: () => {
      queryClient.invalidateQueries(cmsKeys.pages());
      toast.success('Página criada com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao criar página:', error);
      toast.error('Erro ao criar página');
    },
  });

  const updatePageMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdatePageData }) =>
      CMSService.updatePage(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries(cmsKeys.pages());
      toast.success('Página atualizada com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar página:', error);
      toast.error('Erro ao atualizar página');
    },
  });

  const deletePageMutation = useMutation({
    mutationFn: CMSService.deletePage,
    onSuccess: () => {
      queryClient.invalidateQueries(cmsKeys.pages());
      toast.success('Página removida com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao remover página:', error);
      toast.error('Erro ao remover página');
    },
  });

  return {
    // Compatibilidade com código existente
    pages: pagesResult?.pages || [],
    isLoading,
    fetchPages,
    createPage: (pageData: CreatePageData) => createPageMutation.mutateAsync(pageData),
    updatePage: (id: string, updates: UpdatePageData) => 
      updatePageMutation.mutateAsync({ id, updates }),
    deletePage: (id: string) => deletePageMutation.mutateAsync(id),

    // Novos dados
    pagesResult,
    totalCount: pagesResult?.total_count || 0,
    totalPages: pagesResult?.total_pages || 0,

    // Estados de loading
    isCreating: createPageMutation.isLoading,
    isUpdating: updatePageMutation.isLoading,
    isDeleting: deletePageMutation.isLoading,
  };
}

// Hook para seções do website (compatível com código existente)
export function useWebsiteSections(pageId?: string) {
  const queryClient = useQueryClient();

  const {
    data: sections,
    isLoading,
    error,
    refetch: fetchSections,
  } = useQuery({
    queryKey: cmsKeys.sectionsList(pageId),
    queryFn: () => CMSService.getSections(pageId),
    enabled: !!pageId,
    staleTime: 2 * 60 * 1000,
  });

  const createSectionMutation = useMutation({
    mutationFn: CMSService.createSection,
    onSuccess: () => {
      queryClient.invalidateQueries(cmsKeys.sections());
      toast.success('Seção criada com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao criar seção:', error);
      toast.error('Erro ao criar seção');
    },
  });

  const updateSectionMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateSectionData }) =>
      CMSService.updateSection(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries(cmsKeys.sections());
      toast.success('Seção atualizada com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar seção:', error);
      toast.error('Erro ao atualizar seção');
    },
  });

  const deleteSectionMutation = useMutation({
    mutationFn: CMSService.deleteSection,
    onSuccess: () => {
      queryClient.invalidateQueries(cmsKeys.sections());
      toast.success('Seção removida com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao remover seção:', error);
      toast.error('Erro ao remover seção');
    },
  });

  const reorderSectionsMutation = useMutation({
    mutationFn: ({ pageId, sectionIds }: { pageId: string; sectionIds: string[] }) =>
      CMSService.reorderSections(pageId, sectionIds),
    onSuccess: () => {
      queryClient.invalidateQueries(cmsKeys.sections());
      toast.success('Seções reordenadas com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao reordenar seções:', error);
      toast.error('Erro ao reordenar seções');
    },
  });

  return {
    // Compatibilidade com código existente
    sections: sections || [],
    isLoading,
    fetchSections,
    createSection: (sectionData: CreateSectionData) => createSectionMutation.mutateAsync(sectionData),
    updateSection: (id: string, updates: UpdateSectionData) => 
      updateSectionMutation.mutateAsync({ id, updates }),
    deleteSection: (id: string) => deleteSectionMutation.mutateAsync(id),
    toggleSectionActive: (id: string, isActive: boolean) => 
      updateSectionMutation.mutateAsync({ id, updates: { is_active: isActive } }),

    // Novos métodos
    reorderSections: (pageId: string, sectionIds: string[]) =>
      reorderSectionsMutation.mutateAsync({ pageId, sectionIds }),

    // Estados de loading
    isCreating: createSectionMutation.isLoading,
    isUpdating: updateSectionMutation.isLoading,
    isDeleting: deleteSectionMutation.isLoading,
    isReordering: reorderSectionsMutation.isLoading,
  };
}

// Hook para CMS da landing page (compatível com código existente)
export function useCMSLandingPage(slug: string = 'home') {
  const {
    data: landingPage,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: cmsKeys.pageBySlug(slug),
    queryFn: () => CMSService.getPageBySlug(slug),
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  return {
    landingPage,
    loading,
    error: error?.message || null,
    refetch,
  };
}

// Hook para página específica
export function useCMSPage(pageId: string) {
  const queryClient = useQueryClient();

  const {
    data: page,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: cmsKeys.page(pageId),
    queryFn: () => CMSService.getPageById(pageId),
    enabled: !!pageId,
    staleTime: 2 * 60 * 1000,
  });

  const updatePageMutation = useMutation({
    mutationFn: (updates: UpdatePageData) => CMSService.updatePage(pageId, updates),
    onSuccess: (updatedPage) => {
      queryClient.setQueryData(cmsKeys.page(pageId), updatedPage);
      queryClient.invalidateQueries(cmsKeys.pages());
      toast.success('Página atualizada com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao atualizar página:', error);
      toast.error('Erro ao atualizar página');
    },
  });

  const publishPageMutation = useMutation({
    mutationFn: () => CMSService.publishPage(pageId),
    onSuccess: (updatedPage) => {
      queryClient.setQueryData(cmsKeys.page(pageId), updatedPage);
      queryClient.invalidateQueries(cmsKeys.pages());
      toast.success('Página publicada com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao publicar página:', error);
      toast.error('Erro ao publicar página');
    },
  });

  const unpublishPageMutation = useMutation({
    mutationFn: () => CMSService.unpublishPage(pageId),
    onSuccess: (updatedPage) => {
      queryClient.setQueryData(cmsKeys.page(pageId), updatedPage);
      queryClient.invalidateQueries(cmsKeys.pages());
      toast.success('Página despublicada com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao despublicar página:', error);
      toast.error('Erro ao despublicar página');
    },
  });

  return {
    page,
    isLoading,
    error: error?.message || null,
    refetch,
    updatePage: (updates: UpdatePageData) => updatePageMutation.mutateAsync(updates),
    publishPage: () => publishPageMutation.mutateAsync(),
    unpublishPage: () => unpublishPageMutation.mutateAsync(),
    isUpdating: updatePageMutation.isLoading,
    isPublishing: publishPageMutation.isLoading,
    isUnpublishing: unpublishPageMutation.isLoading,
  };
}

// Hook para templates
export function useCMSTemplates() {
  const queryClient = useQueryClient();

  const {
    data: templates,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: cmsKeys.templates(),
    queryFn: CMSService.getTemplates,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });

  const createPageFromTemplateMutation = useMutation({
    mutationFn: ({ templateId, pageData }: { templateId: string; pageData: Partial<CreatePageData> }) =>
      CMSService.createPageFromTemplate(templateId, pageData),
    onSuccess: () => {
      queryClient.invalidateQueries(cmsKeys.pages());
      toast.success('Página criada a partir do template!');
    },
    onError: (error: any) => {
      console.error('Erro ao criar página do template:', error);
      toast.error('Erro ao criar página do template');
    },
  });

  return {
    templates: templates || [],
    isLoading,
    error: error?.message || null,
    refetch,
    createPageFromTemplate: (templateId: string, pageData: Partial<CreatePageData>) =>
      createPageFromTemplateMutation.mutateAsync({ templateId, pageData }),
    isCreatingFromTemplate: createPageFromTemplateMutation.isLoading,
  };
}

// Hook para versionamento
export function useCMSVersions(pageId: string) {
  const queryClient = useQueryClient();

  const {
    data: versions,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: cmsKeys.versions(pageId),
    queryFn: () => CMSService.getVersions(pageId),
    enabled: !!pageId,
    staleTime: 5 * 60 * 1000,
  });

  const restoreVersionMutation = useMutation({
    mutationFn: CMSService.restoreVersion,
    onSuccess: () => {
      queryClient.invalidateQueries(cmsKeys.page(pageId));
      queryClient.invalidateQueries(cmsKeys.versions(pageId));
      toast.success('Versão restaurada com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao restaurar versão:', error);
      toast.error('Erro ao restaurar versão');
    },
  });

  return {
    versions: versions || [],
    isLoading,
    error: error?.message || null,
    refetch,
    restoreVersion: (versionId: string) => restoreVersionMutation.mutateAsync(versionId),
    isRestoring: restoreVersionMutation.isLoading,
  };
}

// Hook para analytics
export function useCMSAnalytics(pageId: string) {
  const {
    data: analytics,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: cmsKeys.analytics(pageId),
    queryFn: () => CMSService.getAnalytics(pageId),
    enabled: !!pageId,
    staleTime: 5 * 60 * 1000,
  });

  return {
    analytics,
    isLoading,
    error: error?.message || null,
    refetch,
  };
}

// Hook para mídia
export function useCMSMedia() {
  const queryClient = useQueryClient();

  const {
    data: mediaAssets,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: cmsKeys.media(),
    queryFn: CMSService.getMediaAssets,
    staleTime: 2 * 60 * 1000,
  });

  const uploadMediaMutation = useMutation({
    mutationFn: ({ file, metadata }: { file: File; metadata: Partial<MediaAsset> }) =>
      CMSService.uploadMediaAsset(file, metadata),
    onSuccess: () => {
      queryClient.invalidateQueries(cmsKeys.media());
      toast.success('Arquivo enviado com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao enviar arquivo:', error);
      toast.error('Erro ao enviar arquivo');
    },
  });

  const deleteMediaMutation = useMutation({
    mutationFn: CMSService.deleteMediaAsset,
    onSuccess: () => {
      queryClient.invalidateQueries(cmsKeys.media());
      toast.success('Arquivo removido com sucesso!');
    },
    onError: (error: any) => {
      console.error('Erro ao remover arquivo:', error);
      toast.error('Erro ao remover arquivo');
    },
  });

  return {
    mediaAssets: mediaAssets || [],
    isLoading,
    error: error?.message || null,
    refetch,
    uploadMedia: (file: File, metadata: Partial<MediaAsset> = {}) =>
      uploadMediaMutation.mutateAsync({ file, metadata }),
    deleteMedia: (id: string) => deleteMediaMutation.mutateAsync(id),
    isUploading: uploadMediaMutation.isLoading,
    isDeleting: deleteMediaMutation.isLoading,
  };
}

// Exportações para compatibilidade
export { CMSService };
export type { CMSPage as WebsitePage, CMSSection as WebsiteSection };

