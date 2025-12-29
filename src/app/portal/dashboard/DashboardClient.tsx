'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaRocket, FaClock, FaCheck, FaTimes, FaSignOutAlt, FaExclamationTriangle,
    FaPaperPlane, FaTools, FaPlus, FaLayerGroup, FaShoppingCart,
    FaMobileAlt, FaGlobe, FaShieldAlt, FaListUl, FaMoneyBillWave, FaInfoCircle
} from 'react-icons/fa';
import { logoutClient } from '../login/actions';
import { submitProjectRequest } from './actions';
import ProposalView from './ProposalView';

// --- ÖZELLİK KATALOĞU ---
const FEATURE_CATALOG = [
    { category: 'Temel & Arayüz', icon: <FaGlobe />, items: ['Karanlık Mod (Dark Mode)', 'Çoklu Dil Desteği', 'Animasyonlu Geçişler', 'SEO Optimizasyonu', 'Blog / Haber Yönetimi'] },
    { category: 'Kullanıcı & Etkileşim', icon: <FaLayerGroup />, items: ['Üyelik Sistemi', 'Sosyal Medya Girişi', 'Canlı Destek (Chat)', 'Yorum & Puanlama', 'Form & Anket Modülü'] },
    { category: 'E-Ticaret & Ödeme', icon: <FaShoppingCart />, items: ['Sanal POS / Ödeme', 'Sepet Sistemi', 'Stok Takibi', 'İndirim Kuponu', 'Fatura Entegrasyonu'] },
    { category: 'Mobil & Bildirim', icon: <FaMobileAlt />, items: ['Bildirim Gönderme (Push)', 'Offline Çalışma', 'Konum / Harita', 'Kamera / QR Okuma'] },
    { category: 'Gelişmiş / Backend', icon: <FaShieldAlt />, items: ['Yönetim Paneli (Admin)', 'Yapay Zeka Entegrasyonu', 'Raporlama & Analiz', 'Veri Yedekleme', 'API Servisleri'] }
];

