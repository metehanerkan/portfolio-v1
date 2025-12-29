'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaRocket, FaClock, FaCheck, FaTimes, FaSignOutAlt, FaExclamationTriangle,
    FaPaperPlane, FaTools, FaPlus, FaLayerGroup, FaShoppingCart,
    FaMobileAlt, FaGlobe, FaShieldAlt, FaListUl, FaMoneyBillWave, FaInfoCircle,
    FaCloudUploadAlt, FaMagic, FaTrash, FaGamepad, FaServer, FaChartLine, FaRobot, FaFingerprint
} from 'react-icons/fa';
import { logoutClient } from '../login/actions';
import { submitProjectRequest } from './actions';
import ProposalView from './ProposalView';
import { toast } from 'react-hot-toast';
import { UploadButton } from '@/lib/uploadthing';

const FEATURE_POOLS = {
    common: [
        { category: 'Genel & Güvenlik', icon: <FaShieldAlt />, items: ['Yönetim Paneli (Admin Dashboard)', 'Gelişmiş Üyelik (Login/Register)', 'Google/Apple ile Giriş', 'Veri Yedekleme Sistemi', 'Canlı Destek / WhatsApp Hattı', 'KVKK & Gizlilik Modülü', 'Çoklu Dil Desteği (i18n)'] },
        { category: 'Yapay Zeka & Analiz', icon: <FaRobot />, items: ['AI Chatbot Entegrasyonu', 'Ziyaretçi Analizi (Analytics)', 'Otomatik İçerik Üretimi (GPT)', 'Kullanıcı Davranış Raporu'] }
    ],
    web: [
        { category: 'Web Geliştirme', icon: <FaGlobe />, items: ['SEO Optimizasyonu (Google Dostu)', 'PWA (Telefona İndirilebilir Web)', 'Karanlık/Aydınlık Mod', 'Blog / Haber Yönetimi', 'Hız Optimizasyonu (CDN)', 'Animasyonlu Sayfa Geçişleri', 'Kurumsal E-Posta Kurulumu'] },
        { category: 'E-Ticaret & Ödeme', icon: <FaShoppingCart />, items: ['Sanal POS (Iyzico/Stripe)', 'Sepet & Sipariş Sistemi', 'Stok Takibi & Varyasyon', 'İndirim Kuponu Modülü', 'Pazaryeri Entegrasyonu (Trendyol vb.)', 'Fatura Oluşturma'] }
    ],
    mobile: [
        { category: 'Mobil Özellikleri', icon: <FaMobileAlt />, items: ['Bildirim (Push Notification)', 'Offline Çalışma Modu', 'Kamera & QR Tarayıcı', 'Konum & Harita Entegrasyonu', 'App Store / Play Store Görselleri', 'Widget Desteği', 'Uygulama İçi Puanlama'] },
        { category: 'Kullanıcı Deneyimi', icon: <FaFingerprint />, items: ['Biyometrik Giriş (FaceID/TouchID)', 'Sosyal Medya Paylaşımı', 'Hikayeler (Stories) Modülü', 'Onboarding (Tanıtım) Ekranları'] }
    ],
    game: [
        { category: 'Oyun Özellikleri', icon: <FaGamepad />, items: ['Skor Tablosu (Leaderboard)', 'Multiplayer / Online Desteği', 'Oyun İçi Ekonomi (Coin/Elmas)', 'Reklam Modülü (AdMob/Unity)', 'Karakter Özelleştirme', 'Günlük Ödül Sistemi', 'Bulut Kayıt (Cloud Save)'] }
    ]
};

