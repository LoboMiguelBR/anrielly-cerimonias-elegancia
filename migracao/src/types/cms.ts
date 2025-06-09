// Tipos CMS aprimorados (compatível com sistema existente)
export type PageStatus = 'published' | 'draft' | 'archived' | 'scheduled';
export type PageType = 'home' | 'about' | 'services' | 'contact' | 'custom' | 'landing' | 'portfolio';
export type SectionType = 'hero' | 'about' | 'services' | 'gallery' | 'testimonials' | 'contact' | 'custom' | 'cta' | 'features' | 'pricing';

// Interface principal da página (estendida, mantendo compatibilidade)
export interface CMSPage {
  // Campos existentes (mantidos para compatibilidade)
  id: string;
  title: string;
  slug: string;
  content?: string;
  meta_description?: string;
  meta_keywords?: string;
  status: PageStatus;
  page_type: PageType;
  is_published?: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
  
  // Novos campos aprimorados
  tenant_id: string;
  author_id: string;
  
  // SEO aprimorado
  seo: SEOSettings;
  
  // Configurações da página
  settings: PageSettings;
  
  // Versionamento
  version: number;
  parent_version_id?: string;
  
  // Agendamento
  publish_at?: string;
  unpublish_at?: string;
  
  // Análise
  analytics: PageAnalytics;
  
  // Relacionamentos
  sections: CMSSection[];
  template_id?: string;
  
  // Metadados
  tags: string[];
  custom_fields: Record<string, any>;
}

export interface SEOSettings {
  title?: string;
  description?: string;
  keywords: string[];
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  og_type?: string;
  twitter_card?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  robots: {
    index: boolean;
    follow: boolean;
    archive: boolean;
    snippet: boolean;
  };
  structured_data?: Record<string, any>;
}

export interface PageSettings {
  layout: 'default' | 'full_width' | 'sidebar_left' | 'sidebar_right' | 'custom';
  theme: 'light' | 'dark' | 'auto';
  header_visible: boolean;
  footer_visible: boolean;
  sidebar_visible: boolean;
  breadcrumbs_visible: boolean;
  comments_enabled: boolean;
  social_sharing_enabled: boolean;
  password_protected: boolean;
  password?: string;
  access_level: 'public' | 'private' | 'members_only' | 'admin_only';
  custom_css?: string;
  custom_js?: string;
}

export interface PageAnalytics {
  views: number;
  unique_views: number;
  bounce_rate: number;
  avg_time_on_page: number;
  last_viewed_at?: string;
  conversion_rate?: number;
  goal_completions?: number;
}

// Interface da seção (estendida, mantendo compatibilidade)
export interface CMSSection {
  // Campos existentes (mantidos para compatibilidade)
  id: string;
  title?: string;
  page_id?: string;
  section_type: SectionType;
  content: any;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
  
  // Novos campos aprimorados
  tenant_id: string;
  
  // Configurações da seção
  settings: SectionSettings;
  
  // Estilo e layout
  styling: SectionStyling;
  
  // Responsividade
  responsive_settings: ResponsiveSettings;
  
  // Animações
  animations: AnimationSettings;
  
  // Conteúdo estruturado
  structured_content: StructuredContent;
  
  // Versionamento
  version: number;
  
  // Metadados
  custom_attributes: Record<string, any>;
}

export interface SectionSettings {
  visible: boolean;
  container_width: 'full' | 'container' | 'narrow';
  background_type: 'none' | 'color' | 'image' | 'video' | 'gradient';
  background_value?: string;
  padding: SpacingSettings;
  margin: SpacingSettings;
  border: BorderSettings;
  shadow: ShadowSettings;
}

export interface SectionStyling {
  background_color?: string;
  background_image?: string;
  background_video?: string;
  background_gradient?: GradientSettings;
  text_color?: string;
  link_color?: string;
  border_color?: string;
  custom_css?: string;
}

export interface SpacingSettings {
  top: number;
  right: number;
  bottom: number;
  left: number;
  unit: 'px' | 'rem' | 'em' | '%' | 'vh' | 'vw';
}

export interface BorderSettings {
  width: number;
  style: 'none' | 'solid' | 'dashed' | 'dotted' | 'double';
  color: string;
  radius: number;
}

export interface ShadowSettings {
  enabled: boolean;
  x_offset: number;
  y_offset: number;
  blur: number;
  spread: number;
  color: string;
  inset: boolean;
}

export interface GradientSettings {
  type: 'linear' | 'radial';
  direction: number;
  stops: GradientStop[];
}

export interface GradientStop {
  color: string;
  position: number;
}

export interface ResponsiveSettings {
  desktop: ResponsiveBreakpoint;
  tablet: ResponsiveBreakpoint;
  mobile: ResponsiveBreakpoint;
}

export interface ResponsiveBreakpoint {
  visible: boolean;
  order_index?: number;
  padding?: SpacingSettings;
  margin?: SpacingSettings;
  text_size?: string;
  custom_css?: string;
}

export interface AnimationSettings {
  entrance: AnimationConfig;
  scroll: AnimationConfig;
  hover: AnimationConfig;
}

export interface AnimationConfig {
  enabled: boolean;
  type: string;
  duration: number;
  delay: number;
  easing: string;
  repeat: boolean;
}

export interface StructuredContent {
  blocks: ContentBlock[];
  schema_version: string;
}

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  data: Record<string, any>;
  settings: ContentBlockSettings;
}

export type ContentBlockType = 
  | 'text'
  | 'heading'
  | 'image'
  | 'video'
  | 'gallery'
  | 'button'
  | 'form'
  | 'testimonial'
  | 'pricing'
  | 'team_member'
  | 'feature'
  | 'spacer'
  | 'divider'
  | 'code'
  | 'embed'
  | 'custom';

