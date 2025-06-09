
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Edit, Trash2, Phone, Mail, Globe, MapPin } from 'lucide-react';
import { useProfessionals } from '@/hooks/useProfessionals';
import { toast } from 'sonner';

const GestaoFornecedores = () => {
  const { professionals, loading, addProfessional, updateProfessional, deleteProfessional } = useProfessionals();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    email: '',
    phone: '',
    city: '',
    website: '',
    instagram: '',
    notes: '',
    price_range: '',
    payment_terms: '',
    supplier_type: 'servico'
  });

  // Categorias baseadas nos dados existentes
  const categories = [
    'Fotografia', 'Decoração', 'Música', 'Buffet', 'Cerimonialista', 
    'Floricultura', 'Transporte', 'Beleza', 'Som e Iluminação', 'Outros'
  ];

  const priceRanges = [
    'Econômico (até R$ 1.000)',
    'Intermediário (R$ 1.000 - R$ 5.000)', 
    'Premium (R$ 5.000 - R$ 15.000)',
    'Luxo (acima de R$ 15.000)'
  ];

  // Filtrar fornecedores
  const filteredSuppliers = professionals?.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || supplier.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }) || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSupplier) {
        await updateProfessional(editingSupplier.id, formData);
        toast.success('Fornecedor atualizado com sucesso!');
        setEditingSupplier(null);
      } else {
        await addProfessional(formData);
        toast.success('Fornecedor adicionado com sucesso!');
        setShowAddDialog(false);
      }
      
      // Reset form
      setFormData({
        name: '',
        category: '',
        email: '',
        phone: '',
        city: '',
        website: '',
        instagram: '',
        notes: '',
        price_range: '',
        payment_terms: '',
        supplier_type: 'servico'
      });
    } catch (error) {
      toast.error('Erro ao salvar fornecedor');
    }
  };

  const handleEdit = (supplier) => {
    setFormData({
      name: supplier.name || '',
      category: supplier.category || '',
      email: supplier.email || '',
      phone: supplier.phone || '',
      city: supplier.city || '',
      website: supplier.website || '',
      instagram: supplier.instagram || '',
      notes: supplier.notes || '',
      price_range: supplier.price_range || '',
      payment_terms: supplier.payment_terms || '',
      supplier_type: supplier.supplier_type || 'servico'
    });
    setEditingSupplier(supplier);
    setShowAddDialog(true);
  };

  const handleDelete = async (supplierId) => {
    if (window.confirm('Tem certeza que deseja excluir este fornecedor?')) {
      try {
        await deleteProfessional(supplierId);
        toast.success('Fornecedor removido com sucesso!');
      } catch (error) {
        toast.error('Erro ao remover fornecedor');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      email: '',
      phone: '',
      city: '',
      website: '',
      instagram: '',
      notes: '',
      price_range: '',
      payment_terms: '',
      supplier_type: 'servico'
    });
    setEditingSupplier(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando fornecedores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestão de Fornecedores</h2>
          <p className="text-gray-600">Gerencie sua rede de fornecedores e prestadores de serviços</p>
        </div>
        
        <Dialog open={showAddDialog} onOpenChange={(open) => {
          setShowAddDialog(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Fornecedor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingSupplier ? 'Editar Fornecedor' : 'Novo Fornecedor'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Categoria *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Cidade *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="price_range">Faixa de Preço</Label>
                  <Select 
                    value={formData.price_range} 
                    onValueChange={(value) => setFormData({ ...formData, price_range: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a faixa" />
                    </SelectTrigger>
                    <SelectContent>
                      {priceRanges.map(range => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    placeholder="@usuario"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="payment_terms">Condições de Pagamento</Label>
                <Input
                  id="payment_terms"
                  value={formData.payment_terms}
                  onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value })}
                  placeholder="Ex: 50% entrada + 50% no evento"
                />
              </div>

              <div>
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingSupplier ? 'Atualizar' : 'Adicionar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar fornecedores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Fornecedores */}
      <div className="grid gap-4">
        {filteredSuppliers.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">
                {searchTerm || categoryFilter !== 'all' 
                  ? 'Nenhum fornecedor encontrado com os filtros atuais'
                  : 'Nenhum fornecedor cadastrado ainda'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredSuppliers.map((supplier) => (
            <Card key={supplier.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {supplier.name}
                      </h3>
                      <Badge variant="secondary">{supplier.category}</Badge>
                      {supplier.price_range && (
                        <Badge variant="outline">{supplier.price_range}</Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {supplier.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {supplier.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {supplier.city}
                      </div>
                      {supplier.website && (
                        <div className="flex items-center gap-1">
                          <Globe className="w-4 h-4" />
                          <a 
                            href={supplier.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Website
                          </a>
                        </div>
                      )}
                    </div>

                    {supplier.payment_terms && (
                      <div className="mt-2 text-sm text-gray-600">
                        <strong>Pagamento:</strong> {supplier.payment_terms}
                      </div>
                    )}

                    {supplier.notes && (
                      <div className="mt-2 text-sm text-gray-600">
                        <strong>Observações:</strong> {supplier.notes}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(supplier)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(supplier.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default GestaoFornecedores;
