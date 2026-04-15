import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export const VIPSection = () => {
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
            
            <h2 className="text-2xl md:text-5xl font-display font-bold mb-4 tracking-tight text-white">
              Faça parte do <br className="hidden md:block" /> 
              <span className="bg-gradient-to-r from-[#D4AF37] via-[#F9E498] to-[#D4AF37] bg-clip-text text-transparent"> Círculo VIP Nexa Interiores</span>
            </h2>
            
            <p className="text-white/80 text-sm md:text-base mb-8 max-w-xl mx-auto leading-relaxed">
              Acesso prioritário a lançamentos de móveis planejados de luxo e mobiliário exclusivo em Ribeirão Preto.
            </p>

            <motion.a 
              href="https://chat.whatsapp.com/IbkkmjexeIaBWmV5IhjFdz?mode=gi_t"
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
