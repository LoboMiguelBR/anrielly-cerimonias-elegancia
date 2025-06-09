import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth, usePermissions } from '@/hooks/useAuthEnhanced';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard,
  Calendar,
  Users,
  Building2,
  FileText,
  Settings,
  BarChart3,
  MessageSquare,
  Bell,
  Search,
  Plus,
  Menu,
  LogOut,
  User,
  CreditCard,
  Shield,
  Globe,
  Briefcase,
  Star,
  Clock,
  CheckSquare,
  Heart,
  Camera,
  Music,
  Utensils,
  Car,
  Gift,
  Palette,
  MapPin
} from 'lucide-react';

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  roles?: string[];
  permissions?: Array<{ resource: string; action: string }>;
  children?: NavigationItem[];
}

// Configuração de navegação baseada em perfis
const navigationConfig: NavigationItem[] = [
  // Admin Master
  {
    title: 'Dashboard Master',
    href: '/admin-master',
    icon: LayoutDashboard,
    roles: ['admin_master'],
  },
  {
    title: 'Tenants',
    href: '/admin-master/tenants',
    icon: Building2,
    roles: ['admin_master'],
    children: [
      {
        title: 'Todos os Tenants',
        href: '/admin-master/tenants',
        icon: Building2,
        roles: ['admin_master'],
      },
      {
        title: 'Novo Tenant',
        href: '/admin-master/tenants/new',
        icon: Plus,
        roles: ['admin_master'],
      },
      {
        title: 'Configurações',
        href: '/admin-master/tenants/settings',
        icon: Settings,
        roles: ['admin_master'],
      },
    ],
  },
  {
    title: 'Financeiro',
    href: '/admin-master/financial',
    icon: CreditCard,
    roles: ['admin_master'],
    children: [
      {
        title: 'Receitas',
        href: '/admin-master/financial/revenue',
        icon: BarChart3,
        roles: ['admin_master'],
      },
      {
        title: 'Assinaturas',
        href: '/admin-master/financial/subscriptions',
        icon: CreditCard,
        roles: ['admin_master'],
      },
      {
        title: 'Relatórios',
        href: '/admin-master/financial/reports',
        icon: FileText,
        roles: ['admin_master'],
      },
    ],
  },
  {
    title: 'Sistema',
    href: '/admin-master/system',
    icon: Shield,
    roles: ['admin_master'],
    children: [
      {
        title: 'Monitoramento',
        href: '/admin-master/system/monitoring',
        icon: BarChart3,
        roles: ['admin_master'],
      },
      {
        title: 'Logs',
        href: '/admin-master/system/logs',
        icon: FileText,
        roles: ['admin_master'],
      },
      {
        title: 'Configurações',
        href: '/admin-master/system/settings',
        icon: Settings,
        roles: ['admin_master'],
      },
    ],
  },

  // Admin (Cerimonialista)
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    roles: ['admin'],
  },
  {
    title: 'Eventos',
    href: '/admin/events',
    icon: Calendar,
    roles: ['admin'],
    children: [
      {
        title: 'Todos os Eventos',
        href: '/admin/events',
        icon: Calendar,
        roles: ['admin'],
      },
      {
        title: 'Novo Evento',
        href: '/admin/events/new',
        icon: Plus,
        roles: ['admin'],
      },
      {
        title: 'Calendário',
        href: '/admin/events/calendar',
        icon: Calendar,
        roles: ['admin'],
      },
      {
        title: 'Templates',
        href: '/admin/events/templates',
        icon: FileText,
        roles: ['admin'],
      },
    ],
  },
  {
    title: 'Clientes',
    href: '/admin/clients',
    icon: Users,
    roles: ['admin'],
    children: [
      {
        title: 'Todos os Clientes',
        href: '/admin/clients',
        icon: Users,
        roles: ['admin'],
      },
      {
        title: 'Novo Cliente',
        href: '/admin/clients/new',
        icon: Plus,
        roles: ['admin'],
      },
      {
        title: 'Leads',
        href: '/admin/clients/leads',
        icon: User,
        roles: ['admin'],
      },
    ],
  },
  {
    title: 'Fornecedores',
    href: '/admin/suppliers',
    icon: Building2,
    roles: ['admin'],
    children: [
      {
        title: 'Todos os Fornecedores',
        href: '/admin/suppliers',
        icon: Building2,
        roles: ['admin'],
      },
      {
        title: 'Novo Fornecedor',
        href: '/admin/suppliers/new',
        icon: Plus,
        roles: ['admin'],
      },
      {
        title: 'Cotações',
        href: '/admin/suppliers/quotes',
        icon: FileText,
        roles: ['admin'],
      },
      {
        title: 'Contratos',
        href: '/admin/suppliers/contracts',
        icon: FileText,
        roles: ['admin'],
      },
      {
        title: 'Avaliações',
        href: '/admin/suppliers/reviews',
        icon: Star,
        roles: ['admin'],
      },
    ],
  },
  {
    title: 'CMS',
    href: '/admin/cms',
    icon: Globe,
    roles: ['admin'],
    children: [
      {
        title: 'Páginas',
        href: '/admin/cms/pages',
        icon: FileText,
        roles: ['admin'],
      },
      {
        title: 'Nova Página',
        href: '/admin/cms/pages/new',
        icon: Plus,
        roles: ['admin'],
      },
      {
        title: 'Templates',
        href: '/admin/cms/templates',
        icon: Palette,
        roles: ['admin'],
      },
      {
        title: 'Mídia',
        href: '/admin/cms/media',
        icon: Camera,
        roles: ['admin'],
      },
    ],
  },
  {
    title: 'Relatórios',
    href: '/admin/reports',
    icon: BarChart3,
    roles: ['admin'],
    children: [
      {
        title: 'Eventos',
        href: '/admin/reports/events',
        icon: Calendar,
        roles: ['admin'],
      },
      {
        title: 'Financeiro',
        href: '/admin/reports/financial',
        icon: CreditCard,
        roles: ['admin'],
      },
      {
        title: 'Clientes',
        href: '/admin/reports/clients',
        icon: Users,
        roles: ['admin'],
      },
      {
        title: 'Fornecedores',
        href: '/admin/reports/suppliers',
        icon: Building2,
        roles: ['admin'],
      },
    ],
  },
  {
    title: 'Configurações',
    href: '/admin/settings',
    icon: Settings,
    roles: ['admin'],
    children: [
      {
        title: 'Empresa',
        href: '/admin/settings/company',
        icon: Building2,
        roles: ['admin'],
      },
      {
        title: 'Usuários',
        href: '/admin/settings/users',
        icon: Users,
        roles: ['admin'],
      },
      {
        title: 'Integrações',
        href: '/admin/settings/integrations',
        icon: Globe,
        roles: ['admin'],
      },
      {
        title: 'Notificações',
        href: '/admin/settings/notifications',
        icon: Bell,
        roles: ['admin'],
      },
    ],
  },

  // Cliente (Fornecedor)
  {
    title: 'Dashboard',
    href: '/supplier',
    icon: LayoutDashboard,
    roles: ['cliente'],
  },
  {
    title: 'Meu Perfil',
    href: '/supplier/profile',
    icon: User,
    roles: ['cliente'],
    children: [
      {
        title: 'Informações',
        href: '/supplier/profile',
        icon: User,
        roles: ['cliente'],
      },
      {
        title: 'Serviços',
        href: '/supplier/profile/services',
        icon: Briefcase,
        roles: ['cliente'],
      },
      {
        title: 'Portfólio',
        href: '/supplier/profile/portfolio',
        icon: Camera,
        roles: ['cliente'],
      },
      {
        title: 'Certificações',
        href: '/supplier/profile/certifications',
        icon: Shield,
        roles: ['cliente'],
      },
    ],
  },
  {
    title: 'Cotações',
    href: '/supplier/quotes',
    icon: FileText,
    roles: ['cliente'],
    children: [
      {
        title: 'Pendentes',
        href: '/supplier/quotes/pending',
        icon: Clock,
        roles: ['cliente'],
        badge: '3',
      },
      {
        title: 'Enviadas',
        href: '/supplier/quotes/sent',
        icon: FileText,
        roles: ['cliente'],
      },
      {
        title: 'Aceitas',
        href: '/supplier/quotes/accepted',
        icon: CheckSquare,
        roles: ['cliente'],
      },
      {
        title: 'Histórico',
        href: '/supplier/quotes/history',
        icon: FileText,
        roles: ['cliente'],
      },
    ],
  },
  {
    title: 'Eventos',
    href: '/supplier/events',
    icon: Calendar,
    roles: ['cliente'],
    children: [
      {
        title: 'Confirmados',
        href: '/supplier/events/confirmed',
        icon: CheckSquare,
        roles: ['cliente'],
      },
      {
        title: 'Em Andamento',
        href: '/supplier/events/ongoing',
        icon: Clock,
        roles: ['cliente'],
      },
      {
        title: 'Concluídos',
        href: '/supplier/events/completed',
        icon: CheckSquare,
        roles: ['cliente'],
      },
    ],
  },
  {
    title: 'Avaliações',
    href: '/supplier/reviews',
    icon: Star,
    roles: ['cliente'],
  },
  {
    title: 'Financeiro',
    href: '/supplier/financial',
    icon: CreditCard,
    roles: ['cliente'],
    children: [
      {
        title: 'Receitas',
        href: '/supplier/financial/revenue',
        icon: BarChart3,
        roles: ['cliente'],
      },
      {
        title: 'Pagamentos',
        href: '/supplier/financial/payments',
        icon: CreditCard,
        roles: ['cliente'],
      },
      {
        title: 'Relatórios',
        href: '/supplier/financial/reports',
        icon: FileText,
        roles: ['cliente'],
      },
    ],
  },

  // Usuário (Noivos/Contratantes)
  {
    title: 'Meus Eventos',
    href: '/user',
    icon: Heart,
    roles: ['usuario'],
  },
  {
    title: 'Planejamento',
    href: '/user/planning',
    icon: CheckSquare,
    roles: ['usuario'],
    children: [
      {
        title: 'Checklist',
        href: '/user/planning/checklist',
        icon: CheckSquare,
        roles: ['usuario'],
      },
      {
        title: 'Timeline',
        href: '/user/planning/timeline',
        icon: Clock,
        roles: ['usuario'],
      },
      {
        title: 'Orçamento',
        href: '/user/planning/budget',
        icon: CreditCard,
        roles: ['usuario'],
      },
    ],
  },
  {
    title: 'Fornecedores',
    href: '/user/suppliers',
    icon: Building2,
    roles: ['usuario'],
    children: [
      {
        title: 'Buscar',
        href: '/user/suppliers/search',
        icon: Search,
        roles: ['usuario'],
      },
      {
        title: 'Cotações',
        href: '/user/suppliers/quotes',
        icon: FileText,
        roles: ['usuario'],
      },
      {
        title: 'Contratados',
        href: '/user/suppliers/hired',
        icon: CheckSquare,
        roles: ['usuario'],
      },
    ],
  },
  {
    title: 'Inspirações',
    href: '/user/inspiration',
    icon: Palette,
    roles: ['usuario'],
    children: [
      {
        title: 'Decoração',
        href: '/user/inspiration/decoration',
        icon: Palette,
        roles: ['usuario'],
      },
      {
        title: 'Cardápio',
        href: '/user/inspiration/menu',
        icon: Utensils,
        roles: ['usuario'],
      },
      {
        title: 'Música',
        href: '/user/inspiration/music',
        icon: Music,
        roles: ['usuario'],
      },
      {
        title: 'Fotografia',
        href: '/user/inspiration/photography',
        icon: Camera,
        roles: ['usuario'],
      },
    ],
  },
  {
    title: 'Mensagens',
    href: '/user/messages',
    icon: MessageSquare,
    roles: ['usuario'],
    badge: '2',
  },
];

