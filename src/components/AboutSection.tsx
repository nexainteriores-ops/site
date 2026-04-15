import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight } from 'lucide-react';

export const AboutSection = () => {
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
            src="/images/faxada.webp" 
            alt="Fachada da Nexa Interiores - Loja de Móveis de Alto Padrão em Ribeirão Preto" 
            loading="lazy"
            className="w-full h-full object-cover opacity-35"
          />
        </motion.div>
        {/* Gradient forte para garantir legibilidade do texto e do logo */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        {/* Toque quente em dourado para harmonizar com a paleta da marca */}
        <div className="absolute inset-0 bg-[#3A2800]/20" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block text-[#D4AF37] uppercase tracking-[0.3em] text-xs font-bold mb-8">Curadoria Gratuita • Direto das Feiras Mundiais</span>
          <h2 className="text-xl md:text-5xl font-display font-medium mb-8 md:mb-12 leading-tight text-gradient">
            "Nosso principal diferencial é trazer mobiliário exclusivo direto das maiores e mais recentes feiras de mobiliário de alto padrão para sua casa."
          </h2>
          <p className="text-white/80 text-sm md:text-lg max-w-2xl mx-auto mb-10">Oferecemos curadoria de interiores totalmente gratuita. Te ajudamos a escolher os melhores sofás de luxo, poltronas, peças de decoração e mesas de jantar que harmonizam perfeitamente com a sua arquitetura.</p>
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
