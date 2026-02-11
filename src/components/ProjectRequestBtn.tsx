'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaRocket, FaTimes, FaPaperPlane, FaCheckCircle,
    FaLaptopCode, FaPaintBrush, FaPlus, FaTrash,
    FaFigma, FaLink, FaLightbulb, FaMagic, FaTag, FaArrowLeft
} from 'react-icons/fa';
import { sendMessage } from '@/app/[lang]/(site)/contact/actions';
import { usePathname } from 'next/navigation';

// --- VERİLER ---
const PLATFORM_OPTIONS = [
    { id: 'web', label: 'Web Sitesi' },
    { id: 'mobile', label: 'Mobil Uygulama' },
    { id: 'crm', label: 'Yönetim Paneli' },
    { id: 'ecommerce', label: 'E-Ticaret' }
];

const DESIGN_OPTIONS = [
    { id: 'ready', label: 'Tasarımım Hazır', icon: <FaFigma />, desc: 'Figma, Adobe XD vb.' },
    { id: 'redesign', label: 'Site Yenileme', icon: <FaLink />, desc: 'Mevcut site revizesi' },
    { id: 'scratch', label: 'Sıfırdan Tasarım', icon: <FaMagic />, desc: 'Bana özel çizilsin' },
    { id: 'template', label: 'Fark Etmez / Hazır', icon: <FaLightbulb />, desc: 'Hızlı ve ekonomik' }
];

// 'Diğer' seçeneği eklendi
const BUDGET_OPTIONS = ['10-30 Bin ₺', '30-75 Bin ₺', '75-150 Bin ₺', '150 Bin ₺ +', 'Diğer'];
const DEADLINE_OPTIONS = ['Çok Acil (1-2 Hft)', 'Normal (1 Ay)', 'Rahat (2-3 Ay)', 'Esnek', 'Diğer'];

const FEATURES_BY_PLATFORM: Record<string, string[]> = {
    web: ['SEO Uyumu', 'Blog/Haber', 'Çoklu Dil', 'Karanlık Mod'],
    mobile: ['Bildirim (Push)', 'Offline Mod', 'Konum/Harita', 'Uygulama İçi Satın Alma'],
    crm: ['Raporlama', 'Personel Yönetimi', 'Excel/PDF Çıktı', 'Yedekleme'],
    ecommerce: ['Sepet/Ödeme', 'Stok Takibi', 'Kargo Entegrasyonu', 'İndirim Kuponu'],
    default: ['Kullanıcı Girişi', 'Canlı Destek', 'Yapay Zeka']
};

