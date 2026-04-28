import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Instagram, Menu, X, ChevronRight } from 'lucide-react';
import { useState, lazy, Suspense } from 'react';
import { Analytics } from '@vercel/analytics/react';

// Correct Lazy load from external files to enable proper code splitting
const Collections = lazy(() => import('./components/Collections').then(m => ({ default: m.Collections })));
const AboutSection = lazy(() => import('./components/AboutSection').then(m => ({ default: m.AboutSection })));
const VIPSection = lazy(() => import('./components/VIPSection').then(m => ({ default: m.VIPSection })));
const VisitSection = lazy(() => import('./components/VisitSection').then(m => ({ default: m.VisitSection })));
const Footer = lazy(() => import('./components/Footer').then(m => ({ default: m.Footer })));
const SEOData = lazy(() => import('./components/SEOData').then(m => ({ default: m.SEOData })));

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(scrollY, [0, 100], ['rgba(6, 18, 15, 0)', 'rgba(6, 18, 15, 1)']);

  return (
    <motion.nav 
      style={{ backgroundColor }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center h-full"
        >
          <img src="/logo.png" alt="Nexa Interiores" className="h-20 w-auto object-cover" />
        </motion.div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
          <a href="#colecoes" className="hover:text-white transition-colors">Coleções</a>
          <a href="#sobre" className="hover:text-white transition-colors">A Marca</a>
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
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass border-t border-white/10 p-6 flex flex-col gap-4 text-sm font-medium"
        >
          <a href="#colecoes" className="hover:text-white transition-colors" onClick={() => setIsOpen(false)}>Coleções</a>
          <a href="#sobre" className="hover:text-white transition-colors" onClick={() => setIsOpen(false)}>A Marca</a>
          <a href="#vip" className="text-[#D4AF37] hover:text-[#F9E498] transition-colors" onClick={() => setIsOpen(false)}>Grupo VIP</a>
          <a href="#visita" className="hover:text-white transition-colors" onClick={() => setIsOpen(false)}>Visite-nos</a>
        </motion.div>
      )}
    </motion.nav>
  );
};

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#06120F]">
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/hero.webp" 
          alt="Loja de móveis em Ribeirão Preto - Nexa Interiores: Mobiliário exclusivo e design de interiores premium" 
          className="w-full h-full object-cover opacity-60"
          referrerPolicy="no-referrer"
          fetchPriority="high"
          width="1920"
          height="1080"
          decoding="async"
        />
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

export default function App() {
  return (
    <div className="min-h-screen font-sans selection:bg-white selection:text-black bg-[#06120F]">
      <Suspense fallback={null}>
        <SEOData />
      </Suspense>
      <Navbar />
      <main>
        <Hero />
        <Suspense fallback={<div className="h-screen bg-[#06120F]" />}>
          <Collections />
          <AboutSection />
          <VIPSection />
          <VisitSection />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      <Analytics />
    </div>
  );
}
