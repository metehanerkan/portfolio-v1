'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { FaLock } from 'react-icons/fa';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Ana Sayfa', href: '/' },
        { name: 'Projeler', href: '/projects' },
        { name: 'Blog', href: '/blog' },
        { name: 'Hakkımda', href: '/about' },
        { name: 'İletişim', href: '/contact' }


    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out border-b ${scrolled || isOpen
            ? 'h-20 bg-[#030014]/70 backdrop-blur-md border-purple-500/20 shadow-[0_4px_30px_-10px_rgba(88,28,135,0.3)]' // SCROLLED: Daha şeffaf ve buzlu
            : 'h-24 bg-gradient-to-b from-black/60 to-transparent border-transparent' // TOP: Hafif gölgeli
            }`}>
            <div className="max-w-7xl mx-auto px-6 h-full">
                <div className="flex items-center justify-between h-full transition-all duration-300">

                    {/* LOGO */}
                    <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent hover:opacity-80 transition]">
                        Metehan.dev
                    </Link>

                    {/* MASAÜSTÜ MENÜ */}
                    <div className="hidden md:flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        // "text-sm" yaptık (Eski boyut)
                                        className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg relative group flex flex-col items-center justify-center
                                            ${isActive ? 'text-white' : 'text-purple-100/70 hover:text-white'}
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

                        {/* BUTON */}
                        <Link
                            href="/portal"
                            className="flex items-center gap-2 bg-white/10 border border-purple-500/30 hover:border-purple-400 hover:bg-purple-600/20 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 group backdrop-blur-md"
                        >
                            <FaLock size={12} className="text-purple-300 group-hover:text-white transition-colors" />
                            Projem
                        </Link>
                    </div>

                    {/* MOBİL BUTON */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`md:hidden p-2 rounded-lg transition duration-300 ${isOpen ? 'text-white bg-purple-500/20' : 'text-purple-200 hover:text-white hover:bg-white/10'}`}
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

                {/* MOBİL MENÜ İÇERİK */}
                {isOpen && (
                    <div className="md:hidden py-4 border-t border-purple-500/20 bg-[#030014]/90 backdrop-blur-xl animate-fadeIn px-4 rounded-b-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.9)]">
                        <div className="flex flex-col gap-2">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className={`block px-4 py-3 rounded-xl text-base font-medium transition ${isActive ? 'bg-purple-600/20 text-white border border-purple-500/30' : 'text-purple-200/70 hover:text-white hover:bg-white/5'}`}>
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
                                Projem (Giriş)
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}