'use client';

import { NAV_LINKS, CONTACT_EMAIL, BRAND } from '@/constants';
import { Menu, X } from 'lucide-react';

interface NavigationProps {
  readonly isScrolled: boolean;
  readonly isMobileMenuOpen: boolean;
  readonly onToggleMobileMenu: () => void;
}

const Navigation = ({
  isScrolled,
  isMobileMenuOpen,
  onToggleMobileMenu,
}: NavigationProps) => {
  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  const handleCloseMobileMenu = () => {
    onToggleMobileMenu();
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav
        className={`fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-[1400px] z-50 transition-all duration-700 ${
          isScrolled
            ? 'glass-panel rounded-full py-4 px-8 bg-noise'
            : 'py-8 px-0 border-transparent bg-transparent'
        }`}
      >
        <div className="flex justify-between items-center">
          <div className="text-xs font-bold font-montserrat tracking-[0.3em] mix-blend-difference z-50 animate-fade-up delay-0">
            {BRAND.NAME}
          </div>

          {/* Desktop Navigation */}
          <div
            className={`hidden md:flex gap-12 items-center text-[10px] font-mono tracking-widest uppercase mix-blend-difference transition-all duration-500 animate-fade-up delay-200 ${
              isScrolled ? 'text-gray-200' : 'text-gray-400'
            }`}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-white transition-colors relative group"
                tabIndex={0}
              >
                {link.label}
                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="px-5 py-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all duration-300"
              tabIndex={0}
              aria-label="Send email to contact"
            >
              Contact
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white z-50"
            onClick={onToggleMobileMenu}
            onKeyDown={(e) => handleKeyDown(e, onToggleMobileMenu)}
            aria-label={isMobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
            aria-expanded={isMobileMenuOpen}
            tabIndex={0}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center space-y-8 md:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleCloseMobileMenu}
              onKeyDown={(e) => handleKeyDown(e, handleCloseMobileMenu)}
              className="text-3xl font-light"
              tabIndex={0}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
};

export default Navigation;
