import React, { useState } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuthEnhanced } from '@/hooks/useAuthEnhanced';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  LayoutDashboard,
  Building2,
  DollarSign,
  Activity,
  Settings,
  Users,
  Bell,
  Search,
  Menu,
  LogOut,
  User,
  Shield,
  ChevronDown,
  Home,
  BarChart3,
  Server,
  CreditCard,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Navegação do Admin Master
const navigation = [
  {
    name: 'Dashboard',
    href: '/admin-master',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    name: 'Tenants',
    href: '/admin-master/tenants',
    icon: Building2,
    children: [
      { name: 'Todos os Tenants', href: '/admin-master/tenants' },
      { name: 'Novo Tenant', href: '/admin-master/tenants/new' },
      { name: 'Configurações', href: '/admin-master/tenants/settings' },
    ],
  },
  {
    name: 'Financeiro',
    href: '/admin-master/financial',
    icon: DollarSign,
    children: [
      { name: 'Visão Geral', href: '/admin-master/financial' },
      { name: 'Assinaturas', href: '/admin-master/financial/subscriptions' },
      { name: 'Pagamentos', href: '/admin-master/financial/payments' },
      { name: 'Faturas', href: '/admin-master/financial/invoices' },
      { name: 'Analytics', href: '/admin-master/financial/analytics' },
    ],
  },
  {
    name: 'Monitoramento',
    href: '/admin-master/monitoring',
    icon: Activity,
    children: [
      { name: 'Visão Geral', href: '/admin-master/monitoring' },
      { name: 'Performance', href: '/admin-master/monitoring/performance' },
      { name: 'Logs', href: '/admin-master/monitoring/logs' },
      { name: 'Alertas', href: '/admin-master/monitoring/alerts' },
      { name: 'Recursos', href: '/admin-master/monitoring/resources' },
    ],
  },
  {
    name: 'Usuários',
    href: '/admin-master/users',
    icon: Users,
    children: [
      { name: 'Todos os Usuários', href: '/admin-master/users' },
      { name: 'Administradores', href: '/admin-master/users/admins' },
      { name: 'Permissões', href: '/admin-master/users/permissions' },
    ],
  },
  {
    name: 'Configurações',
    href: '/admin-master/settings',
    icon: Settings,
    children: [
      { name: 'Sistema', href: '/admin-master/settings/system' },
      { name: 'Segurança', href: '/admin-master/settings/security' },
      { name: 'Integrações', href: '/admin-master/settings/integrations' },
      { name: 'Backup', href: '/admin-master/settings/backup' },
    ],
  },
];

// Layout principal do Admin Master
export function AdminMasterLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const location = useLocation();
  const { user, logout, isAdminMaster } = useAuthEnhanced();

  // Verificar se o usuário é Admin Master
  if (!isAdminMaster()) {
    return <Navigate to="/dashboard" replace />;
  }

  const toggleExpanded = (name: string) => {
    setExpandedItems(prev => 
      prev.includes(name) 
        ? prev.filter(item => item !== name)
        : [...prev, name]
    );
  };

  const isActive = (href: string, exact = false) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link to="/admin-master" className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-lg font-bold">Admin Master</h1>
            <p className="text-xs text-muted-foreground">Sistema de Gestão</p>
          </div>
        </Link>
      </div>

      {/* Navegação */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isItemActive = isActive(item.href, item.exact);
          const isExpanded = expandedItems.includes(item.name);
          
          return (
            <div key={item.name}>
              <div className="flex items-center">
                <Link
                  to={item.href}
                  className={cn(
                    'flex flex-1 items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isItemActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Link>
                {item.children && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => toggleExpanded(item.name)}
                  >
                    <ChevronDown 
                      className={cn(
                        'h-4 w-4 transition-transform',
                        isExpanded ? 'rotate-180' : ''
                      )} 
                    />
                  </Button>
                )}
              </div>
              
              {item.children && isExpanded && (
                <div className="ml-6 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      to={child.href}
                      className={cn(
                        'block rounded-md px-3 py-2 text-sm transition-colors',
                        isActive(child.href)
                          ? 'bg-accent text-accent-foreground'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      )}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Status do Sistema */}
      <div className="border-t p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-xs text-muted-foreground">Sistema Online</span>
          </div>
          <Badge variant="outline" className="text-xs">
            v2.0.0
          </Badge>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar Desktop */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r">
        <SidebarContent />
      </div>

      {/* Sidebar Mobile */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Conteúdo Principal */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center border-b bg-background px-6">
          <div className="flex items-center space-x-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
            </Sheet>

            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Home className="h-4 w-4" />
              <span>/</span>
              <span>Admin Master</span>
              {location.pathname !== '/admin-master' && (
                <>
                  <span>/</span>
                  <span className="text-foreground">
                    {location.pathname.split('/').pop()?.replace('-', ' ')}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="ml-auto flex items-center space-x-4">
            {/* Notificações */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
              >
                3
              </Badge>
            </Button>

            {/* Menu do Usuário */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar_url} alt={user?.email} />
                    <AvatarFallback>
                      {user?.email?.charAt(0).toUpperCase() || 'A'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.first_name} {user?.last_name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                    <Badge variant="outline" className="w-fit text-xs">
                      Admin Master
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/admin-master/profile">
                    <User className="mr-2 h-4 w-4" />
                    Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/admin-master/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Configurações
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Conteúdo da Página */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminMasterLayout;

