import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Hero = ({ containerVariants, itemVariants }) => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-nature-white">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-nature-lemon rounded-full blur-[120px]" 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-nature-orange rounded-full blur-[150px]" 
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          
          {/* Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7"
          >
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-3 mb-8"
            >
              <div className="h-[1px] w-12 bg-nature-orange" />
              <span className="text-nature-orange font-bold tracking-[0.2em] text-xs uppercase">
                L'excellence du terroir
              </span>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-[5.5rem] font-bold text-nature-green leading-[1.05] mb-10 tracking-tight"
            >
              Le goût naturel <br />
              <span className="italic font-light text-nature-green/80">dans chaque cuillère</span>
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl text-nature-green/60 mb-12 leading-relaxed max-w-2xl font-light"
            >
              Poudres naturelles de fruits, légumes et plantes séchés — <span className="font-bold text-nature-green">100% naturelles</span>, sans conservateurs.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 mb-16">
              <Link to="/products" className="btn-premium btn-primary text-lg px-10 group">
                Découvrir nos produits
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/contact" className="btn-premium btn-secondary text-lg px-10">
                Nous contacter
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-8 items-center pt-8 border-t border-nature-beige/50">
              {[
                { text: "100% Naturel", icon: Leaf },
                { text: "Sans conservateurs", icon: ShieldCheck },
                { text: "Produit en Algérie", icon: CheckCircle2 }
              ].map((badge, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-2"
                >
                  <badge.icon className="w-5 h-5 text-nature-orange" />
                  <span className="text-sm font-bold text-nature-green/80 uppercase tracking-wider">{badge.text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Visual Content - Floating Mockups */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 2, 0]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="relative z-10"
            >
              <div className="rounded-[4rem] overflow-hidden shadow-2xl border-[1px] border-nature-beige/20 bg-nature-white/40 backdrop-blur-sm p-4">
                <img 
                  src="/maison_el_oula_floating_mockups_1778747150581.png" 
                  alt="Poudres Naturelles Maison Oula - Lemon, Mint, Orange" 
                  loading="lazy"
                  className="w-full h-auto rounded-[3rem] shadow-inner"
                />
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
