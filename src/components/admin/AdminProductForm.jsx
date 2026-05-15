import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  X, 
  Globe, 
  Info, 
  BarChart, 
  Search, 
  Plus, 
  Trash2,
  Image as ImageIcon
} from 'lucide-react';
import toast from 'react-hot-toast';
import ImageUpload from './ImageUpload';
import api from '../../api/axios';
import { getImageUrl } from '../../utils/formatters';

const AdminProductForm = ({ product, onSuccess, onClose }) => {
  const [activeTab, setActiveTab] = useState('FR');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: { fr: '', en: '', ar: '' },
    slug: '',
    description: { fr: '', en: '', ar: '' },
    category: '',
    price: 0,
    countInStock: 0,
    status: 'active',
    weight: '50g',
    ingredients: { fr: [], en: [], ar: [] },
    usage: { fr: '', en: '', ar: '' },
    benefits: { fr: [], en: [], ar: [] },
    badges: [],
    nutrition_table: { calories: '', fat: '', protein: '', carbs: '', fiber: '' },
    seo_title: '',
    seo_description: '',
    images: []
  });

  useEffect(() => {
    if (product) {
      setFormData(prev => ({
        ...prev,
        ...product,
        name: { ...prev.name, ...product.name },
        description: { ...prev.description, ...product.description },
        usage: { ...prev.usage, ...(product.usage || {}) },
        ingredients: { ...prev.ingredients, ...(product.ingredients || {}) },
        benefits: { ...prev.benefits, ...(product.benefits || {}) }
      }));
    }
  }, [product]);

  const handleChange = (field, value, lang) => {
    if (lang) {
      setFormData(prev => ({
        ...prev,
        [field]: { ...prev[field], [lang]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleNutritionChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      nutrition_table: { ...prev.nutrition_table, [field]: value }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data } = product 
        ? await api.put(`/products/${product._id}`, formData)
        : await api.post('/products', formData);

      if (data.success) {
        toast.success(product ? 'Produit mis à jour' : 'Produit créé');
        onSuccess();
      } else {
        toast.error(data.message || 'Une erreur est survenue');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const tabs = ['FR', 'EN', 'AR', 'INFO', 'SEO'];

  return (
    <form onSubmit={handleSubmit} className="space-y-10 pb-10">
      {/* Tab Navigation */}
      <div className="flex gap-2 p-2 bg-nature-beige/10 rounded-2xl sticky top-0 z-20 backdrop-blur-sm border border-nature-beige/50">
        {tabs.map(tab => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`
              flex-grow py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
              ${activeTab === tab ? 'bg-nature-green text-nature-white shadow-lg' : 'text-nature-green/40 hover:bg-nature-beige/30'}
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {/* Multilingual Content */}
        {['FR', 'EN', 'AR'].includes(activeTab) && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-nature-green/40 ml-4">Nom du produit ({activeTab})</label>
              <input 
                type="text" 
                value={formData.name?.[activeTab.toLowerCase()] || ''} 
                onChange={(e) => handleChange('name', e.target.value, activeTab.toLowerCase())}
                className="w-full bg-white border border-nature-beige rounded-2xl py-4 px-6 text-sm font-bold text-nature-green outline-none focus:ring-2 focus:ring-nature-green"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-nature-green/40 ml-4">Description ({activeTab})</label>
              <textarea 
                rows="5"
                value={formData.description?.[activeTab.toLowerCase()] || ''} 
                onChange={(e) => handleChange('description', e.target.value, activeTab.toLowerCase())}
                className="w-full bg-white border border-nature-beige rounded-2xl py-4 px-6 text-sm font-bold text-nature-green outline-none focus:ring-2 focus:ring-nature-green"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-nature-green/40 ml-4">Usage ({activeTab})</label>
              <textarea 
                rows="3"
                value={formData.usage?.[activeTab.toLowerCase()] || ''} 
                onChange={(e) => handleChange('usage', e.target.value, activeTab.toLowerCase())}
                className="w-full bg-white border border-nature-beige rounded-2xl py-4 px-6 text-sm font-bold text-nature-green outline-none focus:ring-2 focus:ring-nature-green"
              />
            </div>
          </motion.div>
        )}

        {/* General Info */}
        {activeTab === 'INFO' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-nature-green/40 ml-4">URL Slug (SEO)</label>
              <input 
                type="text" 
                value={formData.slug} 
                onChange={(e) => handleChange('slug', e.target.value)}
                className="w-full bg-white border border-nature-beige rounded-2xl py-4 px-6 text-sm font-bold text-nature-green outline-none focus:ring-2 focus:ring-nature-green"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-nature-green/40 ml-4">Catégorie</label>
              <select 
                value={formData.category} 
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full bg-white border border-nature-beige rounded-2xl py-4 px-6 text-sm font-bold text-nature-green outline-none focus:ring-2 focus:ring-nature-green appearance-none"
                required
              >
                <option value="">Sélectionner</option>
                <option value="Fruits Séchés">Fruits Séchés</option>
                <option value="Épices">Épices</option>
                <option value="Infusions">Infusions</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-nature-green/40 ml-4">Prix (DA)</label>
              <input 
                type="number" 
                value={formData.price} 
                onChange={(e) => handleChange('price', e.target.value)}
                className="w-full bg-white border border-nature-beige rounded-2xl py-4 px-6 text-sm font-bold text-nature-green outline-none focus:ring-2 focus:ring-nature-green"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-nature-green/40 ml-4">Stock</label>
              <input 
                type="number" 
                value={formData.countInStock} 
                onChange={(e) => handleChange('countInStock', e.target.value)}
                className="w-full bg-white border border-nature-beige rounded-2xl py-4 px-6 text-sm font-bold text-nature-green outline-none focus:ring-2 focus:ring-nature-green"
                required
              />
            </div>
            
            {/* Image Manager Section */}
            <div className="md:col-span-2">
               <ImageUpload 
                folder={formData.slug || 'new-product'}
                onUploadSuccess={(url) => setFormData(prev => ({ ...prev, images: [...prev.images, url] }))}
                currentImage={null}
               />
               <div className="flex gap-2 mt-4">
                 {formData.images.map((img, i) => (
                   <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-nature-beige">
                     <img src={getImageUrl(img)} className="w-full h-full object-cover" />
                     <button onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }))} className="absolute top-0 right-0 p-1 bg-nature-orange text-white rounded-bl-lg">
                       <Trash2 className="w-3 h-3" />
                     </button>
                   </div>
                 ))}
               </div>
            </div>
          </motion.div>
        )}

        {/* SEO Tab */}
        {activeTab === 'SEO' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-nature-green/40 ml-4">Meta Title</label>
              <input 
                type="text" 
                value={formData.seo_title} 
                onChange={(e) => handleChange('seo_title', e.target.value)}
                className="w-full bg-white border border-nature-beige rounded-2xl py-4 px-6 text-sm font-bold text-nature-green outline-none focus:ring-2 focus:ring-nature-green"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-nature-green/40 ml-4">Meta Description</label>
              <textarea 
                rows="4"
                value={formData.seo_description} 
                onChange={(e) => handleChange('seo_description', e.target.value)}
                className="w-full bg-white border border-nature-beige rounded-2xl py-4 px-6 text-sm font-bold text-nature-green outline-none focus:ring-2 focus:ring-nature-green"
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Sticky Bottom Actions */}
      <div className="sticky bottom-0 bg-white/80 backdrop-blur-md pt-6 pb-2 border-t border-nature-beige flex justify-end gap-4 z-20">
        <button 
          type="button" 
          onClick={onClose}
          className="px-8 py-4 border border-nature-beige rounded-2xl text-xs font-black uppercase tracking-widest text-nature-green/40 hover:bg-nature-beige/30 transition-all"
        >
          Annuler
        </button>
        <button 
          type="submit" 
          disabled={loading}
          className="px-10 py-4 bg-nature-green text-nature-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-xl hover:shadow-nature-green/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-5 h-5" />
              {product ? 'Enregistrer les modifications' : 'Créer le produit'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AdminProductForm;
