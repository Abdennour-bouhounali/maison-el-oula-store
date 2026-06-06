import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

// ─── Data ──────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    id: 'wellness',
    index: '01',
    label: 'Lifestyle & Wellness',
    headline: 'Feel the\nDifference.',
    desc: 'From morning rituals to evening wind-downs. Nature\'s most vibrant ingredients, concentrated for your daily life.',
    accent: '#A3B18A',       // sage
    bg: '#F4F7F0',
    textColor: '#3A4A30',
    products: [
      { name: 'Strawberry', note: 'Antioxidant-rich, intensely fruity' },
      { name: 'Citrus', note: 'Bright, vitamin C concentrate' },
      { name: 'Mint', note: 'Cooling, digestive wellness' },
      { name: 'Date', note: 'Natural energy, caramelized depth' },
    ],
    symbol: '◉',
  },
  {
    id: 'culinary',
    index: '02',
    label: 'Culinary Essentials',
    headline: 'Cook\nBoldly.',
    desc: 'The backbone of every great Mediterranean dish. Pure, concentrated, and always ready.',
    accent: '#B75D46',       // terracotta
    bg: '#FBF3EF',
    textColor: '#6B2A14',
    products: [
      { name: 'Garlic', note: '10× fresh garlic intensity' },
      { name: 'Purple Onion', note: 'Sweet, complex allium depth' },
    ],
    symbol: '◈',
  },
  {
    id: 'solutions',
    index: '03',
    label: 'Solution Products',
    headline: 'Solve\nAnything.',
    desc: 'Pre-composed blends designed for the modern kitchen. One spoonful, infinite solutions.',
    accent: '#6B705C',       // olive
    bg: '#F3F3F0',
    textColor: '#2A2A2A',
    products: [
      { name: 'Mediterranean Base', note: 'The foundation of every dish' },
      { name: 'Cooking Concentrate', note: 'Depth, umami, warmth' },
      { name: 'Savory Blend', note: 'Complex, balanced, effortless' },
    ],
    symbol: '◆',
  },
];

