
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Image, Camera, MessageCircle, FileText, Home, LogOut } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Dados simulados (posteriormente virão do Supabase)
  const quoteRequests = [
    { id: 1, name: 'Maria Silva', date: '2025-08-15', eventType: 'casamento', phone: '(24) 99999-0000', status: 'novo', email: 'maria@example.com', eventLocation: 'Volta Redonda, RJ' },
    { id: 2, name: 'João Santos', date: '2025-07-22', eventType: 'corporativo', phone: '(24) 98888-1111', status: 'novo', email: 'joao@example.com', eventLocation: 'Barra Mansa, RJ' }
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
              <Image className="w-4 h-4 mr-2" /> Galeria
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
                      <th className="p-3 text-left">Local</th>
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
                        <td className="p-3">{request.eventLocation}</td>
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
            <p className="text-gray-500 mb-8">Crie propostas personalizadas para enviar aos clientes.</p>
            
            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-medium mb-6 text-lg">Nova Proposta</h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gold">
                      <option value="">Selecione um cliente</option>
                      {quoteRequests.map(request => (
                        <option key={request.id} value={request.id}>
                          {request.name} - {request.eventType}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data da Proposta</label>
                    <input 
                      type="date" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gold"
                      defaultValue={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Serviços Incluídos</label>
                  <div className="space-y-2">
                    {['Reuniões de planejamento', 'Visita técnica', 'Coordenação dos fornecedores', 'Condução da cerimônia', 'Coordenação da recepção'].map((service, index) => (
                      <div key={index} className="flex items-center">
                        <input 
                          type="checkbox" 
                          id={`service-${index}`} 
                          className="mr-2"
                          defaultChecked
                        />
                        <label htmlFor={`service-${index}`}>{service}</label>
                      </div>
                    ))}
                    <div className="mt-2">
                      <input 
                        type="text" 
                        placeholder="Adicionar serviço personalizado" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gold"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valor Total</label>
                  <div className="flex items-center">
                    <span className="bg-gray-100 px-3 py-2 border border-r-0 border-gray-300 rounded-l-md">R$</span>
                    <input 
                      type="text" 
                      placeholder="0,00"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condições de Pagamento</label>
                  <textarea 
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gold"
                    defaultValue="50% de sinal na assinatura do contrato, 50% restantes até 5 dias antes do evento."
                  ></textarea>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observações Adicionais</label>
                  <textarea 
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-gold"
                    placeholder="Informações adicionais para a proposta..."
                  ></textarea>
                </div>
                
                <div className="flex justify-end gap-4">
                  <Button variant="outline">Pré-visualizar</Button>
                  <Button>Gerar PDF</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
