import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const { t } = useTranslation();

  return (
    <nav className="fixed top-0 w-full bg-nature-white/80 backdrop-blur-md z-50 border-b border-nature-beige">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold text-nature-green tracking-tight">
              La Maison El Oula
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            <a href="#" className="text-nature-green hover:text-nature-orange font-medium transition-colors">
              {t('nav.home')}
            </a>
            <a href="#" className="text-nature-green hover:text-nature-orange font-medium transition-colors">
              {t('nav.products')}
            </a>
            <a href="#" className="text-nature-green hover:text-nature-orange font-medium transition-colors">
              {t('nav.about')}
            </a>
            <a href="#" className="text-nature-green hover:text-nature-orange font-medium transition-colors">
              {t('nav.contact')}
            </a>
            <LanguageSwitcher />
          </div>

          <div className="md:hidden">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
