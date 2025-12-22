'use client';

import { useState } from 'react';
import { MdEmail, MdLocationOn } from "react-icons/md"; // Material Design İkonları
import { FaLinkedin } from "react-icons/fa"; // FontAwesome LinkedIn İkonu

export default function ContactPage() {
    // Form verilerini tutacak State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    // Gönderim durumunu tutacak State (Yükleniyor, Başarılı, Hata)
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    // Kullanıcı inputlara yazdıkça state'i güncelleyen fonksiyon
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Gönder butonuna basılınca çalışacak fonksiyon
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Sayfanın yenilenmesini engelle
        setStatus('loading');

        // Simülasyon: Sanki backend'e gidiyormuş gibi 2 saniye bekle
        setTimeout(() => {
            console.log("Form Verisi:", formData); // Konsola yazdır (Backend yerine)
            setStatus('success');
            setFormData({ name: '', email: '', message: '' }); // Formu temizle
        }, 2000);
    };

    return (
        <main className="min-h-screen bg-black text-white pt-24 px-6 flex items-center justify-center">
            <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12">

                <div className="flex flex-col justify-center space-y-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
                            Bir Merhaba De
                        </h1>
                        <p className="text-gray-400 text-lg">
                            Proje fikirlerin, iş tekliflerin veya sadece tanışmak için bana yazabilirsin.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4 group">
                            <div className="w-12 h-12 bg-gray-900 border border-gray-800 rounded-full flex items-center justify-center group-hover:border-blue-500 group-hover:bg-blue-500/10 transition duration-300">
                                <MdEmail className="text-2xl text-blue-400 group-hover:scale-110 transition" />
                            </div>
                            <a href="mailto:metehanerkan08@gmail.com" className="text-gray-300 hover:text-white transition">
                                metehanerkan08@gmail.com
                            </a>
                        </div>

                        <div className="flex items-center gap-4 group">
                            <div className="w-12 h-12 bg-gray-900 border border-gray-800 rounded-full flex items-center justify-center group-hover:border-blue-600 group-hover:bg-blue-600/10 transition duration-300">
                                <FaLinkedin className="text-2xl text-[#0077b5] group-hover:scale-110 transition" />
                            </div>
                            <a
                                href="https://www.linkedin.com/in/metehan-erkan-b9a52a1b8/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-300 hover:text-white transition"
                            >
                                Linkedin Profilim
                            </a>
                        </div>
                        <div className="flex items-center gap-4 group">
                            <div className="w-12 h-12 bg-gray-900 border border-gray-800 rounded-full flex items-center justify-center group-hover:border-purple-500 group-hover:bg-purple-500/10 transition duration-300">
                                <MdLocationOn className="text-2xl text-purple-400 group-hover:scale-110 transition" />
                            </div>
                            <span className="text-gray-300">Afyonkarahisar, Türkiye</span>
                        </div>
                    </div>
                </div>

                {/* SAĞ TARAF: Form */}
                <div className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800 backdrop-blur-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* İsim */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Adın Soyadın</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                                placeholder="Örn: Metehan Erkan"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">E-posta Adresin</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                                placeholder="ornek@email.com"
                            />
                        </div>

                        {/* Mesaj */}
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">Mesajın</label>
                            <textarea
                                id="message"
                                name="message"
                                required
                                rows={4}
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition resize-none"
                                placeholder="Mesajınızı yazınız..."
                            ></textarea>
                        </div>

                        {/* Buton */}
                        <button
                            type="submit"
                            disabled={status === 'loading' || status === 'success'}
                            className={`w-full py-4 rounded-lg font-bold transition flex items-center justify-center gap-2
                                ${status === 'success' ? 'bg-green-600 text-white cursor-default' : 'bg-white text-black hover:bg-gray-200'}
                                ${status === 'loading' ? 'opacity-70 cursor-wait' : ''}
                            `}
                        >
                            {status === 'loading' && (
                                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                            )}
                            {status === 'idle' && 'Gönder'}
                            {status === 'loading' && 'Gönderiliyor...'}
                            {status === 'success' && 'Mesaj İletildi!'}
                        </button>

                    </form>
                </div>

            </div>
        </main>
    );
}