export interface ContentBlockSettings {
  alignment: 'left' | 'center' | 'right' | 'justify';
  width: 'auto' | 'full' | 'custom';
  custom_width?: number;
  margin: SpacingSettings;
  padding: SpacingSettings;
}

// Templates de página
export interface CMSTemplate {
  id: string;
  name: string;
  description: string;
  category: 'landing' | 'portfolio' | 'blog' | 'ecommerce' | 'corporate' | 'event';
  preview_image: string;
  page_structure: TemplatePageStructure;
  default_sections: TemplateSectionData[];
  settings: TemplateSettings;
  is_premium: boolean;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface TemplatePageStructure {
  layout: string;
  header_type: string;
  footer_type: string;
  sidebar_enabled: boolean;
  color_scheme: string;
}

export interface TemplateSectionData {
  section_type: SectionType;
  default_content: any;
  default_settings: SectionSettings;
  default_styling: SectionStyling;
  order_index: number;
  required: boolean;
}

export interface TemplateSettings {
  customizable_colors: boolean;
  customizable_fonts: boolean;
  customizable_layout: boolean;
  max_sections: number;
  allowed_section_types: SectionType[];
}

// Versionamento e histórico
export interface CMSVersion {
  id: string;
  page_id: string;
  version_number: number;
  title: string;
  content_snapshot: any;
  created_by: string;
  created_at: string;
  is_published: boolean;
  change_summary?: string;
}

export interface CMSRevision {
  id: string;
  page_id: string;
  section_id?: string;
  action: 'create' | 'update' | 'delete' | 'publish' | 'unpublish';
  changes: Record<string, any>;
  created_by: string;
  created_at: string;
  ip_address: string;
}

// Mídia e assets
export interface MediaAsset {
  id: string;
  tenant_id: string;
  filename: string;
  original_filename: string;
  file_path: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  width?: number;
  height?: number;
  alt_text?: string;
  caption?: string;
  tags: string[];
  folder_id?: string;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}

export interface MediaFolder {
  id: string;
  tenant_id: string;
  name: string;
  parent_id?: string;
  path: string;
  created_by: string;
  created_at: string;
}

// Formulários e leads
export interface CMSForm {
  id: string;
  tenant_id: string;
  name: string;
  title: string;
  description?: string;
  fields: FormField[];
  settings: FormSettings;
  styling: FormStyling;
  notifications: FormNotification[];
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file' | 'date' | 'number';
  name: string;
  label: string;
  placeholder?: string;
  required: boolean;
  validation_rules: ValidationRule[];
  options?: FormFieldOption[];
  default_value?: any;
  order_index: number;
}

export interface FormFieldOption {
  label: string;
  value: string;
}

export interface ValidationRule {
  type: 'required' | 'email' | 'phone' | 'min_length' | 'max_length' | 'pattern';
  value?: any;
  message: string;
}

export interface FormSettings {
  submit_button_text: string;
  success_message: string;
  error_message: string;
  redirect_url?: string;
  allow_multiple_submissions: boolean;
  store_submissions: boolean;
  require_captcha: boolean;
}

export interface FormStyling {
  theme: 'default' | 'minimal' | 'modern' | 'classic';
  primary_color: string;
  button_style: 'solid' | 'outline' | 'ghost';
  field_style: 'default' | 'floating' | 'underline';
  custom_css?: string;
}

export interface FormNotification {
  type: 'email' | 'webhook' | 'slack';
  enabled: boolean;
  recipients?: string[];
  webhook_url?: string;
  message_template?: string;
}

export interface FormSubmission {
  id: string;
  form_id: string;
  data: Record<string, any>;
  ip_address: string;
  user_agent: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  created_at: string;
}

// Analytics e métricas
export interface CMSAnalytics {
  page_id: string;
  period: 'day' | 'week' | 'month' | 'year';
  metrics: {
    page_views: number;
    unique_visitors: number;
    bounce_rate: number;
    avg_session_duration: number;
    conversion_rate: number;
    form_submissions: number;
    social_shares: number;
  };
  traffic_sources: TrafficSource[];
  popular_content: PopularContent[];
  user_behavior: UserBehavior[];
  generated_at: string;
}

export interface TrafficSource {
  source: string;
  medium: string;
  visitors: number;
  percentage: number;
}

export interface PopularContent {
  section_id: string;
  section_title: string;
  interactions: number;
  time_spent: number;
}

export interface UserBehavior {
  action: string;
  element: string;
  count: number;
  avg_time_to_action: number;
}

// Filtros e busca para CMS
export interface CMSFilters {
  status?: PageStatus[];
  page_type?: PageType[];
  author_id?: string;
  date_range?: {
    start: string;
    end: string;
  };
  tags?: string[];
  search_query?: string;
  template_id?: string;
}

export interface CMSSearchResult {
  pages: CMSPage[];
  total_count: number;
  page: number;
  per_page: number;
  total_pages: number;
  filters_applied: CMSFilters;
}

// Configurações globais do CMS
export interface CMSSettings {
  tenant_id: string;
  default_template_id?: string;
  default_author_id: string;
  auto_save_interval: number;
  max_revisions: number;
  image_optimization: boolean;
  cdn_enabled: boolean;
  cache_enabled: boolean;
  seo_defaults: SEOSettings;
  social_defaults: SocialSettings;
  updated_by: string;
  updated_at: string;
}

export interface SocialSettings {
  facebook_app_id?: string;
  twitter_handle?: string;
  instagram_handle?: string;
  linkedin_company?: string;
  youtube_channel?: string;
}

// Exportações para compatibilidade
export type { CMSPage as WebsitePage };
export type { CMSSection as WebsiteSection };
export type { CMSPage as CMSLandingPage };

