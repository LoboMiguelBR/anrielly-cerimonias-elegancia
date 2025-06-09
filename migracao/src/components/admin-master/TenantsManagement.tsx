import React, { useState } from 'react';
import { useTenants, useTenant } from '@/hooks/useTenants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  Users, 
  Calendar, 
  CreditCard,
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import type { Tenant, TenantStatus, TenantSubscriptionPlan, CreateTenantData, UpdateTenantData } from '@/types/auth';

// Componente principal de gestão de tenants
export function TenantsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TenantStatus | 'all'>('all');
  const [planFilter, setPlanFilter] = useState<TenantSubscriptionPlan | 'all'>('all');
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const filters = {
    search: searchTerm || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    plan: planFilter !== 'all' ? planFilter : undefined,
    limit: 50,
  };

  const { 
    tenants, 
    isLoading, 
    createTenant, 
    updateTenant, 
    deleteTenant,
    isCreating,
    isUpdating,
    isDeleting
  } = useTenants(filters);

  const handleCreateTenant = (data: CreateTenantData) => {
    createTenant(data);
    setIsCreateDialogOpen(false);
  };

  const handleUpdateTenant = (data: UpdateTenantData) => {
    if (selectedTenant) {
      updateTenant({ id: selectedTenant.id, data });
      setIsEditDialogOpen(false);
      setSelectedTenant(null);
    }
  };

  const handleDeleteTenant = (tenantId: string) => {
    deleteTenant(tenantId);
  };

  const getStatusBadge = (status: TenantStatus) => {
    const variants = {
      active: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      trial: { variant: 'secondary' as const, icon: Clock, color: 'text-blue-600' },
      suspended: { variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' },
      cancelled: { variant: 'outline' as const, icon: XCircle, color: 'text-gray-600' },
    };

    const config = variants[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className={`h-3 w-3 ${config.color}`} />
        {status === 'active' && 'Ativo'}
        {status === 'trial' && 'Trial'}
        {status === 'suspended' && 'Suspenso'}
        {status === 'cancelled' && 'Cancelado'}
      </Badge>
    );
  };

  const getPlanBadge = (plan: TenantSubscriptionPlan) => {
    const colors = {
      basic: 'bg-gray-100 text-gray-800',
      premium: 'bg-blue-100 text-blue-800',
      enterprise: 'bg-purple-100 text-purple-800',
    };

    return (
      <Badge variant="outline" className={colors[plan]}>
        {plan === 'basic' && 'Básico'}
        {plan === 'premium' && 'Premium'}
        {plan === 'enterprise' && 'Enterprise'}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Tenants</h1>
          <p className="text-muted-foreground">
            Gerencie todas as empresas e organizações do sistema
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Tenant
            </Button>
          </DialogTrigger>
          <CreateTenantDialog 
            onSubmit={handleCreateTenant}
            isLoading={isCreating}
          />
        </Dialog>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nome ou slug do tenant..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="suspended">Suspenso</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="plan">Plano</Label>
              <Select value={planFilter} onValueChange={(value) => setPlanFilter(value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os planos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os planos</SelectItem>
                  <SelectItem value="basic">Básico</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Tenants */}
      <Card>
        <CardHeader>
          <CardTitle>Tenants ({tenants.length})</CardTitle>
          <CardDescription>
            Lista de todas as empresas cadastradas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Usuários</TableHead>
                  <TableHead>Eventos</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{tenant.name}</div>
                          <div className="text-sm text-muted-foreground">{tenant.slug}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(tenant.status)}
                    </TableCell>
                    <TableCell>
                      {getPlanBadge(tenant.subscription_plan)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {tenant.user_profiles?.length || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {tenant.events?.length || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(tenant.created_at).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedTenant(tenant);
                              setIsViewDialogOpen(true);
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedTenant(tenant);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                className="text-red-600"
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Deletar
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja deletar o tenant "{tenant.name}"? 
                                  Esta ação não pode ser desfeita e todos os dados serão perdidos.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteTenant(tenant.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                  disabled={isDeleting}
                                >
                                  {isDeleting ? 'Deletando...' : 'Deletar'}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {tenants.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">Nenhum tenant encontrado</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Comece criando um novo tenant para o sistema.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      {isEditDialogOpen && selectedTenant && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <EditTenantDialog
            tenant={selectedTenant}
            onSubmit={handleUpdateTenant}
            isLoading={isUpdating}
          />
        </Dialog>
      )}

      {isViewDialogOpen && selectedTenant && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <ViewTenantDialog tenant={selectedTenant} />
        </Dialog>
      )}
    </div>
  );
}

// Componente para criar tenant
function CreateTenantDialog({ 
  onSubmit, 
  isLoading 
}: { 
  onSubmit: (data: CreateTenantData) => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState<CreateTenantData>({
    name: '',
    slug: '',
    admin_email: '',
    admin_password: '',
    admin_first_name: '',
    admin_last_name: '',
    tax_id: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip_code: '',
      country: 'Brasil',
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!formData.name || !formData.slug || !formData.admin_email) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    if (formData.admin_password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    onSubmit(formData);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Criar Novo Tenant</DialogTitle>
        <DialogDescription>
          Crie uma nova empresa/organização no sistema
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Básico</TabsTrigger>
            <TabsTrigger value="admin">Administrador</TabsTrigger>
            <TabsTrigger value="billing">Faturamento</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Empresa *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      name,
                      slug: generateSlug(name)
                    }));
                  }}
                  placeholder="Anrielly Cerimônias"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="anrielly-cerimonias"
                  required
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="admin" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="admin_first_name">Nome *</Label>
                <Input
                  id="admin_first_name"
                  value={formData.admin_first_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, admin_first_name: e.target.value }))}
                  placeholder="Anrielly"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin_last_name">Sobrenome *</Label>
                <Input
                  id="admin_last_name"
                  value={formData.admin_last_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, admin_last_name: e.target.value }))}
                  placeholder="Gomes"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin_email">Email do Administrador *</Label>
              <Input
                id="admin_email"
                type="email"
                value={formData.admin_email}
                onChange={(e) => setFormData(prev => ({ ...prev, admin_email: e.target.value }))}
                placeholder="admin@empresa.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin_password">Senha *</Label>
              <Input
                id="admin_password"
                type="password"
                value={formData.admin_password}
                onChange={(e) => setFormData(prev => ({ ...prev, admin_password: e.target.value }))}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
              />
            </div>
          </TabsContent>

          <TabsContent value="billing" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tax_id">CNPJ</Label>
              <Input
                id="tax_id"
                value={formData.tax_id}
                onChange={(e) => setFormData(prev => ({ ...prev, tax_id: e.target.value }))}
                placeholder="00.000.000/0000-00"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="street">Endereço</Label>
                <Input
                  id="street"
                  value={formData.address?.street || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    address: { ...prev.address, street: e.target.value }
                  }))}
                  placeholder="Rua, número"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  value={formData.address?.city || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    address: { ...prev.address, city: e.target.value }
                  }))}
                  placeholder="São Paulo"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  value={formData.address?.state || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    address: { ...prev.address, state: e.target.value }
                  }))}
                  placeholder="SP"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip_code">CEP</Label>
                <Input
                  id="zip_code"
                  value={formData.address?.zip_code || ''}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    address: { ...prev.address, zip_code: e.target.value }
                  }))}
                  placeholder="00000-000"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Criando...' : 'Criar Tenant'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

