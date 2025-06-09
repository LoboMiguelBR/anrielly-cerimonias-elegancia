
import React from 'react';
import { useUserProfiles } from '@/hooks/useUserProfiles';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, UserPlus, Mail, Phone, Shield } from 'lucide-react';

const UsersTab = () => {
  const { 
    profiles, 
    invitations, 
    loading, 
    createInvitation, 
    updateProfile 
  } = useUserProfiles();

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'cerimonialista':
        return 'bg-blue-100 text-blue-800';
      case 'cliente':
        return 'bg-green-100 text-green-800';
      case 'noivo':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
          <p className="text-gray-600">Gerencie usuários e permissões do sistema</p>
        </div>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Convidar Usuário
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Usuários</p>
                <p className="text-2xl font-bold text-gray-900">{profiles.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Administradores</p>
                <p className="text-2xl font-bold text-gray-900">
                  {profiles.filter(p => p.role === 'admin').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Mail className="w-8 h-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Convites Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">{invitations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {profiles.filter(p => p.status === 'ativo').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input 
          placeholder="Buscar usuários..." 
          className="flex-1"
        />
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os roles</SelectItem>
            <SelectItem value="admin">Administrador</SelectItem>
            <SelectItem value="cerimonialista">Cerimonialista</SelectItem>
            <SelectItem value="cliente">Cliente</SelectItem>
            <SelectItem value="noivo">Noivo/Noiva</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="inativo">Inativo</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os usuários do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profiles.map((profile) => (
              <div 
                key={profile.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-medium">
                      {profile.name?.charAt(0).toUpperCase() || profile.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {profile.name || 'Nome não informado'}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{profile.email}</span>
                    </div>
                    {profile.created_at && (
                      <p className="text-xs text-gray-500">
                        Criado em {new Date(profile.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Badge className={getRoleColor(profile.role)}>
                    {profile.role}
                  </Badge>
                  <Badge variant={profile.status === 'ativo' ? 'default' : 'secondary'}>
                    {profile.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                </div>
              </div>
            ))}

            {profiles.length === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum usuário encontrado
                </h3>
                <p className="text-gray-600">
                  Comece convidando usuários para o sistema.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      {invitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Convites Pendentes</CardTitle>
            <CardDescription>
              Convites enviados aguardando aceite
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invitations.map((invitation) => (
                <div 
                  key={invitation.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{invitation.email}</p>
                    <p className="text-sm text-gray-600">
                      Role: {invitation.role} • Enviado em {' '}
                      {new Date(invitation.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Reenviar
                    </Button>
                    <Button variant="outline" size="sm">
                      Cancelar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UsersTab;
