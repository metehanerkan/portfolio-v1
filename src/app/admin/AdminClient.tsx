'use client';

import { useState, useRef } from 'react';
import {
    FaProjectDiagram, FaPenNib, FaChartBar, FaEnvelope, FaCog,
    FaStar, FaToggleOn, FaToggleOff, FaEdit, FaUpload, FaTimes, FaImage, FaTrash, FaSignOutAlt, FaEye, FaRocket, FaCheck, FaBriefcase, FaClock, FaExpand, FaFileContract, FaMoneyBillWave, FaPaperPlane, FaTools, FaSave, FaHandshake, FaExchangeAlt, FaListUl, FaLink, FaPaintBrush, FaAlignLeft, FaLaptopCode, FaInfoCircle, FaPlus, FaFolderOpen, FaUser, FaMobileAlt, FaCommentDots, FaExclamationTriangle, FaPaperclip, FaExternalLinkAlt
} from 'react-icons/fa';
import {
    addProject, deleteProject, addBlog, deleteBlog, deleteMessage,
    toggleProjectStatus, toggleProjectFeatured, toggleBlogStatus, toggleBlogFeatured,
    updateProject, updateBlog, acceptProject, deleteClientProject, sendProposal, updateProjectProgress, acceptClientOffer, updateProjectStatus, cancelProject
} from './actions';
import Link from 'next/link';
import { logout } from '@/app/login/actions';
import MarkdownEditor from '@/components/MarkdownEditor';
import { motion, AnimatePresence } from 'framer-motion';
import { updateRequestStatus } from '@/app/admin/actions';
import { toast } from 'react-hot-toast';

interface AdminClientProps {
    projects: any[];
    blogs: any[];
    messages: any[];
    clientProjects: any[];
}

const PROJECT_CATEGORIES = ['Web', 'Mobil', 'Sistem', 'Oyun', 'Diğer'];
const BLOG_CATEGORIES = ['Yazılım', 'Kariyer', 'Teknoloji', 'Rehber', 'Diğer'];

// --- YARDIMCI FONKSİYON: Log Metnini Parse Etme ---
const parseProjectDescription = (desc: string) => {
    if (!desc) return { budget: '-', deadline: '-', platforms: [], design: '-', notes: '' };

    const getVal = (key: string) => desc.split('\n').find((l: string) => l.includes(key))?.split(':')[1]?.trim();

    return {
        budget: getVal('💰 Bütçe') || getVal('Bütçe') || '-',
        deadline: getVal('📅 Süre') || getVal('Süre') || '-',
        platforms: getVal('📱 Platformlar')?.split(', ') || [],
        design: getVal('🎨 Tasarım Durumu') || '-',
        notes: desc.split('📝 NOTLAR:')[1]?.trim() || desc.split('-------------------').pop()?.trim() || ''
    };
};

