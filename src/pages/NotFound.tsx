
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-6 bg-white rounded-lg shadow-sm">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Página não encontrada</p>
        <Link 
          to="/" 
          className="text-purple-600 hover:text-purple-700 underline"
        >
          Voltar para a Página Inicial
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
