import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'nature-green' }) => {
  const colorMap = {
    'nature-green': 'bg-nature-green text-nature-white',
    'nature-orange': 'bg-nature-orange text-nature-white',
    'nature-beige': 'bg-nature-beige text-nature-green',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-nature-beige/50 flex flex-col justify-between"
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl ${colorMap[color] || colorMap['nature-green']}`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full ${trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            {trend === 'up' ? '+' : '-'}{trendValue}%
          </span>
        )}
      </div>
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-nature-green/40 mb-2">{title}</p>
        <h3 className="text-4xl font-black text-nature-green tracking-tighter">{value}</h3>
      </div>
    </motion.div>
  );
};

export default StatCard;
