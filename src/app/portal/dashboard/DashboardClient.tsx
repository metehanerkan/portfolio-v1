'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaRocket, FaClock, FaCheck, FaTimes, FaSignOutAlt, FaExclamationTriangle,
    FaCommentDots, FaPaperPlane, FaTools, FaPlus, FaLayerGroup, FaShoppingCart,
    FaMobileAlt, FaGlobe, FaDatabase, FaShieldAlt, FaListUl, FaMoneyBillWave
} from 'react-icons/fa';
import { logoutClient } from '../login/actions';
import { submitProjectRequest } from './actions';
import ProposalView from './ProposalView';

// --- ÖZELLİK LİSTESİ (KATEGORİLERLE) ---
const FEATURE_CATALOG = [
    {
        category: 'Temel & Arayüz',
        icon: <FaGlobe />,
        items: ['Karanlık Mod (Dark Mode)', 'Çoklu Dil Desteği', 'Animasyonlu Geçişler', 'SEO Optimizasyonu', 'Blog / Haber Yönetimi']
    },
    {
        category: 'Kullanıcı & Etkileşim',
        icon: <FaLayerGroup />,
        items: ['Üyelik Sistemi', 'Sosyal Medya Girişi', 'Canlı Destek (Chat)', 'Yorum & Puanlama', 'Form & Anket Modülü']
    },
    {
        category: 'E-Ticaret & Ödeme',
        icon: <FaShoppingCart />,
        items: ['Sanal POS / Ödeme', 'Sepet Sistemi', 'Stok Takibi', 'İndirim Kuponu', 'Fatura Entegrasyonu']
    },
    {
        category: 'Mobil & Bildirim',
        icon: <FaMobileAlt />,
        items: ['Bildirim Gönderme (Push)', 'Offline Çalışma', 'Konum / Harita', 'Kamera / QR Okuma']
    },
    {
        category: 'Gelişmiş / Backend',
        icon: <FaShieldAlt />,
        items: ['Yönetim Paneli (Admin)', 'Yapay Zeka Entegrasyonu', 'Raporlama & Analiz', 'Veri Yedekleme', 'API Servisleri']
    }
];

