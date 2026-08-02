import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Globe } from 'lucide-react';

export const LanguageSwitcher = () => {
  const { language, switchLanguage } = useAppContext();

  return (
    <button
      onClick={() => switchLanguage(language === 'en' ? 'ne' : 'en')}
      className="p-2 hover:bg-gray-100 rounded-lg flex items-center gap-2 text-sm"
    >
      <Globe size={18} />
      <span>{language === 'en' ? '🇬🇧 EN' : '🇳🇵 NE'}</span>
    </button>
  );
};