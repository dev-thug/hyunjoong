"use client";

import {
  getNavLinks,
  getContactHref,
  BRAND,
  type NavLabels,
} from "@/constants";
import type { Locale } from "@/i18n-config";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useMemo,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import LanguageSwitcher from "./LanguageSwitcher";

interface NavigationProps {
  readonly isScrolled: boolean;
  readonly isMobileMenuOpen: boolean;
  readonly onToggleMobileMenu: () => void;
  readonly onCloseMobileMenu: () => void;
  readonly lang: Locale;
  readonly navLabels: NavLabels;
}

const Navigation = ({
  isScrolled,
  isMobileMenuOpen,
  onToggleMobileMenu,
  onCloseMobileMenu,
  lang,
  navLabels,
}: NavigationProps) => {
  const pathname = usePathname();
  const navLinks = useMemo(
    () => getNavLinks(lang, navLabels),
    [lang, navLabels]
  );
  const contactHref = useMemo(() => getContactHref(lang), [lang]);
  const ariaLabels =
    lang === "ko"
      ? {
          mainNavigation: "주요 탐색",
          home: "홈페이지로 이동",
          contact: "문의 양식 열기",
          openMenu: "모바일 메뉴 열기",
          closeMenu: "모바일 메뉴 닫기",
          mobileNavigation: "모바일 탐색 메뉴",
        }
      : {
          mainNavigation: "Main navigation",
          home: "Go to home page",
          contact: "Open contact form",
          openMenu: "Open mobile menu",
          closeMenu: "Close mobile menu",
          mobileNavigation: "Mobile navigation menu",
        };

  const toggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  // Body scroll lock + Escape-to-close
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";

    if (!isMobileMenuOpen) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseMobileMenu();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
    };
  }, [isMobileMenuOpen, onCloseMobileMenu]);

  // Reset body overflow when this component unmounts.
  useEffect(() => {
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }
    };
  }, []);

  // Focus management: focus first link on open, restore to toggle on close.
  const wasOpenRef = useRef(false);
  useEffect(() => {
    if (isMobileMenuOpen) {
      wasOpenRef.current = true;
      // Defer to next tick so the dialog is visible/focusable.
      const id = window.setTimeout(() => {
        firstMobileLinkRef.current?.focus();
      }, 0);
      return () => window.clearTimeout(id);
    }
    // Only restore focus to toggle if menu was previously open
    // (avoids stealing focus on initial mount).
    if (wasOpenRef.current) {
      wasOpenRef.current = false;
      toggleButtonRef.current?.focus();
    }
  }, [isMobileMenuOpen]);

  // Focus trap: cycle Tab / Shift+Tab among focusable descendants.
  const handleDialogKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusables = dialog.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])'
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;
    if (event.shiftKey) {
      if (active === first) {
        event.preventDefault();
        last.focus();
      }
    } else {
      if (active === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav
        aria-label={ariaLabels.mainNavigation}
        className={`fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-[1400px] z-50 transition-all duration-700 ${
          isScrolled
            ? "glass-panel rounded-full py-4 px-8 bg-noise"
            : "py-8 px-0 border-transparent bg-transparent"
        }`}
      >
        <div className="flex justify-between items-center">
          <Link
            href={`/${lang}`}
            className="text-xs font-bold font-montserrat tracking-[0.3em] mix-blend-difference z-50 animate-fade-up delay-0 hover:scale-105 active:scale-95 transition-all duration-300 inline-block"
            aria-label={ariaLabels.home}
          >
            {BRAND.NAME}
          </Link>

          {/* Desktop Navigation */}
          <div
            className={`hidden md:flex gap-12 items-center text-[10px] font-mono tracking-widest uppercase mix-blend-difference transition-all duration-500 animate-fade-up delay-200 ${
              isScrolled ? "text-gray-200" : "text-gray-400"
            }`}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                className="hover:text-white transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-2 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
            <Link
              href={contactHref}
              aria-current={pathname === contactHref ? "page" : undefined}
              className="px-5 py-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all duration-300"
              aria-label={ariaLabels.contact}
            >
              {navLabels.contact}
            </Link>
            <LanguageSwitcher isScrolled={isScrolled} />
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={toggleButtonRef}
            type="button"
            className="md:hidden inline-flex h-11 w-11 items-center justify-center text-white z-50"
            onClick={onToggleMobileMenu}
            aria-label={
              isMobileMenuOpen ? ariaLabels.closeMenu : ariaLabels.openMenu
            }
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation-menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay (always rendered to keep aria-controls valid) */}
      <div
        ref={dialogRef}
        id="mobile-navigation-menu"
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabels.mobileNavigation}
        aria-hidden={!isMobileMenuOpen}
        hidden={!isMobileMenuOpen}
        onKeyDown={handleDialogKeyDown}
        className="fixed inset-0 z-40 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center space-y-8 md:hidden"
      >
        {navLinks.map((link, index) => (
          <Link
            key={link.href}
            href={link.href}
            ref={index === 0 ? firstMobileLinkRef : undefined}
            aria-current={pathname === link.href ? "page" : undefined}
            onClick={onCloseMobileMenu}
            className="text-3xl font-light"
          >
            {link.label}
          </Link>
        ))}
        <Link
          href={contactHref}
          aria-current={pathname === contactHref ? "page" : undefined}
          onClick={onCloseMobileMenu}
          className="text-3xl font-light"
        >
          {navLabels.contact}
        </Link>
        <div className="pt-4">
          <LanguageSwitcher isScrolled={true} />
        </div>
      </div>
    </>
  );
};

export default Navigation;
