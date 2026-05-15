import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ChevronRight,
  ShieldCheck,
  Calendar,
  Info
} from 'lucide-react';

import Section from '../components/ui/Section';
import SEO from '../components/ui/SEO';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { getImageUrl } from '../utils/formatters';
import api from '../api/axios';

const STATUS_STEPS = [
  { id: 'Pending', icon: Clock, label: 'En attente' },
  { id: 'Confirmed', icon: CheckCircle2, label: 'Confirmée' },
  { id: 'Preparing', icon: Package, label: 'En préparation' },
  { id: 'Shipped', icon: Truck, label: 'Expédiée' },
  { id: 'Delivered', icon: CheckCircle2, label: 'Livrée' },
];

const TrackOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchId, setSearchId] = useState(id || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrder = async (orderId) => {
    if (!orderId) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/orders/track/${orderId}`);
      if (data.success) {
        setOrder(data.data);
      } else {
        setError('Commande introuvable. Veuillez vérifier votre numéro.');
        setOrder(null);
      }
    } catch (err) {
      setError('Erreur lors de la récupération. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrder(id);
    }
  }, [id]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchId) {
      navigate(`/track/${searchId}`);
    }
  };

  const currentStatusIndex = order ? STATUS_STEPS.findIndex(s => s.id === order.status) : -1;

  return (
    <div className="pt-32 pb-24 bg-nature-white min-h-screen">
      <SEO title="Suivre ma commande | La Maison El Oula" description="Suivez l'état de votre commande de produits naturels en temps réel." />
      
      <Section>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-black text-nature-green tracking-tighter mb-6">
              Suivez votre <span className="italic font-light">colis</span>
            </h1>
            <p className="text-nature-green/60 font-light max-w-lg mx-auto">
              Entrez votre numéro de commande pour connaître l'état d'avancement de votre livraison en temps réel.
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-20">
            <div className="flex flex-col md:flex-row gap-4 p-4 bg-nature-white rounded-[2.5rem] shadow-premium border border-nature-beige">
              <div className="flex-grow relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-nature-green/20" />
                <input 
                  type="text" 
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Numéro de commande (ex: ORD-12345)" 
                  className="w-full bg-transparent border-none py-4 pl-16 pr-6 text-lg font-bold text-nature-green outline-none placeholder:text-nature-green/20"
                />
              </div>
              <Button type="submit" loading={loading} className="px-10 py-4 rounded-3xl">
                Rechercher
              </Button>
            </div>
          </form>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <div className="w-16 h-16 border-4 border-nature-beige border-t-nature-green rounded-full animate-spin mb-6" />
                <p className="text-nature-green font-bold uppercase tracking-widest text-xs">Récupération des données...</p>
              </motion.div>
            ) : error ? (
              <motion.div 
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-nature-orange/5 border-2 border-nature-orange/20 p-8 rounded-[2rem] text-center"
              >
                <Info className="w-12 h-12 text-nature-orange mx-auto mb-4" />
                <p className="text-nature-green font-bold">{error}</p>
              </motion.div>
            ) : order && (
              <motion.div 
                key="order"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-12"
              >
                {/* Order Meta */}
                <div className="flex flex-wrap justify-between items-end gap-6 border-b border-nature-beige pb-10">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-nature-green/40">Commande n°</span>
                    <h2 className="text-3xl font-black text-nature-green tracking-tighter uppercase">{order._id.slice(-8)}</h2>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase tracking-widest text-nature-green/40">Statut actuel</span>
                    <div className="flex items-center gap-2 text-nature-green font-black uppercase text-sm tracking-tighter">
                      <span className="w-2 h-2 bg-nature-orange rounded-full animate-pulse" />
                      {STATUS_STEPS[currentStatusIndex]?.label}
                    </div>
                  </div>
                </div>

                {/* Visual Timeline */}
                <div className="relative py-12 px-4">
                  {/* Progress Line */}
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-nature-beige -translate-y-1/2 hidden md:block">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(currentStatusIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
                      className="h-full bg-nature-green"
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-4 relative z-10">
                    {STATUS_STEPS.map((step, index) => {
                      const isCompleted = index <= currentStatusIndex;
                      const isCurrent = index === currentStatusIndex;
                      return (
                        <div key={step.id} className="flex flex-col items-center text-center space-y-4">
                          <div className={`
                            w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500
                            ${isCompleted ? 'bg-nature-green text-nature-white shadow-lg' : 'bg-nature-white text-nature-green/20 border-2 border-nature-beige'}
                            ${isCurrent ? 'ring-8 ring-nature-green/10 scale-110' : ''}
                          `}>
                            <step.icon className="w-6 h-6" />
                          </div>
                          <div>
                            <p className={`text-[10px] font-black uppercase tracking-widest ${isCompleted ? 'text-nature-green' : 'text-nature-green/20'}`}>
                              {step.label}
                            </p>
                            {isCompleted && index === currentStatusIndex && (
                              <p className="text-[8px] text-nature-orange font-bold uppercase mt-1">En cours</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Order Info Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Delivery Details */}
                  <div className="bg-nature-white p-10 rounded-[3rem] border border-nature-beige shadow-sm space-y-8">
                    <h3 className="text-xl font-black text-nature-green uppercase tracking-tighter border-b border-nature-beige pb-6">
                      Détails de livraison
                    </h3>
                    <div className="space-y-6">
                      <div className="flex gap-4">
                        <MapPin className="w-5 h-5 text-nature-orange flex-shrink-0" />
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-nature-green/40 mb-1">Adresse</p>
                          <p className="text-sm font-bold text-nature-green leading-relaxed">
                            {order.shippingAddress.address}, {order.shippingAddress.wilaya}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <Calendar className="w-5 h-5 text-nature-orange flex-shrink-0" />
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-nature-green/40 mb-1">Estimation de livraison</p>
                          <p className="text-sm font-bold text-nature-green">
                            24h - 48h (Délai habituel)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-nature-white p-10 rounded-[3rem] border border-nature-beige shadow-sm space-y-8">
                    <h3 className="text-xl font-black text-nature-green uppercase tracking-tighter border-b border-nature-beige pb-6">
                      Contenu du colis
                    </h3>
                    <div className="space-y-4">
                      {order.orderItems.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-4 border-b border-nature-beige/30 last:border-0">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-nature-beige/20 rounded-xl overflow-hidden flex-shrink-0">
                              <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-nature-green">{item.name}</p>
                              <p className="text-[10px] font-black uppercase tracking-widest text-nature-green/40">Quantité: {item.qty}</p>
                            </div>
                          </div>
                          <Package className="w-5 h-5 text-nature-green/20" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Note */}
                <div className="flex items-center gap-4 p-6 bg-nature-green text-nature-white rounded-3xl">
                  <ShieldCheck className="w-8 h-8 flex-shrink-0" />
                  <p className="text-xs font-light leading-relaxed">
                    Votre colis est emballé avec soin dans un packaging écologique. Notre service client est disponible au 05 55 00 00 00 pour toute question.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Section>
    </div>
  );
};

export default TrackOrder;
