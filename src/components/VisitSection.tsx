import { motion } from 'motion/react';
import { MapPin, Clock, Phone, ChevronRight } from 'lucide-react';

export const VisitSection = () => {
  return (
    <section id="visita" className="py-20 md:py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-6xl font-display font-bold mb-6 md:mb-8 tracking-tight text-white">Loja de móveis em <br /> Ribeirão Preto: Visite-nos.</h2>
          <p className="text-white/80 text-base md:text-lg mb-10 md:mb-12 max-w-md">
            Nossa flagship store de decoração sofisticada e design de interiores premium em Ribeirão Preto é um convite à imersão no mobiliário exclusivo.
          </p>

          <div className="space-y-8">
            <div className="flex items-start gap-4 text-white">
              <div className="p-3 glass rounded-2xl text-white/80">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="font-bold mb-1">Localização</h3>
                <p className="text-white/80">Av. Norma Valério Corrêa, 316 - Jardim Botânico<br />Ribeirão Preto - SP</p>
              </div>
            </div>
            <div className="flex items-start gap-4 text-white">
              <div className="p-3 glass rounded-2xl text-white/80">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="font-bold mb-1">Horário de Atendimento</h3>
                <p className="text-white/80">Segunda a Sexta: 09h às 19h<br />Sábado: 09h às 13h</p>
              </div>
            </div>
            <div className="flex items-start gap-4 text-white">
              <div className="p-3 glass rounded-2xl text-white/80">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="font-bold mb-1">Contato</h3>
                <p className="text-white/80">(16) 99790-8686</p>
              </div>
            </div>
          </div>

          <div className="mt-10 md:mt-12 flex flex-col sm:flex-row gap-4">
            <motion.a 
              href="https://wa.me/5516997908686?text=Olá! Gostaria de agendar minha Curadoria de Interiores Gratuita."
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-8 py-4 md:px-10 md:py-5 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black rounded-full font-bold text-base md:text-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(212,175,55,0.4)]"
            >
              Agendar Curadoria Gratuita
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </motion.a>
            <motion.a 
              href="https://www.google.com/maps/search/?api=1&query=Avenida+Norma+Valério+Corrêa+316+Ribeirão+Preto+SP"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-8 py-4 md:px-10 md:py-5 bg-white text-black rounded-full font-bold text-base md:text-lg hover:bg-white/90 transition-all shadow-2xl shadow-white/10 text-center flex items-center justify-center"
            >
              Abrir no Google Maps
            </motion.a>
          </div>
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
