import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { MapPin, Instagram, ArrowRight, Menu, X, ChevronRight, Phone, Clock, ArrowLeft } from 'lucide-react';
import { useState, useRef } from 'react';
import { cn } from './lib/utils';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(scrollY, [0, 100], ['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']);

  return (
    <motion.nav 
      style={{ backgroundColor }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-display font-bold tracking-tighter flex items-center gap-2"
        >
          <span className="bg-gradient-to-r from-[#D4AF37] via-[#F9E498] to-[#D4AF37] bg-clip-text text-transparent">NEXA</span>
          <span className="text-white/40 text-lg font-light tracking-[0.2em] mt-1">INTERIORES</span>
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

        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
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
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=2000" 
          alt="Loja de móveis em Ribeirão Preto - Nexa Interiores: Mobiliário exclusivo e design de interiores premium" 
          className="w-full h-full object-cover opacity-60 scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-block text-[#D4AF37] uppercase tracking-[0.3em] text-xs font-bold mb-6"
        >
          Curadoria de Interiores Gratuita • Ribeirão Preto
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-4xl md:text-8xl font-display font-bold tracking-tight mb-8 text-gradient"
        >
          Mobiliário exclusivo <br /> direto das feiras <br /> para a sua casa.
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
        </motion.div>
      </div>

      {/* Floating Liquid Glass Elements */}
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

interface FeatureCardProps {
  title: string;
  description: string;
  image: string;
  onClick?: () => void;
  key?: string | number;
}

const FeatureCard = ({ title, description, image, onClick }: FeatureCardProps) => {
  const [imgSrc, setImgSrc] = useState(image);

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      onClick={onClick}
      className="group relative overflow-hidden rounded-3xl aspect-[4/5] md:aspect-[3/4] glass cursor-pointer max-w-sm mx-auto w-full"
    >
      <img 
        src={imgSrc} 
        alt={title} 
        onError={() => setImgSrc("https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800")}
        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 p-6 md:p-8">
        <h3 className="text-lg md:text-xl font-display font-bold mb-2">{title}</h3>
        <p className="text-white/60 text-[10px] md:text-xs leading-relaxed max-w-[180px]">{description}</p>
        <div className="mt-4 flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-wider text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity">
          Explorar <ChevronRight size={14} />
        </div>
      </div>
    </motion.div>
  );
};

interface CollectionItemProps {
  item: { name: string; image: string };
  index: number;
  key?: string | number;
}

const CollectionItem = ({ item, index }: CollectionItemProps) => {
  const [itemImg, setItemImg] = useState(item.image);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative aspect-[4/3] sm:aspect-square rounded-3xl overflow-hidden glass border-white/5"
    >
      <img 
        src={itemImg} 
        alt={item.name} 
        onError={() => setItemImg("https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=400")}
        className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-700"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />
      <div className="absolute bottom-0 left-0 p-6 md:p-8">
        <p className="text-base md:text-xl font-display font-medium text-white/90">{item.name}</p>
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
      description: "Sofás de luxo e design que definem o conceito de conforto e sofisticação para o seu ambiente.",
      image: "/images/sofas/s1.jpg",
      items: [
        { name: "Sofá Design", image: "/images/sofas/s1.jpg" },
        { name: "Sofá Contemporâneo", image: "/images/sofas/s2.jpg" },
        { name: "Sofá Clássico", image: "/images/sofas/s3.jpg" },
        { name: "Sofá Minimalista", image: "/images/sofas/s4.jpg" },
        { name: "Sofá Modular", image: "/images/sofas/s5.jpg" },
        { name: "Sofá Elegance", image: "/images/sofas/s6.jpeg" }
      ]
    },
    {
      id: "poltronas",
      title: "Poltronas",
      description: "Poltronas de design exclusivo, unindo ergonomia, arte e alto padrão para sua sala ou dormitório.",
      image: "/images/poltronas/p1.jpg",
      items: [
        { name: "Poltrona Exclusiva", image: "/images/poltronas/74594662-DCB1-42B4-BB1D-B1A85BD3FDC0.jpg" },
        { name: "Poltrona Classic", image: "/images/poltronas/p1.jpg" },
        { name: "Poltrona Velvet", image: "/images/poltronas/p2.jpg" },
        { name: "Poltrona Lounge", image: "/images/poltronas/p4.jpg" },
        { name: "Poltrona Modern", image: "/images/poltronas/p5.jpg" },
        { name: "Poltrona Art", image: "/images/poltronas/p7.jpg" }
      ]
    },
    {
      id: "dining",
      title: "Salas de Jantar",
      description: "Mesas de jantar de alto padrão e cadeiras exclusivas para momentos inesquecíveis em sua residência.",
      image: "/images/salas-de-jantar/m2.jpg",
      items: [
        { name: "Mesa de Jantar de Alto Padrão", image: "/images/salas-de-jantar/D976339B-E0C1-4249-A47F-E6C2C9FB7EF7.jpg" },
        { name: "Sala de Jantar Elegance", image: "/images/salas-de-jantar/IMG_6215.jpg" },
        { name: "Conjunto Jantar Moderno", image: "/images/salas-de-jantar/m1].jpg" },
        { name: "Mesa de Jantar Exclusiva", image: "/images/salas-de-jantar/m2.jpg" },
        { name: "Mesa de Jantar Clássica", image: "/images/salas-de-jantar/m3.jpg" },
        { name: "Sala de Jantar Completa", image: "/images/salas-de-jantar/m4.jpg" }
      ]
    }
  ];

  const selectedCategory = collections.find(c => c.id === activeCategory);

  return (
    <section id="colecoes" className="py-20 md:py-24 px-6 bg-black min-h-[600px]">
      <div className="max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {!activeCategory ? (
            <motion.div 
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-8">
                <div className="max-w-3xl">
                  <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 md:mb-6 tracking-tight">Catálogo Exclusivo. <br /> Curadoria Gratuita.</h2>
                  <p className="text-white/60 text-base md:text-lg">Nossa equipe de especialistas oferece curadoria de interiores gratuita. Escolha os melhores sofás de luxo, poltronas e mesas de jantar, selecionados a dedo diretamente das maiores feiras de design para a sua casa em Ribeirão Preto.</p>
                </div>
                <a 
                  href="https://instagram.com/nexainteriores" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group text-sm md:text-base"
                >
                  Ver catálogo completo no Instagram
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
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
            </motion.div>
          ) : (
            <motion.div 
              key="detail"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-12 md:space-y-16"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <button 
                  onClick={() => setActiveCategory(null)}
                  className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group w-fit"
                >
                  <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                  Voltar para Coleções
                </button>
                <h2 className="text-2xl md:text-5xl font-display font-bold tracking-tight text-gradient">
                  {selectedCategory?.title}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                {selectedCategory?.items.map((item, i) => (
                  <CollectionItem key={i} item={item} index={i} />
                ))}
              </div>

              <div className="glass p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] text-center border-white/5">
                <h3 className="text-xl md:text-3xl font-display font-bold mb-4">Deseja ver estas peças de perto?</h3>
                <p className="text-white/60 text-sm md:text-base mb-8 max-w-lg mx-auto">
                  Cada detalhe, textura e acabamento foi pensado para proporcionar uma experiência única. Visite nossa loja em Ribeirão Preto.
                </p>
                <a 
                  href="#visita" 
                  onClick={() => setActiveCategory(null)}
                  className="inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-white text-black rounded-full font-bold hover:bg-white/90 transition-all text-sm md:text-base"
                >
                  Agendar Visita <ChevronRight size={16} />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

const VIPSection = () => {
  return (
    <section id="vip" className="py-12 px-6 relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative glass p-8 md:p-12 rounded-[2.5rem] overflow-hidden text-center border-[#D4AF37]/20"
        >
          {/* Decorative Gold Glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#D4AF37]/10 blur-[100px] rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#D4AF37]/5 blur-[100px] rounded-full" />

          <div className="relative z-10">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-bold tracking-[0.2em] uppercase mb-4"
            >
              Móveis de Luxo Exclusivos
            </motion.div>
            
            <h2 className="text-2xl md:text-5xl font-display font-bold mb-4 tracking-tight">
              Faça parte do <br className="hidden md:block" /> 
              <span className="bg-gradient-to-r from-[#D4AF37] via-[#F9E498] to-[#D4AF37] bg-clip-text text-transparent"> Círculo VIP Nexa Interiores</span>
            </h2>
            
            <p className="text-white/60 text-sm md:text-base mb-8 max-w-xl mx-auto leading-relaxed">
              Acesso prioritário a lançamentos de móveis planejados de luxo e mobiliário exclusivo em Ribeirão Preto.
            </p>

            <motion.a 
              href="https://wa.me/5516997908686?text=Olá! Gostaria de entrar no Grupo VIP da Nexa Interiores."
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-8 py-3 md:px-10 md:py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black rounded-full font-bold text-sm md:text-base hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all"
            >
              Entrar no Grupo VIP
              <ArrowRight size={16} />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const VisitSection = () => {
  return (
    <section id="visita" className="py-20 md:py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-6xl font-display font-bold mb-6 md:mb-8 tracking-tight">Loja de móveis em <br /> Ribeirão Preto: Visite-nos.</h2>
          <p className="text-white/60 text-base md:text-lg mb-10 md:mb-12 max-w-md">
            Nossa flagship store de decoração sofisticada e design de interiores premium em Ribeirão Preto é um convite à imersão no mobiliário exclusivo.
          </p>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="p-3 glass rounded-2xl text-white/80">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="font-bold mb-1">Localização</h4>
                <p className="text-white/60">Av. Norma Valério Corrêa, 316 - Jardim Botânico<br />Ribeirão Preto - SP</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 glass rounded-2xl text-white/80">
                <Clock size={24} />
              </div>
              <div>
                <h4 className="font-bold mb-1">Horário de Atendimento</h4>
                <p className="text-white/60">Segunda a Sexta: 09h às 19h<br />Sábado: 09h às 13h</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 glass rounded-2xl text-white/80">
                <Phone size={24} />
              </div>
              <div>
                <h4 className="font-bold mb-1">Contato</h4>
                <p className="text-white/60">(16) 99790-8686</p>
              </div>
            </div>
          </div>

          <motion.a 
            href="https://www.google.com/maps/search/?api=1&query=Avenida+Norma+Valério+Corrêa+316+Ribeirão+Preto+SP"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-10 md:mt-12 inline-block w-full md:w-auto px-8 py-4 md:px-12 md:py-5 bg-white text-black rounded-full font-bold text-base md:text-lg hover:bg-white/90 transition-all shadow-2xl shadow-white/10 text-center"
          >
            Abrir no Google Maps
          </motion.a>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative aspect-square rounded-[3rem] overflow-hidden glass p-4"
        >
          <div className="w-full h-full rounded-[2.5rem] overflow-hidden bg-white/5 relative">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.141505342417!2d-47.80368492473815!3d-21.21531698048256!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94b9be938f97e69b%3A0x6d9f9c7e8f97e69b!2sAv.%20Norma%20Val%C3%A9rio%20Corr%C3%AAa%2C%20316%20-%20Jardim%20Bot%C3%A2nico%2C%20Ribeir%C3%A3o%20Preto%20-%20SP%2C%2014021-614!5e0!3m2!1spt-BR!2sbr!4v1712089451000!5m2!1spt-BR!2sbr" 
              className="w-full h-full border-0 opacity-80 grayscale invert contrast-[1.2] brightness-[0.8] hover:grayscale-0 hover:invert-0 hover:contrast-100 hover:brightness-100 transition-all duration-700"
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização Nexa Interiores"
            ></iframe>
            <div className="absolute inset-0 pointer-events-none border-[12px] border-black/20 rounded-[2.5rem]" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};


const Footer = () => {
  return (
    <footer className="py-12 md:py-16 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
        <div className="text-center md:text-left">
          <div className="text-2xl font-display font-bold tracking-tighter mb-4 flex items-center justify-center md:justify-start gap-2">
            <span className="bg-gradient-to-r from-[#D4AF37] via-[#F9E498] to-[#D4AF37] bg-clip-text text-transparent">NEXA</span>
            <span className="text-white/40 text-lg font-light tracking-[0.2em] mt-1">INTERIORES</span>
          </div>
          <p className="text-white/40 text-sm max-w-xs">
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

        <div className="text-white/20 text-xs">
          © 2026 Nexa Interiores. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

const SEOData = () => {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "FurnitureStore",
      "name": "Nexa Interiores - Loja de Móveis de Alto Padrão em Ribeirão Preto",
      "description": "Nexa Interiores traz mobiliário exclusivo direto das maiores e mais recentes feiras de mobiliário de alto padrão para a sua casa. Especialistas em sofás, poltronas e salas de jantar.",
      "image": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6",
      "@id": "https://nexainteriores.com.br",
      "url": window.location.href,
      "telephone": "+5516997908686",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Av. Norma Valério Corrêa, 316",
        "addressLocality": "Ribeirão Preto",
        "addressRegion": "SP",
        "postalCode": "14021-614",
        "addressCountry": "BR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": -21.215317,
        "longitude": -47.803685
      },
      "areaServed": {
        "@type": "City",
        "name": "Ribeirão Preto e Região"
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "09:00",
          "closes": "19:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "Saturday",
          "opens": "09:00",
          "closes": "13:00"
        }
      ],
      "sameAs": [
        "https://instagram.com/nexainteriores"
      ],
      "priceRange": "$$$$"
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Curadoria de Interiores Gratuita",
      "provider": {
        "@type": "FurnitureStore",
        "name": "Nexa Interiores"
      },
      "areaServed": {
        "@type": "City",
        "name": "Ribeirão Preto"
      },
      "description": "Serviço exclusivo e gratuito de curadoria de interiores. Ajudamos a harmonizar sofás, poltronas, salas de jantar e decoração para projetos de alto padrão.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "BRL"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "A Nexa Interiores cobra pela curadoria de interiores?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Não. Oferecemos curadoria de interiores de alto padrão de forma totalmente gratuita aos nossos clientes em nossa loja de Ribeirão Preto. Basta agendar pelo WhatsApp."
          }
        },
        {
          "@type": "Question",
          "name": "De onde vêm os móveis da Nexa Interiores?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Temos o diferencial de ter mobiliário exclusivo, direto das maiores e mais recentes feiras de mobiliário de alto padrão internacional e nacional. Focamos em sofás de luxo, poltronas, salas de jantar e itens decorativos exclusivos."
          }
        }
      ]
    }
  ];

  return (
    <script type="application/ld+json">
      {JSON.stringify(structuredData)}
    </script>
  );
};

const AboutSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section id="sobre" ref={ref} className="relative py-32 md:py-40 px-6 overflow-hidden border-y border-white/5">
      {/* Parallax Background */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          style={{ y }}
          className="absolute inset-0 w-full h-[120%] -top-[10%]"
        >
          <img 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000" 
            alt="Fachada da Nexa Interiores - Loja de Móveis de Alto Padrão em Ribeirão Preto" 
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block text-[#D4AF37] uppercase tracking-[0.3em] text-xs font-bold mb-8">Curadoria Gratuita • Direto das Feiras Mundiais</span>
          <h1 className="text-xl md:text-5xl font-display font-medium mb-8 md:mb-12 leading-tight text-gradient">
            "Nosso principal diferencial é trazer mobiliário exclusivo direto das maiores e mais recentes feiras de mobiliário de alto padrão para sua casa."
          </h1>
          <p className="text-white/60 text-sm md:text-lg max-w-2xl mx-auto mb-10">Oferecemos curadoria de interiores totalmente gratuita. Te ajudamos a escolher os melhores sofás de luxo, poltronas, peças de decoração e mesas de jantar que harmonizam perfeitamente com a sua arquitetura.</p>
          <a 
            href="https://wa.me/5516997908686?text=Olá! Gostaria de falar com um especialista sobre a Curadoria de Interiores Gratuita."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-3 md:px-10 md:py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black rounded-full font-bold text-sm md:text-base hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all mx-auto mb-12"
          >
            Falar pelo WhatsApp
            <ArrowRight size={16} />
          </a>
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto" />
        </motion.div>
      </div>
    </section>
  );
};

export default function App() {
  return (
    <div className="min-h-screen font-sans selection:bg-white selection:text-black">
      <SEOData />
      <Navbar />
      <main>
        <Hero />
        <Collections />
        <AboutSection />
        <VIPSection />
        <VisitSection />
      </main>
      <Footer />
    </div>
  );
}