export default function DashboardClient({ project }: { project: any }) {
    const [requestModalOpen, setRequestModalOpen] = useState(false);
    const [requestType, setRequestType] = useState('new_feature');
    const [loading, setLoading] = useState(false);

    // Form State
    const [selectedNewFeatures, setSelectedNewFeatures] = useState<string[]>([]);
    const [customRequestNote, setCustomRequestNote] = useState('');
    const [attachment, setAttachment] = useState<string | null>(null);

    // --- 1. PROJE TÜRÜNÜ ALGILA ---
    const projectType = useMemo(() => {
        const desc = (project.description || "").toLowerCase();
        const cat = (project.category || "").toLowerCase();
        const combined = desc + " " + cat;

        if (combined.includes('mobil') || combined.includes('ios') || combined.includes('android') || combined.includes('app') || combined.includes('flutter') || combined.includes('react native')) return 'mobile';
        if (combined.includes('oyun') || combined.includes('game') || combined.includes('unity') || combined.includes('unreal')) return 'game';
        return 'web'; // Varsayılan
    }, [project]);

    // --- 2. GÖSTERİLECEK LİSTEYİ OLUŞTUR ---
    const activeCatalog = useMemo(() => {
        const specificFeatures = FEATURE_POOLS[projectType as keyof typeof FEATURE_POOLS] || FEATURE_POOLS.web;
        return [...FEATURE_POOLS.common, ...specificFeatures];
    }, [projectType]);

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
            const featuresText = selectedNewFeatures.length > 0 ? `🚀 EKLENECEK ÖZELLİKLER:\n${selectedNewFeatures.map(f => `- ${f}`).join('\n')}` : "";
            const customText = customRequestNote ? `\n\n📝 ÖZEL İSTEK / NOT:\n${customRequestNote}` : "";
            finalMessage = featuresText + customText;

            if (!finalMessage.trim()) {
                toast.error("Lütfen en az bir özellik seçin veya not yazın.");
                setLoading(false);
                return;
            }
        } else {
            finalMessage = customRequestNote;
        }

        formData.append('message', finalMessage);
        if (attachment) formData.append('attachmentUrl', attachment);

        await submitProjectRequest(formData);

        toast.success('Talebiniz iletildi! Yöneticimiz inceleyip dönüş yapacak.', {
            duration: 5000, icon: '🚀', style: { background: '#10B981', color: '#fff', fontWeight: 'bold' }
        });

        setLoading(false);
        setRequestModalOpen(false);
        setSelectedNewFeatures([]);
        setCustomRequestNote('');
        setAttachment(null);
    };

    if (project.status === 'CANCELLED') {
        return (
            <div className="min-h-full bg-black flex flex-col items-center justify-center p-6 text-center font-sans h-screen">
                <div className="bg-[#0f1115] border border-red-500/30 p-10 rounded-3xl shadow-2xl max-w-lg w-full relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20"><FaTimes className="text-4xl text-red-500" /></div>
                    <h1 className="text-2xl font-bold text-white mb-2">Proje İptal Edildi</h1>
                    <p className="text-gray-400 text-sm leading-relaxed mb-8">Bu proje yöneticisi tarafından durdurulmuştur. Artık işlem yapılamaz.</p>
                    <form action={logoutClient}><button className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold transition border border-gray-800 flex items-center justify-center gap-2"><FaSignOutAlt /> Çıkış Yap</button></form>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-full bg-black text-white font-sans">
            <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                        <h1 className="text-lg md:text-xl font-bold tracking-tight">Proje Paneli</h1>
                        <span className="text-gray-500 text-sm hidden sm:inline-block">| {project.name}</span>
                    </div>
                    <form action={logoutClient}><button className="text-xs text-gray-400 hover:text-white flex items-center gap-2 border border-gray-700 px-3 py-1.5 rounded-lg transition hover:bg-gray-800"><FaSignOutAlt /> <span className="hidden sm:inline">Çıkış</span></button></form>
                </div>
            </header>

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
                {project.status === 'PRICING_SENT' || project.status === 'NEGOTIATION' ? (
                    <ProposalView project={project} />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            {/* KÜNYE */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-[#0f1115] border border-gray-800 p-4 rounded-xl flex flex-col justify-center items-center text-center"><span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1"><FaMoneyBillWave className="text-green-500" /> Bütçe</span><span className="text-lg font-bold text-white font-mono">{project.budget || project.clientOfferPrice || "Belirtilmedi"}</span></div>
                                <div className="bg-[#0f1115] border border-gray-800 p-4 rounded-xl flex flex-col justify-center items-center text-center"><span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1"><FaClock className="text-orange-500" /> Teslim</span><span className="text-lg font-bold text-white font-mono">{project.deadline || project.clientOfferDeadline || "Belirtilmedi"}</span></div>
                                <div className="bg-[#0f1115] border border-gray-800 p-4 rounded-xl flex flex-col justify-center items-center text-center"><span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1"><FaRocket className="text-blue-500" /> Başlangıç</span><span className="text-sm font-bold text-white font-mono">{project.startDate ? new Date(project.startDate).toLocaleDateString('tr-TR') : "Bekleniyor"}</span></div>
                            </div>
                            {/* İLERLEME */}
                            <div className="bg-[#0f1115] border border-gray-800 rounded-2xl p-6 md:p-8 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-32 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
                                <div className="flex justify-between items-end mb-6 relative z-10">
                                    <div><h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{project.name}</h2><span className="text-xs bg-gray-800 px-2 py-1 rounded border border-gray-700 text-gray-400">Canlı Durum</span></div>
                                    <div className="text-right"><div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent font-mono">%{project.progress}</div><div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Tamamlandı</div></div>
                                </div>
                                <div className="w-full bg-gray-900 rounded-full h-3 mb-4 overflow-hidden border border-gray-800 relative z-10"><motion.div initial={{ width: 0 }} animate={{ width: `${project.progress}%` }} transition={{ duration: 1.5, ease: "easeOut" }} className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full relative"><div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div></motion.div></div>
                                <div className="flex justify-between text-sm relative z-10"><div className="flex items-center gap-2 text-gray-300 bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-700/50"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>{project.currentStage || "Hazırlık Yapılıyor..."}</div><span className="text-gray-500 text-xs self-center">Güncelleme: {new Date(project.updatedAt).toLocaleDateString('tr-TR')}</span></div>
                            </div>
                            {/* ENVANTER */}
                            <div className="bg-[#0f1115] border border-gray-800 rounded-2xl p-6">
                                <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 flex items-center gap-2 tracking-wider"><FaListUl className="text-blue-500" /> Proje Envanteri</h3>
                                {currentFeatures.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{currentFeatures.map((feat: string, i: number) => (<div key={i} className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-xl border border-gray-800/50 hover:bg-gray-800 transition"><div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0"><FaCheck className="text-green-500 text-[10px]" /></div><span className="text-sm text-gray-300">{feat}</span></div>))}</div>
                                ) : (<div className="text-center py-6 text-gray-500 text-xs border border-dashed border-gray-800 rounded-xl">Özellik listesi yükleniyor veya boş.</div>)}
                            </div>
                        </div>
                        {/* SAĞ */}
                        <div className="space-y-6">
                            <div className="p-6 bg-gradient-to-b from-blue-900/10 to-transparent border border-blue-500/20 rounded-2xl"><h3 className="text-lg font-bold text-white mb-4">Hızlı İşlemler</h3><div className="grid gap-3"><button onClick={() => { setRequestType('new_feature'); setRequestModalOpen(true); }} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"><FaPlus /> Yeni Özellik İste</button><button onClick={() => { setRequestType('bug'); setRequestModalOpen(true); }} className="w-full py-3 bg-gray-900 border border-gray-800 hover:bg-red-900/10 hover:border-red-500/30 text-gray-300 hover:text-red-400 rounded-xl font-medium transition flex items-center justify-center gap-2"><FaExclamationTriangle /> Sorun Bildir</button></div></div>
                            <div className="bg-[#0f1115] border border-gray-800 rounded-2xl p-6 h-[400px] flex flex-col"><h3 className="text-sm font-bold text-gray-400 uppercase mb-4 flex items-center gap-2 tracking-wider"><FaClock /> Talep Geçmişi</h3><div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">{project.requests.length === 0 && <p className="text-gray-600 text-xs text-center py-10">Henüz talep yok.</p>}{project.requests.map((req: any) => (<div key={req.id} className="p-3 bg-gray-900/50 rounded-xl border border-gray-800/50 hover:border-gray-700 transition"><div className="flex justify-between items-start mb-2"><span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${req.type === 'new_feature' ? 'bg-blue-500/10 text-blue-400' : req.type === 'bug' ? 'bg-red-500/10 text-red-400' : 'bg-gray-800 text-gray-400'}`}>{req.type === 'new_feature' ? 'Özellik' : req.type === 'bug' ? 'Hata' : 'Diğer'}</span><span className={`text-[10px] font-bold ${req.status === 'PENDING' ? 'text-yellow-500' : req.status === 'APPROVED' ? 'text-green-500' : 'text-red-500'}`}>{req.status === 'PENDING' ? 'Bekliyor' : req.status === 'APPROVED' ? 'Onaylandı' : 'Reddedildi'}</span></div><p className="text-xs text-gray-400 line-clamp-2">{req.message}</p><span className="text-[10px] text-gray-600 mt-2 block">{new Date(req.createdAt).toLocaleDateString('tr-TR')}</span></div>))}</div></div>
                        </div>
                    </div>
                )}
            </main>

            {/* MODAL */}
            <AnimatePresence>
                {requestModalOpen && (
                    <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setRequestModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.95, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 50 }} className="bg-[#0f1115] border border-gray-800 rounded-3xl shadow-2xl relative z-10 max-w-5xl w-full flex flex-col max-h-[90vh] overflow-hidden">
                            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-950">
                                <div><h3 className="text-xl font-bold text-white flex items-center gap-2">{requestType === 'new_feature' ? <><FaMagic className="text-blue-500" /> Projeyi Geliştir</> : <><FaExclamationTriangle className="text-red-500" /> Sorun Bildir</>}</h3><p className="text-gray-500 text-xs mt-1">{requestType === 'new_feature' ? `Proje türüne (${projectType.toUpperCase()}) uygun öneriler aşağıdadır.` : 'Yaşadığın sorunu detaylıca anlat.'}</p></div>
                                <button onClick={() => setRequestModalOpen(false)} className="p-2 bg-gray-900 rounded-full text-gray-500 hover:text-white transition"><FaTimes /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0a0c10]">
                                <div className="grid grid-cols-1 md:grid-cols-3 min-h-full">
                                    <div className="md:col-span-2 p-8 space-y-8 border-r border-gray-800">
                                        {requestType === 'new_feature' && (
                                            <div className="space-y-8">
                                                {activeCatalog.map((cat, index) => (
                                                    <div key={index}>
                                                        <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2 border-b border-gray-800 pb-2">{cat.icon} {cat.category}</h4>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{cat.items.map((item) => { const isOwned = currentFeatures.includes(item); const isSelected = selectedNewFeatures.includes(item); return (<button key={item} disabled={isOwned} onClick={() => toggleFeature(item)} className={`p-3 rounded-xl border text-left text-xs font-medium transition flex items-center justify-between group ${isOwned ? 'bg-gray-900/30 border-gray-800 text-gray-600 cursor-not-allowed opacity-50' : isSelected ? 'bg-blue-600/20 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.15)]' : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-600 hover:text-gray-200'}`}>{item} {isOwned ? <span className="text-[9px] bg-gray-800 px-1.5 py-0.5 rounded text-gray-500 border border-gray-700">Mevcut</span> : isSelected && <FaCheck className="text-blue-500" />}</button>) })}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <div><label className="text-xs font-bold text-gray-500 uppercase block mb-2 flex items-center gap-2"><FaMagic className="text-purple-500" /> {requestType === 'new_feature' ? 'Listede Yok mu? Hayalindekini Yaz' : 'Sorun Detayı'}</label><textarea value={customRequestNote} onChange={(e) => setCustomRequestNote(e.target.value)} rows={5} className="w-full bg-black border border-gray-800 rounded-xl p-4 text-white focus:border-blue-500 outline-none resize-none text-sm placeholder:text-gray-700 focus:ring-1 focus:ring-blue-500/50 transition" placeholder={requestType === 'new_feature' ? 'Örn: Kullanıcılar profil fotoğraflarına filtre ekleyebilsin...' : 'Hata nerede oluştu?'} /></div>
                                    </div>
                                    <div className="md:col-span-1 bg-gray-950/50 p-8 flex flex-col gap-6">
                                        <div className="flex-1"><label className="text-xs font-bold text-gray-500 uppercase block mb-3">Dosya / Ekran Görüntüsü</label>{attachment ? (<div className="flex flex-col items-center justify-center bg-green-500/10 p-6 rounded-xl border border-green-500/20 group h-40"><div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mb-2"><FaCheck /></div><span className="text-green-500 text-sm font-bold block mb-2">Dosya Yüklendi</span><div className="flex gap-2"><a href={attachment} target="_blank" className="text-[10px] bg-green-900/50 px-3 py-1 rounded text-green-200 hover:text-white transition">Görüntüle</a><button onClick={() => setAttachment(null)} className="text-[10px] bg-red-900/50 px-3 py-1 rounded text-red-300 hover:text-white transition">Sil</button></div></div>) : (<div className="border-2 border-dashed border-gray-800 rounded-xl bg-gray-900/30 hover:bg-gray-900/50 hover:border-gray-700 transition relative group p-4 h-40 flex flex-col items-center justify-center gap-2 text-center"><div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-500 group-hover:text-white transition group-hover:scale-110 duration-300"><FaCloudUploadAlt size={20} /></div><div><span className="text-xs font-bold text-gray-400 block group-hover:text-white transition">Dosya Yükle</span><span className="text-[9px] text-gray-600 block">Resim veya PDF (Max 4MB)</span></div><div className="absolute inset-0 opacity-0 cursor-pointer"><UploadButton endpoint="clientAttachment" onClientUploadComplete={(res) => { setAttachment(res[0].url); toast.success("Dosya yüklendi!"); }} onUploadError={(error: Error) => { toast.error(`Hata: ${error.message}`); }} appearance={{ button: "w-full h-full", allowedContent: "hidden" }} /></div></div>)}</div>
                                        <div className="bg-gray-900 p-4 rounded-xl border border-gray-800"><h5 className="text-white text-xs font-bold mb-2">Özet</h5><ul className="text-[10px] text-gray-400 space-y-1"><li className="flex justify-between"><span>Seçilen Özellik:</span> <span className="text-white">{selectedNewFeatures.length}</span></li><li className="flex justify-between"><span>Özel Not:</span> <span className="text-white">{customRequestNote ? 'Var' : 'Yok'}</span></li><li className="flex justify-between"><span>Dosya Eki:</span> <span className="text-white">{attachment ? 'Var' : 'Yok'}</span></li></ul></div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-t border-gray-800 bg-gray-950 flex justify-end gap-3 rounded-b-3xl"><button onClick={() => setRequestModalOpen(false)} className="px-6 py-3 rounded-xl text-gray-500 font-bold hover:text-white transition">Vazgeç</button><button onClick={handleRequestSubmit} disabled={loading || (requestType === 'new_feature' && selectedNewFeatures.length === 0 && !customRequestNote.trim()) || (requestType === 'bug' && !customRequestNote.trim())} className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold transition shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">{loading ? 'Gönderiliyor...' : <><FaPaperPlane /> Gönder</>}</button></div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}