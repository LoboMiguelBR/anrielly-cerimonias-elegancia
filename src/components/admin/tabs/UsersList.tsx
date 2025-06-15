
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Trash2 } from "lucide-react";
import UserAdminActions from "./UserAdminActions";
import { UserProfile, UserRole, UserInvitation } from "@/hooks/useUserProfiles";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface UsersListProps {
  profiles: UserProfile[];
  filterRole: string;
  searchTerm: string;
  isMobile: boolean;
  getRoleBadge: (role: string) => JSX.Element;
  fetchProfiles: () => void;
  invitations: UserInvitation[];
  deleteInvitation: (id: string) => void;
}

export default function UsersList({
  profiles,
  filterRole,
  searchTerm,
  isMobile,
  getRoleBadge,
  fetchProfiles,
  invitations,
  deleteInvitation,
}: UsersListProps) {
  // Filtro da lista
  const filteredProfiles = profiles
    .filter(profile => {
      const matchesRole = filterRole === 'all' || profile.role === filterRole;
      const matchesSearch = searchTerm === '' ||
        profile.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.email.toLowerCase().includes(searchTerm.toLowerCase());
      // Exibe todos usuários, pois queremos mostrar ativos/inativos
      return matchesRole && matchesSearch;
    });

  return (
    <>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Usuários Ativos / Inativos</h3>
        {filteredProfiles.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">Nenhum usuário encontrado</p>
            </CardContent>
          </Card>
        ) : (
          filteredProfiles.map((profile) => (
            <Card key={profile.id} className={profile.ativo === false ? "opacity-60" : ""}>
              <CardContent className="p-4">
                <div className={`flex justify-between items-start ${isMobile ? 'flex-col gap-3' : ''}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {profile.name || profile.email}
                      </h4>
                      {getRoleBadge(profile.role)}
                      {profile.ativo === false && (
                        <Badge variant="outline" className="text-xs bg-gray-100 text-gray-600 ml-2">Inativo</Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {profile.email}
                      </div>
                      <div>
                        <strong>Status:</strong> {profile.status}
                      </div>
                      {profile.last_login && (
                        <div>
                          <strong>Último login:</strong> {format(new Date(profile.last_login), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`flex gap-2 ${isMobile ? 'w-full' : ''}`}>
                    <UserAdminActions profile={profile} onChange={fetchProfiles} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Lista de Convites Pendentes */}
      {invitations.length > 0 && (
        <div className="space-y-4 mt-4">
          <h3 className="text-lg font-semibold text-gray-900">Convites Pendentes</h3>
          {invitations.map((invitation) => (
            <Card key={invitation.id}>
              <CardContent className="p-4">
                <div className={`flex justify-between items-start ${isMobile ? 'flex-col gap-3' : ''}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{invitation.email}</h4>
                      {getRoleBadge(invitation.role)}
                    </div>
                    <div className="text-sm text-gray-600">
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
                      className={isMobile ? 'flex-1' : ''}
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
    </>
  );
}
