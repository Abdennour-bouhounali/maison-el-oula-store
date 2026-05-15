import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

import Section from '../components/ui/Section';
import SEO from '../components/ui/SEO';
import ProductCard from '../components/ui/ProductCard';

import Hero from '../components/sections/Hero';
import FeatureShowcase from '../components/sections/FeatureShowcase';

import { USAGES } from '../constants';
import { useProducts } from '../hooks/useProducts';
import { getImageUrl } from '../utils/formatters';

const Home = () => {
  const { t } = useTranslation();
  const { products, loading } = useProducts();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    },
  };

  return (
    <>
      <SEO 
        title={t('seo.home_title')}
        description={t('seo.home_desc')}
      />
      
      <Hero 
        containerVariants={containerVariants} 
        itemVariants={itemVariants} 
      />

      <FeatureShowcase 
        containerVariants={containerVariants} 
        itemVariants={itemVariants} 
      />

      {/* Top Produits Section */}
      <Section>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8"
        >
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-bold text-nature-green mb-6 tracking-tight">Nos incontournables</h2>
            <p className="text-xl text-nature-green/60 font-light">Découvrez les poudres préférées de notre communauté, prêtes à sublimer vos recettes.</p>
          </div>
          <Link to="/products" className="text-nature-green font-bold border-b-2 border-nature-orange pb-1 hover:text-nature-orange transition-colors">
            Voir toute la gamme
          </Link>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12"
        >
          {loading ? (
             [1, 2, 3].map(i => (
              <div key={i} className="aspect-[4/5] bg-nature-beige/10 rounded-[3rem] animate-pulse" />
            ))
          ) : (
            products.slice(0, 3).map((product) => (
              <ProductCard 
                key={product._id} 
                product={product} 
                variants={itemVariants} 
              />
            ))
          )}
        </motion.div>
      </Section>

      {/* Creative Usages Section */}
      <Section className="bg-nature-white py-32 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-block px-6 py-2 rounded-full bg-nature-orange/10 text-nature-orange text-xs font-black uppercase tracking-[0.3em] mb-6"
          >
            {t('usages.subtitle')}
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-nature-green tracking-tight"
          >
            {t('usages.title')}
          </motion.h2>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {USAGES.map((usage, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="group relative h-[30rem] rounded-[3rem] overflow-hidden shadow-premium"
            >
              <img src={usage.img} alt={t(`usages.${usage.id}_title`)} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-nature-green/90 via-nature-green/20 to-transparent p-10 flex flex-col justify-end">
                <h3 className="text-3xl font-bold text-nature-white mb-4">{t(`usages.${usage.id}_title`)}</h3>
                <p className="text-nature-white/80 font-light leading-relaxed">{t(`usages.${usage.id}_desc`)}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* Packaging Showcase Section */}
      <Section className="bg-nature-beige/10 py-32 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-block px-6 py-2 rounded-full bg-nature-green/10 text-nature-green text-xs font-black uppercase tracking-[0.3em] mb-6"
          >
            {t('showcase.subtitle')}
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-nature-green mb-8 tracking-tight"
          >
            {t('showcase.title')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-xl text-nature-green/60 font-light max-w-2xl mx-auto leading-relaxed"
          >
            {t('showcase.desc')}
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-10"
        >
          {loading ? (
             [1, 2, 3, 4, 5].map(i => (
              <div key={i} className="aspect-[2/3] bg-white rounded-[2rem] animate-pulse" />
            ))
          ) : (
            products.map((item) => (
              <motion.div
                key={item._id}
                variants={itemVariants}
                whileHover={{ y: -15 }}
                className="group relative"
              >
                <div className="aspect-[2/3] rounded-[2rem] overflow-hidden shadow-premium bg-nature-white transition-all duration-500 group-hover:shadow-2xl">
                  <img 
                    src={getImageUrl(item.images[0])} 
                    alt={item.name.fr} 
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-nature-green/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-4">
                    <span className="text-nature-white font-bold text-center uppercase tracking-widest text-xs">
                      {item.name.fr}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </Section>
    </>
  );
};

export default Home;
