
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Users, Search } from 'lucide-react';
import { useProfessionals } from '@/hooks/useProfessionals';

interface Professional {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  city: string;
}

interface ProfessionalSelectorProps {
  onProfessionalSelect: (professional: Professional | null) => void;
  selectedProfessionalId?: string;
}

const ProfessionalSelector = ({ onProfessionalSelect, selectedProfessionalId }: ProfessionalSelectorProps) => {
  const { professionals, isLoading } = useProfessionals(); // Changed from data to professionals
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProfessionals = professionals.filter(prof =>
    prof.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prof.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prof.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProfessionalSelect = (professionalId: string) => {
    if (professionalId === 'none') {
      onProfessionalSelect(null);
      return;
    }

    const selectedProfessional = professionals.find(prof => prof.id === professionalId);
    if (selectedProfessional) {
      onProfessionalSelect(selectedProfessional);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>Profissional (Opcional)</Label>
        <div className="h-10 bg-gray-100 animate-pulse rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Label htmlFor="professional-select">Profissional (Opcional)</Label>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por nome, categoria ou cidade..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Select 
        value={selectedProfessionalId || ""} 
        onValueChange={handleProfessionalSelect}
      >
        <SelectTrigger>
          <SelectValue placeholder="Selecione um profissional (opcional)">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              {selectedProfessionalId ? 
                professionals.find(p => p.id === selectedProfessionalId)?.name || "Profissional selecionado"
                : "Nenhum profissional selecionado"
              }
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">
            <span className="text-gray-500">Nenhum profissional</span>
          </SelectItem>
          {filteredProfessionals.map((professional) => (
            <SelectItem key={professional.id} value={professional.id}>
              <div className="flex flex-col">
                <span className="font-medium">{professional.name}</span>
                <span className="text-sm text-gray-500">
                  {professional.category} • {professional.city}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {searchTerm && filteredProfessionals.length === 0 && (
        <p className="text-sm text-gray-500">
          Nenhum profissional encontrado para "{searchTerm}"
        </p>
      )}
    </div>
  );
};

export default ProfessionalSelector;