// Componente para editar tenant
function EditTenantDialog({ 
  tenant, 
  onSubmit, 
  isLoading 
}: { 
  tenant: Tenant;
  onSubmit: (data: UpdateTenantData) => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState<UpdateTenantData>({
    name: tenant.name,
    status: tenant.status,
    subscription_plan: tenant.subscription_plan,
    subscription_status: tenant.subscription_status,
    trial_ends_at: tenant.trial_ends_at,
    settings: tenant.settings,
    billing_info: tenant.billing_info,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Editar Tenant</DialogTitle>
        <DialogDescription>
          Atualize as informações do tenant "{tenant.name}"
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="edit_name">Nome da Empresa</Label>
            <Input
              id="edit_name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit_status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as TenantStatus }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="suspended">Suspenso</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="edit_plan">Plano</Label>
            <Select 
              value={formData.subscription_plan} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, subscription_plan: value as TenantSubscriptionPlan }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Básico</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit_subscription_status">Status da Assinatura</Label>
            <Select 
              value={formData.subscription_status} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, subscription_status: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativa</SelectItem>
                <SelectItem value="trialing">Trial</SelectItem>
                <SelectItem value="past_due">Vencida</SelectItem>
                <SelectItem value="cancelled">Cancelada</SelectItem>
                <SelectItem value="unpaid">Não Paga</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

// Componente para visualizar tenant
function ViewTenantDialog({ tenant }: { tenant: Tenant }) {
  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          {tenant.name}
        </DialogTitle>
        <DialogDescription>
          Informações detalhadas do tenant
        </DialogDescription>
      </DialogHeader>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="events">Eventos</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Nome</Label>
                  <p className="font-medium">{tenant.name}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Slug</Label>
                  <p className="font-mono text-sm">{tenant.slug}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Status</Label>
                  <div className="mt-1">
                    {/* getStatusBadge(tenant.status) */}
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Plano</Label>
                  <div className="mt-1">
                    {/* getPlanBadge(tenant.subscription_plan) */}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Usuários</span>
                  <span className="font-medium">{tenant.user_profiles?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Eventos</span>
                  <span className="font-medium">{tenant.events?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Criado em</span>
                  <span className="font-medium">
                    {new Date(tenant.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Atualizado em</span>
                  <span className="font-medium">
                    {new Date(tenant.updated_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Usuários do Tenant</CardTitle>
            </CardHeader>
            <CardContent>
              {tenant.user_profiles && tenant.user_profiles.length > 0 ? (
                <div className="space-y-2">
                  {tenant.user_profiles.map((user: any) => (
                    <div key={user.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="font-medium">{user.first_name} {user.last_name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <Badge variant="outline">{user.role}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Nenhum usuário encontrado</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Eventos do Tenant</CardTitle>
            </CardHeader>
            <CardContent>
              {tenant.events && tenant.events.length > 0 ? (
                <div className="space-y-2">
                  {tenant.events.map((event: any) => (
                    <div key={event.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.start_date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <Badge variant="outline">{event.status}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Nenhum evento encontrado</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Configurações</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-muted p-4 rounded overflow-auto">
                {JSON.stringify(tenant.settings, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
}

export default TenantsManagement;

