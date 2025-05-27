
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Home, Image, MessageCircle, FileText, Camera, Palette, Heart, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface MobileAdminNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const MobileAdminNav = ({ activeTab, onTabChange }: MobileAdminNavProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "gallery", label: "Galeria", icon: Image },
    { id: "testimonials", label: "Depoimentos", icon: MessageCircle },
    { id: "quotes", label: "Orçamentos", icon: FileText },
    { id: "proposals", label: "Propostas", icon: Camera },
    { id: "templates", label: "Templates", icon: Palette },
    { id: "questionarios", label: "Questionários", icon: Heart },
  ]

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      localStorage.clear()
      sessionStorage.clear()
      toast({
        title: "Logout realizado",
        description: "Você saiu do painel administrativo",
      })
      navigate('/')
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
      localStorage.clear()
      sessionStorage.clear()
      toast({
        title: "Aviso de logout",
        description: "Sessão encerrada, mas ocorreu um erro no servidor",
      })
      navigate('/')
    }
  }

  const handleTabSelect = (tabId: string) => {
    onTabChange(tabId)
    setIsOpen(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <h2 className="font-playfair text-xl font-bold text-gray-800">
              Painel Admin
            </h2>
          </div>
          
          <div className="flex-1 py-4">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className={`w-full justify-start px-6 py-4 h-auto ${
                  activeTab === item.id ? 'bg-rose-50 text-rose-700 border-r-2 border-rose-500' : ''
                }`}
                onClick={() => handleTabSelect(item.id)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Button>
            ))}
          </div>
          
          <div className="border-t p-4 space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={() => navigate('/')}
            >
              <Home className="mr-3 h-4 w-4" />
              Ir para Site
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" 
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MobileAdminNav
