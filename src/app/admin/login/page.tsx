'use client';

import { useState } from 'react';
import { loginAdmin } from './actions';
import { FaLock, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

export default function LoginPage() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const result = await loginAdmin(formData);

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
    };

    return (
        // ✨ DÜZELTME: 'min-h-screen' yerine 'fixed inset-0 z-[999]' kullanıldı.
        // Bu sayede sayfa, global Navbar'ın üzerine biner ve o boşluk kaybolur.
        <div className="fixed inset-0 z-[999] bg-[#030014] flex items-center justify-center p-4 overflow-hidden selection:bg-purple-500/30">

            {/* --- ARKA PLAN IŞIKLARI --- */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Tepe Işığı */}
                <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-purple-900/50 via-[#1a0b2e]/30 to-transparent blur-[80px] opacity-80" />
                {/* Ana Işıklar */}
                <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] opacity-60"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[100px]"></div>
            </div>

            {/* ANA SAYFAYA DÖN BUTONU */}
            {/* ✨ DÜZELTME: 'top-8' yerine 'top-6' yaparak biraz daha yukarı aldık */}
            <Link href="/" className="absolute top-6 left-6 text-purple-200/50 hover:text-white flex items-center gap-2 transition-all duration-300 text-sm font-bold z-50 group hover:-translate-x-1">
                <FaArrowLeft className="group-hover:-translate-x-1 transition" /> Ana Sayfaya Dön
            </Link>

            {/* --- KART YAPISI --- */}
            <div className="w-full max-w-md bg-[#0a0a0a]/60 backdrop-blur-xl border border-purple-500/20 p-8 md:p-12 rounded-3xl shadow-[0_0_50px_-10px_rgba(168,85,247,0.15)] relative z-10">

                {/* Kart Üstü Işıltı Çizgisi */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>

                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.2)] rotate-3 hover:rotate-6 transition duration-500 group">
                        <FaLock className="text-3xl text-purple-400 group-hover:text-white transition-colors drop-shadow-md" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight drop-shadow-md">Admin Girişi</h1>
                    <p className="text-purple-200/50 text-sm">Yönetici paneline erişmek için şifrenizi girin.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="password"
                            name="password"
                            placeholder="Şifre"
                            className="w-full bg-[#030014]/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-purple-200/20 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all duration-300 hover:border-white/20"
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-sm text-center font-bold animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.1)]">
                            {error}
                        </div>
                    )}

                    <button
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl transition-all duration-300 transform active:scale-[0.98] shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] border border-white/10 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                Giriş Yapılıyor...
                            </span>
                        ) : (
                            <>Giriş Yap <FaArrowRight className="group-hover:translate-x-1 transition" /></>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}