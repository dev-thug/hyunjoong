'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Locale, i18n } from '@/i18n-config';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  readonly dict: {
    navigation: {
      language: string;
    };
  };
  readonly isScrolled?: boolean;
}

const LanguageSwitcher = ({ dict, isScrolled = false }: LanguageSwitcherProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const currentLocale = pathname.split('/')[1] as Locale;
  const targetLocale: Locale = currentLocale === 'ko' ? 'en' : 'ko';

  const handleLanguageChange = () => {
    const segments = pathname.split('/');
    segments[1] = targetLocale;
    const newPath = segments.join('/');
    router.push(newPath);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleLanguageChange();
    }
  };

  return (
    <button
      onClick={handleLanguageChange}
      onKeyDown={handleKeyDown}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 group hover:bg-white/10 ${
        isScrolled ? 'text-gray-200' : 'text-gray-400'
      } hover:text-white`}
      aria-label={`Switch to ${dict.navigation.language}`}
      tabIndex={0}
    >
      <Globe size={14} className="opacity-60 group-hover:opacity-100 transition-opacity" />
      <span className="text-[10px] font-mono tracking-widest uppercase">
        {dict.navigation.language}
      </span>
    </button>
  );
};

export default LanguageSwitcher;
