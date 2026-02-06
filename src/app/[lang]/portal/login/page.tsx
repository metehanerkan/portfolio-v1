'use client';

import { loginClient } from './actions';
import { FaRocket, FaLock, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { useState } from 'react';
import Link from 'next/link';

export default function ClientLoginPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        setError('');

        // Server action'ı çağır
        const result = await loginClient(formData);

        // Eğer server action bir obje döndürdüyse hata var demektir (redirect olmadıysa)
        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#030014] flex items-center justify-center p-4 relative overflow-hidden selection:bg-purple-500/30 transition-colors duration-300">

            {/* --- ARKA PLAN IŞIKLARI (Spotlight) --- */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
                {/* Üst Işık - Light mod için renk ayarlandı */}
                <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-purple-500/10 dark:bg-purple-600/20 rounded-full blur-[120px] opacity-60"></div>
                {/* Alt Sağ Işık */}
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-900/20 rounded-full blur-[100px]"></div>
            </div>

            {/* 👇 ANA SAYFAYA DÖN BUTONU */}
            <Link href="/" className="absolute top-8 left-8 text-gray-600 dark:text-purple-200/50 hover:text-purple-600 dark:hover:text-white flex items-center gap-2 transition-all duration-300 text-sm font-bold z-50 group hover:-translate-x-1">
                <FaArrowLeft className="group-hover:-translate-x-1 transition" /> Ana Sayfaya Dön
            </Link>

            {/* --- KART YAPISI (Glassmorphism) --- */}
            <div className="bg-white/70 dark:bg-[#0a0a0a]/60 backdrop-blur-xl border border-purple-500/10 dark:border-purple-500/20 p-8 md:p-12 rounded-3xl shadow-[0_0_50px_-10px_rgba(168,85,247,0.1)] dark:shadow-[0_0_50px_-10px_rgba(168,85,247,0.15)] w-full max-w-md relative z-10">

                {/* Kart Üstü Işıltı Çizgisi */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>

                <div className="text-center mb-10">
                    {/* İkon Kutusu */}
                    <div className="w-20 h-20 bg-purple-100 dark:bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-purple-200 dark:border-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.1)] dark:shadow-[0_0_20px_rgba(168,85,247,0.2)] rotate-3 hover:rotate-6 transition duration-500 group">
                        <FaRocket className="text-4xl text-purple-600 dark:text-purple-400 group-hover:text-purple-800 dark:group-hover:text-white transition-colors drop-shadow-md" />
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight drop-shadow-sm">
                        Müşteri Paneli
                    </h1>
                    <p className="text-gray-500 dark:text-purple-200/50 text-sm">
                        Proje durumunu takip etmek için sana özel kodu gir.
                    </p>
                </div>

                <form action={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-xs font-bold text-purple-600/70 dark:text-purple-300/70 uppercase mb-2 block ml-1 tracking-wider">Erişim Kodu</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FaLock className="text-purple-400 dark:text-purple-500/40 group-focus-within:text-purple-600 dark:group-focus-within:text-purple-400 transition" />
                            </div>
                            <input
                                name="accessCode"
                                type="text"
                                placeholder="Örn: PRJ-123"
                                className="w-full bg-gray-50 dark:bg-[#030014]/50 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white pl-11 pr-4 py-4 rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all duration-300 font-mono tracking-wider placeholder:tracking-normal placeholder:text-gray-400 dark:placeholder:text-gray-600 hover:border-purple-400/50 dark:hover:border-white/20"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg text-red-600 dark:text-red-300 text-xs text-center font-bold animate-pulse shadow-sm">
                            {error}
                        </div>
                    )}

                    <button
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl transition-all duration-300 transform active:scale-[0.98] shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] border border-transparent dark:border-white/10 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                Giriş Yapılıyor...
                            </span>
                        ) : (
                            <>Panele Git <FaArrowRight className="group-hover:translate-x-1 transition" /></>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-500 dark:text-purple-200/30">
                        Kodunu unuttuysan lütfen <a href="mailto:iletisim@metehan.dev" className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-white hover:underline transition-colors">iletişime geç</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}