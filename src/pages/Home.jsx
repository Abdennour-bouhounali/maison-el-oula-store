import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

import Section from '../components/ui/Section';
import SEO from '../components/ui/SEO';
import ProductCard from '../components/ui/ProductCard';

import Hero from '../components/sections/Hero';
import Transformation from '../components/sections/Transformation';
import Ecosystem from '../components/sections/Ecosystem';
import FeatureShowcase from '../components/sections/FeatureShowcase';
import { USAGES } from '../constants';
import { useProducts } from '../hooks/useProducts';
import { getImageUrl } from '../utils/formatters';

const Home = () => {
  const { t } = useTranslation();
  const { products, loading } = useProducts();

  return (
    <div className="overflow-clip">
      <SEO 
        title={t('seo.home_title')} 
        description={t('seo.home_desc')} 
      />

      <Hero />
      <Transformation />
      <Ecosystem />

      {/* Product Highlight Section */}
      <Section className="bg-nature-white">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="max-w-2xl">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-nature-orange mb-4 block">Notre Collection</span>
            <h2 className="text-5xl md:text-7xl font-black text-nature-green tracking-tighter leading-[0.9]">
              L'essence de la <span className="italic font-light">pureté</span>
            </h2>
          </div>
          <Link 
            to="/products" 
            className="group flex items-center gap-4 text-nature-green font-bold uppercase tracking-widest text-xs border-b-2 border-nature-beige pb-2 hover:border-nature-orange transition-all"
          >
            Voir toute la boutique
            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-nature-beige/20 rounded-[3rem] animate-pulse" />
            ))
          ) : (
            products.slice(0, 3).map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))
          )}
        </div>
      </Section>

      <FeatureShowcase />

      {/* Usages / Inspiration Section */}
      <Section className="bg-nature-white">
        <div className="text-center mb-20">
          <span className="text-xs font-black uppercase tracking-[0.3em] text-nature-orange mb-4 block">{t('usages.subtitle')}</span>
          <h2 className="text-5xl md:text-7xl font-black text-nature-green tracking-tighter leading-[0.9]">
            {t('usages.title')}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {USAGES.map((usage, index) => (
            <motion.div 
              key={usage.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group relative aspect-[16/10] overflow-hidden rounded-[3rem] cursor-pointer"
            >
              <img 
                src={usage.img} 
                alt={t(`usages.${usage.id}_title`)} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-nature-green/80 via-nature-green/20 to-transparent flex flex-col justify-end p-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <h3 className="text-2xl font-black text-nature-white mb-2 tracking-tighter">{t(`usages.${usage.id}_title`)}</h3>
                <p className="text-nature-white/80 text-sm font-light leading-relaxed">{t(`usages.${usage.id}_desc`)}</p>
              </div>
              <div className="absolute top-8 right-8 bg-nature-white text-nature-green w-12 h-12 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                <ArrowRight className="w-5 h-5" />
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Artisanal Process CTA */}
      <Section className="pb-32">
        <div className="bg-nature-green rounded-[4rem] p-12 md:p-24 relative overflow-hidden flex flex-col md:flex-row items-center gap-16">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 rounded-full blur-[120px] -z-0" />
          
          <div className="flex-grow z-10 text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-black text-nature-white tracking-tighter leading-none mb-8">
              Redécouvrez le goût <br />
              <span className="italic font-light opacity-60">de l'authentique</span>
            </h2>
            <Link to="/about">
              <button className="bg-nature-white text-nature-green px-10 py-5 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-nature-orange hover:text-nature-white transition-all shadow-xl">
                Notre Savoir-Faire
              </button>
            </Link>
          </div>

          <div className="w-full md:w-1/3 aspect-square bg-nature-white/10 rounded-[3rem] backdrop-blur-md border border-white/10 flex items-center justify-center p-12 z-10">
            <div className="text-center">
              <span className="block text-5xl font-black text-nature-white mb-2 italic">100%</span>
              <span className="block text-xs font-black uppercase tracking-[0.3em] text-nature-white/40">Naturel & Artisanal</span>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Home;
