
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Home, LogOut } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AdminHeader = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
Versão corrigida e robusta do handleLogout:
ts
Copiar
Editar
const handleLogout = async () => {
  try {
    await supabase.auth.signOut();

    // Limpa qualquer dado persistente local
    localStorage.clear();
    sessionStorage.clear();

    toast({
      title: "Logout realizado",
      description: "Você saiu do painel administrativo",
    });

    navigate('/');
  } catch (error) {
    console.error("Erro ao fazer logout:", error);

    // Limpa de qualquer forma
    localStorage.clear();
    sessionStorage.clear();

    toast({
      title: "Aviso de logout",
      description: "Sessão encerrada, mas ocorreu um erro no servidor",
    });

    navigate('/');
  }
}

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="font-playfair text-2xl font-bold text-gray-800">Painel Administrativo</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/')}>
            <Home className="w-4 h-4 mr-2" /> Site
          </Button>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Sair
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
