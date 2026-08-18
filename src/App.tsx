import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Instagram, Menu, X, ChevronRight, Sparkles } from 'lucide-react';
import { useState, lazy, Suspense, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { trackLead } from './lib/fbPixel';
import { Link } from 'react-router-dom';

// Correct Lazy load from external files to enable proper code splitting
const Collections = lazy(() => import('./components/Collections').then(m => ({ default: m.Collections })));
const AboutSection = lazy(() => import('./components/AboutSection').then(m => ({ default: m.AboutSection })));
const VIPSection = lazy(() => import('./components/VIPSection').then(m => ({ default: m.VIPSection })));
const VisitSection = lazy(() => import('./components/VisitSection').then(m => ({ default: m.VisitSection })));
const Footer = lazy(() => import('./components/Footer').then(m => ({ default: m.Footer })));
const SEOData = lazy(() => import('./components/SEOData').then(m => ({ default: m.SEOData })));

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 overflow-hidden shadow-2xl">
      <div 
        className="absolute inset-0 -z-10"
        style={{ 
          backgroundImage: "url('/images/textura.webp')",
          backgroundSize: "800px auto",
          backgroundRepeat: "repeat",
          backgroundPosition: "center",
        }}
      />
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center h-full py-2"
        >
          <img 
            src="/logo.webp" 
            alt="Nexa Interiores" 
            className="h-full w-auto object-cover" 
            style={{
              maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 35%, transparent 90%)',
              WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 35%, transparent 90%)'
            }}
          />
        </motion.div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
          <a href="#colecoes" className="hover:text-white transition-colors">Coleções</a>
          <a href="#sobre" className="hover:text-white transition-colors">A Marca</a>
          <Link to="/reimagine" className="hover:text-white transition-colors flex items-center gap-1.5 text-[#D4AF37] font-semibold">
            <Sparkles size={14} className="text-[#D4AF37] animate-pulse" />
            Reimagine
          </Link>
          <a href="#vip" className="text-[#D4AF37] hover:text-[#F9E498] transition-colors flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            Grupo VIP
          </a>
          <a href="#visita" className="hover:text-white transition-colors">Visite-nos</a>
          <a 
            href="https://instagram.com/nexainteriores" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 glass rounded-full hover:bg-white/10 transition-all"
          >
            <Instagram size={18} />
          </a>
        </div>

        <button className="md:hidden text-white" aria-label={isOpen ? "Fechar menu" : "Abrir menu"} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div 
          className="md:hidden border-t border-white/10 p-6 flex flex-col gap-4 text-sm font-medium relative"
        >
          <div 
            className="absolute inset-0 -z-10"
            style={{ 
              backgroundImage: "url('/images/textura.webp')",
              backgroundSize: "800px auto",
              backgroundRepeat: "repeat",
              backgroundPosition: "center",
            }}
          />
          <a href="#colecoes" className="hover:text-white transition-colors" onClick={() => setIsOpen(false)}>Coleções</a>
          <a href="#sobre" className="hover:text-white transition-colors" onClick={() => setIsOpen(false)}>A Marca</a>
          <Link to="/reimagine" className="text-[#D4AF37] hover:text-[#F9E498] transition-colors flex items-center gap-1.5 font-semibold" onClick={() => setIsOpen(false)}>
            <Sparkles size={14} className="text-[#D4AF37] animate-pulse" />
            Reimagine seu Ambiente
          </Link>
          <a href="#vip" className="text-[#D4AF37] hover:text-[#F9E498] transition-colors" onClick={() => setIsOpen(false)}>Grupo VIP</a>
          <a href="#visita" className="hover:text-white transition-colors" onClick={() => setIsOpen(false)}>Visite-nos</a>
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#06120F]">
      <div className="absolute inset-0 z-0">
        <picture className="absolute inset-0 w-full h-full">
          <source media="(max-width: 768px)" srcSet="/images/hero-mobile-opt.webp" />
          <img 
            src="/images/hero-opt.webp" 
            alt="Loja de móveis em Ribeirão Preto - Nexa Interiores: Mobiliário exclusivo e design de interiores premium" 
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
            fetchPriority="high"
            width="1920"
            height="1080"
            decoding="async"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-[#06120F]/20 via-[#06120F]/40 to-[#06120F]" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl">
        <span className="inline-block text-[#D4AF37] uppercase tracking-[0.3em] text-xs font-bold mb-6 font-display">
          Curadoria de Interiores Gratuita • Ribeirão Preto
        </span>
        <h1 className="text-4xl md:text-8xl font-display font-bold tracking-tight mb-8 text-gradient">
          Mobiliário exclusivo <br /> direto das feiras <br /> para a sua casa.
        </h1>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href="https://wa.me/5516997908686?text=Olá! Gostaria de agendar minha Curadoria de Interiores Gratuita."
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackLead('hero')}
            className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black rounded-full font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 group text-sm md:text-base shadow-[0_0_20px_rgba(212,175,55,0.4)]"
          >
            Agendar Curadoria Gratuita
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a 
            href="#visita" 
            className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 glass rounded-full font-bold hover:bg-white/10 transition-all text-sm md:text-base text-white"
          >
            Visitar a Loja Física
          </a>
        </div>
      </div>

      {/* Floating Liquid Glass Elements - Keep animations for these as they are non-critical */}
      <motion.div 
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-[10%] w-64 h-64 glass rounded-3xl -z-10 blur-sm opacity-30"
      />
      <motion.div 
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-40 left-[5%] w-48 h-48 glass rounded-full -z-10 blur-md opacity-20"
      />
    </section>
  );
};

