
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Gallery, Camera, MessageCircle, FileText, Home, LogOut } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Dados simulados (posteriormente virão do Supabase)
  const quoteRequests = [
    { id: 1, name: 'Maria Silva', date: '2025-08-15', eventType: 'casamento', phone: '(24) 99999-0000', status: 'novo' },
    { id: 2, name: 'João Santos', date: '2025-07-22', eventType: 'corporativo', phone: '(24) 98888-1111', status: 'novo' }
  ];
  
  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    toast({
      title: "Logout realizado",
      description: "Você saiu do painel administrativo",
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
      
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="bg-white p-1 border rounded-md w-full flex overflow-x-auto">
            <TabsTrigger value="dashboard" className="flex items-center">
              <Home className="w-4 h-4 mr-2" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center">
              <Gallery className="w-4 h-4 mr-2" /> Galeria
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="flex items-center">
              <MessageCircle className="w-4 h-4 mr-2" /> Depoimentos
            </TabsTrigger>
            <TabsTrigger value="quotes" className="flex items-center">
              <FileText className="w-4 h-4 mr-2" /> Orçamentos
            </TabsTrigger>
            <TabsTrigger value="proposals" className="flex items-center">
              <Camera className="w-4 h-4 mr-2" /> Propostas
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Resumo Geral</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-lavender/10 rounded-lg p-6 text-center">
                <p className="text-gray-600">Orçamentos Pendentes</p>
                <p className="text-3xl font-semibold">{quoteRequests.length}</p>
              </div>
              <div className="bg-lavender/10 rounded-lg p-6 text-center">
                <p className="text-gray-600">Propostas Enviadas</p>
                <p className="text-3xl font-semibold">0</p>
              </div>
              <div className="bg-lavender/10 rounded-lg p-6 text-center">
                <p className="text-gray-600">Fotos na Galeria</p>
                <p className="text-3xl font-semibold">8</p>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Orçamentos Recentes</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 text-left">Nome</th>
                      <th className="p-3 text-left">Data do Evento</th>
                      <th className="p-3 text-left">Tipo</th>
                      <th className="p-3 text-left">Contato</th>
                      <th className="p-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quoteRequests.map(request => (
                      <tr key={request.id} className="border-t hover:bg-gray-50">
                        <td className="p-3">{request.name}</td>
                        <td className="p-3">{new Date(request.date).toLocaleDateString('pt-BR')}</td>
                        <td className="p-3">{request.eventType}</td>
                        <td className="p-3">{request.phone}</td>
                        <td className="p-3">
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {request.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="gallery" className="p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Gerenciar Galeria</h2>
            <p className="text-gray-500 mb-8">Esta seção será implementada com o Supabase para upload e gerenciamento de imagens.</p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Camera className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600">Clique ou arraste as imagens para fazer upload</p>
              <p className="text-gray-400 text-sm mt-2">Esta funcionalidade estará disponível após a integração com o Supabase</p>
            </div>
          </TabsContent>
          
          <TabsContent value="testimonials" className="p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Gerenciar Depoimentos</h2>
            <p className="text-gray-500 mb-8">Esta seção será implementada com o Supabase para gerenciamento de depoimentos de clientes.</p>
          </TabsContent>
          
          <TabsContent value="quotes" className="p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Gerenciar Solicitações de Orçamento</h2>
            <p className="text-gray-500 mb-8">Esta seção será implementada com o Supabase para gerenciamento das solicitações recebidas pelo formulário de contato.</p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 text-left">Nome</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Telefone</th>
                    <th className="p-3 text-left">Tipo de Evento</th>
                    <th className="p-3 text-left">Data</th>
                    <th className="p-3 text-left">Local</th>
                    <th className="p-3 text-left">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {quoteRequests.map(request => (
                    <tr key={request.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{request.name}</td>
                      <td className="p-3">cliente@exemplo.com</td>
                      <td className="p-3">{request.phone}</td>
                      <td className="p-3">{request.eventType}</td>
                      <td className="p-3">{new Date(request.date).toLocaleDateString('pt-BR')}</td>
                      <td className="p-3">Volta Redonda, RJ</td>
                      <td className="p-3">
                        <Button size="sm" variant="outline" className="text-xs">
                          Criar Proposta
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          <TabsContent value="proposals" className="p-6 bg-white rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Gerador de Propostas</h2>
            <p className="text-gray-500 mb-8">Esta seção será implementada para gerar propostas em PDF personalizadas a partir dos dados de orçamento.</p>
            
            <div className="bg-lavender/10 p-6 rounded-lg">
              <h3 className="font-medium mb-4">Template de Proposta</h3>
              <p className="text-gray-600 mb-4">Esta funcionalidade será desenvolvida com react-pdf ou jsPDF para geração de documentos PDF personalizados com os dados do cliente e do evento.</p>
              
              <div className="mt-4">
                <Button>Visualizar Template</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
