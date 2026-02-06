'use client';

import { useState, useEffect, useMemo } from 'react';
import { approveProposal, submitCounterOffer } from './actions';
import {
    FaCheck, FaMoneyBillWave, FaInfoCircle, FaTimes, FaHandshake, FaPaperPlane,
    FaExchangeAlt, FaListUl, FaLink, FaLaptopCode, FaPaintBrush, FaPlus, FaArrowLeft,
    FaClock, FaFigma, FaLightbulb, FaMagic, FaHourglassHalf, FaCommentDots
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// --- SEÇENEKLER ---
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

const FEATURES_BY_PLATFORM: Record<string, string[]> = {
    web: ['SEO Uyumu', 'Blog/Haber', 'Çoklu Dil', 'Karanlık Mod'],
    mobile: ['Bildirim (Push)', 'Offline Mod', 'Konum/Harita', 'Uygulama İçi Satın Alma'],
    crm: ['Raporlama', 'Personel Yönetimi', 'Excel/PDF Çıktı', 'Yedekleme'],
    ecommerce: ['Sepet/Ödeme', 'Stok Takibi', 'Kargo Entegrasyonu', 'İndirim Kuponu'],
    default: ['Kullanıcı Girişi', 'Canlı Destek', 'Yapay Zeka']
};

export default function ProposalView({ project }: { project: any }) {
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showNegotiate, setShowNegotiate] = useState(false);

    // Pazarlık Modu Kontrolü
    const isNegotiating = project.status === 'NEGOTIATION';

    // --- PAZARLIK STATE'LERİ ---
    const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
    const [selectedDesign, setSelectedDesign] = useState<string>('');
    const [designDetail, setDesignDetail] = useState<string>('');
    const [targetBudget, setTargetBudget] = useState<string>('');
    const [targetDeadline, setTargetDeadline] = useState<string>('');
    const [customFeatures, setCustomFeatures] = useState<string[]>([]);
    const [tempFeature, setTempFeature] = useState('');
    const [offerNotes, setOfferNotes] = useState('');

    // --- PARSING HELPER ---
    const parseDetail = (key: string) => {
        if (!project.description) return "";
        const lines = project.description.split('\n');
        const line = lines.find((l: string) => l.includes(key));
        return line ? line.split(':')[1]?.trim() : "";
    };

    const parseList = (key: string) => {
        const val = parseDetail(key);
        return val && val !== '-' ? val.split(', ') : [];
    };

    // Modal Açıldığında Verileri Doldur
    useEffect(() => {
        if (showNegotiate) {
            setSelectedPlatforms(parseList('📱 Platformlar'));

            const currentDesignLabel = parseDetail('🎨 Tasarım Durumu');
            const foundDesign = DESIGN_OPTIONS.find(d => d.label === currentDesignLabel);
            if (foundDesign) setSelectedDesign(foundDesign.id);

            const link = parseDetail('Link');
            const refs = parseDetail('Referanslar');
            setDesignDetail(link || refs || '');

            const rawFeatures = project.description.split('🛠️ TEKNİK ÖZELLİKLER')[1]?.split('📝 NOTLAR')[0]?.trim();
            if (rawFeatures && rawFeatures !== 'Standart.') {
                setCustomFeatures(rawFeatures.split(', '));
            }

            setTargetBudget(parseDetail('💰 Bütçe') || '');
            setTargetDeadline(parseDetail('📅 Süre') || '');
        }
    }, [showNegotiate, project.description]);

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

    // --- REVIZE VERİLERİNİ PARSE ETME (GÖRSELLEŞTİRME İÇİN) ---
    const clientOfferDetails = useMemo(() => {
        if (!isNegotiating || !project.clientOfferNotes) return null;

        // Gelen string formatı: "📱 ... 🎨 ... 🛠️ ... 📝 ..."
        const text = project.clientOfferNotes;

        // Bölücüleri kullanarak veriyi parçala
        const platformsPart = text.split('📱 Yeni Platformlar:')[1]?.split('🎨')[0]?.trim();
        const designPart = text.split('🎨 Yeni Tasarım:')[1]?.split('🛠️')[0]?.trim();
        const featuresPart = text.split('🛠️ Yeni Özellikler:')[1]?.split('📝')[0]?.trim();
        const notePart = text.split('📝 Müşteri Notu:')[1]?.trim();

        return {
            platforms: platformsPart ? platformsPart.split(', ').filter(Boolean) : [],
            design: designPart || "Belirtilmedi",
            features: featuresPart ? featuresPart.split(', ').filter(Boolean) : [],
            note: notePart || "Not yok."
        };
    }, [isNegotiating, project.clientOfferNotes]);


    // --- HANDLERS ---
    const togglePlatform = (val: string) => {
        if (selectedPlatforms.includes(val)) setSelectedPlatforms(prev => prev.filter(p => p !== val));
        else setSelectedPlatforms(prev => [...prev, val]);
    };

    const toggleFeature = (val: string) => {
        if (customFeatures.includes(val)) setCustomFeatures(prev => prev.filter(f => f !== val));
        else setCustomFeatures(prev => [...prev, val]);
    };

    const addManualFeature = () => {
        if (!tempFeature.trim()) return;
        if (!customFeatures.includes(tempFeature.trim())) setCustomFeatures(prev => [...prev, tempFeature.trim()]);
        setTempFeature('');
    };

    const handleApprove = async () => {
        setLoading(true);
        await approveProposal(project.accessCode);
        setLoading(false);
        setShowConfirm(false);
    };

    const handleNegotiateSubmit = async (formData: FormData) => {
        setLoading(true);

        const designLabel = DESIGN_OPTIONS.find(d => d.id === selectedDesign)?.label || 'Belirtilmedi';

        // Admin panelinde parse edilecek formatta string oluşturuyoruz
        const changeSummary = `
🔄 MÜŞTERİ REVİZE TALEBİ
--------------------------
📱 Yeni Platformlar: ${selectedPlatforms.join(', ')}
🎨 Yeni Tasarım: ${designLabel} ${designDetail ? `(${designDetail})` : ''}
🛠️ Yeni Özellikler: ${customFeatures.join(', ')}
📝 Müşteri Notu: ${offerNotes}
        `.trim();

        formData.set('offerPrice', targetBudget);
        formData.set('offerDeadline', targetDeadline);
        formData.set('offerNotes', changeSummary);
        formData.set('code', project.accessCode);

        await submitCounterOffer(formData);
        setLoading(false);
        setShowNegotiate(false);
    };

    // UI Data
    const uiData = {
        budget: parseDetail('💰 Bütçe'),
        deadline: parseDetail('📅 Süre'),
        platforms: parseList('📱 Platformlar'),
        design: parseDetail('🎨 Tasarım Durumu'),
        designLink: parseDetail('Link') || parseDetail('Referanslar'),
        features: project.description.split('🛠️ TEKNİK ÖZELLİKLER')[1]?.split('📝 NOTLAR')[0]?.trim().split(', ') || []
    };

    return (
        <>
            <div className={`border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-xl dark:shadow-2xl relative transition-colors duration-500
                ${isNegotiating ? 'bg-yellow-50 dark:bg-[#1a1500] border-yellow-200 dark:border-yellow-900/30' : 'bg-white dark:bg-[#0f1115]'}`}>

                {/* ÜST BANNER (DURUMA GÖRE DEĞİŞİR) */}
                <div className={`p-8 md:p-10 text-center border-b border-gray-200 dark:border-gray-800 relative overflow-hidden
                    ${isNegotiating ? 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20' : 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/40 dark:to-purple-900/40'}`}>

                    <div className={`absolute top-0 left-0 w-full h-1 bg-[length:200%_100%] animate-gradientMove
                        ${isNegotiating ? 'bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500' : 'bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500'}`}></div>

                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 flex justify-center items-center gap-3">
                        {isNegotiating ? <><FaHourglassHalf className="text-yellow-600 dark:text-yellow-500" /> Revize Talebin İnceleniyor</> : 'Proje Teklifi Hazır! 🚀'}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto text-lg">
                        {isNegotiating
                            ? 'Gönderdiğin karşı teklifi aldım. En kısa sürede değerlendirip sana yeni bir güncelleme yapacağım.'
                            : 'Senin için detaylı bir inceleme yaptım ve en uygun yol haritasını çıkardım.'}
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row">

                    {/* SOL: TEKLİF VE ŞARTLAR */}
                    <div className="w-full lg:w-7/12 p-8 md:p-10 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-800">

                        {/* ADMİNİN İLK TEKLİFİ (REFERANS OLARAK HEP DURUR) */}
                        <div className="opacity-80">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <FaMoneyBillWave className="text-green-600 dark:text-green-500" /> İlk Teklifim
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 p-6 rounded-2xl flex flex-col justify-center items-center text-center">
                                    <span className="text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-wider mb-1">Onaylanan Bütçe</span>
                                    <span className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white font-mono">{project.budget}</span>
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 p-6 rounded-2xl flex flex-col justify-center items-center text-center">
                                    <span className="text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">Teslim Süresi</span>
                                    <span className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white font-mono">{project.deadline}</span>
                                </div>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-3">
                                    <FaListUl className="text-gray-500" />
                                    <span className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase">Hizmet Kapsamı & Notlar</span>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-gray-200 dark:border-gray-800">
                                    <pre className="whitespace-pre-wrap font-sans text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                                        {project.adminNotes || "Standart proje süreçleri geçerlidir."}
                                    </pre>
                                </div>
                            </div>
                        </div>

                        {/* 👇 BURASI YENİLENDİ: PAZARLIK KARTI */}
                        {isNegotiating && clientOfferDetails ? (
                            <div className="mt-8 bg-yellow-50 dark:bg-yellow-500/5 border border-yellow-200 dark:border-yellow-500/20 rounded-2xl p-6 relative overflow-hidden animate-fadeIn">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <FaHandshake size={80} className="text-yellow-500" />
                                </div>

                                <h3 className="text-yellow-600 dark:text-yellow-500 font-bold text-lg mb-6 flex items-center gap-2">
                                    <FaExchangeAlt /> Senin Karşı Teklifin
                                </h3>

                                {/* Fiyat & Süre */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div>
                                        <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Önerdiğin Fiyat</span>
                                        <div className="text-xl font-mono text-gray-900 dark:text-white font-bold">{project.clientOfferPrice}</div>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Önerdiğin Tarih</span>
                                        <div className="text-xl font-mono text-gray-900 dark:text-white font-bold">{project.clientOfferDeadline}</div>
                                    </div>
                                </div>

                                <div className="space-y-4 border-t border-yellow-200 dark:border-yellow-500/10 pt-4">

                                    {/* Platform & Tasarım */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-[10px] text-gray-500 font-bold uppercase block mb-2"><FaLaptopCode className="inline mr-1" /> Platformlar</span>
                                            <div className="flex flex-wrap gap-2">
                                                {clientOfferDetails.platforms.map((p: string, i: number) => (
                                                    <span key={i} className="text-[10px] bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 px-2 py-1 rounded border border-blue-200 dark:border-blue-500/20">{p}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-gray-500 font-bold uppercase block mb-2"><FaPaintBrush className="inline mr-1" /> Tasarım</span>
                                            <div className="text-xs text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-500/10 px-2 py-1 rounded border border-purple-200 dark:border-purple-500/20 inline-block">
                                                {clientOfferDetails.design}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Özellikler */}
                                    {clientOfferDetails.features.length > 0 && (
                                        <div>
                                            <span className="text-[10px] text-gray-500 font-bold uppercase block mb-2"><FaListUl className="inline mr-1" /> Özellikler</span>
                                            <div className="grid grid-cols-2 gap-2">
                                                {clientOfferDetails.features.map((f: string, i: number) => (
                                                    <div key={i} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                                        <FaCheck className="text-green-500 text-[10px]" /> {f}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Not */}
                                    <div className="bg-white/50 dark:bg-black/30 p-4 rounded-xl border border-yellow-200 dark:border-yellow-900/30 relative">
                                        <FaCommentDots className="absolute top-3 right-3 text-yellow-500/20" />
                                        <span className="text-[10px] text-yellow-600 font-bold uppercase mb-1 block">Revize Notun</span>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 italic leading-relaxed">
                                            "{clientOfferDetails.note}"
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center gap-2 text-xs text-yellow-600/70 dark:text-yellow-500/70">
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                                    Admin yanıtı bekleniyor...
                                </div>
                            </div>
                        ) : !isNegotiating && (
                            // PAZARLIK YOKSA BUTONLARI GÖSTER
                            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                                <button onClick={() => setShowNegotiate(true)} className="flex-1 py-4 rounded-xl bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-800 hover:border-yellow-500/50 group">
                                    <FaExchangeAlt className="group-hover:text-yellow-500 transition" /> Şartları Değiştir / Revize
                                </button>
                                <button onClick={() => setShowConfirm(true)} className="flex-[1.5] py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold transition shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transform active:scale-95">
                                    <FaCheck /> Teklifi Kabul Et
                                </button>
                            </div>
                        )}
                    </div>

                    {/* SAĞ: TALEP ÖZETİ (DEĞİŞMEZ BİLGİLER) */}
                    <div className="w-full lg:w-5/12 p-8 md:p-10 bg-gray-50 dark:bg-[#0a0c10] flex flex-col">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-300 mb-6 flex items-center gap-2">
                            <FaInfoCircle className="text-gray-600 dark:text-gray-600" /> İlk Başvurun
                        </h3>

                        <div className="space-y-6 opacity-70 hover:opacity-100 transition duration-300">
                            <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                                <span className="text-[10px] font-bold text-gray-500 uppercase block mb-1">PROJE</span>
                                <span className="text-gray-900 dark:text-white font-bold text-lg">{project.name}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-white dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800/50">
                                    <div className="text-green-600 dark:text-green-500 text-[10px] font-bold uppercase mb-1">Bütçe Aralığı</div>
                                    <div className="text-gray-600 dark:text-gray-300 text-sm font-medium">{uiData.budget}</div>
                                </div>
                                <div className="p-3 bg-white dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800/50">
                                    <div className="text-orange-600 dark:text-orange-500 text-[10px] font-bold uppercase mb-1">İstenen Süre</div>
                                    <div className="text-gray-600 dark:text-gray-300 text-sm font-medium">{uiData.deadline}</div>
                                </div>
                            </div>

                            <div>
                                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-500 uppercase block mb-2">SEÇİLEN PLATFORMLAR</span>
                                <div className="flex flex-wrap gap-2">
                                    {uiData.platforms.map((p: string) => (
                                        <span key={p} className="px-3 py-1.5 bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 rounded-lg text-xs font-bold flex items-center gap-2">
                                            <FaLaptopCode /> {p}
                                        </span>
                                    ))}
                                    {uiData.platforms.length === 0 && <span className="text-gray-500 dark:text-gray-600 text-xs">-</span>}
                                </div>
                            </div>

                            <div>
                                <span className="text-[10px] font-bold text-purple-600 dark:text-purple-500 uppercase block mb-2">TASARIM DURUMU</span>
                                <div className="p-3 bg-purple-50 dark:bg-purple-500/5 border border-purple-200 dark:border-purple-500/10 rounded-xl flex items-center justify-between">
                                    <span className="text-purple-700 dark:text-purple-300 text-sm font-medium flex items-center gap-2"><FaPaintBrush /> {uiData.design}</span>
                                    {uiData.designLink && (
                                        <a href={uiData.designLink} target="_blank" className="text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-500 transition">Linke Git</a>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 min-h-0 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 overflow-y-auto custom-scrollbar max-h-48">
                                <span className="text-[10px] font-bold text-gray-500 uppercase block mb-2">İSTENEN ÖZELLİKLER</span>
                                <div className="space-y-2">
                                    {uiData.features.map((f: string, i: number) => (
                                        <div key={i} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                            <FaCheck className="text-green-500 flex-shrink-0" /> {f}
                                        </div>
                                    ))}
                                    {uiData.features.length === 0 && <span className="text-gray-500 dark:text-gray-600 text-xs italic">Özel istek belirtilmemiş.</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MODAL 1: ONAY --- */}
            <AnimatePresence>
                {showConfirm && (
                    <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowConfirm(false)} className="absolute inset-0 bg-black/80 dark:bg-black/80 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 rounded-2xl shadow-2xl relative z-10 max-w-sm w-full text-center">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Başlıyor muyuz? 🚀</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">Onayladığında geliştirme süreci başlayacak.</p>
                            <div className="flex gap-3">
                                <button onClick={() => setShowConfirm(false)} className="flex-1 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-400 font-bold transition">Vazgeç</button>
                                <button onClick={handleApprove} disabled={loading} className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold transition">{loading ? '...' : 'Onayla'}</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* --- MODAL 2: PAZARLIK & REVİZE (NET GİRİŞLİ + TASARIM) --- */}
            <AnimatePresence>
                {showNegotiate && (
                    <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNegotiate(false)} className="absolute inset-0 bg-black/80 dark:bg-black/80 backdrop-blur-sm" />

                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 30 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 30 }}
                            className="bg-gray-50 dark:bg-gray-900 border border-yellow-500/30 rounded-3xl shadow-2xl relative z-10 max-w-5xl w-full overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950/50 flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <FaHandshake className="text-yellow-500" /> Projeyi Yeniden Şekillendir
                                    </h3>
                                    <p className="text-gray-500 text-xs">Bütçene uyması için platform veya özellikleri çıkarıp ekleyebilirsin.</p>
                                </div>
                                <button onClick={() => setShowNegotiate(false)} className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition"><FaTimes /></button>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                                <form action={handleNegotiateSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                                    {/* SOL: PLATFORM & TASARIM & ÖZELLİKLER */}
                                    <div className="space-y-6">
                                        {/* Platform */}
                                        <div>
                                            <label className="text-xs font-bold text-blue-500 uppercase block mb-3">PLATFORM SEÇİMİ</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {PLATFORM_OPTIONS.map(plat => (
                                                    <div
                                                        key={plat.id}
                                                        onClick={() => togglePlatform(plat.label)}
                                                        className={`p-3 rounded-lg border cursor-pointer transition flex items-center justify-between text-xs font-bold
                                                        ${selectedPlatforms.includes(plat.label) ? 'bg-blue-600/20 border-blue-500 text-blue-700 dark:text-white' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400'}`}
                                                    >
                                                        {plat.label}
                                                        {selectedPlatforms.includes(plat.label) && <FaCheck className="text-blue-500" />}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Tasarım (YENİ) */}
                                        <div>
                                            <label className="text-xs font-bold text-purple-500 uppercase block mb-3">TASARIM DURUMU</label>
                                            <div className="grid grid-cols-2 gap-2 mb-3">
                                                {DESIGN_OPTIONS.map(opt => (
                                                    <div
                                                        key={opt.id}
                                                        onClick={() => setSelectedDesign(opt.id)}
                                                        className={`p-3 rounded-lg border cursor-pointer transition flex flex-col gap-1
                                                        ${selectedDesign === opt.id ? 'bg-purple-600/20 border-purple-500 text-purple-700 dark:text-white' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400'}`}
                                                    >
                                                        <div className="text-lg">{opt.icon}</div>
                                                        <span className="text-xs font-bold">{opt.label}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Dinamik Tasarım Detayı */}
                                            {(selectedDesign === 'ready' || selectedDesign === 'redesign') && (
                                                <input value={designDetail} onChange={(e) => setDesignDetail(e.target.value)} placeholder="Link (Figma/Site)..." className="w-full bg-white dark:bg-black border border-purple-500/50 rounded-lg px-3 py-2 text-gray-900 dark:text-white text-xs outline-none" />
                                            )}
                                            {(selectedDesign === 'scratch') && (
                                                <textarea value={designDetail} onChange={(e) => setDesignDetail(e.target.value)} rows={2} placeholder="Örnek aldığınız site linkleri..." className="w-full bg-white dark:bg-black border border-purple-500/50 rounded-lg px-3 py-2 text-gray-900 dark:text-white text-xs outline-none resize-none" />
                                            )}
                                        </div>

                                        {/* Özellikler */}
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase block mb-3">ÖZELLİKLER (EKLE / ÇIKAR)</label>

                                            <div className="flex gap-2 mb-3">
                                                <input value={tempFeature} onChange={(e) => setTempFeature(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addManualFeature())} placeholder="+ Özellik ekle" className="flex-1 bg-white dark:bg-black border border-gray-300 dark:border-gray-800 rounded-lg px-3 py-2 text-gray-900 dark:text-white text-xs outline-none focus:border-gray-600" />
                                                <button type="button" onClick={addManualFeature} className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-white px-3 rounded-lg"><FaPlus /></button>
                                            </div>

                                            <div className="h-40 overflow-y-auto custom-scrollbar bg-white dark:bg-gray-950/50 p-3 rounded-xl border border-gray-200 dark:border-gray-800 space-y-2">
                                                {customFeatures.map(feat => (
                                                    <div key={feat} onClick={() => toggleFeature(feat)} className="flex items-center justify-between p-2 bg-purple-100 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 rounded-lg cursor-pointer hover:bg-red-100 dark:hover:bg-red-500/10 hover:border-red-200 dark:hover:border-red-500/30 group transition">
                                                        <span className="text-xs text-purple-700 dark:text-purple-300 group-hover:text-red-700 dark:group-hover:text-red-300">{feat}</span>
                                                        <FaTimes className="text-purple-500 group-hover:text-red-500" />
                                                    </div>
                                                ))}

                                                {availableFeatures.filter(f => !customFeatures.includes(f)).map(feat => (
                                                    <div key={feat} onClick={() => toggleFeature(feat)} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg cursor-pointer hover:bg-green-100 dark:hover:bg-green-500/10 hover:border-green-200 dark:hover:border-green-500/30 group transition">
                                                        <span className="text-xs text-gray-600 dark:text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-300">{feat}</span>
                                                        <FaPlus className="text-gray-500 dark:text-gray-700 group-hover:text-green-500" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* SAĞ: NET BÜTÇE, SÜRE & NOTLAR */}
                                    <div className="space-y-6">

                                        {/* NET BÜTÇE */}
                                        <div>
                                            <label className="text-xs font-bold text-green-500 uppercase block mb-3 flex items-center gap-2">
                                                <FaMoneyBillWave /> Net Bütçe Teklifin
                                            </label>
                                            <input
                                                value={targetBudget}
                                                onChange={(e) => setTargetBudget(e.target.value)}
                                                placeholder="Örn: 22.500 TL"
                                                className="w-full bg-white dark:bg-black border border-green-500/50 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:border-green-500 outline-none text-lg font-mono font-bold"
                                                required
                                            />
                                            <p className="text-[10px] text-gray-600 mt-1">İstediğin net rakamı buraya yaz.</p>
                                        </div>

                                        {/* NET SÜRE */}
                                        <div>
                                            <label className="text-xs font-bold text-orange-500 uppercase block mb-3 flex items-center gap-2">
                                                <FaClock /> İstediğin Net Tarih
                                            </label>
                                            <input
                                                value={targetDeadline}
                                                onChange={(e) => setTargetDeadline(e.target.value)}
                                                placeholder="Örn: 15 Mart 2025"
                                                className="w-full bg-white dark:bg-black border border-orange-500/50 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:border-orange-500 outline-none text-lg font-mono font-bold"
                                                required
                                            />
                                        </div>

                                        {/* NOTLAR */}
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase block mb-2">EK NOTLAR</label>
                                            <textarea
                                                value={offerNotes}
                                                onChange={(e) => setOfferNotes(e.target.value)}
                                                rows={4}
                                                placeholder="Değişikliklerin sebebini kısaca açıklayabilirsin..."
                                                className="w-full bg-white dark:bg-black border border-gray-300 dark:border-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:border-yellow-500 outline-none resize-none text-sm leading-relaxed"
                                            />
                                        </div>

                                        <button disabled={(!targetBudget || !targetDeadline) || loading} className="w-full py-4 rounded-xl bg-yellow-600 text-white font-bold hover:bg-yellow-700 transition shadow-lg shadow-yellow-900/20 flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50 disabled:grayscale mt-4">
                                            {loading ? 'Gönderiliyor...' : <><FaPaperPlane /> Yeni Teklifi Gönder</>}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}