'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaCheck, FaTools, FaPlus, FaBan, FaPaperPlane, FaTimes,
    FaExclamationTriangle
} from 'react-icons/fa';
import { submitProjectRequest } from './actions';

export default function ProjectStatusView({ project }: { project: any }) {
    const [activeModal, setActiveModal] = useState<'new_feature' | 'change' | 'cancel' | 'bug' | null>(null);
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        formData.set('code', project.accessCode);
        formData.set('type', activeModal || 'general');

        await submitProjectRequest(formData);

        setLoading(false);
        setSuccessMsg('Talebin başarıyla iletildi! En kısa sürede dönüş yapacağım.');
        setActiveModal(null);
        setTimeout(() => setSuccessMsg(''), 5000);
    };

    // İlerleme yüzdesine göre renk
    const getProgressColor = () => {
        if (project.progress < 30) return 'text-blue-500';
        if (project.progress < 70) return 'text-purple-500';
        return 'text-green-500';
    };

    const getProgressBarColor = () => {
        if (project.progress < 30) return 'bg-blue-600';
        if (project.progress < 70) return 'bg-purple-600';
        return 'bg-green-600';
    };

    return (
        <div className="space-y-8">

            {/* 1. ÜST BİLGİ KARTI (STATUS) */}
            <div className="bg-[#0f1115] border border-gray-800 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
                <div className={`absolute top-0 left-0 w-full h-1 ${getProgressBarColor()}`}></div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="animate-pulse w-3 h-3 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                            <span className="text-green-500 text-xs font-bold uppercase tracking-widest">Canlı Geliştirme Süreci</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-1">{project.name}</h2>
                        <p className="text-gray-400 text-sm">Şu anki Aşama: <span className="text-white font-medium">{project.currentStage || 'Başlangıç Aşaması'}</span></p>
                    </div>

                    <div className="text-center md:text-right">
                        <span className={`text-5xl font-mono font-bold ${getProgressColor()}`}>%{project.progress}</span>
                        <p className="text-gray-500 text-xs uppercase tracking-wider mt-1">Tamamlanma Oranı</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-900 rounded-full h-4 mt-8 border border-gray-800 overflow-hidden relative">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className={`h-full ${getProgressBarColor()} relative`}
                    >
                        <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                    </motion.div>
                </div>
            </div>

            {/* 2. KONTROL PANELİ (GRID BUTONLAR) */}
            <div>
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <FaTools className="text-gray-500" /> Talep & Yönetim
                </h3>

                {successMsg && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm flex items-center gap-2">
                        <FaCheck /> {successMsg}
                    </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Buton 1: Yeni Özellik */}
                    <button onClick={() => setActiveModal('new_feature')} className="group bg-gray-900 border border-gray-800 p-6 rounded-2xl hover:border-blue-500/50 transition text-left relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition transform group-hover:scale-110"><FaPlus size={40} className="text-blue-500" /></div>
                        <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500 mb-4 group-hover:bg-blue-500 group-hover:text-white transition"><FaPlus /></div>
                        <h4 className="font-bold text-white mb-1">Yeni Özellik İste</h4>
                        <p className="text-gray-500 text-xs">Projeye eklemek istediğin yeni modüller mi var?</p>
                    </button>

                    {/* Buton 2: Değişiklik / Hata */}
                    <button onClick={() => setActiveModal('change')} className="group bg-gray-900 border border-gray-800 p-6 rounded-2xl hover:border-purple-500/50 transition text-left relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition transform group-hover:scale-110"><FaTools size={40} className="text-purple-500" /></div>
                        <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-500 mb-4 group-hover:bg-purple-500 group-hover:text-white transition"><FaTools /></div>
                        <h4 className="font-bold text-white mb-1">Kapsam Değişikliği</h4>
                        <p className="text-gray-500 text-xs">Mevcut özelliklerde değişiklik veya düzenleme.</p>
                    </button>

                    {/* Buton 3: İptal / Sorun */}
                    <button onClick={() => setActiveModal('cancel')} className="group bg-gray-900 border border-gray-800 p-6 rounded-2xl hover:border-red-500/50 transition text-left relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition transform group-hover:scale-110"><FaExclamationTriangle size={40} className="text-red-500" /></div>
                        <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center text-red-500 mb-4 group-hover:bg-red-500 group-hover:text-white transition"><FaBan /></div>
                        <h4 className="font-bold text-white mb-1">İptal / Sorun Bildir</h4>
                        <p className="text-gray-500 text-xs">Projeyi durdurma veya acil durum bildirimi.</p>
                    </button>
                </div>
            </div>

            {/* --- ORTAK MODAL YAPISI --- */}
            <AnimatePresence>
                {activeModal && (
                    <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveModal(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 50 }}
                            className="bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl relative z-10 max-w-lg w-full overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-950">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    {activeModal === 'new_feature' && <><FaPlus className="text-blue-500" /> Yeni Özellik İste</>}
                                    {activeModal === 'change' && <><FaTools className="text-purple-500" /> Değişiklik Talebi</>}
                                    {activeModal === 'cancel' && <><FaExclamationTriangle className="text-red-500" /> İptal / Sorun</>}
                                </h3>
                                <button onClick={() => setActiveModal(null)} className="text-gray-500 hover:text-white"><FaTimes /></button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-8">
                                <form action={handleSubmit} className="space-y-4">
                                    {activeModal === 'cancel' && (
                                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm mb-4">
                                            ⚠️ <strong>Dikkat:</strong> İptal talebi gönderdiğinde süreç durdurulabilir. Lütfen sebebini detaylıca açıkla.
                                        </div>
                                    )}

                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                                            {activeModal === 'new_feature' ? 'İstediğin Özellik Nedir?' :
                                                activeModal === 'change' ? 'Neyi Değiştirmek İstiyorsun?' :
                                                    'İptal Sebebi / Sorun Nedir?'}
                                        </label>
                                        <textarea
                                            name="message"
                                            rows={5}
                                            placeholder="Talebinizi detaylı bir şekilde açıklayın..."
                                            className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none resize-none text-sm leading-relaxed"
                                            required
                                        />
                                    </div>

                                    <button disabled={loading} className={`w-full py-4 rounded-xl text-white font-bold transition shadow-lg flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50 disabled:grayscale
                                        ${activeModal === 'new_feature' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-900/20' :
                                            activeModal === 'change' ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-900/20' :
                                                'bg-red-600 hover:bg-red-700 shadow-red-900/20'}`}>
                                        {loading ? 'Gönderiliyor...' : <><FaPaperPlane /> Talebi Gönder</>}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}