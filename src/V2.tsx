import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { MapPin, Instagram, ArrowRight, Menu, X, ChevronRight, Phone, Clock, ArrowLeft } from 'lucide-react';
import { useState, useRef, Suspense } from 'react';
import { cn } from './lib/utils';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(scrollY, [0, 100], ['rgba(5, 7, 6, 0)', 'rgba(5, 7, 6, 0.9)']);

  return (
    <motion.nav 
      style={{ backgroundColor }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-brand-serif font-bold tracking-tight flex items-center gap-2"
        >
          <span className="bg-gradient-to-r from-brand-gold-dark via-brand-gold-light to-brand-gold-dark bg-clip-text text-transparent">NEXA</span>
          <span className="text-white/40 text-lg font-light tracking-[0.3em] mt-1 font-sans">INTERIORES</span>
        </motion.div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
          <a href="#colecoes" className="hover:text-white transition-colors">Coleções</a>
          <a href="#sobre" className="hover:text-white transition-colors">A Marca</a>
          <a href="#vip" className="text-brand-gold hover:text-brand-gold-light transition-colors flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
            Grupo VIP
          </a>
          <a href="#visita" className="hover:text-white transition-colors">Visite-nos</a>
          <a 
            href="https://instagram.com/nexainteriores" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 glass rounded-full hover:bg-white/10 transition-all border-white/20"
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
          <a href="#vip" className="text-brand-gold hover:text-brand-gold-light transition-colors" onClick={() => setIsOpen(false)}>Grupo VIP</a>
          <a href="#visita" className="hover:text-white transition-colors" onClick={() => setIsOpen(false)}>Visite-nos</a>
        </motion.div>
      )}
    </motion.nav>
  );
};

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-brand-bg-deep">
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/faxada.webp" 
          alt="Loja de móveis em Ribeirão Preto - Nexa Interiores" 
          className="w-full h-full object-cover opacity-40 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-bg-deep/20 via-brand-bg-deep/60 to-brand-bg-deep" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-block text-brand-gold uppercase tracking-[0.4em] text-xs font-bold mb-6"
        >
          Curadoria de Interiores Gratuita • Ribeirão Preto
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-4xl md:text-8xl font-brand-serif font-bold tracking-tight mb-8 leading-[1.1]"
        >
          <span className="text-white">Mobiliário</span> <br />
          <span className="bg-gradient-to-r from-brand-gold-light via-white to-brand-gold-light bg-clip-text text-transparent italic">exclusivo</span> <br />
          <span className="text-white/90">para sua casa.</span>
        </motion.h1>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a 
            href="https://wa.me/5516997908686?text=Olá! Gostaria de agendar minha Curadoria de Interiores Gratuita."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-brand-gold to-brand-gold-dark text-black rounded-full font-bold hover:brightness-110 transition-all flex items-center justify-center gap-2 group shadow-[0_0_30px_rgba(212,175,55,0.3)]"
          >
            Agendar Curadoria Gratuita
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a 
            href="#visita" 
            className="w-full sm:w-auto px-10 py-4 glass rounded-full font-bold hover:bg-white/10 transition-all text-white border-white/20"
          >
            Visitar a Loja Física
          </a>
        </motion.div>
      </div>

      <motion.div 
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-[10%] w-64 h-64 glass rounded-3xl -z-10 blur-sm opacity-20 border-brand-gold/20"
      />
    </section>
  );
};

const FeatureCard = ({ title, description, image, onClick }: any) => {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      onClick={onClick}
      className="group relative overflow-hidden rounded-[2.5rem] aspect-[3/4] glass cursor-pointer border-white/5"
    >
      <img 
        src={image} 
        alt={title} 
        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-bg-deep via-brand-bg-deep/20 to-transparent" />
      <div className="absolute bottom-0 left-0 p-8">
        <h3 className="text-2xl font-brand-serif font-bold mb-3">{title}</h3>
        <p className="text-white/60 text-xs leading-relaxed max-w-[200px]">{description}</p>
        <div className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-gold opacity-0 group-hover:opacity-100 transition-opacity">
          Ver Coleção <ArrowRight size={14} />
        </div>
      </div>
    </motion.div>
  );
};