const ReimagineSection = () => {
  return (
    <section className="py-20 md:py-24 px-6 bg-[#06120F] relative overflow-hidden">
      {/* Elemento de fundo decorativo */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl -z-10" />
      
      <div className="max-w-6xl mx-auto">
        <div className="glass p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] border-white/5 relative overflow-hidden grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          
          {/* Esquerda: Conteúdo */}
          <div className="space-y-6 md:space-y-8 text-left">
            <span className="inline-flex items-center gap-2 text-[#D4AF37] uppercase tracking-[0.2em] text-xs font-bold font-display">
              <Sparkles size={16} className="animate-pulse" />
              Tecnologia & Curadoria
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold tracking-tight text-white leading-tight">
              Veja nossos móveis <br /> no seu próprio ambiente.
            </h2>
            <p className="text-white/70 text-sm md:text-base leading-relaxed">
              Com o nosso novo editor interativo por Inteligência Artificial, você pode enviar uma foto da sua sala ou quarto, marcar a área desejada e ver instantaneamente como nossos sofás, poltronas e mesas de jantar em estoque ficariam no seu espaço.
            </p>
            <div className="pt-2">
              <Link 
                to="/reimagine"
                className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black rounded-full font-bold hover:brightness-110 transition-all text-sm md:text-base shadow-[0_0_25px_rgba(212,175,55,0.3)] group"
              >
                Reimaginar meu Ambiente
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Direita: Ilustração Visual */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] rounded-[2rem] blur opacity-20 group-hover:opacity-35 transition duration-1000" />
            <div className="relative rounded-[2rem] overflow-hidden border border-white/10 bg-black/40 aspect-[4/3] flex items-center justify-center">
              <img 
                src="/images/salas-de-jantar/m2.webp" 
                alt="Reimagine seu ambiente" 
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Elementos flutuantes de interface simulada */}
              <div className="absolute top-4 left-4 glass px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5 border-white/10 shadow-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
                Visualizador IA
              </div>
              
              <div className="absolute bottom-4 right-4 glass px-4 py-2.5 rounded-2xl text-[11px] font-semibold text-white/95 max-w-[200px] border-white/10 shadow-lg flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-[#D4AF37]/20 flex items-center justify-center text-xs">🛋️</div>
                <div>
                  <div className="font-bold text-[10px] text-[#D4AF37]">Móvel Selecionado</div>
                  <div className="truncate text-[9px] text-white/50">Mesa de Jantar Exclusiva</div>
                </div>
              </div>

              {/* Caixa de seleção simulada */}
              <div className="absolute inset-[20%_25%_25%_25%] border-2 border-[#D4AF37] bg-[#D4AF37]/15 rounded-lg flex items-center justify-center shadow-2xl animate-pulse">
                <span className="text-[10px] font-bold text-white bg-black/70 px-2 py-1 rounded border border-[#D4AF37]/30">Posicionando...</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default function App() {
  const [renderRest, setRenderRest] = useState(false);

  useEffect(() => {
    const loader = document.getElementById('app-loader');
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.remove();
      }, 500); // Wait for transition to finish
    }
    
    // Delay rendering below-the-fold content to prioritize Hero and reduce TBT and Reflows
    let timer = setTimeout(() => setRenderRest(true), 3000);
    
    const handleInteraction = () => {
      setRenderRest(true);
      clearTimeout(timer);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };

    window.addEventListener('scroll', handleInteraction, { passive: true });
    window.addEventListener('mousemove', handleInteraction, { passive: true });
    window.addEventListener('touchstart', handleInteraction, { passive: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  return (
    <div className="min-h-screen font-sans selection:bg-white selection:text-black bg-[#06120F]">
      <Suspense fallback={null}>
        <SEOData />
      </Suspense>
      <Navbar />
      <main>
        <Hero />
        {renderRest && (
          <Suspense fallback={<div className="h-screen bg-[#06120F]" />}>
            <Collections />
            <ReimagineSection />
            <AboutSection />
            <VIPSection />
            <VisitSection />
          </Suspense>
        )}
      </main>
      {renderRest && (
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      )}
      <Analytics />
    </div>
  );
}