export default function DashboardClient({ project }: { project: any }) {
    const [requestModalOpen, setRequestModalOpen] = useState(false);
    const [requestType, setRequestType] = useState('new_feature');
    const [loading, setLoading] = useState(false);
    const [selectedNewFeatures, setSelectedNewFeatures] = useState<string[]>([]);
    const [customRequestNote, setCustomRequestNote] = useState('');

    // --- MEVCUT ÖZELLİKLERİ BULMA ---
    const currentFeatures = useMemo(() => {
        let features: string[] = [];
        if (project.features && project.features.length > 0) {
            features = [...features, ...project.features.split(', ').map((f: string) => f.trim())];
        }
        if (project.description) {
            const parts = project.description.split('🛠️ TEKNİK ÖZELLİKLER');
            if (parts.length > 1) {
                const featuresPart = parts[1].split('📝 NOTLAR')[0];
                const descFeatures = featuresPart.replace(/^:/, '').trim().split(', ').map((f: string) => f.trim()).filter((f: string) => f && f !== 'Standart.' && f !== 'Yok');
                features = [...features, ...descFeatures];
            }
        }
        return Array.from(new Set(features));
    }, [project.features, project.description]);

    const toggleFeature = (feature: string) => {
        if (selectedNewFeatures.includes(feature)) setSelectedNewFeatures(prev => prev.filter(f => f !== feature));
        else setSelectedNewFeatures(prev => [...prev, feature]);
    };

    const handleRequestSubmit = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('code', project.accessCode);
        formData.append('type', requestType);

        let finalMessage = "";
        if (requestType === 'new_feature') {
            finalMessage = `🚀 EKLENECEK ÖZELLİKLER:\n${selectedNewFeatures.map(f => `- ${f}`).join('\n')}\n\n📝 NOT:\n${customRequestNote}`;
        } else {
            finalMessage = customRequestNote;
        }
        formData.append('message', finalMessage);

        await submitProjectRequest(formData);
        setLoading(false);
        setRequestModalOpen(false);
        setSelectedNewFeatures([]);
        setCustomRequestNote('');
        alert('Talebiniz iletildi!');
    };

    return (
        <div className="flex flex-col min-h-full bg-black text-white font-sans">

            {/* ÜST BAR (STICKY) - Top: 0 ve z-index önemli */}
            <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                        <h1 className="text-lg md:text-xl font-bold tracking-tight">Proje Paneli</h1>
                        <span className="text-gray-500 text-sm hidden sm:inline-block">| {project.name}</span>
                    </div>
                    <form action={logoutClient}>
                        <button className="text-xs text-gray-400 hover:text-white flex items-center gap-2 border border-gray-700 px-3 py-1.5 rounded-lg transition hover:bg-gray-800">
                            <FaSignOutAlt /> <span className="hidden sm:inline">Çıkış</span>
                        </button>
                    </form>
                </div>
            </header>

            {/* ANA İÇERİK - Padding top kaldırıldı, sadece dikey boşluk (py-6) */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">

                {project.status === 'PRICING_SENT' || project.status === 'NEGOTIATION' ? (
                    <ProposalView project={project} />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* SOL KOLON: ÖZET & DURUM */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* 1. PROJE KÜNYESİ (BÜTÇE & TARİH) */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-[#0f1115] border border-gray-800 p-4 rounded-xl flex flex-col justify-center items-center text-center">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1"><FaMoneyBillWave className="text-green-500" /> Bütçe</span>
                                    <span className="text-lg font-bold text-white font-mono">{project.budget || project.clientOfferPrice || "Belirtilmedi"}</span>
                                </div>
                                <div className="bg-[#0f1115] border border-gray-800 p-4 rounded-xl flex flex-col justify-center items-center text-center">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1"><FaClock className="text-orange-500" /> Teslim</span>
                                    <span className="text-lg font-bold text-white font-mono">{project.deadline || project.clientOfferDeadline || "Belirtilmedi"}</span>
                                </div>
                                <div className="bg-[#0f1115] border border-gray-800 p-4 rounded-xl flex flex-col justify-center items-center text-center">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1"><FaRocket className="text-blue-500" /> Başlangıç</span>
                                    <span className="text-sm font-bold text-white font-mono">{project.startDate ? new Date(project.startDate).toLocaleDateString('tr-TR') : "Bekleniyor"}</span>
                                </div>
                            </div>

                            {/* 2. CANLI İLERLEME KARTI */}
                            <div className="bg-[#0f1115] border border-gray-800 rounded-2xl p-6 md:p-8 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-32 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
                                <div className="flex justify-between items-end mb-6 relative z-10">
                                    <div>
                                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{project.name}</h2>
                                        <span className="text-xs bg-gray-800 px-2 py-1 rounded border border-gray-700 text-gray-400">Canlı Durum</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent font-mono">%{project.progress}</div>
                                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Tamamlandı</div>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-900 rounded-full h-3 mb-4 overflow-hidden border border-gray-800 relative z-10">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${project.progress}%` }} transition={{ duration: 1.5, ease: "easeOut" }} className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full relative">
                                        <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                                    </motion.div>
                                </div>
                                <div className="flex justify-between text-sm relative z-10">
                                    <div className="flex items-center gap-2 text-gray-300 bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-700/50">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        {project.currentStage || "Hazırlık Yapılıyor..."}
                                    </div>
                                    <span className="text-gray-500 text-xs self-center">Güncelleme: {new Date(project.updatedAt).toLocaleDateString('tr-TR')}</span>
                                </div>
                            </div>

                            {/* 3. PROJE ENVANTERİ (ÖZELLİKLER) */}
                            <div className="bg-[#0f1115] border border-gray-800 rounded-2xl p-6">
                                <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 flex items-center gap-2 tracking-wider">
                                    <FaListUl className="text-blue-500" /> Proje Envanteri
                                </h3>
                                {currentFeatures.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {currentFeatures.map((feat: string, i: number) => (
                                            <div key={i} className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-xl border border-gray-800/50 hover:bg-gray-800 transition">
                                                <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0"><FaCheck className="text-green-500 text-[10px]" /></div>
                                                <span className="text-sm text-gray-300">{feat}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6 text-gray-500 text-xs border border-dashed border-gray-800 rounded-xl">Özellik listesi yükleniyor veya boş.</div>
                                )}
                            </div>
                        </div>

                        {/* SAĞ KOLON: İŞLEMLER & GEÇMİŞ */}
                        <div className="space-y-6">
                            <div className="p-6 bg-gradient-to-b from-blue-900/10 to-transparent border border-blue-500/20 rounded-2xl">
                                <h3 className="text-lg font-bold text-white mb-4">Hızlı İşlemler</h3>
                                <div className="grid gap-3">
                                    <button onClick={() => { setRequestType('new_feature'); setRequestModalOpen(true); }} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"><FaPlus /> Yeni Özellik İste</button>
                                    <button onClick={() => { setRequestType('bug'); setRequestModalOpen(true); }} className="w-full py-3 bg-gray-900 border border-gray-800 hover:bg-red-900/10 hover:border-red-500/30 text-gray-300 hover:text-red-400 rounded-xl font-medium transition flex items-center justify-center gap-2"><FaExclamationTriangle /> Sorun Bildir</button>
                                </div>
                            </div>

                            <div className="bg-[#0f1115] border border-gray-800 rounded-2xl p-6 h-[400px] flex flex-col">
                                <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 flex items-center gap-2 tracking-wider"><FaClock /> Talep Geçmişi</h3>
                                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
                                    {project.requests.length === 0 && <p className="text-gray-600 text-xs text-center py-10">Henüz talep yok.</p>}
                                    {project.requests.map((req: any) => (
                                        <div key={req.id} className="p-3 bg-gray-900/50 rounded-xl border border-gray-800/50 hover:border-gray-700 transition">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${req.type === 'new_feature' ? 'bg-blue-500/10 text-blue-400' : req.type === 'bug' ? 'bg-red-500/10 text-red-400' : 'bg-gray-800 text-gray-400'}`}>{req.type === 'new_feature' ? 'Özellik' : req.type === 'bug' ? 'Hata' : 'Diğer'}</span>
                                                <span className={`text-[10px] font-bold ${req.status === 'PENDING' ? 'text-yellow-500' : req.status === 'APPROVED' ? 'text-green-500' : 'text-red-500'}`}>{req.status === 'PENDING' ? 'Bekliyor' : req.status === 'APPROVED' ? 'Onaylandı' : 'Reddedildi'}</span>
                                            </div>
                                            <p className="text-xs text-gray-400 line-clamp-2">{req.message}</p>
                                            <span className="text-[10px] text-gray-600 mt-2 block">{new Date(req.createdAt).toLocaleDateString('tr-TR')}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* MODAL: YENİ ÖZELLİK / TALEP İSTE */}
            <AnimatePresence>
                {requestModalOpen && (
                    <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setRequestModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 50 }} className="bg-[#0f1115] border border-gray-800 rounded-3xl shadow-2xl relative z-10 max-w-4xl w-full flex flex-col max-h-[85vh]">
                            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-950">
                                <div><h3 className="text-xl font-bold text-white flex items-center gap-2">{requestType === 'new_feature' ? <><FaPlus className="text-blue-500" /> Özellik Ekle</> : <><FaExclamationTriangle className="text-red-500" /> Sorun Bildir</>}</h3><p className="text-gray-500 text-xs mt-1">Talebiniz yöneticiye iletilecek.</p></div>
                                <button onClick={() => setRequestModalOpen(false)} className="p-2 bg-gray-900 rounded-full text-gray-500 hover:text-white transition"><FaTimes /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8 bg-[#0a0c10]">
                                {requestType === 'new_feature' && (
                                    <div className="space-y-8">
                                        {FEATURE_CATALOG.map((cat, index) => (
                                            <div key={index}>
                                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2 border-b border-gray-800 pb-2">{cat.icon} {cat.category}</h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                                    {cat.items.map((item) => {
                                                        const isOwned = currentFeatures.includes(item);
                                                        const isSelected = selectedNewFeatures.includes(item);
                                                        return (
                                                            <button key={item} disabled={isOwned} onClick={() => toggleFeature(item)} className={`p-3 rounded-xl border text-left text-xs font-medium transition flex items-center justify-between group ${isOwned ? 'bg-gray-900/30 border-gray-800 text-gray-600 cursor-not-allowed opacity-50' : isSelected ? 'bg-blue-600/20 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.15)]' : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-600 hover:text-gray-200'}`}>
                                                                {item} {isOwned ? <span className="text-[9px] bg-gray-800 px-1.5 py-0.5 rounded text-gray-500 border border-gray-700">Mevcut</span> : isSelected && <FaCheck className="text-blue-500" />}
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div><label className="text-xs font-bold text-gray-500 uppercase block mb-2">{requestType === 'new_feature' ? 'Ekstra Notlar' : 'Sorun Detayı'}</label><textarea value={customRequestNote} onChange={(e) => setCustomRequestNote(e.target.value)} rows={4} className="w-full bg-black border border-gray-800 rounded-xl p-4 text-white focus:border-blue-500 outline-none resize-none text-sm" placeholder="Detayları buraya yaz..." /></div>
                            </div>
                            <div className="p-6 border-t border-gray-800 bg-gray-950 flex justify-end gap-3">
                                <button onClick={() => setRequestModalOpen(false)} className="px-6 py-3 rounded-xl text-gray-500 font-bold hover:text-white transition">Vazgeç</button>
                                <button onClick={handleRequestSubmit} disabled={loading || (requestType === 'new_feature' && selectedNewFeatures.length === 0 && !customRequestNote.trim()) || (requestType === 'bug' && !customRequestNote.trim())} className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">{loading ? 'Gönderiliyor...' : <><FaPaperPlane /> Gönder</>}</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}