import { Instagram } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="py-12 md:py-16 px-6 border-t border-white/5 relative z-0 overflow-hidden">
      <div 
        className="absolute inset-0 -z-10"
        style={{ 
          backgroundImage: "url('/images/textura.webp')",
          backgroundSize: "800px auto",
          backgroundRepeat: "repeat",
          backgroundPosition: "center",
        }}
      />
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="text-center md:text-left">
          <div className="mb-4 flex items-center justify-center md:justify-start h-20 py-2">
            <img 
              src="/logo.png" 
              alt="Nexa Interiores" 
              className="h-full w-auto object-cover" 
              style={{
                maskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 60%, transparent 100%)',
                WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 60%, transparent 100%)'
              }}
            />
          </div>
          <p className="text-white/60 text-sm max-w-xs">
            A melhor loja de móveis de alto padrão em Ribeirão Preto. Design de interiores premium, móveis de luxo e mobiliário exclusivo para sua casa.
          </p>
        </div>

        <div className="flex gap-8">
          <a 
            href="https://instagram.com/nexainteriores" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white/60 hover:text-white transition-colors"
          >
            Instagram
          </a>
          <a 
            href="https://wa.me/5516997908686" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white/60 hover:text-white transition-colors"
          >
            WhatsApp
          </a>
        </div>

        <div className="text-white/60 text-xs text-center md:text-right">
          © 2026 Nexa Interiores. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};
