'use client';

import { useState } from 'react';
import { sendMessage } from './actions';
import { FaPaperPlane, FaEnvelope, FaMapMarkerAlt, FaLinkedin, FaGithub } from 'react-icons/fa';
import { Dictionary } from '@/dictionaries';

export default function ContactClient({ dict, settings }: { dict: Dictionary['contact'], settings?: any }) {
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
        <main className="min-h-screen bg-[#030014] text-white pt-32 px-6 pb-20 relative overflow-hidden">

            {/* --- ARKA PLAN IŞIK EFEKTLERİ --- */}
            <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-purple-900/20 via-[#1a0b2e]/40 to-transparent blur-[80px] opacity-90" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[128px]"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[128px]"></div>
            </div>

            {/* --- İÇERİK ALANI --- */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">

                {/* SOL TARAF */}
                <div className="space-y-10">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent mb-6 drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                            {dict.title}
                        </h1>
                        <p className="text-purple-200/60 text-lg leading-relaxed">
                            {dict.desc}
                        </p>
                    </div>

                    <div className="space-y-8">
                        {/* E-POSTA KUTUSU */}
                        <div className="flex items-center gap-6 group">
                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-purple-500/50 group-hover:bg-purple-500/10 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.2)] group-hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                                <FaEnvelope className="text-2xl text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <div>
                                <p className="text-sm text-purple-200/50 uppercase tracking-wide font-semibold mb-1">{dict.emailLabel}</p>
                                <a href={`mailto:${settings?.contactEmail || "metehanerkan08@gmail.com"}`} className="font-medium text-white hover:text-purple-300 transition-colors text-lg">
                                    {settings?.contactEmail || "metehanerkan08@gmail.com"}
                                </a>
                            </div>
                        </div>

                        {/* KONUM KUTUSU */}
                        <div className="flex items-center gap-6 group">
                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-indigo-500/50 group-hover:bg-indigo-500/10 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.2)] group-hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                                <FaMapMarkerAlt className="text-2xl text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
                            </div>
                            <div>
                                <p className="text-sm text-purple-200/50 uppercase tracking-wide font-semibold mb-1">{dict.locationLabel}</p>
                                <p className="font-medium text-white text-lg">{settings?.contactAddress || dict.locationValue}</p>
                            </div>
                        </div>
                    </div>

                    {/* Sosyal Medya */}
                    <div className="pt-8 border-t border-white/10">
                        <p className="text-sm text-purple-200/50 mb-4 font-semibold uppercase tracking-wide">{dict.socialLabel}</p>
                        <div className="flex gap-4">
                            <a href={settings?.socialLinkedin || "https://www.linkedin.com/in/metehan-erkan-b9a52a1b8/"} target="_blank" className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-purple-200/70 border border-white/10 hover:bg-[#0077b5] hover:border-[#0077b5] hover:text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"><FaLinkedin size={24} /></a>
                            <a href={settings?.socialGithub || "https://github.com/metehanerkan"} target="_blank" className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-purple-200/70 border border-white/10 hover:bg-white hover:border-white hover:text-black transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"><FaGithub size={24} /></a>
                        </div>
                    </div>
                </div>

                {/* SAĞ TARAF: Form (Glassmorphism) */}
                <div className="bg-[#0a0a0a]/40 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-white/10 shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] relative overflow-hidden group">

                    {/* Form Üstü Işıltı */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {success ? (
                        <div className="h-[450px] flex flex-col items-center justify-center text-center animate-fadeIn">
                            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                                <FaPaperPlane className="text-5xl text-green-400" />
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-3">{dict.successTitle}</h3>
                            <p className="text-purple-200/60 text-lg">{dict.successDesc}</p>
                            <button onClick={() => setSuccess(false)} className="mt-8 px-6 py-2 rounded-full border border-white/10 hover:bg-white/5 text-sm text-purple-300 transition-colors">{dict.newMessageBtn}</button>
                        </div>
                    ) : (
                        <form id="contact-form" action={handleSubmit} className="space-y-6">
                            <h3 className="text-2xl font-bold text-white mb-8 border-b border-white/5 pb-4">{dict.formTitle}</h3>
                            <input type="text" name="website" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

                            <div className="space-y-2 group/input">
                                <label className="text-xs font-bold text-purple-200/50 uppercase tracking-wider ml-1 group-focus-within/input:text-purple-400 transition-colors">{dict.nameLabel}</label>
                                <input name="name" type="text" placeholder={dict.namePlaceholder} required
                                    className="w-full bg-[#030014]/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-purple-200/20 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all duration-300 hover:border-white/20"
                                />
                            </div>

                            <div className="space-y-2 group/input">
                                <label className="text-xs font-bold text-purple-200/50 uppercase tracking-wider ml-1 group-focus-within/input:text-purple-400 transition-colors">{dict.emailInputLabel}</label>
                                <input name="email" type="email" placeholder={dict.emailPlaceholder} required
                                    className="w-full bg-[#030014]/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-purple-200/20 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all duration-300 hover:border-white/20"
                                />
                            </div>

                            <div className="space-y-2 group/input">
                                <label className="text-xs font-bold text-purple-200/50 uppercase tracking-wider ml-1 group-focus-within/input:text-purple-400 transition-colors">{dict.messageLabel}</label>
                                <textarea name="message" rows={5} placeholder={dict.messagePlaceholder} required
                                    className="w-full bg-[#030014]/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder-purple-200/20 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all duration-300 resize-none hover:border-white/20"
                                ></textarea>
                            </div>

                            <button disabled={loading} type="submit" className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 rounded-xl hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-300 transform hover:-translate-y-1 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 border border-white/10">
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        {dict.sendLoading}
                                    </span>
                                ) : (
                                    <>
                                        {dict.sendButton} <FaPaperPlane className="text-lg" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>

            </div>
        </main>
    );
}
