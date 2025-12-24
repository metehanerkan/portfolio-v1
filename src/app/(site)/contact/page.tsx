'use client';

import { useState } from 'react';
import { sendMessage } from './actions';
import { FaPaperPlane, FaEnvelope, FaMapMarkerAlt, FaLinkedin, FaGithub } from 'react-icons/fa';

export default function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        const result = await sendMessage(formData);
        setLoading(false);

        if (result.success) {
            setSuccess(true);


            const form = document.getElementById('contact-form') as HTMLFormElement;
            form.reset();
        } else {
            alert(result.error || 'Mesaj gönderilemedi.');
        }
    }

    return (
        <main className="min-h-screen bg-black text-white pt-24 px-6 relative overflow-hidden">

            {/* Arka Plan Efektleri */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[128px] -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[128px] -z-10"></div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                {/* SOL TARA: İletişim Bilgileri */}
                <div className="space-y-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
                            Bir Merhaba De.
                        </h1>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            Proje fikirlerin, iş tekliflerin veya sadece tanışmak için bana yazabilirsin. En kısa zamanda geri dönüş yapacağım!
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4 text-gray-300 hover:text-white transition group">
                            <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center border border-gray-800 group-hover:border-blue-500 transition">
                                <FaEnvelope className="text-xl text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">E-posta</p>
                                <p className="font-medium">metehanerkan08@gmail.com</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-gray-300 hover:text-white transition group">
                            <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center border border-gray-800 group-hover:border-purple-500 transition">
                                <FaMapMarkerAlt className="text-xl text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Konum</p>
                                <p className="font-medium">Afyonkarahisar / Türkiye</p>
                            </div>
                        </div>
                    </div>

                    {/* Sosyal Medya */}
                    <div className="pt-8 border-t border-gray-900">
                        <p className="text-sm text-gray-500 mb-4">Sosyal Medya</p>
                        <div className="flex gap-4">
                            <a href="https://www.linkedin.com/in/metehan-erkan-b9a52a1b8/" target="_blank" className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition"><FaLinkedin size={20} /></a>

                            <a href="https://github.com/metehanerkan" target="_blank" className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-800 hover:text-white transition"><FaGithub size={20} /></a>
                        </div>
                    </div>
                </div>

                {/* SAĞ TARAF: Form */}
                <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-3xl border border-gray-800 shadow-2xl">

                    {success ? (
                        <div className="h-[400px] flex flex-col items-center justify-center text-center animate-fadeIn">
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                                <FaPaperPlane className="text-4xl text-green-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Mesajın İletildi! 🚀</h3>
                            <p className="text-gray-400">En kısa sürede sana geri dönüş yapacağım.</p>
                            <button onClick={() => setSuccess(false)} className="mt-6 text-sm text-green-400 hover:underline">Yeni mesaj gönder</button>
                        </div>
                    ) : (
                        <form id="contact-form" action={handleSubmit} className="space-y-6">
                            <h3 className="text-2xl font-bold text-white mb-6">Bana Ulaşın</h3>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 ml-1">Adın Soyadın</label>
                                <input name="name" type="text" placeholder="Örn: Metehan Erkan" required
                                    className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 ml-1">E-posta Adresin</label>
                                <input name="email" type="email" placeholder="ornek@email.com" required
                                    className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 ml-1">Mesajın</label>
                                <textarea name="message" rows={5} placeholder="Mesajınızı yazın..." required
                                    className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none transition resize-none"
                                ></textarea>
                            </div>

                            <button disabled={loading} type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl hover:opacity-90 transition transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                {loading ? 'Gönderiliyor...' : (
                                    <>Gönder <FaPaperPlane /></>
                                )}
                            </button>
                        </form>
                    )}
                </div>

            </div>
        </main>
    );
}