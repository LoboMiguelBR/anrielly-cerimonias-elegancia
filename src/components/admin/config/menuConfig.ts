
export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  section: string;
}

export const menuItems: MenuItem[] = [
  // Dashboard
  { id: 'dashboard', label: 'Dashboard', icon: 'BarChart3', section: 'dashboard' },

  // Gestão Comercial
  { id: 'gestao-comercial', label: 'Gestão Comercial', icon: 'TrendingUp', section: 'comercial' },
  { id: 'leads', label: 'Leads', icon: 'Users', section: 'comercial' },
  { id: 'quotes', label: 'Orçamentos', icon: 'FileText', section: 'comercial' },
  { id: 'proposals', label: 'Propostas', icon: 'Send', section: 'comercial' },
  { id: 'contracts', label: 'Contratos', icon: 'FileSignature', section: 'comercial' },

  // Eventos e Clientes
  { id: 'events', label: 'Eventos', icon: 'Calendar', section: 'eventos' },
  { id: 'questionarios', label: 'Questionários', icon: 'ClipboardList', section: 'eventos' },
  { id: 'historias-casais', label: 'Histórias dos Casais', icon: 'Heart', section: 'eventos' },

  // Templates (Nova seção centralizada)
  { id: 'templates', label: 'Templates', icon: 'Layout', section: 'configuracoes' },
  { id: 'professionals', label: 'Profissionais', icon: 'UserCheck', section: 'configuracoes' },
  { id: 'testimonials', label: 'Depoimentos', icon: 'MessageSquare', section: 'configuracoes' },
  { id: 'gallery', label: 'Galeria', icon: 'Image', section: 'configuracoes' },
  { id: 'landing-pages', label: 'Landing Pages', icon: 'Globe', section: 'configuracoes' },
  { id: 'users', label: 'Usuários', icon: 'Settings', section: 'configuracoes' }
];

export const menuSections = {
  dashboard: 'Dashboard',
  comercial: 'Gestão Comercial',
  eventos: 'Eventos & Clientes',
  configuracoes: 'Configurações'
};