// Componente de item de navegação
function NavigationItem({ 
  item, 
  isActive, 
  hasPermission 
}: { 
  item: NavigationItem; 
  isActive: boolean; 
  hasPermission: boolean;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  if (!hasPermission) return null;

  const hasChildren = item.children && item.children.length > 0;

  return (
    <div>
      {hasChildren ? (
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start",
            isActive && "bg-accent text-accent-foreground"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <item.icon className="mr-2 h-4 w-4" />
          {item.title}
          {item.badge && (
            <Badge variant="secondary" className="ml-auto">
              {item.badge}
            </Badge>
          )}
        </Button>
      ) : (
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start",
            isActive && "bg-accent text-accent-foreground"
          )}
          asChild
        >
          <Link to={item.href}>
            <item.icon className="mr-2 h-4 w-4" />
            {item.title}
            {item.badge && (
              <Badge variant="secondary" className="ml-auto">
                {item.badge}
              </Badge>
            )}
          </Link>
        </Button>
      )}

      {hasChildren && isOpen && (
        <div className="ml-4 mt-1 space-y-1">
          {item.children?.map((child) => (
            <NavigationItemChild key={child.href} item={child} />
          ))}
        </div>
      )}
    </div>
  );
}

// Componente de item filho de navegação
function NavigationItemChild({ item }: { item: NavigationItem }) {
  const location = useLocation();
  const isActive = location.pathname === item.href;

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "w-full justify-start",
        isActive && "bg-accent text-accent-foreground"
      )}
      asChild
    >
      <Link to={item.href}>
        <item.icon className="mr-2 h-3 w-3" />
        {item.title}
        {item.badge && (
          <Badge variant="secondary" className="ml-auto text-xs">
            {item.badge}
          </Badge>
        )}
      </Link>
    </Button>
  );
}

