import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Eye, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock,
  MoreVertical,
  ChevronRight,
  ArrowUpDown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../../utils/formatters';
import api from '../../api/axios';

const statusColors = {
  'Pending': 'bg-nature-orange/10 text-nature-orange',
  'Confirmed': 'bg-blue-100 text-blue-600',
  'Preparing': 'bg-yellow-100 text-yellow-600',
  'Shipped': 'bg-purple-100 text-purple-600',
  'Delivered': 'bg-nature-green/10 text-nature-green',
  'Cancelled': 'bg-red-100 text-red-600',
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      if (data.success) {
        setOrders(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-nature-green tracking-tighter">Gestion des <span className="italic font-light">commandes</span></h1>
          <p className="text-nature-green/40 font-bold uppercase tracking-widest text-[10px] mt-2">Suivez et traitez les commandes de vos clients</p>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-nature-beige/50 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-nature-green/30" />
          <input 
            type="text" 
            placeholder="Rechercher par client, n° commande..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-nature-beige/20 border-none rounded-xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-nature-green transition-all"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button className="flex items-center justify-center gap-2 px-6 py-4 bg-nature-white border border-nature-beige rounded-xl text-xs font-black uppercase tracking-widest text-nature-green/60 hover:bg-nature-beige/30 transition-all">
            <Filter className="w-4 h-4" />
            Filtres
          </button>
          <button className="flex items-center justify-center gap-2 px-6 py-4 bg-nature-white border border-nature-beige rounded-xl text-xs font-black uppercase tracking-widest text-nature-green/60 hover:bg-nature-beige/30 transition-all">
            <ArrowUpDown className="w-4 h-4" />
            Trier
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-nature-beige/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-nature-beige/10 border-b border-nature-beige/50">
              <tr>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-nature-green/40">ID & Date</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-nature-green/40">Client</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-nature-green/40">Articles</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-nature-green/40">Total</th>
                <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-nature-green/40">Statut</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-nature-green/40 text-right">Détails</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-nature-beige/30">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-20 text-center">
                    <div className="w-12 h-12 border-4 border-nature-beige border-t-nature-green rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-20 text-center text-nature-green/40 font-bold italic uppercase tracking-widest text-xs">
                    Aucune commande trouvée
                  </td>
                </tr>
              ) : orders.filter(o => o.shippingAddress.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || o._id.includes(searchTerm)).map((order) => (
                <tr key={order._id} className="hover:bg-nature-beige/5 transition-colors group">
                  <td className="px-10 py-6">
                    <div>
                      <p className="font-bold text-nature-green uppercase tracking-tighter">#{order._id.slice(-8)}</p>
                      <p className="text-[10px] text-nature-green/40 uppercase font-black tracking-widest mt-1">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div>
                      <p className="text-sm font-bold text-nature-green">{order.shippingAddress.fullName}</p>
                      <p className="text-[10px] text-nature-green/40 font-black uppercase tracking-widest">{order.shippingAddress.wilaya}</p>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex -space-x-3">
                      {order.orderItems.map((item, i) => (
                        <div key={i} className="w-10 h-10 bg-nature-beige rounded-xl border-2 border-white flex items-center justify-center p-1 overflow-hidden" title={item.name}>
                          <img src={getImageUrl(item.image)} alt="" className="w-full h-full object-cover rounded-md" />
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className="font-black text-nature-green italic">{order.totalPrice} DA</span>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <Link 
                      to={`/admin/orders/${order._id}`}
                      className="inline-block p-3 bg-nature-white border border-nature-beige rounded-xl text-nature-green hover:bg-nature-green hover:text-nature-white transition-all shadow-sm group/btn"
                    >
                      <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
