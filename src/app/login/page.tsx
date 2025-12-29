'use client';

import { useState } from 'react';
// 👇 HATA BURADAYDI: 'login' yerine 'loginAdmin' yaptık
import { loginAdmin } from './actions';
import { FaLock, FaArrowRight } from 'react-icons/fa';

export default function LoginPage() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);

        // 👇 FONKSİYON İSMİ GÜNCELLENDİ
        const result = await loginAdmin(formData);

        // Eğer action içinde redirect çalışırsa burası çalışmaz, ama hata dönerse yakalarız.
        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-full bg-black flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-600/30">
                        <FaLock size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Admin Girişi</h1>
                    <p className="text-gray-400 text-sm mt-2">Yönetici paneline erişmek için şifrenizi girin.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="password"
                            name="password"
                            placeholder="Şifre"
                            className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-4 text-white focus:border-blue-500 focus:outline-none transition placeholder:text-gray-700"
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Giriş Yapılıyor...' : <>Giriş Yap <FaArrowRight /></>}
                    </button>
                </form>
            </div>
        </div>
    );
}