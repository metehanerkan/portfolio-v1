'use client';

import { useActionState } from 'react'; // Veya useState ile manuel handle
import { loginClient } from './actions';
import { FaRocket, FaLock, FaArrowRight } from 'react-icons/fa';
import { useState } from 'react';

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
        <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">

            {/* Arka Plan Efektleri */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 p-40 bg-purple-600/10 rounded-full blur-3xl"></div>

            <div className="bg-[#0f1115] border border-gray-800 p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-md relative z-10">

                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-gray-900 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-800 shadow-lg rotate-3 hover:rotate-6 transition duration-500">
                        <FaRocket className="text-4xl text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Müşteri Paneli</h1>
                    <p className="text-gray-500 text-sm">Proje durumunu takip etmek için sana özel kodu gir.</p>
                </div>

                <form action={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block ml-1">Erişim Kodu</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FaLock className="text-gray-600 group-focus-within:text-blue-500 transition" />
                            </div>
                            <input
                                name="accessCode"
                                type="text"
                                placeholder="Örn: PRJ-123"
                                className="w-full bg-black border border-gray-800 text-white pl-11 pr-4 py-4 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition font-mono tracking-wider placeholder:tracking-normal"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs text-center font-bold animate-pulse">
                            {error}
                        </div>
                    )}

                    <button
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl transition transform active:scale-[0.98] shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Giriş Yapılıyor...' : <>Panele Git <FaArrowRight className="group-hover:translate-x-1 transition" /></>}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-xs text-gray-600">
                        Kodunu unuttuysan lütfen <a href="mailto:iletisim@seninsiten.com" className="text-blue-500 hover:underline">iletişime geç</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}