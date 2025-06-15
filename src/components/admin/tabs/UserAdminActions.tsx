
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, UserRole } from "@/hooks/useUserProfiles";

interface UserAdminActionsProps {
  profile: UserProfile;
  onChange?: () => void; // callback para refresh
}

export default function UserAdminActions({ profile, onChange }: UserAdminActionsProps) {
  const [loading, setLoading] = useState(false);

  // Troca de role (upgrade/downgrade)
  const handleRoleChange = async (role: UserRole) => {
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", profile.id);
    setLoading(false);
    if (!error) {
      toast.success("Papel atualizado!");
      onChange?.();
    } else {
      toast.error("Erro ao atualizar papel");
    }
  };

  // Ativar/desativar usuário
  const handleToggleActive = async () => {
    setLoading(true);
    const novoStatus = !profile.ativo;
    const { error } = await supabase
      .from("profiles")
      .update({ ativo: novoStatus })
      .eq("id", profile.id);
    setLoading(false);
    if (!error) {
      toast.success(novoStatus ? "Usuário ativado!" : "Usuário desativado!");
      onChange?.();
    } else {
      toast.error("Erro ao atualizar status");
    }
  };

  // Reset de senha: envia link de redefinição
  const handleSendReset = async () => {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(profile.email, {
      redirectTo: window.location.origin + "/admin/login",
    });
    setLoading(false);
    if (!error) {
      toast.success("E-mail de redefinição enviado!");
    } else {
      toast.error("Erro ao enviar redefinição de senha");
    }
  };

  return (
    <div className="flex flex-col gap-1 min-w-[140px]">
      <Select value={profile.role} onValueChange={handleRoleChange} disabled={loading || profile.ativo === false}>
        <SelectTrigger className="h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="cerimonialista">Cerimonialista</SelectItem>
          <SelectItem value="noivo">Noivo</SelectItem>
        </SelectContent>
      </Select>
      <Button
        size="sm"
        variant={profile.ativo ? "outline" : "default"}
        className={`w-full mt-1 ${!profile.ativo ? "bg-gray-300 text-gray-700" : ""}`}
        onClick={handleToggleActive}
        disabled={loading}
      >
        {profile.ativo ? "Desativar" : "Ativar"}
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="w-full mt-1"
        onClick={handleSendReset}
        disabled={loading || profile.ativo === false}
      >
        Resetar Senha
      </Button>
    </div>
  );
}
