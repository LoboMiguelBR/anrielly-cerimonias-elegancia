
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Star, Phone, Mail, MapPin } from 'lucide-react';
import { useSuppliersEnhanced } from '@/hooks/useSuppliersEnhanced';

const SuppliersManager = () => {
  const { suppliers, stats, loading, createSupplier, updateSupplier, deleteSupplier } = useSuppliersEnhanced();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || supplier.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', 'fotografia', 'decoracao', 'buffet', 'musica', 'floricultura', 'cerimonial'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Fornecedores</h2>
          <p className="text-gray-600">Gerencie sua rede de fornecedores</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Novo Fornecedor
        </Button>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.total_suppliers}</div>
              <div className="text-sm text-gray-600">Total de Fornecedores</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.verified_suppliers}</div>
              <div className="text-sm text-gray-600">Verificados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">{stats.preferred_suppliers}</div>
              <div className="text-sm text-gray-600">Preferenciais</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-600">{stats.average_rating.toFixed(1)}</div>
              <div className="text-sm text-gray-600">Avaliação Média</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar fornecedores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 'all' ? 'Todos' : category}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map(supplier => (
          <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{supplier.name}</CardTitle>
                  <Badge variant="outline" className="mt-1">
                    {supplier.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">{supplier.rating.toFixed(1)}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  {supplier.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  {supplier.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  {supplier.address?.city && supplier.address?.state ? 
                    `${supplier.address.city}, ${supplier.address.state}` : 
                    'Endereço não informado'
                  }
                </div>
                
                {supplier.price_range && (
                  <div className="mt-3">
                    <Badge variant="secondary">
                      {supplier.price_range}
                    </Badge>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" className="flex-1">
                    Ver Detalhes
                  </Button>
                  <Button size="sm" className="flex-1">
                    Contratar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSuppliers.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">Nenhum fornecedor encontrado.</p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar primeiro fornecedor
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SuppliersManager;
