
import React from 'react';
import { Camera } from 'lucide-react';

const GalleryTab = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Gerenciar Galeria</h2>
      <p className="text-gray-500 mb-8">Esta seção será implementada com o Supabase para upload e gerenciamento de imagens.</p>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <Camera className="w-12 h-12 mx-auto text-gray-400 mb-2" />
        <p className="text-gray-600">Clique ou arraste as imagens para fazer upload</p>
        <p className="text-gray-400 text-sm mt-2">Esta funcionalidade estará disponível após a integração com o Supabase</p>
      </div>
    </div>
  );
};

export default GalleryTab;
