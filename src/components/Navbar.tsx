'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { FaLock } from 'react-icons/fa'; // İkonu ekledik

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const navLinks = [
        { name: 'Ana Sayfa', href: '/' },
        { name: 'Projeler', href: '/projects' },
        { name: 'Blog', href: '/blog' },
        { name: 'Hakkımda', href: '/about' },
        { name: 'İletişim', href: '/contact' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-20">

                    <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition">
                        Metehan.dev
                    </Link>

                    {/* Masaüstü Menü */}
                    <div className="hidden md:flex items-center gap-2">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;

                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300
                                    ${isActive
                                            ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-105'
                                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                                        }
                                  `}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}

                        {/* 👇 Müşteri Giriş Butonu (Masaüstü) */}
                        <Link
                            href="/portal"
                            className="ml-4 flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-full text-sm font-medium transition border border-gray-700 hover:border-gray-500"
                        >
                            <FaLock size={12} />
                            Projem
                        </Link>
                    </div>

                    {/* Mobil Menü Butonu */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition"
                    >
                        {isOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobil Menü */}
                {isOpen && (
                    <div className="md:hidden py-4 border-t border-gray-800 animate-fadeIn">
                        <div className="flex flex-col gap-2">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`block px-4 py-3 rounded-lg text-base font-medium transition
                                      ${isActive
                                                ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }
                                    `}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}

                            {/* 👇 Müşteri Giriş Butonu (Mobil) */}
                            <Link
                                href="/portal"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-base font-medium bg-gray-800 text-white border border-gray-700 hover:bg-gray-700 transition mt-2"
                            >
                                <FaLock size={14} />
                                Projem (Müşteri Girişi)
                            </Link>
                        </div>
                    </div>
                )}

            </div>
        </nav>
    );
}