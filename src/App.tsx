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
          className="inline-block text-white/60 uppercase tracking-[0.3em] text-xs font-medium mb-6"
        >
          Móveis de Luxo • Design de Interiores Premium em Ribeirão Preto
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-4xl md:text-8xl font-display font-bold tracking-tight mb-8 text-gradient"
        >
          Mobiliário exclusivo <br /> para casas de <br /> alto padrão.
        </motion.h1>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a 
            href="#visita" 
            className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 bg-white text-black rounded-full font-medium hover:bg-white/90 transition-all flex items-center justify-center gap-2 group text-sm md:text-base"
          >
            Agendar Visita
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a 
            href="#colecoes" 
            className="w-full sm:w-auto px-6 py-3 md:px-8 md:py-4 glass rounded-full font-medium hover:bg-white/10 transition-all text-sm md:text-base"
          >
            Ver Coleções
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
      id: "living",
      title: "Salas de Estar de Luxo",
      description: "Sofás de luxo e poltronas de design que definem o conceito de decoração sofisticada para seu living.",
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800",
      items: [
        { name: "Sofá de Luxo Nexa", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400" },
        { name: "Poltrona de Design Velvet", image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=400" },
        { name: "Mesa de Centro Marble", image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=400" },
        { name: "Aparador Minimalist", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=400" },
        { name: "Luminária de Piso Arch", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=400" },
        { name: "Tapete Silk Touch", image: "https://images.unsplash.com/photo-1575414003591-ece8d0416c7a?auto=format&fit=crop&q=80&w=400" }
      ]
    },
    {
      id: "dining",
      title: "Salas de Jantar de Alto Padrão",
      description: "Mesas de jantar de alto padrão e cadeiras exclusivas para momentos inesquecíveis em sua residência.",
      image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&q=80&w=800",
      items: [
        { name: "Mesa de Jantar de Alto Padrão", image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&q=80&w=400" },
        { name: "Cadeira Master Design", image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=400" },
        { name: "Buffet High Gloss", image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=400" },
        { name: "Lustre Crystal Cascade", image: "https://images.unsplash.com/photo-1543157145-f78c636d023d?auto=format&fit=crop&q=80&w=400" },
        { name: "Banqueta Elegance", image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&q=80&w=400" },
        { name: "Cristaleira Glass View", image: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&q=80&w=400" }
      ]
    },
    {
      id: "private",
      title: "Dormitórios de Luxo",
      description: "Móveis planejados de luxo para quartos e suítes que são verdadeiros refúgios de tranquilidade.",
      image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=800",
      items: [
        { name: "Cama King Comfort", image: "https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77?auto=format&fit=crop&q=80&w=400" },
        { name: "Mesa de Cabeceira Lux", image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&q=80&w=400" },
        { name: "Closet Sob Medida Luxo", image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&q=80&w=400" },
        { name: "Penteadeira Glamour", image: "https://images.unsplash.com/photo-1594904351111-a072f80b1a71?auto=format&fit=crop&q=80&w=400" },
        { name: "Recamier Velvet", image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=400" },
        { name: "Cômoda Executive", image: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&q=80&w=400" }
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
                <div className="max-w-2xl">
                  <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 md:mb-6 tracking-tight">Móveis de luxo e <br /> alto padrão em Ribeirão Preto.</h2>
                  <p className="text-white/60 text-base md:text-lg">Nossa curadoria exclusiva de mobiliário contemporâneo une a arquitetura de interiores à tradição do alto padrão.</p>
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
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    "name": "Nexa Interiores - Loja de Móveis de Alto Padrão em Ribeirão Preto",
    "description": "Nexa Interiores é a referência em móveis de luxo e alto padrão em Ribeirão Preto. Oferecemos design de interiores premium, sofás de luxo, mesas de jantar de alto padrão e mobiliário exclusivo para projetos residenciais, apartamentos de luxo e casas de alto padrão.",
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
  };

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
          <span className="inline-block text-[#D4AF37] uppercase tracking-[0.3em] text-xs font-bold mb-8">Arquitetura de Interiores em Ribeirão Preto</span>
          <h2 className="text-xl md:text-5xl font-display font-medium mb-8 md:mb-12 leading-tight text-gradient">
            "Nossa missão é transformar projetos residenciais em experiências sensoriais, onde cada móvel de luxo e alto padrão conta uma história de sofisticação e design de interiores premium."
          </h2>
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



