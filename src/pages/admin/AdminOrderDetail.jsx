import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard,
  ShieldCheck,
  Calendar,
  ExternalLink,
  Printer,
  ChevronRight
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { formatPrice, formatDate } from '../../utils/formatters';
import api from '../../api/axios';

const STATUS_STEPS = [
  { id: 'Pending', label: 'En attente', color: 'text-nature-orange', bg: 'bg-nature-orange/10' },
  { id: 'Confirmed', label: 'Confirmée', color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: 'Preparing', label: 'Préparation', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  { id: 'Shipped', label: 'Expédiée', color: 'text-purple-600', bg: 'bg-purple-100' },
  { id: 'Delivered', label: 'Livrée', color: 'text-nature-green', bg: 'bg-nature-green/10' },
  { id: 'Cancelled', label: 'Annulée', color: 'text-red-600', bg: 'bg-red-100' },
];

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  const fetchOrder = async () => {
    try {
      const { data } = await api.get(`/orders/${id}`);
      if (data.success) {
        setOrder(data.data);
        setNewStatus(data.data.status);
        setTrackingNumber(data.data.trackingNumber || '');
      }
    } catch (err) {
      toast.error('Erreur lors de la récupération de la commande');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleUpdateStatus = async () => {
    setUpdating(true);
    try {
      const { data } = await api.put(`/orders/${id}/status`, { status: newStatus, trackingNumber });
      if (data.success) {
        toast.success('Statut mis à jour');
        fetchOrder();
      }
    } catch (err) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-12 h-12 border-4 border-nature-beige border-t-nature-green rounded-full animate-spin" />
    </div>
  );

  if (!order) return <div className="text-center py-20 font-black text-nature-green uppercase">Commande introuvable</div>;

  const currentStatusIndex = STATUS_STEPS.findIndex(s => s.id === order.status);

  return (
    <div className="space-y-10 pb-24">
      <Toaster position="top-right" />
      
      {/* Back & Actions */}
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <button 
          onClick={() => navigate('/admin/orders')}
          className="flex items-center gap-2 text-nature-green/40 hover:text-nature-green font-black uppercase tracking-widest text-[10px] transition-all group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Retour aux commandes
        </button>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-nature-white border border-nature-beige rounded-xl text-[10px] font-black uppercase tracking-widest text-nature-green/60 hover:bg-nature-beige/30 transition-all">
            <Printer className="w-4 h-4" />
            Imprimer Facture
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-10">
          {/* Order Status Timeline Card */}
          <div className="bg-white p-10 rounded-[3rem] border border-nature-beige/50 shadow-sm space-y-8">
            <div className="flex justify-between items-end border-b border-nature-beige pb-8">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-nature-green/40">Commande</span>
                <h1 className="text-3xl font-black text-nature-green tracking-tighter uppercase">#{order._id.slice(-8)}</h1>
                <p className="text-[10px] font-bold text-nature-green/40 uppercase mt-1">Passée le {formatDate(order.createdAt)}</p>
              </div>
              <div className="text-right">
                <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${STATUS_STEPS[currentStatusIndex]?.bg} ${STATUS_STEPS[currentStatusIndex]?.color}`}>
                  {STATUS_STEPS[currentStatusIndex]?.label}
                </span>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative py-12 px-4 hidden md:block">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-nature-beige -translate-y-1/2">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStatusIndex / (STATUS_STEPS.length - 2)) * 100}%` }}
                  className="h-full bg-nature-green"
                />
              </div>
              <div className="flex justify-between relative z-10">
                {STATUS_STEPS.slice(0, 5).map((step, idx) => (
                  <div key={step.id} className="flex flex-col items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                      idx <= currentStatusIndex ? 'bg-nature-green text-white shadow-lg' : 'bg-nature-white border-2 border-nature-beige text-nature-green/20'
                    }`}>
                      {idx < currentStatusIndex ? <ShieldCheck className="w-5 h-5" /> : idx === currentStatusIndex ? <div className="w-2 h-2 bg-white rounded-full animate-pulse" /> : <Clock className="w-5 h-5" />}
                    </div>
                    <span className={`text-[8px] font-black uppercase tracking-widest ${idx <= currentStatusIndex ? 'text-nature-green' : 'text-nature-green/20'}`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Update Form */}
            <div className="bg-nature-beige/10 p-8 rounded-[2rem] border border-nature-beige/30 grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-nature-green/40 ml-4">Modifier le statut</label>
                <select 
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-white border border-nature-beige rounded-xl py-4 px-6 text-sm font-bold text-nature-green outline-none focus:ring-2 focus:ring-nature-green appearance-none"
                >
                  {STATUS_STEPS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-nature-green/40 ml-4">Numéro de suivi</label>
                <input 
                  type="text"
                  placeholder="EX: TRACK-123"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full bg-white border border-nature-beige rounded-xl py-4 px-6 text-sm font-bold text-nature-green outline-none focus:ring-2 focus:ring-nature-green"
                />
              </div>
              <button 
                onClick={handleUpdateStatus}
                disabled={updating}
                className="bg-nature-green text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
              >
                {updating ? 'Mise à jour...' : 'Enregistrer'}
              </button>
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white rounded-[3rem] border border-nature-beige/50 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-nature-beige/50">
              <h3 className="text-xl font-black text-nature-green uppercase tracking-tighter flex items-center gap-3">
                <Package className="w-6 h-6 text-nature-orange" />
                Articles commandés
              </h3>
            </div>
            <table className="w-full text-left">
              <tbody className="divide-y divide-nature-beige/30">
                {order.orderItems.map((item, idx) => (
                  <tr key={idx} className="group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-nature-beige/20 rounded-2xl overflow-hidden border border-nature-beige/50">
                          <img src={getImageUrl(item.image)} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-bold text-nature-green">{item.name}</p>
                          <p className="text-[10px] font-black text-nature-green/40 uppercase tracking-widest">Prix Unitaire: {formatPrice(item.price)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-bold text-nature-green">x {item.qty}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="font-black text-nature-green italic">{formatPrice(item.qty * item.price)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-nature-beige/10">
                <tr>
                  <td colSpan="2" className="px-8 py-4 text-right text-[10px] font-black uppercase tracking-widest text-nature-green/40">Sous-total</td>
                  <td className="px-8 py-4 text-right font-bold text-nature-green">{formatPrice(order.itemsPrice)}</td>
                </tr>
                <tr>
                  <td colSpan="2" className="px-8 py-4 text-right text-[10px] font-black uppercase tracking-widest text-nature-green/40">Livraison</td>
                  <td className="px-8 py-4 text-right font-bold text-nature-green">{formatPrice(order.shippingPrice)}</td>
                </tr>
                <tr className="border-t border-nature-beige">
                  <td colSpan="2" className="px-8 py-6 text-right text-[12px] font-black uppercase tracking-widest text-nature-green">Total</td>
                  <td className="px-8 py-6 text-right text-2xl font-black text-nature-orange italic">{formatPrice(order.totalPrice)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-10">
          {/* Customer Card */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-nature-beige/50 shadow-sm space-y-6">
            <h3 className="text-xs font-black text-nature-green/40 uppercase tracking-widest border-b border-nature-beige pb-4">Client</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-nature-beige/20 rounded-xl flex items-center justify-center text-nature-green">
                  <span className="font-black text-xl">{order.shippingAddress.fullName[0]}</span>
                </div>
                <div>
                  <p className="font-bold text-nature-green">{order.shippingAddress.fullName}</p>
                  <p className="text-[10px] text-nature-green/40 font-black uppercase tracking-widest">Client invité</p>
                </div>
              </div>
              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-3 text-sm text-nature-green/60">
                  <Mail className="w-4 h-4" />
                  {order.shippingAddress.email}
                </div>
                <div className="flex items-center gap-3 text-sm text-nature-green/60">
                  <Phone className="w-4 h-4" />
                  {order.shippingAddress.phone}
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Card */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-nature-beige/50 shadow-sm space-y-6">
            <h3 className="text-xs font-black text-nature-green/40 uppercase tracking-widest border-b border-nature-beige pb-4">Livraison</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <MapPin className="w-5 h-5 text-nature-orange flex-shrink-0" />
                <p className="text-sm font-bold text-nature-green leading-relaxed">
                  {order.shippingAddress.address}, {order.shippingAddress.wilaya}
                </p>
              </div>
              <div className="pt-4 border-t border-nature-beige/50">
                <p className="text-[10px] font-black uppercase tracking-widest text-nature-green/40 mb-2">Notes de livraison</p>
                <p className="text-xs text-nature-green/60 italic">
                  {order.shippingAddress.deliveryNotes || "Aucune note particulière"}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Card */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-nature-beige/50 shadow-sm space-y-6">
            <h3 className="text-xs font-black text-nature-green/40 uppercase tracking-widest border-b border-nature-beige pb-4">Paiement</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm font-bold text-nature-green">
                  <CreditCard className="w-5 h-5 text-nature-green/40" />
                  Paiement à la livraison
                </div>
                <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${order.isPaid ? 'bg-nature-green/10 text-nature-green' : 'bg-nature-orange/10 text-nature-orange'}`}>
                  {order.isPaid ? 'Payé' : 'Non payé'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
