'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { FaLock } from 'react-icons/fa';
import { Locale, Dictionary } from '@/dictionaries';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';

interface NavbarProps {
    lang: Locale;
    dict: Dictionary['nav'];
}

export default function Navbar({ lang, dict }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 100); // 100px threshold for smoother start
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: dict.home, href: `/${lang}` },
        { name: dict.projects, href: `/${lang}/projects` },
        { name: dict.blog, href: `/${lang}/blog` },
        { name: dict.about, href: `/${lang}/about` },
        { name: dict.contact, href: `/${lang}/contact` }
    ];

    return (
        <nav className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) ${scrolled
            ? 'top-6 w-[90%] sm:w-[85%] md:w-[950px] lg:w-[1150px] rounded-full h-16 bg-white/5 dark:bg-black/5 backdrop-blur-md border border-white/40 dark:border-white/20 shadow-lg shadow-purple-500/5 text-black dark:text-white justify-center items-center'
            : 'top-0 w-full h-24 bg-transparent border-none'
            }`}>
            <div className={`mx-auto h-full w-full transition-all duration-1000 max-w-7xl px-6`}>
                <div className="flex items-center justify-between h-full w-full gap-4 whitespace-nowrap">

                    {/* LOGO */}
                    <Link href={`/${lang}`} className="text-2xl font-bold bg-gradient-to-r from-purple-700 via-purple-500 to-purple-700 dark:from-white dark:via-purple-200 dark:to-purple-400 bg-clip-text text-transparent hover:opacity-80 transition]">
                        Metehan.dev
                    </Link>

                    {/* MASAÜSTÜ MENÜ */}
                    <div className="hidden md:flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            {navLinks.map((link) => {
                                // Active check: tam eşleşme veya alt yol (ancak ana sayfa hariç)
                                const isActive = pathname === link.href || (link.href !== `/${lang}` && pathname.startsWith(link.href));
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg relative group flex flex-col items-center justify-center
                                            ${isActive ? 'text-purple-600 dark:text-white' : 'text-gray-600 dark:text-purple-100/70 hover:text-purple-500 dark:hover:text-white'}
                                        `}
                                    >
                                        <span className="relative z-10 drop-shadow-sm">{link.name}</span>

                                        {/* Alt Çizgi Animasyonu */}
                                        <span className={`absolute bottom-1 h-[2px] bg-purple-400 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(168,85,247,1)]
                                            ${isActive ? 'w-1/2 opacity-100' : 'w-0 opacity-0 group-hover:w-1/3 group-hover:opacity-60'}
                                        `}></span>
                                    </Link>
                                );
                            })}
                        </div>

                        <LanguageSwitcher currentLang={lang} />
                        <ThemeToggle />

                        {/* BUTON */}
                        <Link
                            href="/portal"
                            className="flex items-center gap-2 bg-purple-500/10 dark:bg-white/10 border border-purple-500/20 dark:border-purple-500/30 hover:border-purple-400 hover:bg-purple-600/20 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] text-purple-700 dark:text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 group backdrop-blur-md"
                        >
                            <FaLock size={12} className="text-purple-500 dark:text-purple-300 group-hover:text-purple-700 dark:group-hover:text-white transition-colors" />
                            {dict.portal}
                        </Link>
                    </div>

                    {/* MOBİL VE DİL */}
                    <div className="flex items-center gap-4 md:hidden">
                        <LanguageSwitcher currentLang={lang} />
                        <ThemeToggle />

                        {/* MOBİL BUTON */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`p-2 rounded-lg transition duration-300 ${isOpen ? 'text-white bg-purple-500/20' : 'text-purple-200 hover:text-white hover:bg-white/10'}`}
                        >
                            {isOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 drop-shadow-md">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 drop-shadow-md">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* MOBİL MENÜ İÇERİK */}
                {isOpen && (
                    <div className="md:hidden py-4 border-t border-purple-500/20 bg-white/95 dark:bg-[#030014]/90 backdrop-blur-xl animate-fadeIn px-4 rounded-b-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.9)]">
                        <div className="flex flex-col gap-2">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-xl text-base font-medium transition ${isActive ? 'bg-purple-600/20 text-purple-700 dark:text-white border border-purple-500/30' : 'text-gray-600 dark:text-purple-200/70 hover:text-purple-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                                        {link.name}
                                    </Link>
                                );
                            })}
                            <Link
                                href="/portal"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-base font-medium bg-gradient-to-r from-purple-900/50 to-purple-800/50 text-white border border-purple-500/30 hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition mt-2"
                            >
                                <FaLock size={14} className="text-purple-300" />
                                {dict.portal}
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}