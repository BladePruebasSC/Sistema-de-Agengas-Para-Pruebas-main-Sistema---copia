import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="footer-banner relative">
      {/* Contenido del footer */}
      <div className="footer-content text-center">
        <div className="max-w-6xl mx-auto">
          {/* Logo y nombre */}
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/icono.png" 
              alt="Gaston Stylo" 
              className="h-8 w-8 mr-2 rounded-full shadow-lg"
            />
            <h3 className="text-2xl font-bold text-white">Gaston Stylo</h3>
          </div>
          
          {/* Copyright */}
          <p className="text-white/80 text-sm">
            © 2025 Sistema de Citas. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;