'use client';

import { useState } from 'react';
import { saveProjectBrief } from './actions';
import { FaPaperPlane } from 'react-icons/fa';

interface BriefFormProps {
    accessCode: string;
}

export default function BriefForm({ accessCode }: BriefFormProps) {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        // Server Action'ı çağır
        await saveProjectBrief(formData);
        // İşlem bitince loading kapanır (Sayfa yenilendiği için gerek kalmayabilir ama güvenli olsun)
        setLoading(false);
    };

    return (
        <form action={handleSubmit} className="space-y-8">
            <input type="hidden" name="code" value={accessCode} />

            {/* Bütçe Seçimi */}
            <div className="space-y-3">
                <label className="text-white font-bold flex items-center gap-2">
                    <div className="w-1 h-4 bg-blue-500 rounded-full"></div> Tahmini Bütçen Nedir?
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['10.000₺ - 25.000₺', '25.000₺ - 50.000₺', '50.000₺ ve üzeri'].map((opt) => (
                        <label key={opt} className="cursor-pointer group">
                            <input type="radio" name="budget" value={opt} className="peer hidden" required />
                            <div className="p-4 rounded-xl bg-gray-950 border border-gray-800 peer-checked:border-blue-500 peer-checked:bg-blue-900/10 peer-checked:text-blue-400 transition group-hover:border-gray-600 text-center text-gray-300">
                                {opt}
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* Teslim Tarihi */}
            <div className="space-y-3">
                <label className="text-white font-bold flex items-center gap-2">
                    <div className="w-1 h-4 bg-blue-500 rounded-full"></div> Ne Zaman Teslim İstersin?
                </label>
                <select name="deadline" className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none" required>
                    <option value="" disabled selected>Bir seçenek belirle...</option>
                    <option value="Acil (1-2 Hafta)">🚀 Çok Acil (1-2 Hafta)</option>
                    <option value="Normal (1 Ay)">📅 Normal (1 Ay)</option>
                    <option value="Esnek (2-3 Ay)">☕ Esnek (2-3 Ay)</option>
                </select>
            </div>

            {/* Özellikler */}
            <div className="space-y-3">
                <label className="text-white font-bold flex items-center gap-2">
                    <div className="w-1 h-4 bg-blue-500 rounded-full"></div> Hangi Özellikler Olsun?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['Admin Paneli', 'Ödeme Sistemi', 'Blog Sistemi', 'Karanlık Mod', 'Çoklu Dil', 'SEO Optimizasyonu', 'Mobil Uygulama'].map((feat) => (
                        <label key={feat} className="flex items-center gap-3 p-3 bg-gray-950 rounded-lg border border-gray-800 cursor-pointer hover:bg-gray-800 transition">
                            <input type="checkbox" name="features" value={feat} className="w-5 h-5 rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-900" />
                            <span className="text-gray-300 text-sm">{feat}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Notlar */}
            <div className="space-y-3">
                <label className="text-white font-bold flex items-center gap-2">
                    <div className="w-1 h-4 bg-blue-500 rounded-full"></div> Eklemek İstediklerin
                </label>
                <textarea name="notes" rows={4} placeholder="Varsa örnek siteler veya özel isteklerin..." className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:outline-none resize-none"></textarea>
            </div>

            <button
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transform hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <span className="animate-pulse">Gönderiliyor...</span>
                ) : (
                    <>
                        <FaPaperPlane /> Detayları Gönder ve Teklif İste
                    </>
                )}
            </button>
        </form>
    );
}