// ─── Product Tag ───────────────────────────────────────────────────────────────
const ProductTag = ({ product, accent, textColor, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.4, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
    className="group/tag flex items-start gap-3 py-3 border-b last:border-b-0"
    style={{ borderColor: `${accent}30` }}
  >
    <span
      className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0"
      style={{ backgroundColor: accent }}
    />
    <div>
      <p className="text-sm font-semibold leading-tight" style={{ color: textColor }}>
        {product.name}
      </p>
      <p className="text-xs mt-0.5" style={{ color: `${textColor}80` }}>
        {product.note}
      </p>
    </div>
  </motion.div>
);

// ─── Category Panel ────────────────────────────────────────────────────────────
const CategoryPanel = ({ cat, isActive, isAnyActive, onClick }) => {
  const contracted = isAnyActive && !isActive;

  return (
    <motion.div
      layout
      onClick={onClick}
      className="relative flex flex-col justify-between overflow-hidden cursor-pointer select-none min-h-[520px]"
      animate={{
        flex: isActive ? 2.2 : contracted ? 0.55 : 1,
      }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      style={{ backgroundColor: cat.bg }}
    >
      {/* Large faded index number */}
      <motion.span
        className="absolute bottom-4 right-4 font-black leading-none select-none pointer-events-none"
        style={{ color: `${cat.accent}18`, fontSize: 'clamp(80px, 14vw, 160px)' }}
        animate={{ opacity: isActive ? 0.6 : 1 }}
        transition={{ duration: 0.4 }}
      >
        {cat.index}
      </motion.span>

      {/* Top section */}
      <div className="p-8 lg:p-10">
        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-6">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: cat.accent }}
          />
          <motion.span
            className="text-[10px] font-bold tracking-[0.2em] uppercase overflow-hidden whitespace-nowrap"
            style={{ color: cat.accent }}
            animate={{ opacity: contracted ? 0 : 1, maxWidth: contracted ? '0px' : '300px' }}
            transition={{ duration: 0.4 }}
          >
            {cat.label}
          </motion.span>
        </div>

        {/* Symbol — visible when contracted */}
        <AnimatePresence>
          {contracted && (
            <motion.div
              key="symbol"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 0.5, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.3 }}
              className="text-3xl mb-4"
              style={{ color: cat.accent }}
            >
              {cat.symbol}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Headline */}
        <motion.h3
          className="font-black leading-none mb-4"
          style={{
            color: cat.textColor,
            fontSize: isActive ? 'clamp(2.2rem, 3.5vw, 3.5rem)' : contracted ? '1.1rem' : 'clamp(1.8rem, 2.5vw, 2.8rem)',
          }}
          animate={{ opacity: contracted ? 0.3 : 1 }}
          transition={{ duration: 0.4 }}
        >
          {cat.headline.split('\n').map((line, i) => (
            <span key={i} className="block">
              {i === 1 ? <span style={{ fontWeight: 300, fontStyle: 'italic' }}>{line}</span> : line}
            </span>
          ))}
        </motion.h3>

        {/* Desc — only shown when active */}
        <AnimatePresence>
          {isActive && (
            <motion.p
              key="desc"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="text-sm leading-relaxed mb-8 max-w-xs"
              style={{ color: `${cat.textColor}90` }}
            >
              {cat.desc}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Products — only shown when active */}
        <AnimatePresence>
          {isActive && (
            <motion.div key="products" className="mb-8">
              {cat.products.map((product, i) => (
                <ProductTag
                  key={product.name}
                  product={product}
                  accent={cat.accent}
                  textColor={cat.textColor}
                  index={i}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom CTA — only shown when active */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            key="cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="p-8 lg:p-10 pt-0"
          >
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest group/link"
              style={{ color: cat.accent }}
            >
              Explore {cat.label}
              <ArrowUpRight
                className="w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
              />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active border accent */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-1"
        style={{ backgroundColor: cat.accent }}
        animate={{ scaleX: isActive ? 1 : 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Ambient glow when active */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            key="glow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 right-0 w-2/3 h-1/2 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 80% 20%, ${cat.accent}22, transparent 70%)`,
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Connection Lines (SVG) ────────────────────────────────────────────────────
const ConnectionLines = ({ activeId }) => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <svg
      className="w-full h-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {/* Line between panel 1 and 2 */}
      <motion.line
        x1="33.3" y1="50" x2="66.6" y2="50"
        stroke={activeId ? '#6B705C' : 'rgba(0,0,0,0.06)'}
        strokeWidth="0.3"
        strokeDasharray="1 1"
        animate={{ opacity: activeId ? 0.4 : 1 }}
        transition={{ duration: 0.4 }}
      />
      {/* Line between panel 2 and 3 */}
      <motion.line
        x1="66.6" y1="50" x2="100" y2="50"
        stroke={activeId ? '#6B705C' : 'rgba(0,0,0,0.06)'}
        strokeWidth="0.3"
        strokeDasharray="1 1"
        animate={{ opacity: activeId ? 0.4 : 1 }}
        transition={{ duration: 0.4 }}
      />
    </svg>
  </div>
);

// ─── Main Section ──────────────────────────────────────────────────────────────
const Ecosystem = () => {
  const [activeId, setActiveId] = useState(null);

  const toggle = (id) => setActiveId(prev => prev === id ? null : id);

  return (
    <section className="bg-nature-white py-24 lg:py-32">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <span className="text-xs font-black uppercase tracking-[0.3em] text-nature-orange mb-4 block">
              The Ecosystem
            </span>
            <h2 className="text-5xl md:text-6xl font-black text-nature-green tracking-tighter leading-[0.95]">
              One intelligent<br />
              <span className="italic font-light">pantry.</span>
            </h2>
          </div>
          <p className="text-nature-green/60 text-base max-w-sm leading-relaxed font-light md:text-right">
            Three pillars. Every ingredient connected. Hover a category to explore its world.
          </p>
        </div>
      </div>

      {/* Panel Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          <ConnectionLines activeId={activeId} />

          {/* Desktop: side-by-side expanding panels */}
          <div className="hidden lg:flex gap-[2px] rounded-[1.5rem] overflow-hidden shadow-premium">
            {CATEGORIES.map(cat => (
              <CategoryPanel
                key={cat.id}
                cat={cat}
                isActive={activeId === cat.id}
                isAnyActive={activeId !== null}
                onClick={() => toggle(cat.id)}
              />
            ))}
          </div>

          {/* Mobile: vertical stacked accordion */}
          <div className="flex flex-col gap-2 lg:hidden">
            {CATEGORIES.map(cat => {
              const isOpen = activeId === cat.id;
              return (
                <div
                  key={cat.id}
                  className="rounded-2xl overflow-hidden cursor-pointer"
                  style={{ backgroundColor: cat.bg }}
                  onClick={() => toggle(cat.id)}
                >
                  {/* Header row */}
                  <div className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.accent }} />
                      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: cat.accent }}>
                        {cat.label}
                      </span>
                    </div>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-lg font-thin"
                      style={{ color: cat.accent }}
                    >
                      +
                    </motion.span>
                  </div>

                  {/* Expanded body */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        key="body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden px-6 pb-6"
                      >
                        <p className="text-sm leading-relaxed mb-4" style={{ color: `${cat.textColor}90` }}>
                          {cat.desc}
                        </p>
                        {cat.products.map((product, i) => (
                          <ProductTag
                            key={product.name}
                            product={product}
                            accent={cat.accent}
                            textColor={cat.textColor}
                            index={i}
                          />
                        ))}
                        <div className="mt-6">
                          <Link
                            to="/products"
                            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
                            style={{ color: cat.accent }}
                          >
                            Explore {cat.label}
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-16 flex items-center gap-6"
        >
          <div className="h-px flex-grow bg-nature-beige" />
          <p className="text-xs uppercase tracking-[0.25em] text-nature-green/40 font-semibold whitespace-nowrap">
            All products · 100% natural · No additives
          </p>
          <div className="h-px flex-grow bg-nature-beige" />
        </motion.div>
      </div>
    </section>
  );
};

export default Ecosystem;
