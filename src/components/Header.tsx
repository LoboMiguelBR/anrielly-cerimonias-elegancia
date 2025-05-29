import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { title: 'Sobre', href: '#sobre' },
    { title: 'Serviços', href: '#servicos' },
    { title: 'Diferenciais', href: '#diferenciais' },
    { title: 'Galeria', href: '#galeria' },
    { title: 'Depoimentos', href: '#depoimentos' },
    { title: 'Contato', href: '#contato' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <a href="#" className="flex items-center">
          <img 
            src="/lovable-uploads/a1e9c8bb-3ef0-4768-8b5e-9fac87c9d598.png" 
            alt="Anrielly Gomes - Mestre de Cerimônias" 
            className="h-12 md:h-16"
          />
        </a>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map(item => (
            <a 
              key={item.title} 
              href={item.href} 
              className="text-gray-800 hover:text-gold font-medium transition-colors"
            >
              {item.title}
            </a>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMenu} 
          className="md:hidden text-gray-800 hover:text-gold"
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-md py-4 animate-fade-in">
          <nav className="flex flex-col container mx-auto px-4">
            {navItems.map(item => (
              <a 
                key={item.title} 
                href={item.href} 
                className="text-gray-800 hover:text-gold py-2 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.title}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
