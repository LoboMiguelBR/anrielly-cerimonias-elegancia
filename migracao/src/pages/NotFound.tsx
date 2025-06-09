
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-6 bg-white rounded-lg shadow-sm">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Página não encontrada</p>
        <div className="space-y-3">
          {isAdminRoute ? (
            <Link to="/admin/dashboard" className="block text-blue-500 hover:text-blue-700 underline">
              Voltar para o Dashboard Admin
            </Link>
          ) : (
            <Link to="/" className="block text-blue-500 hover:text-blue-700 underline">
              Voltar para a Página Inicial
            </Link>
          )}
          
          {isAdminRoute && (
            <Link to="/admin/login" className="block text-blue-500 hover:text-blue-700 underline">
              Ir para Login Admin
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