const Collections = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const collections = [
    {
      id: "sofas",
      title: "Sofás",
      description: "Conforto absoluto com design que transcende tendências.",
      image: "/images/sofas/s1.webp",
      items: [
        { name: "Sofá Design", image: "/images/sofas/s1.webp" },
        { name: "Sofá Elegance", image: "/images/sofas/s6.webp" }
      ]
    },
    {
      id: "poltronas",
      title: "Poltronas",
      description: "Peças de destaque que unem ergonomia e arte.",
      image: "/images/poltronas/p1.webp",
      items: [
        { name: "Poltrona Exclusiva", image: "/images/poltronas/p1.webp" }
      ]
    },
    {
      id: "dining",
      title: "Salas de Jantar",
      description: "O cenário perfeito para momentos inesquecíveis.",
      image: "/images/salas-de-jantar/m2.webp",
      items: [
        { name: "Mesa de Jantar", image: "/images/salas-de-jantar/m2.webp" }
      ]
    }
  ];

  return (
    <section id="colecoes" className="py-32 px-6 bg-brand-bg-deep">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-brand-serif font-bold mb-8 tracking-tight">Curadoria Exclusiva.</h2>
          <div className="w-24 h-1 bg-brand-gold mx-auto mb-8" />
          <p className="text-white/70 text-lg leading-relaxed">Selecionamos as melhores peças diretamente das maiores feiras de design para harmonizar com seu projeto de alto padrão em Ribeirão Preto.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {collections.map((item) => (
            <FeatureCard 
              key={item.id} 
              title={item.title} 
              description={item.description} 
              image={item.image} 
              onClick={() => setActiveCategory(item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const AboutSection = () => {
  return (
    <section id="sobre" className="relative py-40 px-6 overflow-hidden bg-brand-bg-deep border-y border-white/5">
      <div className="absolute inset-0 z-0">
        <img src="/images/faxada.webp" className="w-full h-full object-cover opacity-20" alt="Sobre" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-bg-deep via-transparent to-brand-bg-deep" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <span className="text-brand-gold uppercase tracking-[0.3em] text-xs font-bold mb-8 inline-block">A Marca</span>
        <h2 className="text-3xl md:text-6xl font-brand-serif font-medium mb-12 leading-tight">
          "Trazer o mobiliário exclusivo direto das feiras mundiais para o seu ambiente."
        </h2>
        <a 
          href="https://wa.me/5516997908686"
          className="inline-flex items-center gap-4 px-10 py-4 bg-white text-black rounded-full font-bold hover:bg-brand-gold transition-all"
        >
          Consultoria Personalizada <ArrowRight size={18} />
        </a>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-20 px-6 border-t border-white/5 bg-brand-bg-deep">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-16">
        <div>
          <div className="text-3xl font-brand-serif font-bold tracking-tight flex items-center gap-2 mb-6">
            <span className="text-brand-gold">NEXA</span>
            <span className="text-white/40 text-xl font-light tracking-[0.2em] font-sans">INTERIORES</span>
          </div>
          <p className="text-white/40 text-sm max-w-xs leading-relaxed">
            Mobiliário de alto padrão e curadoria gratuita em Ribeirão Preto. Elevando seu conceito de morar bem.
          </p>
        </div>
        
        <div className="flex gap-20">
          <div className="flex flex-col gap-4">
            <span className="text-white font-bold mb-2">Contato</span>
            <a href="#" className="text-white/60 hover:text-brand-gold transition-colors text-sm">(16) 99790-8686</a>
            <a href="#" className="text-white/60 hover:text-brand-gold transition-colors text-sm">Instagram</a>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-white font-bold mb-2">Endereço</span>
            <p className="text-white/60 text-sm leading-relaxed">
              Av. Norma Valério Corrêa, 316<br />
              Jardim Botânico, Ribeirão Preto
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex justify-between items-center text-[10px] text-white/20 uppercase tracking-widest">
        <span>© 2026 Nexa Interiores</span>
        <span>Aesthetics by Antigravity</span>
      </div>
    </footer>
  );
};

export default function V2() {
  return (
    <div className="min-h-screen font-sans selection:bg-brand-gold selection:text-black bg-brand-bg-deep text-white">
      <Navbar />
      <main>
        <Hero />
        <Collections />
        <AboutSection />
        <Footer />
      </main>
    </div>
  );
}
