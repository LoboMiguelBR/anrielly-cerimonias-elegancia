
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Home, LogOut } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AdminHeader = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogout = async () => {
    try {
      // First, check if we have an active session
      const { data: sessionData } = await supabase.auth.getSession();
      
      // Always clear local storage for safety
      localStorage.removeItem('adminUser');
      
      // Only attempt to sign out if there's an active session
      if (sessionData?.session) {
        await supabase.auth.signOut();
      }
      
      toast({
        title: "Logout realizado",
        description: "Você saiu do painel administrativo",
      });
      
      // Navigate to home page after logout
      navigate('/');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      
      // Even if the Supabase logout fails, clear local storage and redirect
      localStorage.removeItem('adminUser');
      
      toast({
        title: "Aviso de logout",
        description: "Sessão encerrada, mas ocorreu um erro no servidor",
        variant: "default",
      });
      
      // Still navigate away even if there was an error
      navigate('/');
    }
  };

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