// Componente principal de navegação
export function MultiProfileNavigation() {
  const { user, signOut } = useAuth();
  const { hasRole, hasPermission } = usePermissions();
  const location = useLocation();

  // Filtrar itens de navegação baseado no perfil do usuário
  const filteredNavigation = navigationConfig.filter(item => {
    // Verificar roles
    if (item.roles && !item.roles.some(role => hasRole(role as any))) {
      return false;
    }

    // Verificar permissões
    if (item.permissions && !item.permissions.every(perm => hasPermission(perm.resource, perm.action))) {
      return false;
    }

    return true;
  });

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="flex h-full w-64 flex-col bg-background border-r">
      {/* Header */}
      <div className="flex h-16 items-center border-b px-4">
        <Link to="/" className="flex items-center space-x-2">
          <Heart className="h-6 w-6 text-primary" />
          <span className="font-bold">Anrielly Cerimônias</span>
        </Link>
      </div>

      {/* User Info */}
      <div className="border-b p-4">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.full_name || user?.email}
            </p>
            <p className="text-xs text-muted-foreground">
              {user?.role === 'admin_master' && 'Admin Master'}
              {user?.role === 'admin' && 'Cerimonialista'}
              {user?.role === 'cliente' && 'Fornecedor'}
              {user?.role === 'usuario' && 'Cliente'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {filteredNavigation.map((item) => {
          const isActive = location.pathname === item.href || 
                          location.pathname.startsWith(item.href + '/');
          
          const hasPermission = !item.roles || item.roles.some(role => hasRole(role as any));

          return (
            <NavigationItem
              key={item.href}
              item={item}
              isActive={isActive}
              hasPermission={hasPermission}
            />
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-4 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start"
          asChild
        >
          <Link to="/profile">
            <User className="mr-2 h-4 w-4" />
            Meu Perfil
          </Link>
        </Button>
        
        <Button
          variant="ghost"
          className="w-full justify-start"
          asChild
        >
          <Link to="/settings">
            <Settings className="mr-2 h-4 w-4" />
            Configurações
          </Link>
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  );
}

// Componente de navegação mobile
export function MobileNavigation() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-64 bg-background">
            <MultiProfileNavigation />
          </div>
        </div>
      )}
    </>
  );
}

export default MultiProfileNavigation;

