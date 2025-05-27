
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Eye, Search, Filter, Phone, Mail, Globe, Instagram, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useMobileLayout } from '@/hooks/useMobileLayout';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Professional } from '@/hooks/useProfessionals';

interface ProfessionalsTableProps {
  professionals: Professional[];
  isLoading: boolean;
  onDelete: (id: string) => void;
}

const CATEGORY_LABELS: { [key: string]: string } = {
  'cerimonialista': 'Cerimonialista',
  'fotografo': 'Fotógrafo',
  'videomaker': 'Videomaker',
  'decorador': 'Decorador',
  'florista': 'Florista',
  'musico': 'Músico',
  'dj': 'DJ',
  'buffet': 'Buffet',
  'doces': 'Doces',
  'bolo': 'Bolo',
  'convites': 'Convites',
  'locacao': 'Locação',
  'transporte': 'Transporte',
  'seguranca': 'Segurança',
  'outro': 'Outro'
};

const ProfessionalsTable = ({ professionals, isLoading, onDelete }: ProfessionalsTableProps) => {
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { isMobile } = useMobileLayout();

  const getCategoryLabel = (category: string) => {
    return CATEGORY_LABELS[category] || category;
  };

  const filteredProfessionals = professionals.filter(professional => {
    const matchesCategory = filterCategory === 'all' || professional.category === filterCategory;
    const matchesSearch = searchTerm === '' || 
      professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const uniqueCategories = Array.from(new Set(professionals.map(p => p.category)));

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className={`flex gap-4 ${isMobile ? 'flex-col' : 'items-center'}`}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar por nome, email, cidade ou categoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className={isMobile ? 'w-full' : 'w-48'}>
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filtrar por categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            {uniqueCategories.map((category) => (
              <SelectItem key={category} value={category}>
                {getCategoryLabel(category)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filteredProfessionals.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">Nenhum profissional encontrado</p>
            </CardContent>
          </Card>
        ) : (
          filteredProfessionals.map((professional) => (
            <Card key={professional.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className={`flex justify-between items-start ${isMobile ? 'flex-col gap-3' : ''}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{professional.name}</h3>
                      <Badge variant="outline" className="text-rose-600 border-rose-200">
                        {getCategoryLabel(professional.category)}
                      </Badge>
                    </div>
                    
                    <div className={`grid gap-2 text-sm text-gray-600 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'}`}>
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {professional.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {professional.phone}
                      </div>
                      <div>
                        <strong>Cidade:</strong> {professional.city}
                      </div>
                      {professional.instagram && (
                        <div className="flex items-center gap-1">
                          <Instagram className="w-4 h-4" />
                          {professional.instagram}
                        </div>
                      )}
                      {professional.website && (
                        <div className="flex items-center gap-1">
                          <Globe className="w-4 h-4" />
                          Website
                        </div>
                      )}
                    </div>
                    
                    {professional.tags && professional.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {professional.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500 mt-2">
                      Cadastrado em {format(new Date(professional.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </div>
                  </div>
                  
                  <div className={`flex gap-2 ${isMobile ? 'w-full' : ''}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedProfessional(professional)}
                      className={isMobile ? 'flex-1' : ''}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver Detalhes
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir o profissional "{professional.name}"? 
                            Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(professional.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={!!selectedProfessional} onOpenChange={() => setSelectedProfessional(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalhes do Profissional</DialogTitle>
          </DialogHeader>
          
          {selectedProfessional && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Nome</label>
                  <p className="text-gray-900">{selectedProfessional.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Categoria</label>
                  <p className="text-gray-900">{getCategoryLabel(selectedProfessional.category)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{selectedProfessional.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Telefone</label>
                  <p className="text-gray-900">{selectedProfessional.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Cidade</label>
                  <p className="text-gray-900">{selectedProfessional.city}</p>
                </div>
                {selectedProfessional.document && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">CNPJ/CPF</label>
                    <p className="text-gray-900">{selectedProfessional.document}</p>
                  </div>
                )}
                {selectedProfessional.instagram && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Instagram</label>
                    <p className="text-gray-900">{selectedProfessional.instagram}</p>
                  </div>
                )}
                {selectedProfessional.website && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Website</label>
                    <p className="text-gray-900">{selectedProfessional.website}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-700">Cadastrado em</label>
                  <p className="text-gray-900">
                    {format(new Date(selectedProfessional.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </p>
                </div>
              </div>
              
              {selectedProfessional.tags && selectedProfessional.tags.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Tags</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedProfessional.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedProfessional.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Observações</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-md mt-1">
                    {selectedProfessional.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfessionalsTable;
