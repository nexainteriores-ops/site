import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronRight, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { trackViewContent, trackInstagramClick } from '../lib/fbPixel';

interface FeatureCardProps {
  title: string;
  description: string;
  image: string;
  onClick?: () => void;
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
        loading="lazy"
        onError={() => setImgSrc("https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800")}
        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-700"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 p-6 md:p-8">
        <h3 className="text-lg md:text-xl font-display font-bold mb-2 text-white">{title}</h3>
        <p className="text-white/80 text-[10px] md:text-xs leading-relaxed max-w-[180px]">{description}</p>
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
}

const CollectionItem = ({ item, index }: CollectionItemProps) => {
  const [itemImg, setItemImg] = useState(item.image);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group relative aspect-[4/3] sm:aspect-square rounded-3xl overflow-hidden glass border-white/5"
    >
      <img 
        src={itemImg} 
        alt={item.name} 
        loading="lazy"
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

export const Collections = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const collections = [
    {
      id: "sofas",
      title: "Sofás",
      description: "Sofás de luxo e design que definem o conceito de conforto e sofisticação para o seu ambiente.",
      image: "/images/sofas/s1.webp",
      items: [
        { name: "Sofá Design", image: "/images/sofas/s1.webp" },
        { name: "Sofá Contemporâneo", image: "/images/sofas/s2.webp" },
        { name: "Sofá Clássico", image: "/images/sofas/s3.webp" },
        { name: "Sofá Minimalista", image: "/images/sofas/s4.webp" }
      ]
    },
    {
      id: "poltronas",
      title: "Poltronas",
      description: "Poltronas de design exclusivo, unindo ergonomia, arte e alto padrão para sua sala ou dormitório.",
      image: "/images/poltronas/p1.webp",
      items: [
        { name: "Poltrona Exclusiva", image: "/images/poltronas/p1.webp" },
        { name: "Poltrona Classic", image: "/images/poltronas/p2.webp" },
        { name: "Poltrona Velvet", image: "/images/poltronas/p3.webp" },
        { name: "Poltrona Lounge", image: "/images/poltronas/p4.webp" }
      ]
    },
    {
      id: "dining",
      title: "Salas de Jantar",
      description: "Mesas de jantar de alto padrão e cadeiras exclusivas para momentos inesquecíveis em sua residência.",
      image: "/images/salas-de-jantar/m1.webp",
      items: [
        { name: "Mesa de Jantar de Alto Padrão", image: "/images/salas-de-jantar/m1.webp" },
        { name: "Sala de Jantar Elegance", image: "/images/salas-de-jantar/m2.webp" },
        { name: "Conjunto Jantar Moderno", image: "/images/salas-de-jantar/m3.webp" },
        { name: "Mesa de Jantar Exclusiva", image: "/images/salas-de-jantar/m4.webp" },
        { name: "Mesa de Jantar Clássica", image: "/images/salas-de-jantar/m5.webp" },
        { name: "Sala de Jantar Completa", image: "/images/salas-de-jantar/m6.webp" },
        { name: "Mesa de Jantar Imperial", image: "/images/salas-de-jantar/m7.webp" },
        { name: "Conjunto Jantar Premium", image: "/images/salas-de-jantar/m8.webp" },
        { name: "Mesa de Jantar Minimalista", image: "/images/salas-de-jantar/m9.webp" }
      ]
    },
    {
      id: "mesas",
      title: "Mesas",
      description: "Mesas de centro, lateral e apoio com design autoral, materiais nobres e acabamentos refinados.",
      image: "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&q=80&w=800",
      items: [
        { name: "Mesa de Centro Escultural", image: "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&q=80&w=600" },
        { name: "Mesa Lateral Orgânica", image: "https://images.unsplash.com/photo-1533779283484-8ad4940aa3a8?auto=format&fit=crop&q=80&w=600" },
        { name: "Mesa de Apoio Mármore", image: "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&q=80&w=600" },
        { name: "Mesa de Cabeceira Premium", image: "https://images.unsplash.com/photo-1540518614846-7ede433c5172?auto=format&fit=crop&q=80&w=600" }
      ]
    },
    {
      id: "cadeiras",
      title: "Cadeiras",
      description: "Cadeiras autorais e ergonômicas que combinam conforto térmico, estética contemporânea e acabamento impecável.",
      image: "https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?auto=format&fit=crop&q=80&w=800",
      items: [
        { name: "Cadeira Curadoria Design", image: "https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?auto=format&fit=crop&q=80&w=600" },
        { name: "Cadeira Estofada Premium", image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&q=80&w=600" },
        { name: "Cadeira de Jantar Wood", image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=600" },
        { name: "Cadeira Contemporânea", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=600" }
      ]
    },
    {
      id: "decoracao",
      title: "Decoração",
      description: "Objetos de arte, vasos e acessórios sofisticados que dão o toque final de personalidade aos seus espaços.",
      image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800",
      items: [
        { name: "Vaso Escultural", image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600" },
        { name: "Centro de Mesa Design", image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&q=80&w=600" },
        { name: "Escultura Decorativa", image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&q=80&w=600" },
        { name: "Objeto de Arte Contemporâneo", image: "https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&q=80&w=600" }
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
                  <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 md:mb-6 tracking-tight text-white">Catálogo Exclusivo. <br /> Curadoria Gratuita.</h2>
                  <p className="text-white/80 text-base md:text-lg">Nossa equipe de especialistas oferece curadoria de interiores gratuita. Escolha os melhores sofás de luxo, poltronas, salas de jantar, mesas, cadeiras e itens de decoração, selecionados a dedo diretamente das maiores feiras de design para a sua casa em Ribeirão Preto.</p>
                </div>
                <a 
                  href="https://instagram.com/nexainteriores" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  onClick={() => trackInstagramClick()}
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group text-sm md:text-base"
                >
                  Ver catálogo completo no Instagram
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {collections.map((item) => (
                  <FeatureCard 
                    key={item.id} 
                    title={item.title} 
                    description={item.description} 
                    image={item.image} 
                    onClick={() => {
                      trackViewContent(item.title, item.id);
                      setActiveCategory(item.id);
                    }}
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
                <h3 className="text-xl md:text-3xl font-display font-bold mb-4 text-white">Deseja ver estas peças de perto?</h3>
                <p className="text-white/80 text-sm md:text-base mb-8 max-w-lg mx-auto">
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
