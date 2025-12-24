'use client';

import { useState } from 'react';
import { login } from './actions';
import { FaLock, FaArrowRight } from 'react-icons/fa';

export default function LoginPage() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError('');

        const result = await login(formData);

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
        // Başarılıysa zaten action içinde yönlendirme yapılacak
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">

            {/* Arka Plan Efekti */}
            <div className="absolute w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
            </div>

            <div className="w-full max-w-md bg-gray-900/80 backdrop-blur-xl border border-gray-800 p-8 rounded-3xl shadow-2xl relative z-10">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700">
                        <FaLock className="text-2xl text-blue-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Yönetici Girişi</h1>
                    <p className="text-gray-500 text-sm mt-2">Devam etmek için parolayı girin.</p>
                </div>

                <form action={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            name="password"
                            type="password"
                            placeholder="Parola"
                            required
                            className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:opacity-90 transition transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? 'Kontrol ediliyor...' : <>Giriş Yap <FaArrowRight /></>}
                    </button>
                </form>
            </div>
        </div>
    );
}