export default function ProjectRequestBtn() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    // view state removed
    const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    // --- STATE ---
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
    const [selectedDesign, setSelectedDesign] = useState<string>('');

    // Bütçe ve Süre için hem seçim hem de özel input state'leri
    const [selectedBudget, setSelectedBudget] = useState<string>('');
    const [customBudget, setCustomBudget] = useState<string>('');

    const [selectedDeadline, setSelectedDeadline] = useState<string>('');
    const [customDeadline, setCustomDeadline] = useState<string>('');

    const [customFeatures, setCustomFeatures] = useState<string[]>([]);
    const [tempFeature, setTempFeature] = useState('');

    if (pathname.startsWith('/admin') || pathname.startsWith('/portal') || pathname.startsWith('/login')) return null;

    // Ana sayfa kontrolü (i18n desteği ile: /, /tr, /en vb.)
    const isHome = pathname === '/' || pathname.split('/').filter(Boolean).length <= 1;

    const availableFeatures = useMemo(() => {
        let features = new Set([...FEATURES_BY_PLATFORM.default]);
        selectedPlatforms.forEach(platId => {
            if (platId.includes('Web')) FEATURES_BY_PLATFORM.web.forEach(f => features.add(f));
            if (platId.includes('Mobil')) FEATURES_BY_PLATFORM.mobile.forEach(f => features.add(f));
            if (platId.includes('Yönetim')) FEATURES_BY_PLATFORM.crm.forEach(f => features.add(f));
            if (platId.includes('Ticaret')) FEATURES_BY_PLATFORM.ecommerce.forEach(f => features.add(f));
        });
        return Array.from(features);
    }, [selectedPlatforms]);

    const handlePlatformChange = (val: string) => {
        if (selectedPlatforms.includes(val)) setSelectedPlatforms(prev => prev.filter(p => p !== val));
        else setSelectedPlatforms(prev => [...prev, val]);
    };

    const addCustomFeature = () => {
        if (!tempFeature.trim()) return;
        if (!customFeatures.includes(tempFeature.trim())) setCustomFeatures(prev => [...prev, tempFeature.trim()]);
        setTempFeature('');
    };

    const handleSubmit = async (formData: FormData) => {
        setFormStatus('loading');

        // Tasarım Durumu
        formData.set('designState', DESIGN_OPTIONS.find(d => d.id === selectedDesign)?.label || 'Belirtilmedi');

        // 👇 KRİTİK DEĞİŞİKLİK: Eğer 'Diğer' seçildiyse custom input değerini gönder
        const finalBudget = selectedBudget === 'Diğer' ? customBudget : selectedBudget;
        const finalDeadline = selectedDeadline === 'Diğer' ? customDeadline : selectedDeadline;

        formData.set('budget', finalBudget);
        formData.set('deadline', finalDeadline);

        selectedPlatforms.forEach(p => formData.append('platforms', p));
        customFeatures.forEach(f => formData.append('customFeatures', f));

        const result = await sendMessage(formData);

        if (result.success) {
            setFormStatus('success');
            setTimeout(() => {
                setIsOpen(false);
                setFormStatus('idle');
                // Reset
                setSelectedPlatforms([]);
                setSelectedDesign('');
                setSelectedBudget('');
                setCustomBudget('');
                setSelectedDeadline('');
                setCustomDeadline('');
                setCustomFeatures([]);
            }, 4000);
        } else {
            setFormStatus('error');
            setTimeout(() => setFormStatus('idle'), 3000);
        }
    };

    return (
        <>
            <motion.button
                onClick={() => setIsOpen(true)}
                initial={{ y: 0 }}
                animate={{
                    y: [0, -15, 0], // Daha yumuşak süzülme
                    boxShadow: [
                        "0px 5px 15px rgba(37, 99, 235, 0.3)",
                        "0px 10px 25px rgba(147, 51, 234, 0.4)",
                        "0px 5px 15px rgba(236, 72, 153, 0.3)"
                    ]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatType: "loop"
                }}
                whileHover={{ scale: 1.05, rotate: isHome ? 0 : 5 }}
                whileTap={{ scale: 0.95 }}
                className={`fixed bottom-6 left-6 z-[60] flex items-center bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-xl border border-white/20 backdrop-blur-md group transition-all duration-300
    ${isHome ? 'px-3.5 py-2.5 md:px-5 md:py-3 rounded-full gap-2' : 'w-10 h-10 md:w-12 md:h-12 justify-center rounded-full'}`}
            >
                {/* Glow Effect Layer */}
                <div className="absolute inset-0 rounded-full bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {isHome && (
                    <span className="font-extrabold tracking-wide whitespace-nowrap drop-shadow-md text-[10px] md:text-xs relative z-10">
                        Bir Fikrim Var
                    </span>
                )}

                {/* İkon Arkası */}
                <div className={`${isHome ? 'bg-white/20 p-2 rounded-full border border-white/20' : ''} relative z-10`}>
                    <FaRocket className={`transition-transform duration-300 drop-shadow-md ${isHome ? 'text-lg md:text-xl text-white' : 'text-xl md:text-2xl text-white'}`} />
                </div>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-xl transition-all" />

                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 30 }}
                            className="relative w-full max-w-6xl bg-white dark:bg-[#0f1115] border border-gray-200 dark:border-gray-800 rounded-3xl shadow-2xl shadow-blue-900/20 z-10 overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="overflow-y-auto custom-scrollbar p-6 md:p-10">
                                <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 z-20 text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-800 p-2 rounded-full transition hover:bg-red-500/10 hover:text-red-500 dark:hover:bg-red-500/20 dark:hover:text-red-400"><FaTimes /></button>

                                {formStatus === 'success' ? (
                                    <div className="flex flex-col items-center justify-center py-24 text-center">
                                        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.4)] animate-bounce"><FaCheckCircle className="text-5xl text-white" /></div>
                                        <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Harika, Başvurunu Aldım! 🚀</h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-xl max-w-lg">Projenin detaylarını hemen inceleyip, sana özel yol haritası ve teklifimi ileteceğim.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-8 border-b border-gray-200 dark:border-gray-800 pb-6 flex justify-between items-start">
                                            <div>
                                                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-3 flex items-center gap-3">
                                                    <FaRocket className="text-blue-600 dark:text-blue-500" /> Proje Sihirbazı
                                                </h2>
                                                <p className="text-gray-600 dark:text-gray-400 text-lg">Aklındaki projeyi adım adım anlat, gerisini bana bırak.</p>
                                            </div>
                                        </div>

                                        <form action={handleSubmit} className="space-y-10">
                                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                                                {/* --- SOL KOLON --- */}
                                                <div className="lg:col-span-7 space-y-8">

                                                    {/* PROJE ADI */}
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider ml-1 flex items-center gap-2">
                                                            <FaTag /> Projenin Adı / Konusu
                                                        </label>
                                                        <input name="projectName" placeholder="Örn: Yemek Sipariş Uygulaması, Kişisel Blog..." className="input-field border-blue-500/30 bg-blue-50 dark:bg-blue-900/10 text-lg font-bold placeholder:font-normal" required />
                                                    </div>

                                                    {/* KİMLİK */}
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-bold text-gray-500 dark:text-gray-500 uppercase tracking-wider ml-1">Ad Soyad</label>
                                                            <input name="name" placeholder="Adınız" className="input-field" required />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-bold text-gray-500 dark:text-gray-500 uppercase tracking-wider ml-1">E-posta</label>
                                                            <input type="email" name="email" placeholder="mail@ornek.com" className="input-field" required />
                                                        </div>
                                                    </div>

                                                    {/* PLATFORM */}
                                                    <div>
                                                        <label className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-2 mb-3"><FaLaptopCode /> Hangi Platformlar?</label>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            {PLATFORM_OPTIONS.map(plat => (
                                                                <div
                                                                    key={plat.id}
                                                                    onClick={() => handlePlatformChange(plat.label)}
                                                                    className={`p-4 rounded-xl border cursor-pointer transition flex items-center justify-between group
                                                                    ${selectedPlatforms.includes(plat.label)
                                                                            ? 'bg-blue-100 dark:bg-blue-600/20 border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.2)]'
                                                                            : 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                                                                >
                                                                    <span className={`text-sm font-bold ${selectedPlatforms.includes(plat.label) ? 'text-blue-700 dark:text-white' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200'}`}>{plat.label}</span>
                                                                    {selectedPlatforms.includes(plat.label) && <FaCheckCircle className="text-blue-600 dark:text-blue-500" />}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* TASARIM */}
                                                    <div>
                                                        <label className="text-sm font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider flex items-center gap-2 mb-3"><FaPaintBrush /> Tasarım Durumu</label>
                                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                                            {DESIGN_OPTIONS.map(opt => (
                                                                <div
                                                                    key={opt.id}
                                                                    onClick={() => setSelectedDesign(opt.id)}
                                                                    className={`p-4 rounded-xl border cursor-pointer transition flex flex-col gap-2 relative overflow-hidden
                                                                    ${selectedDesign === opt.id
                                                                            ? 'bg-purple-100 dark:bg-purple-600/20 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]'
                                                                            : 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                                                                >
                                                                    <div className={`text-2xl ${selectedDesign === opt.id ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500 dark:text-gray-600'}`}>{opt.icon}</div>
                                                                    <div>
                                                                        <h4 className={`text-sm font-bold ${selectedDesign === opt.id ? 'text-purple-800 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>{opt.label}</h4>
                                                                        <p className="text-[10px] text-gray-500">{opt.desc}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <AnimatePresence mode='wait'>
                                                            {selectedDesign === 'ready' && (
                                                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                                                                    <input name="designUrl" placeholder="Figma, Adobe XD veya Drive Linki..." className="input-field border-purple-500/50 bg-purple-50 dark:bg-purple-900/10" />
                                                                </motion.div>
                                                            )}
                                                            {selectedDesign === 'redesign' && (
                                                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                                                                    <input name="designUrl" placeholder="Mevcut sitenizin adresi..." className="input-field border-purple-500/50 bg-purple-50 dark:bg-purple-900/10" />
                                                                </motion.div>
                                                            )}
                                                            {selectedDesign === 'scratch' && (
                                                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                                                                    <textarea name="referenceSites" rows={2} placeholder="Örnek aldığınız site linkleri..." className="input-field border-purple-500/50 bg-purple-50 dark:bg-purple-900/10 resize-none" />
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
                                                    </div>

                                                    {/* NOTLAR */}
                                                    <div>
                                                        <div className="flex justify-between items-center mb-2">
                                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Proje Notları</label>
                                                        </div>
                                                        <textarea name="message" rows={5} placeholder="Diğer detaylar..." className="input-field resize-none" required />
                                                    </div>
                                                </div>

                                                {/* --- SAĞ KOLON --- */}
                                                <div className="lg:col-span-5 space-y-8 bg-gray-50 dark:bg-gray-900/30 p-6 rounded-3xl border border-gray-200 dark:border-gray-800/50">

                                                    {/* ÖZELLİKLER */}
                                                    <div className="flex-1 flex flex-col min-h-0">
                                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2 mb-3">İstenen Özellikler</label>

                                                        <div className="flex gap-2 mb-3">
                                                            <input value={tempFeature} onChange={(e) => setTempFeature(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomFeature())} placeholder="+ Özel özellik ekle" className="input-field py-2 text-xs bg-white dark:bg-gray-950" />
                                                            <button type="button" onClick={addCustomFeature} className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-white px-3 rounded-lg border border-gray-300 dark:border-gray-700 transition"><FaPlus /></button>
                                                        </div>

                                                        {customFeatures.length > 0 && (
                                                            <div className="flex flex-wrap gap-2 mb-3">
                                                                {customFeatures.map((feat, i) => (
                                                                    <span key={i} className="bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 px-2 py-1 rounded text-[10px] flex items-center gap-1">
                                                                        {feat} <button type="button" onClick={() => setCustomFeatures(prev => prev.filter(f => f !== feat))}><FaTimes /></button>
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}

                                                        <div className="grid grid-cols-1 gap-2 overflow-y-auto custom-scrollbar max-h-60 pr-2">
                                                            {availableFeatures.map(feat => (
                                                                <label key={feat} className="flex items-center gap-3 p-2.5 bg-white dark:bg-gray-900/80 rounded-lg border border-gray-200 dark:border-gray-800 cursor-pointer hover:border-blue-500/30 transition group">
                                                                    <input type="checkbox" name="features" value={feat} className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-50 dark:bg-gray-950" />
                                                                    <span className="text-gray-600 dark:text-gray-400 text-xs group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{feat}</span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="w-full h-px bg-gray-200 dark:bg-gray-800 my-4"></div>

                                                    {/* BÜTÇE (Özel Inputlu) */}
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">Bütçe Aralığı</label>

                                                        {selectedBudget === 'Diğer' ? (
                                                            <div className="flex gap-2 animate-fadeIn">
                                                                <button type="button" onClick={() => setSelectedBudget('')} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition text-gray-500 dark:text-gray-400"><FaArrowLeft /></button>
                                                                <input
                                                                    autoFocus
                                                                    value={customBudget}
                                                                    onChange={(e) => setCustomBudget(e.target.value)}
                                                                    placeholder="Bütçenizi yazın (Örn: Max 20.000 TL)..."
                                                                    className="input-field py-2 text-sm border-green-500/50 focus:border-green-500 bg-green-50 dark:bg-green-900/10"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-wrap gap-2">
                                                                {BUDGET_OPTIONS.map(opt => (
                                                                    <button type="button" key={opt} onClick={() => setSelectedBudget(opt)} className={`px-3 py-2 text-xs rounded-lg border transition ${selectedBudget === opt ? 'bg-green-600 text-white border-green-500' : 'bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500'}`}>{opt}</button>
                                                                ))}
                                                            </div>
                                                        )}
                                                        <input type="hidden" required value={selectedBudget === 'Diğer' ? customBudget : selectedBudget} />
                                                    </div>

                                                    {/* SÜRE (Özel Inputlu) */}
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">Teslim Süresi</label>

                                                        {selectedDeadline === 'Diğer' ? (
                                                            <div className="flex gap-2 animate-fadeIn">
                                                                <button type="button" onClick={() => setSelectedDeadline('')} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition text-gray-500 dark:text-gray-400"><FaArrowLeft /></button>
                                                                <input
                                                                    autoFocus
                                                                    value={customDeadline}
                                                                    onChange={(e) => setCustomDeadline(e.target.value)}
                                                                    placeholder="İstenen süreyi yazın (Örn: 10 Şubat'a kadar)..."
                                                                    className="input-field py-2 text-sm border-orange-500/50 focus:border-orange-500 bg-orange-50 dark:bg-orange-900/10"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-wrap gap-2">
                                                                {DEADLINE_OPTIONS.map(opt => (
                                                                    <button type="button" key={opt} onClick={() => setSelectedDeadline(opt)} className={`px-3 py-2 text-xs rounded-lg border transition ${selectedDeadline === opt ? 'bg-orange-600 text-white border-orange-500' : 'bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500'}`}>{opt}</button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                disabled={
                                                    (!selectedBudget || (selectedBudget === 'Diğer' && !customBudget)) ||
                                                    (!selectedDeadline || (selectedDeadline === 'Diğer' && !customDeadline)) ||
                                                    formStatus === 'loading'
                                                }
                                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all transform hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:grayscale shadow-[0_0_30px_rgba(37,99,235,0.3)]"
                                            >
                                                {formStatus === 'loading' ? <span className="animate-pulse">Gönderiliyor...</span> : <><FaPaperPlane /> Projeyi Başlat</>}
                                            </button>
                                        </form>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style jsx>{`
                .input-field { width: 100%; background-color: var(--input-bg, rgba(17, 24, 39, 0.5)); border: 1px solid var(--input-border, #1f2937); border-radius: 0.75rem; padding: 0.85rem 1rem; color: var(--input-text, white); outline: none; transition: all 0.2s; font-size: 0.95rem; }
                .input-field:focus { border-color: #3b82f6; background-color: var(--input-bg-focus, rgba(17, 24, 39, 0.9)); box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2); }
                .animate-fadeIn { animation: fadeIn 0.3s ease-out; } @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 10px; }
                
                :global(.light) .input-field {
                    --input-bg: #f3f4f6;
                    --input-border: #e5e7eb;
                    --input-text: #1f2937;
                    --input-bg-focus: #ffffff;
                }
                :global(.dark) .input-field {
                    --input-bg: rgba(17, 24, 39, 0.5);
                    --input-border: #1f2937;
                    --input-text: white;
                    --input-bg-focus: rgba(17, 24, 39, 0.9);
                }
            `}</style>
        </>
    );
}