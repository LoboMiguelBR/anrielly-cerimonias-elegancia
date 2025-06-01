
import React, { useState } from 'react';
import { Menu, X, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link to="/" className="flex items-center">
              <Heart className="h-8 w-8 text-purple-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Anrielly Gomes
              </span>
            </Link>
          </div>
          
          <div className="-mr-2 -my-2 md:hidden">
            <button
              type="button"
              className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
          
          <nav className="hidden md:flex space-x-10">
            <a href="#about" className="text-base font-medium text-gray-500 hover:text-gray-900">
              Sobre
            </a>
            <a href="#services" className="text-base font-medium text-gray-500 hover:text-gray-900">
              Serviços
            </a>
            <a href="#gallery" className="text-base font-medium text-gray-500 hover:text-gray-900">
              Galeria
            </a>
            <a href="#testimonials" className="text-base font-medium text-gray-500 hover:text-gray-900">
              Depoimentos
            </a>
            <a href="#contact" className="text-base font-medium text-gray-500 hover:text-gray-900">
              Contato
            </a>
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
          <a href="#about" className="text-gray-500 hover:text-gray-900 block px-3 py-2 text-base font-medium">
            Sobre
          </a>
          <a href="#services" className="text-gray-500 hover:text-gray-900 block px-3 py-2 text-base font-medium">
            Serviços
          </a>
          <a href="#gallery" className="text-gray-500 hover:text-gray-900 block px-3 py-2 text-base font-medium">
            Galeria
          </a>
          <a href="#testimonials" className="text-gray-500 hover:text-gray-900 block px-3 py-2 text-base font-medium">
            Depoimentos
          </a>
          <a href="#contact" className="text-gray-500 hover:text-gray-900 block px-3 py-2 text-base font-medium">
            Contato
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
