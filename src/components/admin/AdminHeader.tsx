
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
      // Properly sign out from Supabase
      await supabase.auth.signOut();
      
      // Also remove local storage item for additional safety
      localStorage.removeItem('adminUser');
      
      toast({
        title: "Logout realizado",
        description: "Você saiu do painel administrativo",
      });
      
      // Navigate to home page after successful logout
      navigate('/');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast({
        title: "Erro no logout",
        description: "Ocorreu um erro ao tentar sair do painel",
        variant: "destructive",
      });
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
