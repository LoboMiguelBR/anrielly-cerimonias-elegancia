
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, UserPlus, Mail, Edit, Trash2, Users, Shield } from 'lucide-react';
import { useUserProfiles, UserRole } from '@/hooks/useUserProfiles';
import { useProfessionals } from '@/hooks/useProfessionals';
import { useMobileLayout } from '@/hooks/useMobileLayout';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const UsersTab = () => {
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [filterRole, setFilterRole] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'noivo' as UserRole,
    professional_id: ''
  });

  const { profiles, invitations, loading, createInvitation, deleteInvitation } = useUserProfiles();
  const { professionals } = useProfessionals();
  const { isMobile } = useMobileLayout();

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-100 text-red-800"><Shield className="w-3 h-3 mr-1" />Admin</Badge>;
      case 'cerimonialista':
        return <Badge className="bg-blue-100 text-blue-800"><Users className="w-3 h-3 mr-1" />Cerimonialista</Badge>;
      case 'noivo':
        return <Badge className="bg-green-100 text-green-800">Noivo</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Acesso completo ao sistema';
      case 'cerimonialista':
        return 'Gerencia eventos e clientes';
      case 'noivo':
        return 'Acesso limitado aos próprios dados';
      default:
        return 'Usuário padrão';
    }
  };

  const filteredProfiles = profiles.filter(profile => {
    const matchesRole = filterRole === 'all' || profile.role === filterRole;
    const matchesSearch = searchTerm === '' || 
      profile.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesRole && matchesSearch;
  });

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createInvitation({
        email: inviteForm.email,
        role: inviteForm.role,
        professional_id: inviteForm.professional_id || undefined
      });
      
      setInviteForm({ email: '', role: 'noivo', professional_id: '' });
      setShowInviteDialog(false);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'bg-green-100 text-green-800';
      case 'inativo':
        return 'bg-red-100 text-red-800';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`space-y-6 ${isMobile ? 'p-2' : ''}`}>
      <div className="flex items-center gap-3">
        <Users className="h-8 w-8 text-purple-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Usuários</h1>
          <p className="text-gray-600">
            Gerencie perfis de acesso e convites para novos usuários
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                <p className="text-2xl font-bold text-gray-900">{profiles.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Administradores</p>
                <p className="text-2xl font-bold text-gray-900">
                  {profiles.filter(p => p.role === 'admin').length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cerimonialistas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {profiles.filter(p => p.role === 'cerimonialista').length}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Convites Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">{invitations.length}</p>
              </div>
              <Mail className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 justify-between items-start">
        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogTrigger asChild>
            <Button className={`bg-blue-600 hover:bg-blue-700 text-white ${isMobile ? 'w-full' : ''}`}>
              <UserPlus className="w-4 h-4 mr-2" />
              Convidar Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className={`${isMobile ? 'w-[95vw] max-w-[95vw]' : 'sm:max-w-[500px]'}`}>
            <DialogHeader>
              <DialogTitle>Convidar Novo Usuário</DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="role">Tipo de Usuário</Label>
                <Select 
                  value={inviteForm.role} 
                  onValueChange={(value: UserRole) => setInviteForm({ ...inviteForm, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        <div>
                          <div>Admin</div>
                          <div className="text-xs text-gray-500">Acesso completo</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="cerimonialista">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <div>
                          <div>Cerimonialista</div>
                          <div className="text-xs text-gray-500">Gerencia eventos</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="noivo">
                      <div>
                        <div>Noivo</div>
                        <div className="text-xs text-gray-500">Acesso limitado</div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {inviteForm.role === 'cerimonialista' && (
                <div>
                  <Label htmlFor="professional">Profissional</Label>
                  <Select 
                    value={inviteForm.professional_id} 
                    onValueChange={(value) => setInviteForm({ ...inviteForm, professional_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um profissional" />
                    </SelectTrigger>
                    <SelectContent>
                      {professionals?.map((professional) => (
                        <SelectItem key={professional.id} value={professional.id}>
                          {professional.name} - {professional.category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowInviteDialog(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Enviando...' : 'Enviar Convite'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <div className={`flex gap-4 ${isMobile ? 'flex-col' : 'items-center'}`}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className={isMobile ? 'w-full' : 'w-48'}>
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="cerimonialista">Cerimonialista</SelectItem>
            <SelectItem value="noivo">Noivo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Usuários */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Usuários Ativos</h3>
        
        {filteredProfiles.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum usuário encontrado</p>
              {searchTerm && (
                <p className="text-sm text-gray-400 mt-1">
                  Tente ajustar os filtros de busca
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredProfiles.map((profile) => (
            <Card key={profile.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className={`flex justify-between items-start ${isMobile ? 'flex-col gap-3' : ''}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {profile.name || 'Usuário sem nome'}
                      </h4>
                      {getRoleBadge(profile.role)}
                      <Badge className={getStatusColor(profile.status)}>
                        {profile.status || 'ativo'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{profile.email}</span>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        {getRoleDescription(profile.role)}
                      </div>
                      
                      {profile.last_login && (
                        <div className="text-xs text-gray-500">
                          <strong>Último login:</strong> {format(new Date(profile.last_login), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </div>
                      )}
                      
                      <div className="text-xs text-gray-500">
                        <strong>Cadastrado em:</strong> {format(new Date(profile.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                      </div>
                    </div>
                  </div>
                  
                  <div className={`flex gap-2 ${isMobile ? 'w-full' : ''}`}>
                    <Button variant="outline" size="sm" className={isMobile ? 'flex-1' : ''}>
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Lista de Convites Pendentes */}
      {invitations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Convites Pendentes</h3>
          
          {invitations.map((invitation) => (
            <Card key={invitation.id} className="border-dashed">
              <CardContent className="p-4">
                <div className={`flex justify-between items-start ${isMobile ? 'flex-col gap-3' : ''}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{invitation.email}</h4>
                      {getRoleBadge(invitation.role)}
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                        Pendente
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>
                        <strong>Enviado em:</strong> {format(new Date(invitation.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </div>
                      <div>
                        <strong>Expira em:</strong> {format(new Date(invitation.expires_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                      </div>
                    </div>
                  </div>
                  
                  <div className={`flex gap-2 ${isMobile ? 'w-full' : ''}`}>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => deleteInvitation(invitation.id)}
                      className={`text-red-600 hover:text-red-700 ${isMobile ? 'flex-1' : ''}`}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersTab;
