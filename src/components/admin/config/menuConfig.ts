
/**
 * Sidebar menu configuration and helpers
 */

// Define the MenuItem and MenuSection types
export interface MenuItem {
  id: string; // key
  label: string;
  icon: string;
}
export interface MenuSection {
  title: string; // section
  items: MenuItem[];
}

// Raw menu config (as before)
export const menuConfig = [
  {
    section: 'Dashboard',
    items: [
      { label: 'Visão Geral', key: 'dashboard', icon: 'home' }
    ],
  },
  {
    section: 'Gestão Comercial',
    items: [
      { label: 'Leads', key: 'leads', icon: 'users' },
      { label: 'Orçamentos', key: 'quotes', icon: 'file-signature' },
      { label: 'Propostas', key: 'proposals', icon: 'clipboard-list' },
      { label: 'Contratos', key: 'contracts', icon: 'file-text' },
    ],
  },
  {
    section: 'Eventos & Clientes',
    items: [
      { label: 'Eventos', key: 'events', icon: 'calendar-days' },
      { label: 'Clientes', key: 'clients', icon: 'users' },
      { label: 'Profissionais', key: 'professionals', icon: 'user-check' },
      { label: 'Serviços', key: 'services', icon: 'star' }
    ],
  },
  {
    section: 'Website & Conteúdo',
    items: [
      { label: 'Website & CMS', key: 'website-cms', icon: 'globe' },
      { label: 'Galeria', key: 'gallery', icon: 'image' },
      { label: 'Depoimentos', key: 'testimonials', icon: 'messages-square' }
    ],
  },
  {
    section: 'Templates & Formulários',
    items: [
      { label: 'Templates de Proposta', key: 'proposal-templates', icon: 'document' },
      { label: 'Templates de Contrato', key: 'contract-templates', icon: 'file-text' },
      { label: 'Emails de Contrato', key: 'contract-email-templates', icon: 'mail' },
      { label: 'Landing Pages', key: 'landing-pages', icon: 'layers' },
      { label: 'Questionários', key: 'questionarios', icon: 'list-checks' },
      { label: 'Histórias de Casais', key: 'historias-casais', icon: 'heart' }
    ],
  },
  {
    section: 'Sistema',
    items: [
      { label: 'Vendas e Financeiro', key: 'vendas-financeiro', icon: 'dollar-sign' },
      { label: 'Gestão Comercial', key: 'gestao-comercial', icon: 'briefcase' },
      { label: 'Usuários', key: 'users', icon: 'user' },
      { label: 'Templates', key: 'templates', icon: 'copy' },
      { label: 'Analytics', key: 'analytics', icon: 'bar-chart' },
      { label: 'Configurações', key: 'settings', icon: 'settings' },
    ],
  },
];

// Converts menuConfig to the structure expected by sidebars
export function getMenuSections(): MenuSection[] {
  return menuConfig.map(section => ({
    title: section.section,
    items: (section.items || []).map(item => ({
      id: item.key,
      label: item.label,
      icon: item.icon,
    })),
  }));
}

// Flattens all menu items for tab accessibility, etc
export function getAllMenuItems(): MenuItem[] {
  return menuConfig.flatMap(section =>
    (section.items || []).map(item => ({
      id: item.key,
      label: item.label,
      icon: item.icon,
    }))
  );
}
