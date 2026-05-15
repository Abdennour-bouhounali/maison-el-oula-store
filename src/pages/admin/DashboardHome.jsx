import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Package, 
  ShoppingBag, 
  AlertTriangle, 
  ChevronUp, 
  ChevronDown,
  ArrowUpRight,
  Clock,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';
import { formatPrice, getImageUrl } from '../../utils/formatters';
import api from '../../api/axios';

const DashboardHome = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const { data: json } = await api.get('/analytics/stats');
      if (json.success) {
        setData(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch analytics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-nature-beige border-t-nature-green rounded-full animate-spin" />
    </div>
  );

  if (!data) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <AlertTriangle className="w-12 h-12 text-nature-orange" />
      <p className="text-nature-green font-bold uppercase tracking-widest text-xs">Impossible de charger les statistiques</p>
      <button 
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-nature-green text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
      >
        Réessayer
      </button>
    </div>
  );

  const COLORS = ['#2D4A22', '#F2994A', '#2F80ED', '#9B51E0', '#EB5757'];

  const stats = [
    { label: 'Revenu Total', value: formatPrice(data.counts.revenue), icon: TrendingUp, change: '+12.5%', isUp: true, color: 'text-nature-green' },
    { label: 'Commandes', value: data.counts.orders, icon: ShoppingBag, change: '+5.2%', isUp: true, color: 'text-blue-600' },
    { label: 'Clients', value: data.counts.users, icon: Users, change: '+18.1%', isUp: true, color: 'text-purple-600' },
    { label: 'Produits', value: data.counts.products, icon: Package, change: '0%', isUp: true, color: 'text-nature-orange' },
  ];

  return (
    <div className="space-y-12 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-nature-green tracking-tighter uppercase">Analytics <span className="italic font-light tracking-normal">Dashboard</span></h1>
          <p className="text-[10px] font-black text-nature-green/40 uppercase tracking-[0.3em] mt-2">Vue d'ensemble de votre performance commerciale</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-nature-white border border-nature-beige rounded-xl text-[10px] font-black uppercase tracking-widest text-nature-green/60 hover:bg-nature-beige/30 transition-all flex items-center gap-2">
            <Clock className="w-4 h-4" />
            7 Derniers Jours
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[2.5rem] border border-nature-beige/50 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 rounded-2xl bg-nature-beige/10 ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black ${stat.isUp ? 'text-nature-green' : 'text-red-500'}`}>
                {stat.isUp ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-nature-green/40 mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-nature-green">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Sales Chart */}
        <div className="bg-white p-10 rounded-[3rem] border border-nature-beige/50 shadow-sm space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-nature-green uppercase tracking-tighter">Évolution du Revenu</h3>
            <button className="text-nature-green/40 hover:text-nature-green"><ArrowUpRight className="w-5 h-5" /></button>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={data.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#2D4A22', opacity: 0.4 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#2D4A22', opacity: 0.4 }} />
                <Tooltip 
                  cursor={{ fill: '#F3F4F6' }}
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', padding: '20px' }}
                />
                <Bar dataKey="revenue" fill="#2D4A22" radius={[10, 10, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Chart */}
        <div className="bg-white p-10 rounded-[3rem] border border-nature-beige/50 shadow-sm space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-nature-green uppercase tracking-tighter">Répartition des Commandes</h3>
            <button className="text-nature-green/40 hover:text-nature-green"><ArrowUpRight className="w-5 h-5" /></button>
          </div>
          <div className="h-[400px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie
                  data={data.statusStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="_id"
                >
                  {data.statusStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Legend Overlay */}
            <div className="absolute flex flex-col gap-2">
              {data.statusStats.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-nature-green/60">{s._id}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Top Products */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-nature-beige/50 shadow-sm space-y-8">
          <h3 className="text-xl font-black text-nature-green uppercase tracking-tighter">Meilleures Ventes</h3>
          <div className="space-y-6">
            {data.topProducts.map((product, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-nature-beige/10 rounded-2xl transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-nature-beige/20 rounded-2xl overflow-hidden shadow-inner">
                    <img src={getImageUrl(product.image)} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-nature-green">{product.name}</p>
                    <p className="text-[10px] font-black text-nature-green/40 uppercase tracking-widest">{product.totalSold} unités vendues</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-nature-green italic">{formatPrice(product.totalRevenue)}</p>
                  <p className="text-[10px] font-black text-nature-green/40 uppercase tracking-widest">CA Total</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stock Alerts */}
        <div className="bg-nature-orange/5 p-10 rounded-[3rem] border border-nature-orange/20 shadow-sm space-y-8">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-nature-orange" />
            <h3 className="text-xl font-black text-nature-orange uppercase tracking-tighter">Alertes Stock</h3>
          </div>
          <div className="space-y-4">
            {data.lowStockProducts.map((product, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-nature-orange/10 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-nature-green">{product.name.fr}</p>
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1">Seulement {product.countInStock} restants</p>
                </div>
                <button className="p-2 bg-nature-orange/10 text-nature-orange rounded-xl hover:bg-nature-orange hover:text-white transition-all">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            ))}
            {data.lowStockProducts.length === 0 && (
              <div className="text-center py-10">
                <p className="text-xs font-bold text-nature-green/40 uppercase italic tracking-widest">Stock optimal ✅</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
