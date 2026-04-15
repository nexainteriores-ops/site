import { Instagram } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="py-12 md:py-16 px-6 border-t border-white/5 bg-[#050706]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="text-center md:text-left">
          <div className="text-2xl font-display font-bold tracking-tighter mb-4 flex items-center justify-center md:justify-start gap-2">
            <span className="bg-gradient-to-r from-[#D4AF37] via-[#F9E498] to-[#D4AF37] bg-clip-text text-transparent">NEXA</span>
            <span className="text-white/40 text-lg font-light tracking-[0.2em] mt-1">INTERIORES</span>
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

        <div className="text-white/20 text-xs text-center md:text-right">
          © 2026 Nexa Interiores. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};
