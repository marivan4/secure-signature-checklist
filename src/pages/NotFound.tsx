
import { useLocation, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

const NotFound = () => {
  const location = useLocation();
  const [isMounted, setIsMounted] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortControllerRef.current = new AbortController();
    setIsMounted(true);
    
    // Log the error in a safe way
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    return () => {
      setIsMounted(false);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [location.pathname]);

  if (!isMounted) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Página não encontrada</p>
        <Link to="/" className="text-blue-500 hover:text-blue-700 underline">
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