export default function AdminClient({ projects, blogs, messages, clientProjects }: AdminClientProps) {
    const [activeTab, setActiveTab] = useState<'stats' | 'projects' | 'blogs' | 'messages' | 'activeProjects' | 'settings'>('stats');
    const [subTab, setSubTab] = useState<'list' | 'form'>('list');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // --- STATE YÖNETİMİ ---
    const [selectedMessage, setSelectedMessage] = useState<any>(null);
    const [projectToAccept, setProjectToAccept] = useState<any>(null);
    const [projectToOffer, setProjectToOffer] = useState<any>(null);
    const [projectToNegotiate, setProjectToNegotiate] = useState<any>(null);
    const [activeProjectToEdit, setActiveProjectToEdit] = useState<any>(null);
    const [manageTab, setManageTab] = useState<'info' | 'progress' | 'requests'>('progress');

    // State'ler (Blog/Proje Ekleme)
    const [blogContent, setBlogContent] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [editingProject, setEditingProject] = useState<any>(null);
    const [editingBlog, setEditingBlog] = useState<any>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    // Refler
    const projectFormRef = useRef<HTMLFormElement>(null);
    const blogFormRef = useRef<HTMLFormElement>(null);

    // Hesaplamalar
    const totalProjectViews = projects.reduce((acc, curr) => acc + (curr.viewCount || 0), 0);
    const totalBlogViews = blogs.reduce((acc, curr) => acc + (curr.viewCount || 0), 0);
    const totalViews = totalProjectViews + totalBlogViews;

    // Filtreleme (Aktif Projeler - İptal edilenler dahil)
    const activeClientProjects = clientProjects.filter(p => p.status === 'APPROVED' || p.status === 'COMPLETED' || p.status === 'CANCELLED');

    // Helperlar
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { toast.error("Dosya çok büyük! Lütfen 2MB altı bir resim seçin."); return; }
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };
    const startEditProject = (project: any) => { setEditingProject(project); setImagePreview(project.imageUrl); setProjectDescription(project.description); setSubTab('form'); };
    const startEditBlog = (b: any) => { setEditingBlog(b); setImagePreview(b.imageUrl); setBlogContent(b.content); setSubTab('form'); };
    const startNewEntry = () => {
        setEditingProject(null); setEditingBlog(null); setBlogContent(''); setProjectDescription(''); setImagePreview(''); setSubTab('form');
        if (projectFormRef.current) projectFormRef.current.reset();
        if (blogFormRef.current) blogFormRef.current.reset();
    };

    const handleAcceptClientOffer = async (formData: FormData) => {
        await acceptClientOffer(formData);
        setProjectToNegotiate(null);
        toast.success("Müşteri teklifi kabul edildi ve proje başlatıldı! 🎉");
    };

    const executeAcceptance = async () => {
        if (!projectToAccept) return;
        await acceptProject(projectToAccept.id, projectToAccept.name, projectToAccept.email, projectToAccept.message, projectToAccept.subject);
        setProjectToAccept(null);
        setSelectedMessage(null);
    };

    const handleSendProposal = async (formData: FormData) => {
        await sendProposal(formData);
        setProjectToOffer(null);
        setProjectToNegotiate(null);
        toast.success("Teklif başarıyla gönderildi! 🚀");
        setShowSuccessModal(true);
        setTimeout(() => setShowSuccessModal(false), 3000);
    };

    const handleUpdateProgress = async (formData: FormData) => {
        await updateProjectStatus(formData);
        setActiveProjectToEdit(null);
        toast.success("Proje durumu güncellendi! Müşteri bilgilendirildi.");
    };

    const renderStats = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 animate-fadeIn">
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-yellow-500 transition group"><div className="flex justify-between items-start"><div><p className="text-gray-400 text-xs uppercase font-bold">Toplam Görüntülenme</p><h3 className="text-3xl font-bold text-white mt-2">{totalViews}</h3></div><div className="p-3 bg-yellow-500/10 rounded-lg text-yellow-500 group-hover:bg-yellow-500 group-hover:text-white transition"><FaEye size={20} /></div></div></div>
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-blue-600 transition group"><div className="flex justify-between items-start"><div><p className="text-gray-400 text-xs uppercase font-bold">Portfolio Projeleri</p><h3 className="text-3xl font-bold text-white mt-2">{projects.length}</h3></div><div className="p-3 bg-blue-500/10 rounded-lg text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition"><FaProjectDiagram size={20} /></div></div></div>
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-green-600 transition group"><div className="flex justify-between items-start"><div><p className="text-gray-400 text-xs uppercase font-bold">Blog Yazıları</p><h3 className="text-3xl font-bold text-white mt-2">{blogs.length}</h3></div><div className="p-3 bg-green-500/10 rounded-lg text-green-500 group-hover:bg-green-500 group-hover:text-white transition"><FaPenNib size={20} /></div></div></div>
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-purple-600 transition group"><div className="flex justify-between items-start"><div><p className="text-gray-400 text-xs uppercase font-bold">Mesajlar</p><h3 className="text-3xl font-bold text-white mt-2">{messages.length}</h3></div><div className="p-3 bg-purple-500/10 rounded-lg text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition"><FaEnvelope size={20} /></div></div></div>
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-orange-500 transition group"><div className="flex justify-between items-start"><div><p className="text-gray-400 text-xs uppercase font-bold">Aktif Müşteri İşleri</p><h3 className="text-3xl font-bold text-white mt-2">{clientProjects.length}</h3></div><div className="p-3 bg-orange-500/10 rounded-lg text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition"><FaBriefcase size={20} /></div></div></div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'stats':
                return (
                    <div className="space-y-8">
                        <h2 className="text-2xl font-bold text-white">Genel Bakış</h2>
                        {renderStats()}
                        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <FaTools className="text-green-500" /> Devam Eden Projeler (Şantiye)
                                </h3>
                                <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">{activeClientProjects.length}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {activeClientProjects.map((proj) => {
                                    let statusColor = "text-orange-400 bg-orange-500/20 border-orange-500/20";
                                    let statusText = "DEVAM EDİYOR";

                                    if (proj.status === 'WAITING_BRIEF') { statusColor = "text-blue-400 bg-blue-500/20 border-blue-500/20"; statusText = "DETAY BEKLENİYOR"; }
                                    if (proj.status === 'BRIEF_SUBMITTED') { statusColor = "text-purple-400 bg-purple-500/20 border-purple-500/20"; statusText = "İNCELEME BEKLİYOR"; }
                                    if (proj.status === 'PRICING_SENT') { statusColor = "text-yellow-400 bg-yellow-500/20 border-yellow-500/20"; statusText = "TEKLİF GÖNDERİLDİ"; }
                                    if (proj.status === 'NEGOTIATION') { statusColor = "text-yellow-400 bg-yellow-500/20 border-yellow-500/20 animate-pulse"; statusText = "PAZARLIK / REVİZE"; }
                                    if (proj.status === 'APPROVED') { statusColor = "text-green-400 bg-green-500/20 border-green-500/20"; statusText = "ONAYLANDI / AKTİF"; }
                                    if (proj.status === 'CANCELLED') { statusColor = "text-red-500 bg-red-500/10 border-red-500/20"; statusText = "İPTAL EDİLDİ"; }

                                    return (
                                        <div key={proj.id} className={`bg-[#0f1115] border rounded-2xl p-6 transition group relative overflow-hidden ${proj.status === 'CANCELLED' ? 'border-red-500/20 hover:border-red-500/40 opacity-75' : 'border-gray-800 hover:border-green-500/30'}`}>
                                            <div className={`absolute top-0 left-0 w-full h-1 ${proj.status === 'CANCELLED' ? 'bg-red-500' : 'bg-green-600'}`}></div>
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-lg font-bold text-white truncate max-w-[150px]">{proj.name}</h3>
                                                    <p className="text-xs text-gray-500 truncate max-w-[150px]">{proj.email}</p>
                                                </div>
                                                <span className={`text-2xl font-mono font-bold ${proj.status === 'CANCELLED' ? 'text-red-500' : 'text-green-500'}`}>%{proj.progress}</span>
                                            </div>
                                            <div className="w-full bg-gray-900 rounded-full h-2 mb-4 overflow-hidden">
                                                <div style={{ width: `${proj.progress}%` }} className={`h-full rounded-full ${proj.status === 'CANCELLED' ? 'bg-red-600' : 'bg-green-600'}`}></div>
                                            </div>
                                            <div className="flex items-center justify-between text-xs text-gray-400 mb-6">
                                                <span className={`px-2 py-1 rounded border ${statusColor}`}>{statusText}</span>
                                            </div>
                                            <button onClick={() => setActiveProjectToEdit(proj)} className="w-full py-3 bg-gray-900 border border-gray-800 rounded-xl text-gray-300 font-bold hover:bg-gray-800 hover:text-white hover:border-green-500/50 transition flex items-center justify-center gap-2 text-sm">
                                                <FaTools /> Yönet / Güncelle
                                            </button>
                                        </div>
                                    );
                                })}
                                {activeClientProjects.length === 0 && (
                                    <div className="col-span-full p-8 border border-gray-800 border-dashed rounded-2xl text-center text-gray-600">
                                        Şu an aktif yürütülen bir proje yok.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case 'projects':
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">Proje Yönetimi</h2>
                            <div className="flex bg-gray-900 p-1 rounded-lg border border-gray-800">
                                <button onClick={() => setSubTab('list')} className={`px-4 py-2 rounded-md text-sm transition ${subTab === 'list' ? 'bg-gray-800 text-white' : 'text-gray-400'}`}>Listele</button>
                                <button onClick={startNewEntry} className={`px-4 py-2 rounded-md text-sm transition ${subTab === 'form' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>{editingProject ? 'Düzenleniyor...' : 'Yeni Ekle'}</button>
                            </div>
                        </div>
                        {subTab === 'list' ? (
                            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                                <div className="p-4 border-b border-gray-800 bg-gray-900/50 flex justify-between text-xs text-gray-500 font-semibold uppercase tracking-wider"><span>Proje Detayı</span><span>İstatistik & İşlemler</span></div>
                                {projects.map((proj) => (
                                    <div key={proj.id} className="flex justify-between items-center p-4 border-b border-gray-800 last:border-0 hover:bg-gray-800/50 transition">
                                        <div className="flex items-center gap-4">{proj.imageUrl ? <img src={proj.imageUrl} className="w-14 h-14 rounded-lg bg-gray-800 object-cover" /> : <div className="w-14 h-14 rounded-lg bg-gray-800 flex items-center justify-center text-gray-500"><FaImage /></div>}<div><h4 className="font-bold text-white">{proj.title}</h4><span className="text-xs text-gray-500">{proj.category}</span></div></div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2 text-gray-400 bg-gray-950 px-3 py-1.5 rounded-lg border border-gray-800 text-sm"><FaEye className="text-blue-500" /><span className="font-mono">{proj.viewCount || 0}</span></div>
                                            <button onClick={() => toggleProjectFeatured(proj.id, proj.isFeatured)} className={`p-2 rounded-lg transition ${proj.isFeatured ? 'text-yellow-400' : 'text-gray-600'}`}><FaStar size={18} /></button>
                                            <button onClick={() => toggleProjectStatus(proj.id, proj.isPublished)} className={`p-2 rounded-lg transition ${proj.isPublished ? 'text-green-400' : 'text-gray-500'}`}>{proj.isPublished ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}</button>
                                            <button onClick={() => startEditProject(proj)} className="p-2 text-gray-400 hover:text-blue-400"><FaEdit size={18} /></button>
                                            <form action={deleteProject}><input type="hidden" name="id" value={proj.id} /><button className="p-2 text-gray-400 hover:text-red-500"><FaTrash size={16} /></button></form>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <form ref={projectFormRef} action={editingProject ? updateProject : addProject} className="bg-gray-900 p-6 rounded-2xl border border-gray-800 space-y-4">
                                {editingProject && <input type="hidden" name="id" value={editingProject.id} />}
                                <div className="grid grid-cols-2 gap-4"><input name="title" defaultValue={editingProject?.title} placeholder="Proje Adı" className="input-dark" required /><select name="category" defaultValue={editingProject?.category || ""} className="input-dark" required><option value="" disabled>Kategori</option>{PROJECT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                                <MarkdownEditor value={projectDescription} onChange={setProjectDescription} label="Açıklama" />
                                <input type="hidden" name="description" value={projectDescription} />
                                <div className="border border-dashed border-gray-700 rounded-xl p-4 text-center hover:border-blue-500 transition bg-gray-950"><input type="file" accept="image/*" onChange={handleImageChange} id="proj-img" className="hidden" /><label htmlFor="proj-img" className="cursor-pointer text-gray-400 hover:text-white flex flex-col items-center">{imagePreview ? <img src={imagePreview} className="h-32 object-contain" /> : <><FaUpload /> <span>Resim Seç</span></>}</label><input type="hidden" name="imageUrl" value={imagePreview} /></div>
                                <input name="technologies" defaultValue={editingProject?.technologies.join(', ')} placeholder="Teknolojiler" className="input-dark" required />
                                <div className="grid grid-cols-2 gap-4"><input name="githubUrl" defaultValue={editingProject?.githubUrl} placeholder="Github URL" className="input-dark" /><input name="liveUrl" defaultValue={editingProject?.liveUrl} placeholder="Live URL" className="input-dark" /></div>
                                <button className="btn-primary w-full">{editingProject ? 'Güncelle' : 'Kaydet'}</button>
                            </form>
                        )}
                    </div>
                );

            case 'blogs':
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">Blog Yönetimi</h2>
                            <div className="flex bg-gray-900 p-1 rounded-lg border border-gray-800">
                                <button onClick={() => setSubTab('list')} className={`px-4 py-2 rounded-md text-sm transition ${subTab === 'list' ? 'bg-gray-800 text-white' : 'text-gray-400'}`}>Listele</button>
                                <button onClick={startNewEntry} className={`px-4 py-2 rounded-md text-sm transition ${subTab === 'form' ? 'bg-green-600 text-white' : 'text-gray-400'}`}>{editingBlog ? 'Düzenleniyor...' : 'Yeni Ekle'}</button>
                            </div>
                        </div>
                        {subTab === 'list' ? (
                            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                                <div className="p-4 border-b border-gray-800 bg-gray-900/50 flex justify-between text-xs text-gray-500 font-semibold uppercase tracking-wider"><span>Blog</span><span>İstatistik & İşlemler</span></div>
                                {blogs.map((b) => (
                                    <div key={b.id} className="flex justify-between items-center p-4 border-b border-gray-800 last:border-0 hover:bg-gray-800/50 transition">
                                        <div className="flex items-center gap-4">{b.imageUrl ? <img src={b.imageUrl} className="w-14 h-14 rounded-lg bg-gray-800 object-cover" /> : <div className="w-14 h-14 rounded-lg bg-gray-800 flex items-center justify-center text-gray-500"><FaImage /></div>}<div><h4 className="font-bold text-white">{b.title}</h4><span className="text-xs text-gray-500">{b.category}</span></div></div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2 text-gray-400 bg-gray-950 px-3 py-1.5 rounded-lg border border-gray-800 text-sm"><FaEye className="text-green-500" /><span className="font-mono">{b.viewCount || 0}</span></div>
                                            <button onClick={() => toggleBlogFeatured(b.id, b.isFeatured)} className={`p-2 rounded-lg transition ${b.isFeatured ? 'text-yellow-400' : 'text-gray-600'}`}><FaStar size={18} /></button>
                                            <button onClick={() => toggleBlogStatus(b.id, b.isPublished)} className={`p-2 rounded-lg transition ${b.isPublished ? 'text-green-400' : 'text-gray-500'}`}>{b.isPublished ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}</button>
                                            <button onClick={() => startEditBlog(b)} className="p-2 text-gray-400 hover:text-green-400"><FaEdit size={18} /></button>
                                            <form action={deleteBlog}><input type="hidden" name="id" value={b.id} /><button className="p-2 text-gray-400 hover:text-red-500"><FaTrash size={16} /></button></form>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <form ref={blogFormRef} action={editingBlog ? updateBlog : addBlog} className="bg-gray-900 p-6 rounded-2xl border border-gray-800 space-y-4">
                                {editingBlog && <input type="hidden" name="id" value={editingBlog.id} />}
                                <input name="title" defaultValue={editingBlog?.title} placeholder="Başlık" className="input-dark" required />
                                <div className="grid grid-cols-2 gap-4"><select name="category" defaultValue={editingBlog?.category || ""} className="input-dark" required><option value="" disabled>Kategori</option>{BLOG_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select><input name="readTime" defaultValue={editingBlog?.readTime} placeholder="Süre" className="input-dark" required /></div>
                                <div className="border border-dashed border-gray-700 rounded-xl p-4 text-center hover:border-green-500 transition bg-gray-950"><input type="file" accept="image/*" onChange={handleImageChange} id="blog-img" className="hidden" /><label htmlFor="blog-img" className="cursor-pointer text-gray-400 hover:text-white flex flex-col items-center">{imagePreview ? <img src={imagePreview} className="h-32 object-contain" /> : <><FaUpload /> <span>Kapak Resmi</span></>}</label><input type="hidden" name="imageUrl" value={imagePreview} /></div>
                                <textarea name="excerpt" defaultValue={editingBlog?.excerpt} placeholder="Özet" className="input-dark h-20" required />
                                <MarkdownEditor value={blogContent} onChange={setBlogContent} label="İçerik" /><input type="hidden" name="content" value={blogContent} />
                                <button className="btn-success w-full">{editingBlog ? 'Güncelle' : 'Yayınla'}</button>
                            </form>
                        )}
                    </div>
                );

            case 'messages':
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <h2 className="text-2xl font-bold text-white">Gelen Mesajlar</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {messages.length === 0 && <p className="text-center py-10 text-gray-500 bg-gray-900 rounded-2xl">Mesaj yok.</p>}
                            {messages.map((msg) => {
                                const isProjectRequest = msg.message.includes('PROJE') || msg.subject.includes('🚀');
                                const parsed = isProjectRequest ? parseProjectDescription(msg.message) : null;

                                return (
                                    <div key={msg.id} onClick={() => setSelectedMessage(msg)} className={`bg-gray-900 p-6 rounded-2xl border transition relative cursor-pointer group ${isProjectRequest ? 'border-purple-500/50 hover:border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.1)]' : 'border-gray-800 hover:border-gray-700'}`}>
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="font-bold text-white text-lg flex items-center gap-2">
                                                    {msg.name}
                                                    {isProjectRequest && <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30 flex items-center gap-1"><FaRocket size={8} /> PROJE TALEBİ</span>}
                                                </h4>
                                                <p className="text-sm text-gray-400">{msg.email}</p>
                                            </div>
                                            <span className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleDateString('tr-TR')}</span>
                                        </div>

                                        {isProjectRequest && parsed ? (
                                            <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 grid grid-cols-1 gap-3">
                                                <div className="flex gap-2 items-center text-sm font-bold text-white border-b border-gray-800 pb-2 mb-2">
                                                    {msg.subject.replace('🚀', '').trim()}
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                    <div className="bg-gray-900/50 p-2 rounded border border-gray-800 flex flex-col">
                                                        <span className="text-green-500 font-bold mb-1">Bütçe</span>
                                                        <span className="text-gray-300">{parsed.budget}</span>
                                                    </div>
                                                    <div className="bg-gray-900/50 p-2 rounded border border-gray-800 flex flex-col">
                                                        <span className="text-orange-500 font-bold mb-1">Süre</span>
                                                        <span className="text-gray-300">{parsed.deadline}</span>
                                                    </div>
                                                </div>
                                                {parsed.platforms.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {parsed.platforms.map((p: string, i: number) => (
                                                            <span key={i} className="text-[10px] bg-blue-500/10 text-blue-300 px-2 py-1 rounded border border-blue-500/20">{p}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-gray-300 bg-gray-950 p-4 rounded-xl text-sm border border-gray-800 whitespace-pre-wrap group-hover:bg-gray-900 transition-colors break-words">
                                                {msg.message.length > 150 ? msg.message.substring(0, 150) + '...' : msg.message}
                                            </p>
                                        )}

                                        <div className="mt-4 flex justify-end gap-3" onClick={(e) => e.stopPropagation()}>
                                            {isProjectRequest && (<button onClick={() => setProjectToAccept(msg)} className="text-green-400 text-sm hover:text-green-300 flex items-center gap-1 bg-green-500/10 px-3 py-2 rounded-lg border border-green-500/20 transition hover:bg-green-500/20"><FaCheck /> İncele & Başlat</button>)}
                                            <form action={deleteMessage}><input type="hidden" name="id" value={msg.id} /><button className="text-red-400 text-sm hover:text-red-300 flex items-center gap-1 px-3 py-2"><FaTrash size={12} /> Sil</button></form>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );

            case 'activeProjects':
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <h2 className="text-2xl font-bold text-white">Müşteri Proje Yönetimi</h2>
                        {clientProjects.length === 0 ? (
                            <div className="text-center py-20 bg-gray-900 rounded-2xl border border-gray-800 border-dashed">
                                <FaBriefcase className="mx-auto text-4xl text-gray-700 mb-4" /><p className="text-gray-500">Henüz kabul edilmiş aktif bir proje yok.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-4">
                                {clientProjects.map((proj) => {
                                    let statusColor = "text-orange-400 bg-orange-500/20 border-orange-500/20";
                                    let statusText = "DEVAM EDİYOR";

                                    if (proj.status === 'WAITING_BRIEF') { statusColor = "text-blue-400 bg-blue-500/20 border-blue-500/20"; statusText = "DETAY BEKLENİYOR"; }
                                    if (proj.status === 'BRIEF_SUBMITTED') { statusColor = "text-purple-400 bg-purple-500/20 border-purple-500/20"; statusText = "İNCELEME BEKLİYOR"; }
                                    if (proj.status === 'PRICING_SENT') { statusColor = "text-yellow-400 bg-yellow-500/20 border-yellow-500/20"; statusText = "TEKLİF GÖNDERİLDİ"; }
                                    if (proj.status === 'NEGOTIATION') { statusColor = "text-yellow-400 bg-yellow-500/20 border-yellow-500/20 animate-pulse"; statusText = "PAZARLIK / REVİZE"; }
                                    if (proj.status === 'APPROVED') { statusColor = "text-green-400 bg-green-500/20 border-green-500/20"; statusText = "ONAYLANDI / AKTİF"; }
                                    if (proj.status === 'CANCELLED') { statusColor = "text-red-500 bg-red-500/10 border-red-500/20"; statusText = "İPTAL EDİLDİ"; }

                                    const parsed = parseProjectDescription(proj.description);

                                    return (
                                        <div key={proj.id} className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-blue-500/50 transition">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h4 className="font-bold text-white text-xl flex items-center gap-3">{proj.name} <span className={`text-xs px-2 py-1 rounded border animate-pulse ${statusColor}`}>{statusText}</span></h4>
                                                    <p className="text-sm text-gray-400 mt-1">{proj.email}</p>
                                                </div>
                                                <div className="text-right"><span className="text-xs text-gray-500 flex items-center justify-end gap-1"><FaClock /> Kod: {proj.accessCode}</span></div>
                                            </div>

                                            <div className="bg-gray-950 p-5 rounded-xl border border-gray-800 mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-gray-500 font-bold uppercase mb-1">Bütçe</span>
                                                    <span className="text-sm text-white font-mono">{parsed.budget}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-gray-500 font-bold uppercase mb-1">Süre</span>
                                                    <span className="text-sm text-white font-mono">{parsed.deadline}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] text-gray-500 font-bold uppercase mb-1">Platformlar</span>
                                                    <div className="flex flex-wrap gap-1">
                                                        {parsed.platforms.map((p: string, i: number) => (
                                                            <span key={i} className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">{p}</span>
                                                        ))}
                                                        {parsed.platforms.length === 0 && <span className="text-gray-600 text-xs">-</span>}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                                                {proj.status === 'BRIEF_SUBMITTED' && (
                                                    <button onClick={() => setProjectToOffer(proj)} className="text-white text-sm hover:bg-purple-600 flex items-center gap-2 bg-purple-500 px-4 py-2 rounded-lg transition font-bold shadow-lg shadow-purple-900/20">
                                                        <FaFileContract /> Detayları Gör & Teklif Ver
                                                    </button>
                                                )}

                                                {(proj.status === 'APPROVED' || proj.status === 'COMPLETED') && (
                                                    <button onClick={() => setActiveProjectToEdit(proj)} className="text-white text-sm hover:bg-blue-600 flex items-center gap-2 bg-blue-500 px-4 py-2 rounded-lg transition font-bold shadow-lg shadow-blue-900/20">
                                                        <FaTools /> Yönet & İlerlet
                                                    </button>
                                                )}

                                                {proj.status === 'NEGOTIATION' && (
                                                    <button onClick={() => setProjectToNegotiate(proj)} className="text-white text-sm hover:bg-yellow-600 flex items-center gap-2 bg-yellow-600/80 px-4 py-2 rounded-lg transition font-bold shadow-lg shadow-yellow-900/20">
                                                        <FaHandshake /> Revizeyi İncele
                                                    </button>
                                                )}

                                                <form action={deleteClientProject}><input type="hidden" name="id" value={proj.id} /><button className="text-red-400 text-sm hover:text-white flex items-center gap-2 bg-red-500/10 px-4 py-2 rounded-lg transition hover:bg-red-500/20"><FaTrash /> Sil</button></form>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                );

            case 'settings':
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <h2 className="text-2xl font-bold text-white">Ayarlar</h2>
                        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
                            <div className="flex items-center gap-4 mb-8"><div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-3xl font-bold text-white">M</div><div><h3 className="text-xl font-bold text-white">Admin Hesabı</h3><p className="text-gray-400">Yönetici yetkileri aktif</p></div></div>
                            <form className="space-y-4 opacity-50 pointer-events-none">
                                <label className="block text-sm text-gray-400">Site Başlığı</label><input type="text" value="Metehan Erkan Portfolio" className="input-dark" readOnly />
                                <label className="block text-sm text-gray-400">E-posta Bildirimleri</label><input type="text" value="Aktif" className="input-dark" readOnly />
                                <p className="text-xs text-yellow-500 pt-2">* Ayarlar modülü geliştirme aşamasındadır.</p>
                            </form>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="flex min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
            <aside className="w-72 bg-gray-950 border-r border-gray-900 fixed h-full flex flex-col z-20 top-0 left-0">
                <div className="p-8 border-b border-gray-900"><h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent tracking-tight">Admin Paneli</h1><p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Kontrol Merkezi</p></div>
                <nav className="flex-1 p-4 space-y-1">
                    <button onClick={() => setActiveTab('stats')} className={`nav-item ${activeTab === 'stats' ? 'active' : ''}`}><FaChartBar /> İstatistikler</button>
                    <button onClick={() => setActiveTab('activeProjects')} className={`nav-item ${activeTab === 'activeProjects' ? 'active' : ''}`}><div className="flex justify-between w-full items-center"><span className="flex items-center gap-3"><FaBriefcase /> Müşteri İşleri</span>{activeClientProjects.length > 0 && <span className="bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-full">{activeClientProjects.length}</span>}</div></button>
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 mt-6 ml-4">İçerik</div>
                    <button onClick={() => { setActiveTab('projects'); setSubTab('list') }} className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`}><FaProjectDiagram /> Projeler</button>
                    <button onClick={() => { setActiveTab('blogs'); setSubTab('list') }} className={`nav-item ${activeTab === 'blogs' ? 'active' : ''}`}><FaPenNib /> Blog Yazıları</button>
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 mt-6 ml-4">Sistem</div>
                    <button onClick={() => setActiveTab('messages')} className={`nav-item ${activeTab === 'messages' ? 'active' : ''}`}><div className="flex justify-between w-full items-center"><span className="flex items-center gap-3"><FaEnvelope /> Mesajlar</span>{messages.length > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{messages.length}</span>}</div></button>
                    <button onClick={() => setActiveTab('settings')} className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}><FaCog /> Ayarlar</button>
                </nav>
                <div className="p-4 border-t border-gray-900 space-y-2"><Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-900 rounded-xl transition text-sm"><FaEye /> Siteyi Görüntüle</Link><form action={logout}><button className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition text-sm"><FaSignOutAlt /> Güvenli Çıkış</button></form></div>
            </aside>

            <main className="flex-1 ml-72 p-10 bg-black min-h-screen relative">
                <div className="max-w-6xl mx-auto">{renderContent()}</div>

                {/* MODAL 1: PROJE KABUL & BAŞLATMA */}
                <AnimatePresence>
                    {projectToAccept && (
                        <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setProjectToAccept(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                            <motion.div initial={{ scale: 0.95, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 50 }} className="bg-[#0f1115] border border-green-500/30 rounded-3xl shadow-2xl relative z-10 max-w-5xl w-full flex flex-col md:flex-row overflow-hidden max-h-[90vh]">
                                <div className="w-full md:w-7/12 bg-[#0a0c10] border-r border-gray-800 flex flex-col">
                                    <div className="p-8 border-b border-gray-900 bg-gray-950/50">
                                        <div className="flex items-center gap-2 mb-2"><span className="bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] font-bold px-2 py-1 rounded uppercase flex items-center gap-1"><FaRocket /> Yeni Başvuru</span><span className="text-gray-500 text-xs">{new Date(projectToAccept.createdAt).toLocaleDateString('tr-TR')}</span></div>
                                        <h3 className="text-2xl font-bold text-white leading-tight">{projectToAccept.subject.replace('🚀', '').replace('PROJE TALEBİ:', '').trim()}</h3>
                                        <p className="text-gray-400 text-sm mt-1 flex items-center gap-2"><span className="font-semibold text-gray-300">{projectToAccept.name}</span> &bull; {projectToAccept.email}</p>
                                    </div>
                                    <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                                        {(() => {
                                            const parsed = parseProjectDescription(projectToAccept.message);
                                            const featuresPart = projectToAccept.message.split('🛠️ TEKNİK ÖZELLİKLER')[1]?.split('📝')[0]?.replace(':', '').trim();
                                            const features = featuresPart && featuresPart !== 'Standart.' ? featuresPart.split(', ') : [];
                                            return (
                                                <>
                                                    <div className="grid grid-cols-2 gap-4"><div className="bg-gray-900/50 p-4 rounded-2xl border border-green-500/20 flex flex-col justify-center text-center"><span className="text-[10px] text-green-500 font-bold uppercase block mb-1">Bütçe Beklentisi</span><span className="text-white font-mono font-bold text-lg">{parsed.budget}</span></div><div className="bg-gray-900/50 p-4 rounded-2xl border border-orange-500/20 flex flex-col justify-center text-center"><span className="text-[10px] text-orange-500 font-bold uppercase block mb-1">İstenen Süre</span><span className="text-white font-mono font-bold text-lg">{parsed.deadline}</span></div></div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800/50"><span className="text-[10px] text-blue-400 font-bold uppercase block mb-3 flex items-center gap-2"><FaLaptopCode /> Platformlar</span><div className="flex flex-wrap gap-2">{parsed.platforms.length > 0 ? parsed.platforms.map((p: string, i: number) => (<span key={i} className="text-xs bg-blue-500/10 text-blue-300 px-2 py-1 rounded border border-blue-500/20 flex items-center gap-1"><FaCheck size={8} /> {p}</span>)) : <span className="text-gray-500 text-xs">-</span>}</div></div><div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800/50"><span className="text-[10px] text-purple-400 font-bold uppercase block mb-3 flex items-center gap-2"><FaPaintBrush /> Tasarım</span><span className="text-white font-bold text-sm block">{parsed.design}</span></div></div>
                                                    {features.length > 0 && (<div className="bg-gray-900 rounded-xl border border-gray-800 p-5"><span className="text-[10px] font-bold text-gray-500 uppercase block mb-3 flex items-center gap-2"><FaListUl /> İstenen Teknik Özellikler</span><div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">{features.map((f: string, i: number) => (<div key={i} className="flex items-center gap-2 text-xs text-gray-300"><div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 flex-shrink-0"><FaCheck size={8} /></div>{f.trim()}</div>))}</div></div>)}
                                                    <div><span className="text-[10px] font-bold text-gray-500 uppercase block mb-2">Müşteri Notu</span><div className="bg-black/40 p-4 rounded-xl border border-gray-800 text-gray-300 text-sm leading-relaxed italic relative"><FaInfoCircle className="absolute top-4 right-4 text-gray-700" />"{parsed.notes}"</div></div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>
                                <div className="w-full md:w-5/12 p-8 bg-[#0f1115] flex flex-col justify-center items-center text-center border-t md:border-t-0 md:border-l border-gray-800 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 -mt-20 -mr-20 w-60 h-60 bg-green-500/5 rounded-full blur-3xl pointer-events-none"></div>
                                    <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-emerald-800 rounded-2xl flex items-center justify-center shadow-[0_0_50px_rgba(22,163,74,0.2)] mb-8 relative z-10 rotate-3 transition group-hover:rotate-6"><FaRocket className="text-4xl text-white ml-1" /></div>
                                    <h3 className="text-2xl font-bold text-white mb-3 relative z-10">Projeyi Başlat</h3>
                                    <p className="text-gray-400 text-sm max-w-xs mx-auto mb-8 leading-relaxed relative z-10">Onayladığında bu başvuru <strong>"Aktif Projeler"</strong> listesine taşınır.</p>
                                    <div className="flex flex-col gap-3 w-full max-w-xs relative z-10">
                                        <button onClick={executeAcceptance} className="w-full py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold hover:from-green-500 hover:to-emerald-500 transition shadow-lg shadow-green-900/20 flex items-center justify-center gap-3 transform active:scale-[0.98] group"><FaCheck className="group-hover:scale-110 transition text-lg" /> <span className="text-lg">Onayla ve Başlat</span></button>
                                        <button onClick={() => setProjectToAccept(null)} className="text-gray-500 hover:text-white text-sm transition py-3 hover:bg-gray-900 rounded-xl font-medium">Vazgeç</button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* MODAL 2: MESAJ DETAY (STANDART) */}
                <AnimatePresence>
                    {selectedMessage && !selectedMessage.message.includes('PROJE') && !selectedMessage.subject.includes('🚀') && (
                        <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedMessage(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl relative z-10 max-w-2xl w-full flex flex-col max-h-[85vh]">
                                <div className="p-6 border-b border-gray-800 flex justify-between items-start"><div><h3 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">{selectedMessage.subject}</h3><p className="text-gray-400 text-sm">{selectedMessage.name} &bull; {selectedMessage.email}</p></div><button onClick={() => setSelectedMessage(null)} className="p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition"><FaTimes /></button></div>
                                <div className="p-8 overflow-y-auto custom-scrollbar bg-gray-950/50"><pre className="text-gray-300 whitespace-pre-wrap break-words leading-relaxed text-sm font-sans">{selectedMessage.message}</pre></div>
                                <div className="p-6 border-t border-gray-800 flex justify-end gap-3 bg-gray-900 rounded-b-3xl">
                                    <form action={deleteMessage}><input type="hidden" name="id" value={selectedMessage.id} /><button className="text-red-400 hover:bg-red-500/10 px-4 py-2 rounded-lg transition font-medium flex items-center gap-2"><FaTrash /> Sil</button></form>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* MODAL 3, 4, 6 (Teklif, Revize, Başarı) - Mevcut haliyle korundu */}
                <AnimatePresence>
                    {projectToOffer && (
                        <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setProjectToOffer(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-[#0f1115] border border-purple-500/30 rounded-3xl shadow-2xl relative z-10 max-w-6xl w-full flex flex-col md:flex-row overflow-hidden max-h-[90vh]">
                                <div className="w-full md:w-7/12 bg-[#0a0c10] border-r border-gray-800 flex flex-col">
                                    <div className="p-8 border-b border-gray-900 bg-gray-950/50"><h3 className="text-2xl font-bold text-white flex items-center gap-3"><FaFileContract className="text-purple-500" /> Proje Detayları</h3><p className="text-gray-500 text-sm mt-1">Müşterinin başvuru formunda girdiği veriler.</p></div>
                                    <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                                        {(() => {
                                            const parsed = parseProjectDescription(projectToOffer.description);
                                            const featuresPart = projectToOffer.description.split('🛠️ TEKNİK ÖZELLİKLER')[1]?.split('📝 NOTLAR')[0]?.trim();
                                            const features = featuresPart && featuresPart !== 'Standart.' ? featuresPart.split(', ') : [];
                                            return (
                                                <div className="space-y-6">
                                                    <div className="grid grid-cols-2 gap-4"><div className="bg-gray-900/50 border border-green-500/20 p-5 rounded-2xl flex flex-col items-center justify-center text-center"><span className="text-[10px] font-bold text-green-500 uppercase tracking-widest mb-2">Hedef Bütçe</span><span className="text-xl font-bold text-white font-mono">{parsed.budget}</span></div><div className="bg-gray-900/50 border border-orange-500/20 p-5 rounded-2xl flex flex-col items-center justify-center text-center"><span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-2">Hedef Süre</span><span className="text-xl font-bold text-white font-mono">{parsed.deadline}</span></div></div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="bg-gray-900 rounded-xl border border-gray-800 p-4"><span className="text-[10px] font-bold text-blue-500 uppercase block mb-3"><FaLaptopCode className="inline mr-1" /> Platformlar</span><div className="flex flex-wrap gap-2">{parsed.platforms.length > 0 ? parsed.platforms.map((p: string, i: number) => (<span key={i} className="px-3 py-1.5 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-lg text-xs font-bold flex items-center gap-2"><FaCheck size={10} /> {p}</span>)) : <span className="text-gray-500 text-xs">-</span>}</div></div><div className="bg-gray-900 rounded-xl border border-gray-800 p-4"><span className="text-[10px] font-bold text-purple-500 uppercase block mb-3"><FaPaintBrush className="inline mr-1" /> Tasarım</span><div className="flex flex-col gap-1"><span className="text-white text-sm font-bold">{parsed.design}</span></div></div></div>
                                                    {features.length > 0 && (<div className="bg-gray-900 rounded-xl border border-gray-800 p-5"><span className="text-[10px] font-bold text-gray-500 uppercase block mb-3"><FaListUl className="inline mr-1" /> İstenen Özellikler</span><div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">{features.map((f: string, i: number) => (<div key={i} className="flex items-center gap-2 text-xs text-gray-300"><div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 flex-shrink-0"><FaCheck size={8} /></div>{f}</div>))}</div></div>)}
                                                    <div><span className="text-[10px] font-bold text-gray-500 uppercase block mb-2">MÜŞTERİ NOTU</span><div className="bg-gray-900 p-4 rounded-xl border border-gray-800 text-gray-300 text-sm leading-relaxed relative italic"><FaInfoCircle className="absolute top-4 right-4 text-gray-700" />"{parsed.notes}"</div></div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>
                                <div className="w-full md:w-5/12 p-8 bg-gray-900 flex flex-col border-l border-gray-800">
                                    <div className="mb-6"><h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2"><FaMoneyBillWave className="text-green-500" /> İlk Teklifini Hazırla</h3><p className="text-gray-400 text-xs">Müşterinin talebine uygun bir fiyat ve takvim oluştur.</p></div>
                                    <form action={handleSendProposal} className="flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-1">
                                        <input type="hidden" name="id" value={projectToOffer.id} />
                                        <div><label className="text-xs font-bold text-gray-500 uppercase mb-2 block tracking-wider">Fiyat Teklifi (TL)</label><input name="price" placeholder="Örn: 25.000 TL" className="input-dark bg-gray-950 border-gray-800 focus:border-green-500 text-lg font-medium w-full" required /></div>
                                        <div><label className="text-xs font-bold text-gray-500 uppercase mb-2 block tracking-wider">Teslim Tarihi</label><input name="adminDeadline" placeholder="Örn: 15 Şubat 2025" className="input-dark bg-gray-950 border-gray-800 focus:border-green-500 w-full" required /></div>
                                        <div className="flex-1"><label className="text-xs font-bold text-gray-500 uppercase mb-2 block tracking-wider">Kapsam & Notlar</label><textarea name="adminNotes" className="w-full h-full min-h-[150px] bg-gray-950 border border-gray-800 rounded-xl p-4 text-white focus:border-green-500 focus:outline-none resize-none text-sm leading-relaxed" placeholder="Fiyata dahil olan hizmetler..."></textarea></div>
                                        <div className="pt-4 border-t border-gray-800 mt-auto"><button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-6 py-4 rounded-xl font-bold shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 transition transform hover:scale-[1.02]"><FaPaperPlane /> Teklifi Gönder</button></div>
                                    </form>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {projectToNegotiate && (
                        <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setProjectToNegotiate(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-[#0f1115] border border-yellow-500/30 rounded-3xl shadow-2xl relative z-10 max-w-6xl w-full flex flex-col md:flex-row overflow-hidden max-h-[90vh]">
                                <div className="w-full md:w-7/12 bg-[#0a0c10] border-r border-gray-800 flex flex-col">
                                    <div className="p-8 border-b border-gray-900 bg-gray-950/50"><h3 className="text-2xl font-bold text-white flex items-center gap-3"><FaHandshake className="text-yellow-500" /> Müşteri Revizesi</h3><p className="text-gray-500 text-sm mt-1">Müşteri şartları değiştirmek istiyor.</p></div>
                                    <div className="p-8 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-gray-900/50 border border-green-500/20 p-5 rounded-2xl flex flex-col items-center justify-center text-center"><span className="text-[10px] font-bold text-green-500 uppercase tracking-widest mb-2">Müşterinin Teklifi</span><span className="text-2xl md:text-3xl font-bold text-white font-mono">{projectToNegotiate.clientOfferPrice}</span></div>
                                            <div className="bg-gray-900/50 border border-orange-500/20 p-5 rounded-2xl flex flex-col items-center justify-center text-center"><span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-2">İstenen Süre</span><span className="text-xl md:text-2xl font-bold text-white font-mono">{projectToNegotiate.clientOfferDeadline}</span></div>
                                        </div>
                                        {(() => {
                                            const notes = projectToNegotiate.clientOfferNotes || '';
                                            const getVal = (key: string) => { const line = notes.split('\n').find((l: string) => l.includes(key)); return line ? line.split(':')[1]?.trim() : null; };
                                            const platforms = getVal('📱 Yeni Platformlar')?.split(', ').filter((x: string) => x) || [];
                                            const designFull = getVal('🎨 Yeni Tasarım') || '';
                                            const designLabel = designFull.split('(')[0]?.trim();
                                            const designLink = designFull.match(/\((.*?)\)/)?.[1] || '';
                                            const features = getVal('🛠️ Yeni Özellikler')?.split(', ').filter((x: string) => x) || [];
                                            const clientMsg = getVal('📝 Müşteri Notu') || notes.split('📝 Müşteri Notu:')[1]?.trim() || "Not bırakılmamış.";
                                            return (
                                                <div className="space-y-6">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="bg-gray-900 rounded-xl border border-gray-800 p-4"><span className="text-[10px] font-bold text-blue-500 uppercase block mb-3"><FaLaptopCode className="inline mr-1" /> İstenen Platformlar</span><div className="flex flex-wrap gap-2">{platforms.length > 0 ? platforms.map((p: string, i: number) => (<span key={i} className="px-3 py-1.5 bg-blue-500/10 text-blue-300 border border-blue-500/20 rounded-lg text-xs font-bold flex items-center gap-2"><FaCheck size={10} /> {p}</span>)) : <span className="text-gray-500 text-xs">-</span>}</div></div><div className="bg-gray-900 rounded-xl border border-gray-800 p-4"><span className="text-[10px] font-bold text-purple-500 uppercase block mb-3"><FaPaintBrush className="inline mr-1" /> Tasarım Tercihi</span>{designLabel ? (<div className="flex flex-col gap-1"><span className="text-white text-sm font-bold">{designLabel}</span>{designLink && <a href={designLink.startsWith('http') ? designLink : `https://${designLink}`} target="_blank" className="text-xs text-purple-400 hover:text-purple-300 underline truncate flex items-center gap-1"><FaLink /> Linki Gör</a>}</div>) : <span className="text-gray-500 text-xs">Belirtilmemiş</span>}</div></div>
                                                    <div className="bg-gray-900 rounded-xl border border-gray-800 p-5"><span className="text-[10px] font-bold text-gray-500 uppercase block mb-3"><FaListUl className="inline mr-1" /> Yeni Özellik Kapsamı</span>{features.length > 0 ? (<div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">{features.map((f: string, i: number) => (<div key={i} className="flex items-center gap-2 text-xs text-gray-300"><div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 flex-shrink-0"><FaCheck size={8} /></div>{f}</div>))}</div>) : <p className="text-gray-500 text-xs italic">Özel özellik belirtilmemiş.</p>}</div>
                                                    <div><span className="text-[10px] font-bold text-gray-500 uppercase block mb-2">MÜŞTERİ NOTU</span><div className="bg-gray-900 p-4 rounded-xl border border-gray-800 text-gray-300 text-sm leading-relaxed relative"><FaInfoCircle className="absolute top-4 right-4 text-gray-700" />"{clientMsg}"</div></div>
                                                </div>
                                            );
                                        })()}
                                        <div className="mt-6 pt-6 border-t border-gray-800"><form action={handleAcceptClientOffer}><input type="hidden" name="id" value={projectToNegotiate.id} /><button className="w-full py-4 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold hover:from-green-500 hover:to-emerald-500 transition shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 transform active:scale-[0.99]"><FaCheck /> Revizeyi Kabul Et & Projeyi Başlat</button></form></div>
                                    </div>
                                </div>
                                <div className="w-full md:w-5/12 p-8 bg-gray-900 flex flex-col border-l border-gray-800">
                                    <div className="mb-6"><h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2"><FaExchangeAlt className="text-blue-500" /> Karşı Teklif Sun</h3><p className="text-gray-400 text-xs">Müşterinin şartları uymuyorsa buradan güncelle.</p></div>
                                    <form action={handleSendProposal} className="flex-1 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-1">
                                        <input type="hidden" name="id" value={projectToNegotiate.id} />
                                        <div><label className="text-xs font-bold text-gray-500 uppercase mb-2 block tracking-wider">Senin Fiyatın (TL)</label><input name="price" defaultValue={projectToNegotiate.budget} className="input-dark bg-gray-950 border-gray-800 focus:border-blue-500 text-lg font-medium w-full" required /></div>
                                        <div><label className="text-xs font-bold text-gray-500 uppercase mb-2 block tracking-wider">Senin Tarihin</label><input name="adminDeadline" defaultValue={projectToNegotiate.deadline} className="input-dark bg-gray-950 border-gray-800 focus:border-blue-500 w-full" required /></div>
                                        <div className="flex-1"><label className="text-xs font-bold text-gray-500 uppercase mb-2 block tracking-wider">Açıklama / Cevap</label><textarea name="adminNotes" className="w-full h-full min-h-[150px] bg-gray-950 border border-gray-800 rounded-xl p-4 text-white focus:border-blue-500 focus:outline-none resize-none text-sm leading-relaxed" placeholder="Neden bu fiyatı verdiğini açıkla..."></textarea></div>
                                        <div className="pt-4 border-t border-gray-800 mt-auto"><button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl font-bold shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition transform hover:scale-[1.02]"><FaPaperPlane /> Yeni Teklifi Gönder</button></div>
                                    </form>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* 👇 MODAL 5: PROJE KONTROL MERKEZİ (TASARIM & ÖZELLİKLER GÜNCELLENDİ) */}
                <AnimatePresence>
                    {activeProjectToEdit && (
                        <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveProjectToEdit(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

                            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-[#0f1115] border border-green-500/30 rounded-3xl shadow-2xl relative z-10 max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]">

                                {/* 1. HEADER */}
                                <div className="p-6 border-b border-gray-800 bg-gray-950 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                            <FaTools className="text-green-500" /> Proje Kontrol Merkezi
                                        </h3>
                                        <p className="text-gray-500 text-xs mt-1">{activeProjectToEdit.name} &bull; {activeProjectToEdit.email}</p>
                                    </div>
                                    <button onClick={() => setActiveProjectToEdit(null)} className="text-gray-500 hover:text-white"><FaTimes /></button>
                                </div>

                                {/* 2. TAB MENÜSÜ */}
                                <div className="flex border-b border-gray-800 bg-gray-900">
                                    <button
                                        onClick={() => setManageTab('info')}
                                        className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2
                        ${manageTab === 'info' ? 'text-blue-400 border-b-2 border-blue-500 bg-blue-500/10' : 'text-gray-500 hover:text-white hover:bg-gray-800'}`}
                                    >
                                        <FaInfoCircle /> Proje Bilgileri
                                    </button>
                                    <button
                                        onClick={() => setManageTab('progress')}
                                        className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2
                        ${manageTab === 'progress' ? 'text-green-400 border-b-2 border-green-500 bg-green-500/10' : 'text-gray-500 hover:text-white hover:bg-gray-800'}`}
                                    >
                                        <FaChartBar /> Durum & İlerleme
                                    </button>
                                    <button
                                        onClick={() => setManageTab('requests')}
                                        className={`flex-1 py-4 text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2
                        ${manageTab === 'requests' ? 'text-yellow-400 border-b-2 border-yellow-500 bg-yellow-500/10' : 'text-gray-500 hover:text-white hover:bg-gray-800'}`}
                                    >
                                        <FaEnvelope /> Gelen Talepler ({activeProjectToEdit.requests?.filter((r: any) => r.status === 'PENDING').length || 0})
                                    </button>
                                </div>

                                {/* 3. İÇERİK ALANI */}
                                <div className="overflow-y-auto custom-scrollbar flex-1 bg-[#0a0c10] min-h-[500px]">

                                    {/* --- SEKME 1: PROJE BİLGİLERİ (YENİLENDİ) --- */}
                                    {manageTab === 'info' && (
                                        <div className="p-8 space-y-6">

                                            {/* A) Proje Künyesi (Grid) */}
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-xl text-center group hover:border-green-500/30 transition">
                                                    <FaMoneyBillWave className="text-green-500 mx-auto mb-2 group-hover:scale-110 transition" />
                                                    <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Anlaşılan Bütçe</span>
                                                    <span className="text-white font-mono font-bold text-lg">{activeProjectToEdit.budget || activeProjectToEdit.clientOfferPrice || 'Belirtilmedi'}</span>
                                                </div>
                                                <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-xl text-center group hover:border-orange-500/30 transition">
                                                    <FaClock className="text-orange-500 mx-auto mb-2 group-hover:scale-110 transition" />
                                                    <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Teslim Tarihi</span>
                                                    <span className="text-white font-mono font-bold text-lg">{activeProjectToEdit.deadline || activeProjectToEdit.clientOfferDeadline || 'Belirtilmedi'}</span>
                                                </div>
                                                <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-xl text-center group hover:border-blue-500/30 transition">
                                                    <FaRocket className="text-blue-500 mx-auto mb-2 group-hover:scale-110 transition" />
                                                    <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Başlangıç</span>
                                                    <span className="text-white font-mono font-bold text-lg">
                                                        {activeProjectToEdit.startDate ? new Date(activeProjectToEdit.startDate).toLocaleDateString('tr-TR') : '-'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* B) Canlı Özellik Listesi (Envanter) */}
                                            <div className="bg-gray-900/30 border border-blue-500/20 p-6 rounded-2xl relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

                                                <span className="text-[10px] text-blue-400 font-bold uppercase block mb-4 flex items-center gap-2">
                                                    <FaListUl /> Aktif Proje Kapsamı & Özellikler
                                                </span>

                                                {(() => {
                                                    // 1. Veritabanındaki 'features' sütununu kontrol et
                                                    let featList: string[] = [];
                                                    if (activeProjectToEdit.features && activeProjectToEdit.features.length > 0) {
                                                        featList = activeProjectToEdit.features.split(', ').map((f: string) => f.trim());
                                                    } else {
                                                        // 2. Yedek: Description'dan parse et
                                                        const desc = activeProjectToEdit.description || "";
                                                        const raw = desc.split('🛠️ TEKNİK ÖZELLİKLER')[1]?.split('📝')[0]?.trim();
                                                        if (raw) featList = raw.split(', ');
                                                    }
                                                    // Tekrar edenleri temizle
                                                    featList = Array.from(new Set(featList));

                                                    return (
                                                        <div className="grid grid-cols-2 gap-3">
                                                            {featList.length > 0 ? featList.map((f, i) => (
                                                                <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-500/5 transition border border-transparent hover:border-blue-500/10">
                                                                    <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                                                        <FaCheck className="text-blue-500 text-[10px]" />
                                                                    </div>
                                                                    <span className="text-xs text-gray-300 font-medium">{f}</span>
                                                                </div>
                                                            )) : <p className="text-gray-500 text-xs italic">Özellik listesi bulunamadı.</p>}
                                                        </div>
                                                    );
                                                })()}
                                            </div>

                                            {/* C) Orijinal Başvuru Detayları (Log Görünümü Yerine Kartlar) */}
                                            <div className="bg-gray-900/30 border border-purple-500/20 p-6 rounded-2xl relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>

                                                <span className="text-[10px] text-purple-400 font-bold uppercase block mb-4 flex items-center gap-2">
                                                    <FaAlignLeft /> Orijinal Başvuru Detayları
                                                </span>

                                                {(() => {
                                                    const desc = activeProjectToEdit.description || "";
                                                    // Helper: Satır bulucu
                                                    const getVal = (key: string) => desc.split('\n').find((l: string) => l.includes(key))?.split(':')[1]?.trim();

                                                    const platforms = getVal('Platformlar')?.split(', ') || [];
                                                    // Tasarım detaylarını al: "TASARIM DETAYLARI" başlığından sonrasını al, bir sonraki başlığa kadar
                                                    const designDetails = desc.split('TASARIM DETAYLARI')[1]?.split('TEKNİK ÖZELLİKLER')[0]?.trim();

                                                    // Teknik özellikleri listeden çek (description içindeki tireli liste)
                                                    const technicalFeatures = desc.split('TEKNİK ÖZELLİKLER')[1]?.split('📝 NOTLAR')[0]?.trim()?.split('\n')
                                                        .filter((l: string) => l.trim().startsWith('-'))
                                                        .map((l: string) => l.replace('-', '').trim()) || [];

                                                    const notes = desc.split('📝 NOTLAR:')[1]?.trim();

                                                    return (
                                                        <div className="space-y-6">
                                                            {/* Proje ve Müşteri Bilgileri */}
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div className="bg-black/40 p-3 rounded-xl border border-gray-800/50 flex items-center gap-3">
                                                                    <FaFolderOpen className="text-purple-500" />
                                                                    <div>
                                                                        <span className="text-[10px] text-gray-500 font-bold uppercase block">Proje Adı</span>
                                                                        <span className="text-white font-medium text-sm">{getVal('PROJE ADI') || activeProjectToEdit.name}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="bg-black/40 p-3 rounded-xl border border-gray-800/50 flex items-center gap-3">
                                                                    <FaUser className="text-purple-500" />
                                                                    <div>
                                                                        <span className="text-[10px] text-gray-500 font-bold uppercase block">Müşteri</span>
                                                                        <span className="text-white font-medium text-sm">{getVal('Müşteri')}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="bg-black/40 p-3 rounded-xl border border-gray-800/50 flex items-center gap-3 md:col-span-2">
                                                                    <FaEnvelope className="text-purple-500" />
                                                                    <div>
                                                                        <span className="text-[10px] text-gray-500 font-bold uppercase block">E-posta</span>
                                                                        <span className="text-white font-medium text-sm">{getVal('E-posta')}</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Platformlar, Bütçe, Süre, Tasarım */}
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                                <div className="bg-black/40 p-3 rounded-xl border border-gray-800/50">
                                                                    <span className="text-[10px] text-gray-500 font-bold uppercase block mb-2 flex items-center gap-2"><FaMobileAlt className="text-purple-500" /> Platformlar</span>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {platforms.length > 0 ? platforms.map((p: string, i: number) => (
                                                                            <span key={i} className="text-[10px] bg-purple-500/10 text-purple-300 px-2 py-1 rounded border border-purple-500/20">{p}</span>
                                                                        )) : <span className="text-xs text-gray-500">-</span>}
                                                                    </div>
                                                                </div>
                                                                <div className="bg-black/40 p-3 rounded-xl border border-gray-800/50">
                                                                    <span className="text-[10px] text-gray-500 font-bold uppercase block mb-2 flex items-center gap-2"><FaMoneyBillWave className="text-green-500" /> Bütçe Aralığı</span>
                                                                    <span className="text-white font-medium text-xs">{getVal('Bütçe') || '-'}</span>
                                                                </div>
                                                                <div className="bg-black/40 p-3 rounded-xl border border-gray-800/50">
                                                                    <span className="text-[10px] text-gray-500 font-bold uppercase block mb-2 flex items-center gap-2"><FaClock className="text-orange-500" /> Süre Hedefi</span>
                                                                    <span className="text-white font-medium text-xs">{getVal('Süre') || '-'}</span>
                                                                </div>
                                                                <div className="bg-black/40 p-3 rounded-xl border border-gray-800/50">
                                                                    <span className="text-[10px] text-gray-500 font-bold uppercase block mb-2 flex items-center gap-2"><FaPaintBrush className="text-blue-500" /> Tasarım</span>
                                                                    <span className="text-white font-medium text-xs">{getVal('Tasarım Durumu') || '-'}</span>
                                                                </div>
                                                            </div>

                                                            {/* Tasarım Detayları */}
                                                            {designDetails && !designDetails.includes('yok') && (
                                                                <div className="bg-black/40 p-3 rounded-xl border border-gray-800/50">
                                                                    <span className="text-[10px] text-gray-500 font-bold uppercase block mb-2 flex items-center gap-2"><FaLink className="text-purple-500" /> Tasarım Detayları</span>
                                                                    <p className="text-gray-300 text-sm whitespace-pre-wrap">{designDetails}</p>
                                                                </div>
                                                            )}

                                                            {/* Teknik Özellikler (Orijinal Başvurudaki) */}
                                                            {technicalFeatures.length > 0 && (
                                                                <div className="bg-black/40 p-3 rounded-xl border border-gray-800/50">
                                                                    <span className="text-[10px] text-gray-500 font-bold uppercase block mb-2 flex items-center gap-2"><FaListUl className="text-purple-500" /> İstenen Teknik Özellikler (Başvuru)</span>
                                                                    <div className="grid grid-cols-2 gap-2">
                                                                        {technicalFeatures.map((f: string, i: number) => (
                                                                            <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                                                                                <FaCheck className="text-purple-500 text-[10px]" /> {f}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Notlar */}
                                                            <div className="bg-black/40 p-3 rounded-xl border border-gray-800/50">
                                                                <span className="text-[10px] text-gray-500 font-bold uppercase block mb-2 flex items-center gap-2"><FaCommentDots className="text-purple-500" /> Müşteri Notları</span>
                                                                <p className="text-gray-300 text-sm whitespace-pre-wrap italic">"{notes || 'Not yok.'}"</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })()}
                                            </div>

                                            {/* D) TEHLİKELİ BÖLGE (İPTAL ETME) */}
                                            <div className="mt-8 pt-8 border-t border-red-500/20">
                                                <h4 className="text-xs font-bold text-red-500 uppercase mb-4 flex items-center gap-2">
                                                    <FaExclamationTriangle /> Tehlikeli İşlemler
                                                </h4>
                                                <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4 flex justify-between items-center">
                                                    <div>
                                                        <h5 className="text-white font-bold text-sm">Projeyi İptal Et</h5>
                                                        <p className="text-gray-500 text-xs mt-1">Bu işlem projeyi durdurur ve müşteriye iptal edildiğini bildirir.</p>
                                                    </div>
                                                    <form action={async (formData) => {
                                                        if (!confirm('Projeyi iptal etmek istediğine emin misin? Bu işlem geri alınamaz.')) return;
                                                        await cancelProject(formData);
                                                        setActiveProjectToEdit(null);
                                                        toast.error('Proje iptal edildi ve durduruldu.');
                                                    }}>
                                                        <input type="hidden" name="id" value={activeProjectToEdit.id} />
                                                        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition shadow-lg shadow-red-900/20">
                                                            Projeyi İptal Et
                                                        </button>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* --- SEKME 2: İLERLEME YÖNETİMİ --- */}
                                    {manageTab === 'progress' && (
                                        <div className="p-8">
                                            <div className="bg-gray-900/30 border border-green-500/10 p-6 rounded-2xl mb-6">
                                                <h4 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
                                                    <FaRocket className="text-green-500" /> Canlı Durum Güncelleme
                                                </h4>
                                                <form action={handleUpdateProgress} className="space-y-6">
                                                    <input type="hidden" name="id" value={activeProjectToEdit.id} />

                                                    <div>
                                                        <div className="flex justify-between text-xs font-bold uppercase text-gray-500 mb-2">
                                                            <span>İlerleme Yüzdesi</span>
                                                            <span className="text-green-500 text-2xl font-mono">%{activeProjectToEdit.progress}</span>
                                                        </div>
                                                        <input type="range" name="progress" min="0" max="100" defaultValue={activeProjectToEdit.progress} className="w-full h-3 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-green-500" />
                                                        <div className="flex justify-between text-[10px] text-gray-600 mt-2">
                                                            <span>Başlangıç</span>
                                                            <span>Geliştirme</span>
                                                            <span>Test</span>
                                                            <span>Bitiş</span>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Müşteriye Görünen Aşama</label>
                                                        <div className="flex gap-2">
                                                            <input name="currentStage" defaultValue={activeProjectToEdit.currentStage || ''} placeholder="Örn: Veritabanı Tasarlanıyor..." className="flex-1 bg-black border border-gray-800 p-4 rounded-xl text-white focus:border-green-500 outline-none text-sm" />
                                                            <button className="bg-green-600 hover:bg-green-500 text-white px-8 rounded-xl font-bold transition shadow-lg shadow-green-900/20">
                                                                Kaydet
                                                            </button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>

                                            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex gap-3 items-start">
                                                <FaInfoCircle className="text-blue-500 mt-1 flex-shrink-0" />
                                                <p className="text-xs text-blue-300 leading-relaxed">
                                                    Burada yaptığın güncellemeler anlık olarak müşteri panelindeki "Canlı Takip" ekranına yansır.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* --- SEKME 3: GELEN TALEPLER (YENİLENDİ & DOSYA DESTEKLİ) --- */}
                                    {manageTab === 'requests' && (
                                        <div className="p-8">
                                            <div className="flex justify-between items-center mb-6">
                                                <h4 className="text-sm font-bold text-white">Müşteri Bildirimleri</h4>
                                                <span className="bg-gray-800 text-gray-400 text-[10px] px-2 py-1 rounded-full border border-gray-700">
                                                    Toplam {activeProjectToEdit.requests?.length || 0}
                                                </span>
                                            </div>

                                            <div className="space-y-4">
                                                {(!activeProjectToEdit.requests || activeProjectToEdit.requests.length === 0) ? (
                                                    <div className="text-center py-12 border-2 border-gray-800 border-dashed rounded-2xl">
                                                        <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-600"><FaEnvelope /></div>
                                                        <p className="text-gray-500 text-sm">Henüz bir talep veya bildirim yok.</p>
                                                    </div>
                                                ) : (
                                                    activeProjectToEdit.requests.map((req: any) => {
                                                        // --- MESAJ AYRIŞTIRMA (PARSING) ---
                                                        // "Yeni Özellik" istekleri genellikle "🚀 EKLENECEK..." diye başlar. Bunları parçalayalım.
                                                        let features: string[] = [];
                                                        let notes = req.message;

                                                        if (req.type === 'new_feature' && req.message.includes('🚀')) {
                                                            const parts = req.message.split('📝 NOT:');
                                                            // Özellikleri çek
                                                            const featuresPart = parts[0].replace('🚀 EKLENECEK ÖZELLİKLER:', '').trim();
                                                            features = featuresPart.split('\n').map((f: string) => f.replace('-', '').trim()).filter((f: string) => f);
                                                            // Notu çek
                                                            notes = parts[1] ? parts[1].trim() : "Not yok.";
                                                        }

                                                        return (
                                                            <div key={req.id} className={`p-5 rounded-2xl border flex flex-col gap-4 transition relative overflow-hidden group ${req.status === 'PENDING' ? 'bg-gray-900/80 border-yellow-500/30' : 'bg-black border-gray-800 opacity-60'}`}>

                                                                {/* Header: Tür ve Tarih */}
                                                                <div className="flex justify-between items-start">
                                                                    <div className="flex items-center gap-2">
                                                                        {req.type === 'new_feature' && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-1 rounded border border-blue-500/30 font-bold flex items-center gap-1"><FaPlus size={8} /> EK ÖZELLİK</span>}
                                                                        {req.type === 'change' && <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-1 rounded border border-purple-500/30 font-bold flex items-center gap-1"><FaExchangeAlt size={8} /> DEĞİŞİKLİK</span>}
                                                                        {req.type === 'cancel' && <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-1 rounded border border-red-500/30 font-bold flex items-center gap-1"><FaTimes size={8} /> İPTAL/SORUN</span>}
                                                                        {req.type === 'bug' && <span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-1 rounded border border-orange-500/30 font-bold flex items-center gap-1"><FaTools size={8} /> HATA</span>}

                                                                        <span className="text-[10px] text-gray-500 ml-2">{new Date(req.createdAt).toLocaleDateString('tr-TR')}</span>
                                                                    </div>

                                                                    {req.status === 'APPROVED' && <span className="text-green-500 text-[10px] font-bold border border-green-500/20 bg-green-500/10 px-2 py-1 rounded flex items-center gap-1"><FaCheck /> ONAYLANDI</span>}
                                                                    {req.status === 'REJECTED' && <span className="text-red-500 text-[10px] font-bold border border-red-500/20 bg-red-500/10 px-2 py-1 rounded flex items-center gap-1"><FaTimes /> REDDEDİLDİ</span>}
                                                                    {req.status === 'PENDING' && <span className="text-yellow-500 text-[10px] font-bold border border-yellow-500/20 bg-yellow-500/10 px-2 py-1 rounded flex items-center gap-1 animate-pulse"><FaClock /> BEKLİYOR</span>}
                                                                </div>

                                                                {/* İçerik Alanı */}
                                                                <div className="space-y-3">
                                                                    {/* Eğer özellik listesi varsa Etiket olarak göster */}
                                                                    {features.length > 0 && (
                                                                        <div className="flex flex-wrap gap-2 mb-2">
                                                                            {features.map((f, i) => (
                                                                                <span key={i} className="text-xs bg-gray-800 text-gray-300 px-3 py-1.5 rounded-lg border border-gray-700 flex items-center gap-2">
                                                                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> {f}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    )}

                                                                    {/* Not / Mesaj Alanı */}
                                                                    <div className="bg-black p-4 rounded-xl border border-gray-800/50 flex gap-3">
                                                                        <FaCommentDots className="text-gray-600 mt-1 flex-shrink-0" />
                                                                        <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                                                                            {notes}
                                                                        </p>
                                                                    </div>

                                                                    {/* 👇 DOSYA EKİ VARSA GÖSTER (YENİ) */}
                                                                    {req.attachmentUrl && (
                                                                        <div className="flex items-center gap-3">
                                                                            <a
                                                                                href={req.attachmentUrl}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="flex items-center gap-2 bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/30 px-4 py-2 rounded-xl text-xs font-bold transition group/file"
                                                                            >
                                                                                <FaPaperclip className="group-hover/file:rotate-45 transition" />
                                                                                Ekli Dosyayı Görüntüle
                                                                                <FaExternalLinkAlt size={10} className="ml-1 opacity-50" />
                                                                            </a>
                                                                            <span className="text-[10px] text-gray-600">Müşteri bir dosya yükledi.</span>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Aksiyon Butonları (Sadece Bekleyenler İçin) */}
                                                                {req.status === 'PENDING' && (
                                                                    <div className="flex gap-3 justify-end mt-2 pt-4 border-t border-gray-800/50">
                                                                        <form action={async (formData) => {
                                                                            const { updateRequestStatus } = await import('./actions');
                                                                            await updateRequestStatus(formData);
                                                                            setActiveProjectToEdit(null);
                                                                            toast.error("Talep reddedildi.");
                                                                        }}>
                                                                            <input type="hidden" name="requestId" value={req.id} />
                                                                            <input type="hidden" name="status" value="REJECTED" />
                                                                            <button className="text-xs text-red-400 hover:text-white bg-red-500/10 hover:bg-red-600 px-4 py-2 rounded-lg transition border border-red-500/20">Reddet</button>
                                                                        </form>

                                                                        <form action={async (formData) => {
                                                                            const { updateRequestStatus } = await import('./actions');
                                                                            await updateRequestStatus(formData);
                                                                            setActiveProjectToEdit(null);
                                                                            toast.success("Talep onaylandı ve proje kapsamına eklendi!");
                                                                        }}>
                                                                            <input type="hidden" name="requestId" value={req.id} />
                                                                            <input type="hidden" name="status" value="APPROVED" />
                                                                            <button className="text-xs text-white bg-green-600 hover:bg-green-500 px-5 py-2 rounded-lg transition font-bold shadow-lg shadow-green-900/20 flex items-center gap-2">
                                                                                <FaCheck /> Onayla & İşe Ekle
                                                                            </button>
                                                                        </form>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })
                                                )}
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* MODAL 6: BAŞARI BİLDİRİMİ */}
                <AnimatePresence>
                    {showSuccessModal && (
                        <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4 pointer-events-none">
                            <motion.div initial={{ scale: 0.5, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.5, opacity: 0, y: 50 }} className="bg-gray-900 border border-green-500/30 p-8 rounded-2xl shadow-[0_0_50px_rgba(34,197,94,0.2)] flex flex-col items-center gap-4 text-center pointer-events-auto">
                                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-600/40"><FaCheck size={32} /></div>
                                <div><h3 className="text-2xl font-bold text-white">İşlem Başarılı! 🚀</h3><p className="text-gray-400 mt-1">Değişiklikler kaydedildi.</p></div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </main>
            <style jsx global>{`
                .input-dark { width: 100%; padding: 0.75rem 1rem; border-radius: 0.75rem; background-color: #0f172a; border: 1px solid #1e293b; color: white; outline: none; transition: all 0.2s; }
                .input-dark:focus { border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2); }
                .nav-item { width: 100%; display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; border-radius: 0.75rem; color: #94a3b8; transition: all 0.2s; font-weight: 500; }
                .nav-item:hover { background-color: #111827; color: white; }
                .nav-item.active { background-color: #1d4ed8; color: white; box-shadow: 0 4px 12px rgba(29, 78, 216, 0.3); }
                .btn-primary { background-color: #2563eb; color: white; padding: 0.75rem; border-radius: 0.75rem; font-weight: bold; transition: background-color 0.2s; } .btn-primary:hover { background-color: #1d4ed8; }
                .btn-success { background-color: #16a34a; color: white; padding: 0.75rem; border-radius: 0.75rem; font-weight: bold; transition: background-color 0.2s; } .btn-success:hover { background-color: #15803d; }
                .animate-fadeIn { animation: fadeIn 0.4s ease-out; } @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .custom-scrollbar::-webkit-scrollbar { width: 8px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #111827; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4b5563; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
            `}</style>
        </div>
    );
}