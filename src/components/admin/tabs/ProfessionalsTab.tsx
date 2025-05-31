
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users, Building2, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ProfessionalsTable from '../professionals/ProfessionalsTable';
import AddProfessionalForm from '../professionals/AddProfessionalForm';
import { useProfessionals } from '@/hooks/useProfessionals';

const ProfessionalsTab = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { professionals, isLoading, addProfessional, deleteProfessional, refetch } = useProfessionals();

  const handleProfessionalAdded = () => {
    setShowAddDialog(false);
  };

  // Estatísticas
  const totalProfessionals = professionals.length;
  const uniqueCategories = new Set(professionals.map(p => p.category)).size;
  const uniqueCities = new Set(professionals.map(p => p.city)).size;
  const topCategory = professionals.length > 0 
    ? professionals.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    : {};
  
  const mostCommonCategory = Object.keys(topCategory).length > 0 
    ? Object.keys(topCategory).reduce((a, b) => topCategory[a] > topCategory[b] ? a : b)
    : '';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão de Profissionais</h2>
          <p className="text-gray-600">Gerencie sua rede de profissionais do mercado de eventos</p>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="bg-rose-500 hover:bg-rose-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Cadastrar Profissional
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Profissional</DialogTitle>
            </DialogHeader>
            <AddProfessionalForm 
              onSuccess={handleProfessionalAdded}
              onSubmit={addProfessional}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Total de Profissionais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalProfessionals}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Categorias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">{uniqueCategories}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Cidades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{uniqueCities}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Categoria Mais Comum</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold text-green-600">
              {mostCommonCategory ? (
                <>
                  {mostCommonCategory.charAt(0).toUpperCase() + mostCommonCategory.slice(1)}
                  <div className="text-xs text-gray-500">
                    ({topCategory[mostCommonCategory]} profissionais)
                  </div>
                </>
              ) : (
                'N/A'
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <ProfessionalsTable 
        professionals={professionals} 
        isLoading={isLoading}
        onDelete={deleteProfessional}
        onRefresh={refetch}
      />
    </div>
  );
};

export default ProfessionalsTab;
