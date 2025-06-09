
// Tipos para CMS aprimorado
export type PageStatus = 'published' | 'draft' | 'archived' | 'scheduled';
export type PageType = 'landing' | 'blog' | 'service' | 'about' | 'contact' | 'custom';
export type SectionType = 'hero' | 'about' | 'services' | 'gallery' | 'testimonials' | 'contact' | 'custom' | 'cta' | 'features' | 'pricing';

export interface CMSPage {
  id: string;
  tenant_id: string;
  
  // Conteúdo básico
  title: string;
  slug: string;
  description: string;
  content: string;
  excerpt?: string;
  
  // Tipo e status
  page_type: PageType;
  status: PageStatus;
  
  // SEO
  seo: SEOConfig;
  
  // Design e layout
  template: string;
  sections: CMSSection[];
  theme_config: ThemeConfig;
  
  // Publicação
  published_at?: string;
  scheduled_at?: string;
  expires_at?: string;
  
  // Versionamento
  version: number;
  parent_version_id?: string;
  
  // Analytics
  view_count: number;
  
  // Metadados
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface CMSSection {
  id: string;
  page_id: string;
  section_type: SectionType;
  title: string;
  content: SectionContent;
  settings: SectionSettings;
  order_index: number;
  active: boolean;
}

export interface SectionContent {
  // Conteúdo textual
  heading?: string;
  subheading?: string;
  description?: string;
  html_content?: string;
  
  // Mídia
  images?: MediaItem[];
  videos?: MediaItem[];
  
  // Dados estruturados
  items?: ContentItem[];
  
  // Call-to-action
  cta?: CTAConfig;
  
  // Formulários
  form?: FormConfig;
}

export interface SectionSettings {
  // Layout
  layout: string;
  columns: number;
  spacing: string;
  alignment: string;
  
  // Estilo
  background: BackgroundConfig;
  text_color: string;
  padding: string;
  margin: string;
  
  // Comportamento
  animation: string;
  parallax: boolean;
  sticky: boolean;
  
  // Responsividade
  responsive: ResponsiveConfig;
}

export interface MediaItem {
  id: string;
  url: string;
  thumbnail_url?: string;
  alt_text: string;
  title?: string;
  caption?: string;
  width?: number;
  height?: number;
}

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  image?: MediaItem;
  link?: string;
  metadata: Record<string, any>;
}

export interface CTAConfig {
  text: string;
  link: string;
  style: 'primary' | 'secondary' | 'outline' | 'text';
  size: 'sm' | 'md' | 'lg';
  icon?: string;
  target: '_self' | '_blank';
}

export interface FormConfig {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
  submit_text: string;
  success_message: string;
  redirect_url?: string;
  email_notifications: boolean;
}

export interface FormField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date';
  required: boolean;
  placeholder?: string;
  options?: string[];
  validation?: string;
}

export interface BackgroundConfig {
  type: 'color' | 'gradient' | 'image' | 'video';
  color?: string;
  gradient?: GradientConfig;
  image?: MediaItem;
  video?: MediaItem;
  overlay?: OverlayConfig;
}

export interface GradientConfig {
  direction: string;
  stops: ColorStop[];
}

export interface ColorStop {
  color: string;
  position: number;
}

export interface OverlayConfig {
  enabled: boolean;
  color: string;
  opacity: number;
  blend_mode: string;
}

export interface ResponsiveConfig {
  mobile: DeviceConfig;
  tablet: DeviceConfig;
  desktop: DeviceConfig;
}

export interface DeviceConfig {
  visible: boolean;
  columns?: number;
  spacing?: string;
  padding?: string;
}

export interface SEOConfig {
  meta_title: string;
  meta_description: string;
  meta_keywords: string[];
  og_title?: string;
  og_description?: string;
  og_image?: string;
  canonical_url?: string;
  robots: string;
  schema_markup?: Record<string, any>;
}

export interface ThemeConfig {
  // Cores principais
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  text_color: string;
  background_color: string;
  
  // Tipografia
  font_family: string;
  heading_font: string;
  font_sizes: FontSizeConfig;
  
  // Espaçamento
  spacing_unit: number;
  border_radius: string;
  
  // Breakpoints
  breakpoints: BreakpointConfig;
  
  // Componentes customizados
  custom_css?: string;
}

export interface FontSizeConfig {
  xs: string;
  sm: string;
  base: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
}

export interface BreakpointConfig {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

// Templates e componentes
export interface CMSTemplate {
  id: string;
  name: string;
  description: string;
  preview_image: string;
  category: string;
  page_type: PageType;
  sections: SectionTemplate[];
  theme_config: ThemeConfig;
  active: boolean;
  premium: boolean;
  created_at: string;
  updated_at: string;
}

export interface SectionTemplate {
  section_type: SectionType;
  title: string;
  default_content: SectionContent;
  default_settings: SectionSettings;
  customizable_fields: string[];
  order_index: number;
}

// Analytics de páginas
export interface PageAnalytics {
  page_id: string;
  period_start: string;
  period_end: string;
  
  // Métricas de tráfego
  total_views: number;
  unique_visitors: number;
  bounce_rate: number;
  average_time_on_page: number;
  
  // Origens de tráfego
  traffic_sources: TrafficSource[];
  
  // Dispositivos
  device_breakdown: DeviceBreakdown;
  
  // Conversões
  form_submissions: number;
  cta_clicks: number;
  conversion_rate: number;
  
  updated_at: string;
}

export interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
}

export interface DeviceBreakdown {
  desktop: number;
  mobile: number;
  tablet: number;
}