export default function DashboardClient({ project }: { project: any }) {
    const [requestModalOpen, setRequestModalOpen] = useState(false);
    const [requestType, setRequestType] = useState('new_feature'); // 'new_feature', 'bug', 'change'
    const [loading, setLoading] = useState(false);

    // Yeni Özellik Seçimi İçin State
    const [selectedNewFeatures, setSelectedNewFeatures] = useState<string[]>([]);
    const [customRequestNote, setCustomRequestNote] = useState('');

    // 👇 KRİTİK GÜNCELLEME: Mevcut Özellikleri Akıllıca Bul (Hem DB hem Description)
    const currentFeatures = useMemo(() => {
        let features: string[] = [];

        // 1. Önce veritabanındaki net 'features' sütununa bak
        if (project.features && project.features.length > 0) {
            const dbFeatures = project.features.split(', ').map((f: string) => f.trim()).filter((f: string) => f !== '');
            features = [...features, ...dbFeatures];
        }

        // 2. Ayrıca 'description' metninin içini tara (Eksik varsa tamamla)
        if (project.description) {
            const parts = project.description.split('🛠️ TEKNİK ÖZELLİKLER');
            if (parts.length > 1) {
                const featuresPart = parts[1].split('📝 NOTLAR')[0];
                const descFeatures = featuresPart.replace(/^:/, '').trim().split(', ').map((f: string) => f.trim()).filter((f: string) => f && f !== 'Standart.' && f !== 'Yok');
                features = [...features, ...descFeatures];
            }
        }

        // Tekrar edenleri temizle (Set kullanarak)
        return Array.from(new Set(features));
    }, [project.features, project.description]);

    // HANDLER: Özellik Seç/Kaldır
    const toggleFeature = (feature: string) => {
        if (selectedNewFeatures.includes(feature)) {
            setSelectedNewFeatures(prev => prev.filter(f => f !== feature));
        } else {
            setSelectedNewFeatures(prev => [...prev, feature]);
        }
    };

    // HANDLER: Talep Gönder
    const handleRequestSubmit = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('code', project.accessCode);
        formData.append('type', requestType);

        // Mesajı oluştur
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
        alert('Talebiniz başarıyla iletildi! Admin panelinde incelenecek.');
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-purple-500/30 pb-20">

            {/* ÜST BAR */}
            <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                        <h1 className="text-xl font-bold tracking-tight">Proje Paneli</h1>
                        <span className="text-gray-500 text-sm hidden sm:inline-block">| {project.name}</span>
                    </div>
                    <form action={logoutClient}>
                        <button className="text-xs text-gray-400 hover:text-white flex items-center gap-2 border border-gray-700 px-3 py-1.5 rounded-lg transition hover:bg-gray-800">
                            <FaSignOutAlt /> Çıkış Yap
                        </button>
                    </form>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

                {/* 1. ÜST BÖLÜM: DURUM & İLERLEME */}
                {project.status === 'PRICING_SENT' || project.status === 'NEGOTIATION' ? (
                    <ProposalView project={project} />
                ) : (
                    // PROJE BAŞLADIYSA DASHBOARD GÖSTER
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* SOL: DETAYLAR ve İLERLEME */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* 👇 YENİ: PROJE KÜNYESİ (BÜTÇE & DETAYLAR) */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-[#0f1115] border border-gray-800 p-5 rounded-2xl flex flex-col justify-center items-center text-center hover:border-green-500/30 transition group">
                                    <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-2 group-hover:scale-110 transition">
                                        <FaMoneyBillWave />
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Anlaşılan Bütçe</span>
                                    <span className="text-lg font-bold text-white font-mono">
                                        {project.budget || project.clientOfferPrice || "Belirtilmedi"}
                                    </span>
                                </div>

                                <div className="bg-[#0f1115] border border-gray-800 p-5 rounded-2xl flex flex-col justify-center items-center text-center hover:border-orange-500/30 transition group">
                                    <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-500 mb-2 group-hover:scale-110 transition">
                                        <FaClock />
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Teslim Tarihi</span>
                                    <span className="text-lg font-bold text-white font-mono">
                                        {project.deadline || project.clientOfferDeadline || "Belirtilmedi"}
                                    </span>
                                </div>

                                <div className="bg-[#0f1115] border border-gray-800 p-5 rounded-2xl flex flex-col justify-center items-center text-center hover:border-blue-500/30 transition group">
                                    <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-500 mb-2 group-hover:scale-110 transition">
                                        <FaRocket />
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Başlangıç Tarihi</span>
                                    <span className="text-sm font-bold text-white font-mono">
                                        {project.startDate ? new Date(project.startDate).toLocaleDateString('tr-TR') : "Hazırlanıyor"}
                                    </span>
                                </div>
                            </div>

                            {/* CANLI İLERLEME KARTI */}
                            <div className="bg-[#0f1115] border border-gray-800 rounded-3xl p-8 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-32 bg-purple-600/10 rounded-full blur-3xl pointer-events-none group-hover:bg-purple-600/20 transition duration-1000"></div>

                                <div className="flex justify-between items-end mb-6 relative z-10">
                                    <div>
                                        <h2 className="text-3xl font-bold text-white mb-2">{project.name}</h2>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs bg-gray-800 px-2 py-1 rounded border border-gray-700 text-gray-400">Canlı Durum</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent font-mono">
                                            %{project.progress}
                                        </div>
                                        <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Tamamlandı</div>
                                    </div>
                                </div>

                                <div className="w-full bg-gray-900 rounded-full h-4 mb-4 overflow-hidden border border-gray-800 relative z-10">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${project.progress}%` }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full relative"
                                    >
                                        <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                                    </motion.div>
                                </div>

                                <div className="flex justify-between text-sm relative z-10">
                                    <div className="flex items-center gap-2 text-gray-300 bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-700/50">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        {project.currentStage || "Hazırlık Yapılıyor..."}
                                    </div>
                                    <span className="text-gray-500 text-xs self-center">Son Güncelleme: {new Date(project.updatedAt).toLocaleDateString('tr-TR')}</span>
                                </div>
                            </div>

                            {/* MEVCUT ÖZELLİKLER LİSTESİ */}
                            <div className="bg-[#0f1115] border border-gray-800 rounded-3xl p-8">
                                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                                    <FaListUl className="text-blue-500" /> Proje Envanteri (Mevcut Kapsam)
                                </h3>

                                {currentFeatures.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {currentFeatures.map((feat: string, i: number) => (
                                            <div key={i} className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-xl border border-gray-800/50 hover:bg-gray-800 transition">
                                                <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                                                    <FaCheck className="text-green-500 text-[10px]" />
                                                </div>
                                                <span className="text-sm text-gray-300 font-medium">{feat}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-500 text-sm border border-dashed border-gray-800 rounded-xl">
                                        Henüz tanımlanmış bir özellik listesi bulunmuyor.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* SAĞ: HIZLI İŞLEMLER & TALEP GEÇMİŞİ */}
                        <div className="space-y-4">
                            <div className="p-6 bg-gradient-to-b from-blue-900/10 to-transparent border border-blue-500/20 rounded-3xl">
                                <h3 className="text-lg font-bold text-white mb-4">Hızlı İşlemler</h3>
                                <div className="grid gap-3">
                                    <button
                                        onClick={() => { setRequestType('new_feature'); setRequestModalOpen(true); }}
                                        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
                                    >
                                        <FaPlus /> Yeni Özellik İste
                                    </button>
                                    <button
                                        onClick={() => { setRequestType('bug'); setRequestModalOpen(true); }}
                                        className="w-full py-3 bg-gray-900 border border-gray-800 hover:bg-red-900/10 hover:border-red-500/30 text-gray-300 hover:text-red-400 rounded-xl font-medium transition flex items-center justify-center gap-2"
                                    >
                                        <FaExclamationTriangle /> Sorun Bildir
                                    </button>
                                </div>
                            </div>

                            {/* Talepler Geçmişi */}
                            <div className="bg-[#0f1115] border border-gray-800 rounded-3xl p-6 h-[500px] flex flex-col">
                                <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
                                    <FaClock /> Talep Geçmişi
                                </h3>
                                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                                    {project.requests.length === 0 && <p className="text-gray-600 text-xs text-center py-10">Henüz talep oluşturmadınız.</p>}
                                    {project.requests.map((req: any) => (
                                        <div key={req.id} className="p-3 bg-gray-900/50 rounded-xl border border-gray-800/50 hover:border-gray-700 transition">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase
                                                    ${req.type === 'new_feature' ? 'bg-blue-500/10 text-blue-400' :
                                                        req.type === 'bug' ? 'bg-red-500/10 text-red-400' : 'bg-gray-800 text-gray-400'}`}>
                                                    {req.type === 'new_feature' ? 'Özellik' : req.type === 'bug' ? 'Hata' : 'Diğer'}
                                                </span>
                                                <span className={`text-[10px] font-bold ${req.status === 'PENDING' ? 'text-yellow-500' : req.status === 'APPROVED' ? 'text-green-500' : 'text-red-500'}`}>
                                                    {req.status === 'PENDING' ? 'Bekliyor' : req.status === 'APPROVED' ? 'Onaylandı' : 'Reddedildi'}
                                                </span>
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
                                <div>
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        {requestType === 'new_feature' ? <><FaPlus className="text-blue-500" /> Projeye Özellik Ekle</> : <><FaExclamationTriangle className="text-red-500" /> Sorun Bildir / Destek</>}
                                    </h3>
                                    <p className="text-gray-500 text-xs mt-1">
                                        {requestType === 'new_feature' ? 'Eklemek istediğin modülleri listeden seçebilirsin.' : 'Yaşadığın sorunu detaylıca anlat.'}
                                    </p>
                                </div>
                                <button onClick={() => setRequestModalOpen(false)} className="p-2 bg-gray-900 rounded-full text-gray-500 hover:text-white transition"><FaTimes /></button>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8 bg-[#0a0c10]">

                                {/* A) YENİ ÖZELLİK SEÇİCİ */}
                                {requestType === 'new_feature' && (
                                    <div className="space-y-8">
                                        {FEATURE_CATALOG.map((cat, index) => (
                                            <div key={index}>
                                                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2 border-b border-gray-800 pb-2">
                                                    {cat.icon} {cat.category}
                                                </h4>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                                    {cat.items.map((item) => {
                                                        const isOwned = currentFeatures.includes(item);
                                                        const isSelected = selectedNewFeatures.includes(item);

                                                        return (
                                                            <button
                                                                key={item}
                                                                disabled={isOwned}
                                                                onClick={() => toggleFeature(item)}
                                                                className={`p-3 rounded-xl border text-left text-xs font-medium transition flex items-center justify-between group
                                                                ${isOwned
                                                                        ? 'bg-gray-900/30 border-gray-800 text-gray-600 cursor-not-allowed opacity-50'
                                                                        : isSelected
                                                                            ? 'bg-blue-600/20 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                                                                            : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-600 hover:text-gray-200'}`}
                                                            >
                                                                {item}
                                                                {isOwned ? <span className="text-[9px] bg-gray-800 px-1.5 py-0.5 rounded text-gray-500 border border-gray-700">Mevcut</span> : isSelected && <FaCheck className="text-blue-500" />}
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* B) NOT / AÇIKLAMA ALANI */}
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase block mb-2">
                                        {requestType === 'new_feature' ? 'Ekstra Notlar / Özel İstekler' : 'Sorun Detayı'}
                                    </label>
                                    <textarea
                                        value={customRequestNote}
                                        onChange={(e) => setCustomRequestNote(e.target.value)}
                                        rows={4}
                                        className="w-full bg-black border border-gray-800 rounded-xl p-4 text-white focus:border-blue-500 outline-none resize-none text-sm"
                                        placeholder={requestType === 'new_feature' ? 'Listede olmayan özel bir isteğin varsa buraya yaz...' : 'Hata nerede oluştu? Hangi adımları izledin?'}
                                    />
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-800 bg-gray-950 flex justify-end gap-3">
                                <button onClick={() => setRequestModalOpen(false)} className="px-6 py-3 rounded-xl text-gray-500 font-bold hover:text-white transition">Vazgeç</button>
                                <button
                                    onClick={handleRequestSubmit}
                                    disabled={loading || (requestType === 'new_feature' && selectedNewFeatures.length === 0 && !customRequestNote.trim()) || (requestType === 'bug' && !customRequestNote.trim())}
                                    className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {loading ? 'Gönderiliyor...' : <><FaPaperPlane /> Talebi Gönder</>}
                                </button>
                            </div>

                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    );
}