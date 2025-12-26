'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaLock, FaArrowRight } from 'react-icons/fa';
import { checkAccessCode } from '../portal/actions';

export default function PortalLoginPage() {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Kodu kontrol et (Server Action)
        const result = await checkAccessCode(code);

        if (result.success) {
            // Başarılıysa, kodu tarayıcıya kaydet (Cookie gibi) ve panele yönlendir
            // Güvenlik notu: Basitlik için URL parametresiyle taşıyacağız ama ileride cookie yapılabilir.
            router.push(`/portal/dashboard?code=${code}`);
        } else {
            setError('Geçersiz veya hatalı kod.');
            setLoading(false);
        }
    };

    return (
        <div className="h-screen bg-black flex items-center justify-center p-4 overflow-hidden -mt-20">
            <div className="w-full max-w-md bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-600/30">
                        <FaLock size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Müşteri Girişi</h1>
                    <p className="text-gray-400 text-sm mt-2">Size gönderilen proje kodunu giriniz.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            placeholder="Örn: A7B-9X2"
                            className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-4 text-center text-2xl tracking-widest text-white focus:border-blue-500 focus:outline-none transition uppercase placeholder:text-gray-700 font-mono"
                            maxLength={7}
                        />
                    </div>

                    {error && <p className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg">{error}</p>}

                    <button
                        disabled={loading || code.length < 3}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Kontrol Ediliyor...' : <>Panele Git <FaArrowRight /></>}
                    </button>
                </form>
            </div>
        </div>
    );
}