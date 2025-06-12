
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSuppliersEnhanced } from '@/hooks/useSuppliersEnhanced';

const SuppliersTab = () => {
  const { suppliers, loading, refetch } = useSuppliersEnhanced();

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
        <Button onClick={refetch}>Atualizar</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Fornecedores</CardTitle>
        </CardHeader>
        <CardContent>
          {suppliers.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Nenhum fornecedor cadastrado ainda.
            </p>
          ) : (
            <div className="space-y-4">
              {suppliers.map(supplier => (
                <div key={supplier.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{supplier.name}</h3>
                      <p className="text-sm text-gray-600">{supplier.category}</p>
                      <p className="text-sm text-gray-500">{supplier.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">Rating: {supplier.rating}/5</p>
                      {supplier.verified && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Verificado
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SuppliersTab;
