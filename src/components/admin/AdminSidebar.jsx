import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  BarChart3, 
  Settings, 
  X,
  Leaf,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MENU_ITEMS = [
  { name: 'Vue d\'ensemble', icon: LayoutDashboard, path: '/admin' },
  { name: 'Produits', icon: Package, path: '/admin/products' },
  { name: 'Commandes', icon: ShoppingBag, path: '/admin/orders' },
  { name: 'Clients', icon: Users, path: '/admin/customers' },
  { name: 'Analytique', icon: BarChart3, path: '/admin/analytics' },
  { name: 'Paramètres', icon: Settings, path: '/admin/settings' },
];

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-nature-green/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 bottom-0 w-72 bg-nature-white border-r border-nature-beige z-50 transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-8 flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between mb-12">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-nature-green rounded-xl flex items-center justify-center text-nature-white">
                <Leaf className="w-6 h-6" />
              </div>
              <span className="text-xl font-black text-nature-green uppercase tracking-tighter">Admin</span>
            </Link>
            <button className="lg:hidden p-2" onClick={() => setIsOpen(false)}>
              <X className="w-6 h-6 text-nature-green" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-grow space-y-2">
            {MENU_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all group
                    ${isActive ? 'bg-nature-green text-nature-white shadow-premium' : 'text-nature-green/60 hover:bg-nature-beige/30'}
                  `}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-nature-white' : 'text-nature-green/40 group-hover:text-nature-green'}`} />
                  {item.name}
                  {isActive && (
                    <motion.div layoutId="sidebar-pill" className="ml-auto w-1.5 h-1.5 bg-nature-white rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="pt-8 border-t border-nature-beige flex flex-col gap-4">
            <div className="flex items-center gap-4 p-4">
              <div className="w-10 h-10 bg-nature-orange rounded-full flex items-center justify-center text-nature-white font-black">
                {userInfo?.name?.charAt(0) || 'A'}
              </div>
              <div>
                <p className="text-sm font-bold text-nature-green">{userInfo?.name || 'Admin Oula'}</p>
                <p className="text-[10px] uppercase font-black tracking-widest text-nature-green/40">
                  {userInfo?.role === 'admin' ? 'Gérant' : 'Connecté'}
                </p>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all group"
            >
              <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-500" />
              Déconnexion
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
