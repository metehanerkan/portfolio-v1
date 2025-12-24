'use client';

import { useState, useRef } from 'react';
import {
    FaProjectDiagram, FaPenNib, FaChartBar, FaEnvelope, FaCog,
    FaStar, FaToggleOn, FaToggleOff, FaEdit, FaUpload, FaTimes, FaImage, FaTrash, FaSignOutAlt, FaEye
} from 'react-icons/fa';
import {
    addProject, deleteProject, addBlog, deleteBlog, deleteMessage,
    toggleProjectStatus, toggleProjectFeatured, toggleBlogStatus, toggleBlogFeatured,
    updateProject, updateBlog
} from './actions';
import Link from 'next/link';
import { logout } from '@/app/login/actions';
import MarkdownEditor from '@/components/MarkdownEditor';

interface AdminClientProps {
    projects: any[];
    blogs: any[];
    messages: any[];
}

const PROJECT_CATEGORIES = ['Web', 'Mobil', 'Sistem', 'Oyun', 'Diğer'];
const BLOG_CATEGORIES = ['Yazılım', 'Kariyer', 'Teknoloji', 'Rehber', 'Diğer'];

export default function AdminClient({ projects, blogs, messages }: AdminClientProps) {
    const [activeTab, setActiveTab] = useState<'stats' | 'projects' | 'blogs' | 'messages' | 'settings'>('stats');
    const [subTab, setSubTab] = useState<'list' | 'form'>('list');

    // --- İÇERİK STATE'LERİ ---
    const [blogContent, setBlogContent] = useState('');
    const [projectDescription, setProjectDescription] = useState('');

    // --- DÜZENLEME VE RESİM STATE'LERİ ---
    const [editingProject, setEditingProject] = useState<any>(null);
    const [editingBlog, setEditingBlog] = useState<any>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    // Form referansları
    const projectFormRef = useRef<HTMLFormElement>(null);
    const blogFormRef = useRef<HTMLFormElement>(null);

    // --- TOPLAM GÖRÜNTÜLENME HESAPLAMA ---
    const totalProjectViews = projects.reduce((acc, curr) => acc + (curr.viewCount || 0), 0);
    const totalBlogViews = blogs.reduce((acc, curr) => acc + (curr.viewCount || 0), 0);
    const totalViews = totalProjectViews + totalBlogViews;

    // --- RESİM İŞLEME FONKSİYONU ---
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert("Dosya çok büyük! Lütfen 2MB altı bir resim seçin.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    // --- DÜZENLEME MODUNU BAŞLATMA ---
    const startEditProject = (project: any) => {
        setEditingProject(project);
        setImagePreview(project.imageUrl);
        setProjectDescription(project.description);
        setSubTab('form');
    };

    const startEditBlog = (b: any) => {
        setEditingBlog(b);
        setImagePreview(b.imageUrl);
        setBlogContent(b.content);
        setSubTab('form');
    };

    // --- YENİ EKLEME MODUNA DÖNME (RESET) ---
    const startNewEntry = () => {
        setEditingProject(null);
        setEditingBlog(null);
        setBlogContent('');
        setProjectDescription('');
        setImagePreview('');
        setSubTab('form');
        if (projectFormRef.current) projectFormRef.current.reset();
        if (blogFormRef.current) blogFormRef.current.reset();
    };

    // --- İSTATİSTİK KARTLARI ---
    const renderStats = () => (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fadeIn">
            {/* Toplam Görüntülenme (YENİ) */}
            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-yellow-500 transition group">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-gray-400 text-sm">Toplam Görüntülenme</p>
                        <h3 className="text-3xl font-bold text-white mt-2">{totalViews}</h3>
                    </div>
                    <div className="p-3 bg-yellow-500/10 rounded-lg text-yellow-500 group-hover:bg-yellow-500 group-hover:text-white transition">
                        <FaEye size={24} />
                    </div>
                </div>
            </div>

            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-blue-600 transition group">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-gray-400 text-sm">Toplam Proje</p>
                        <h3 className="text-3xl font-bold text-white mt-2">{projects.length}</h3>
                    </div>
                    <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition">
                        <FaProjectDiagram size={24} />
                    </div>
                </div>
            </div>

            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-green-600 transition group">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-gray-400 text-sm">Yayındaki Bloglar</p>
                        <h3 className="text-3xl font-bold text-white mt-2">{blogs.filter(b => b.isPublished).length}</h3>
                    </div>
                    <div className="p-3 bg-green-500/10 rounded-lg text-green-500 group-hover:bg-green-500 group-hover:text-white transition">
                        <FaPenNib size={24} />
                    </div>
                </div>
            </div>

            <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-purple-600 transition group">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-gray-400 text-sm">Gelen Mesajlar</p>
                        <h3 className="text-3xl font-bold text-white mt-2">{messages.length}</h3>
                    </div>
                    <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition">
                        <FaEnvelope size={24} />
                    </div>
                </div>
            </div>
        </div>
    );

    // --- SAĞ TARAFTA GÖSTERİLECEK İÇERİKLER ---
    const renderContent = () => {
        switch (activeTab) {
            case 'stats':
                return (
                    <div className="space-y-8">
                        <h2 className="text-2xl font-bold text-white">Genel Bakış</h2>
                        {renderStats()}

                        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
                            <h3 className="text-xl font-bold text-white mb-4">Site Durumu</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm text-gray-400 border-b border-gray-800 pb-3">
                                    <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Proje Görüntülenmesi</span>
                                    <span className="text-white font-bold">{totalProjectViews}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-400 border-b border-gray-800 pb-3">
                                    <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span> Blog Okunması</span>
                                    <span className="text-white font-bold">{totalBlogViews}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm text-gray-400 border-b border-gray-800 pb-3">
                                    <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Mesajlar</span>
                                    <span className="text-white font-bold">{messages.length}</span>
                                </div>
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
                                <button onClick={startNewEntry} className={`px-4 py-2 rounded-md text-sm transition ${subTab === 'form' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>
                                    {editingProject ? 'Düzenleniyor...' : 'Yeni Ekle'}
                                </button>
                            </div>
                        </div>

                        {subTab === 'list' ? (
                            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                                <div className="p-4 border-b border-gray-800 bg-gray-900/50 flex justify-between text-xs text-gray-500 font-semibold uppercase tracking-wider">
                                    <span>Proje Detayı</span>
                                    <span>İstatistik & İşlemler</span>
                                </div>
                                {projects.map((proj) => (
                                    <div key={proj.id} className={`flex justify-between items-center p-4 border-b border-gray-800 last:border-0 hover:bg-gray-800/50 transition ${!proj.isPublished ? 'opacity-75 grayscale-[0.5]' : ''}`}>
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                {proj.imageUrl ? (
                                                    <img src={proj.imageUrl} className="w-14 h-14 rounded-lg bg-gray-800 object-cover" alt="proje" />
                                                ) : (
                                                    <div className="w-14 h-14 rounded-lg bg-gray-800 flex items-center justify-center text-gray-500">
                                                        <FaImage />
                                                    </div>
                                                )}
                                                {proj.isFeatured && <div className="absolute -top-2 -right-2 bg-yellow-500 text-black p-1 rounded-full text-[10px] shadow-lg animate-pulse"><FaStar /></div>}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white flex items-center gap-2">
                                                    {proj.title}
                                                    {!proj.isPublished && <span className="bg-red-500/20 text-red-400 text-[10px] px-2 py-0.5 rounded border border-red-500/20">Taslak</span>}
                                                </h4>
                                                <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded mt-1 inline-block">{proj.category}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            {/* GÖRÜNTÜLENME SAYISI */}
                                            <div className="flex items-center gap-2 text-gray-400 bg-gray-950 px-3 py-1.5 rounded-lg border border-gray-800 text-sm">
                                                <FaEye className="text-blue-500" />
                                                <span className="font-mono">{proj.viewCount || 0}</span>
                                            </div>

                                            <div className="w-px h-8 bg-gray-800 mx-2"></div>

                                            <button onClick={() => toggleProjectFeatured(proj.id, proj.isFeatured)} className={`p-2 rounded-lg transition ${proj.isFeatured ? 'text-yellow-400 bg-yellow-400/10' : 'text-gray-600 hover:text-yellow-400 hover:bg-gray-800'}`} title="Öne Çıkar">
                                                <FaStar size={18} />
                                            </button>

                                            <button onClick={() => toggleProjectStatus(proj.id, proj.isPublished)} className={`p-2 rounded-lg transition flex items-center gap-2 ${proj.isPublished ? 'text-green-400 bg-green-400/10' : 'text-gray-500 bg-gray-800'}`} title={proj.isPublished ? "Yayından Kaldır" : "Yayına Al"}>
                                                {proj.isPublished ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
                                            </button>

                                            <Link href={`/projects/${proj.id}`} target="_blank" className="p-2 text-gray-400 hover:text-blue-500 transition"><FaEye size={18} /></Link>

                                            <button onClick={() => startEditProject(proj)} className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-800 rounded transition" title="Düzenle">
                                                <FaEdit size={18} />
                                            </button>

                                            <form action={deleteProject}>
                                                <input type="hidden" name="id" value={proj.id} />
                                                <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded transition"><FaTrash size={16} /></button>
                                            </form>
                                        </div>
                                    </div>
                                ))}
                                {projects.length === 0 && <p className="p-8 text-center text-gray-500">Proje yok.</p>}
                            </div>
                        ) : (
                            <form ref={projectFormRef} action={editingProject ? updateProject : addProject} className="bg-gray-900 p-6 rounded-2xl border border-gray-800 space-y-4 relative">
                                {editingProject && (
                                    <>
                                        <input type="hidden" name="id" value={editingProject.id} />
                                        <div className="absolute top-4 right-4 bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                                            <FaEdit /> Düzenleme Modu
                                            <button type="button" onClick={startNewEntry} className="hover:text-white"><FaTimes /></button>
                                        </div>
                                    </>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <input name="title" defaultValue={editingProject?.title} placeholder="Proje Adı" className="input-dark" required />
                                    <select
                                        name="category"
                                        defaultValue={editingProject?.category || ""}
                                        className="input-dark cursor-pointer"
                                        required
                                    >
                                        <option value="" disabled>Kategori Seç</option>
                                        {PROJECT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                </div>

                                <MarkdownEditor
                                    value={projectDescription}
                                    onChange={setProjectDescription}
                                    label="Proje Açıklaması"
                                    rows={8}
                                />
                                <input type="hidden" name="description" value={projectDescription} />

                                <div className="border border-dashed border-gray-700 rounded-xl p-4 text-center hover:border-blue-500 transition bg-gray-950">
                                    <input type="file" accept="image/*" onChange={handleImageChange} id="proj-img" className="hidden" />
                                    <label htmlFor="proj-img" className="cursor-pointer flex flex-col items-center gap-2 text-gray-400 hover:text-white">
                                        {imagePreview ? (
                                            <img src={imagePreview} className="h-32 object-contain rounded-lg shadow-lg" alt="önizleme" />
                                        ) : (
                                            <>
                                                <FaUpload size={24} />
                                                <span>Resim Seçmek İçin Tıkla</span>
                                            </>
                                        )}
                                    </label>
                                    <input type="hidden" name="imageUrl" value={imagePreview} />
                                </div>

                                <input name="technologies" defaultValue={editingProject?.technologies.join(', ')} placeholder="Teknolojiler (Virgülle)" className="input-dark" required />
                                <div className="grid grid-cols-2 gap-4">
                                    <input name="githubUrl" defaultValue={editingProject?.githubUrl} placeholder="GitHub URL" className="input-dark" />
                                    <input name="liveUrl" defaultValue={editingProject?.liveUrl} placeholder="Live URL" className="input-dark" />
                                </div>
                                <button className="btn-primary w-full">{editingProject ? 'Değişiklikleri Kaydet' : 'Projeyi Kaydet'}</button>
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
                                <button onClick={startNewEntry} className={`px-4 py-2 rounded-md text-sm transition ${subTab === 'form' ? 'bg-green-600 text-white' : 'text-gray-400'}`}>
                                    {editingBlog ? 'Düzenleniyor...' : 'Yeni Ekle'}
                                </button>
                            </div>
                        </div>

                        {subTab === 'list' ? (
                            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                                <div className="p-4 border-b border-gray-800 bg-gray-900/50 flex justify-between text-xs text-gray-500 font-semibold uppercase tracking-wider">
                                    <span>Blog Yazısı</span>
                                    <span>İstatistik & İşlemler</span>
                                </div>
                                {blogs.map((blog) => (
                                    <div key={blog.id} className={`flex justify-between items-center p-4 border-b border-gray-800 last:border-0 hover:bg-gray-800/50 transition ${!blog.isPublished ? 'opacity-75 grayscale-[0.5]' : ''}`}>
                                        <div className="flex items-center gap-4">
                                            <div className='relative'>
                                                {blog.imageUrl ? (
                                                    <img src={blog.imageUrl} className="w-14 h-14 rounded-lg bg-gray-800 object-cover" alt="blog" />
                                                ) : (
                                                    <div className="w-14 h-14 rounded-lg bg-gray-800 flex items-center justify-center text-gray-500">
                                                        <FaImage />
                                                    </div>
                                                )}
                                                {blog.isFeatured && <div className="absolute -top-2 -right-2 bg-yellow-500 text-black p-1 rounded-full text-[10px] shadow-lg animate-pulse"><FaStar /></div>}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white flex items-center gap-2">
                                                    {blog.title}
                                                    {!blog.isPublished && <span className="bg-red-500/20 text-red-400 text-[10px] px-2 py-0.5 rounded border border-red-500/20">Taslak</span>}
                                                </h4>
                                                <span className="text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded mt-1 inline-block">{blog.category}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            {/* GÖRÜNTÜLENME SAYISI */}
                                            <div className="flex items-center gap-2 text-gray-400 bg-gray-950 px-3 py-1.5 rounded-lg border border-gray-800 text-sm">
                                                <FaEye className="text-green-500" />
                                                <span className="font-mono">{blog.viewCount || 0}</span>
                                            </div>

                                            <div className="w-px h-8 bg-gray-800 mx-2"></div>

                                            <button onClick={() => toggleBlogFeatured(blog.id, blog.isFeatured)} className={`p-2 rounded-lg transition ${blog.isFeatured ? 'text-yellow-400 bg-yellow-400/10' : 'text-gray-600 hover:text-yellow-400 hover:bg-gray-800'}`} title="Öne Çıkar">
                                                <FaStar size={18} />
                                            </button>

                                            <button onClick={() => toggleBlogStatus(blog.id, blog.isPublished)} className={`p-2 rounded-lg transition flex items-center gap-2 ${blog.isPublished ? 'text-green-400 bg-green-400/10' : 'text-gray-500 bg-gray-800'}`} title={blog.isPublished ? "Yayından Kaldır" : "Yayına Al"}>
                                                {blog.isPublished ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
                                            </button>

                                            <Link href={`/blog/${blog.id}`} target="_blank" className="p-2 text-gray-400 hover:text-green-500 transition"><FaEye size={18} /></Link>

                                            <button onClick={() => startEditBlog(blog)} className="p-2 text-gray-400 hover:text-green-400 hover:bg-gray-800 rounded transition" title="Düzenle">
                                                <FaEdit size={18} />
                                            </button>

                                            <form action={deleteBlog}>
                                                <input type="hidden" name="id" value={blog.id} />
                                                <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded transition"><FaTrash size={16} /></button>
                                            </form>
                                        </div>
                                    </div>
                                ))}
                                {blogs.length === 0 && <p className="p-8 text-center text-gray-500">Yazı yok.</p>}
                            </div>
                        ) : (
                            <form ref={blogFormRef} action={editingBlog ? updateBlog : addBlog} className="bg-gray-900 p-6 rounded-2xl border border-gray-800 space-y-4 relative">
                                {editingBlog && (
                                    <>
                                        <input type="hidden" name="id" value={editingBlog.id} />
                                        <div className="absolute top-4 right-4 bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                                            <FaEdit /> Düzenleme Modu
                                            <button type="button" onClick={startNewEntry} className="hover:text-white"><FaTimes /></button>
                                        </div>
                                    </>
                                )}

                                <input name="title" defaultValue={editingBlog?.title} placeholder="Başlık" className="input-dark" required />
                                <div className="grid grid-cols-2 gap-4">
                                    <select
                                        name="category"
                                        defaultValue={editingBlog?.category || ""}
                                        className="input-dark cursor-pointer"
                                        required
                                    >
                                        <option value="" disabled>Kategori Seç</option>
                                        {BLOG_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                    <input name="readTime" defaultValue={editingBlog?.readTime} placeholder="Okuma Süresi" className="input-dark" required />
                                </div>

                                <div className="border border-dashed border-gray-700 rounded-xl p-4 text-center hover:border-green-500 transition bg-gray-950">
                                    <input type="file" accept="image/*" onChange={handleImageChange} id="blog-img" className="hidden" />
                                    <label htmlFor="blog-img" className="cursor-pointer flex flex-col items-center gap-2 text-gray-400 hover:text-white">
                                        {imagePreview ? (
                                            <img src={imagePreview} className="h-32 object-contain rounded-lg shadow-lg" alt="önizleme" />
                                        ) : (
                                            <>
                                                <FaUpload size={24} />
                                                <span>Kapak Resmi Seçmek İçin Tıkla</span>
                                            </>
                                        )}
                                    </label>
                                    <input type="hidden" name="imageUrl" value={imagePreview} />
                                </div>

                                <textarea name="excerpt" defaultValue={editingBlog?.excerpt} placeholder="Kısa Özet" className="input-dark h-20" required />

                                <MarkdownEditor
                                    value={blogContent}
                                    onChange={setBlogContent}
                                    label="Blog İçeriği"
                                />
                                <input type="hidden" name="content" value={blogContent} />

                                <button className="btn-success w-full">{editingBlog ? 'Yazıyı Güncelle' : 'Yayınla'}</button>
                            </form>
                        )}
                    </div>
                );

            case 'messages':
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <h2 className="text-2xl font-bold text-white">Gelen Mesajlar</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {messages.length === 0 && (
                                <div className="text-center py-10 bg-gray-900 rounded-2xl border border-gray-800">
                                    <p className="text-gray-500">Henüz hiç mesaj yok.</p>
                                </div>
                            )}
                            {messages.map((msg) => (
                                <div key={msg.id} className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-purple-500/50 transition">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="font-bold text-white text-lg">{msg.name}</h4>
                                            <p className="text-sm text-gray-400">{msg.email}</p>
                                        </div>
                                        <span className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleDateString('tr-TR')}</span>
                                    </div>
                                    <p className="text-gray-300 bg-gray-950 p-4 rounded-xl text-sm border border-gray-800">
                                        {msg.message}
                                    </p>
                                    <div className="mt-4 flex justify-end">
                                        <form action={deleteMessage}>
                                            <input type="hidden" name="id" value={msg.id} />
                                            <button className="text-red-400 text-sm hover:text-red-300 flex items-center gap-1">
                                                <FaTrash size={12} /> Mesajı Sil
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'settings':
                return (
                    <div className="space-y-6 animate-fadeIn">
                        <h2 className="text-2xl font-bold text-white">Ayarlar</h2>
                        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-3xl font-bold text-white">M</div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Admin Hesabı</h3>
                                    <p className="text-gray-400">Yönetici yetkileri aktif</p>
                                </div>
                            </div>

                            <form className="space-y-4 opacity-50 pointer-events-none">
                                <label className="block text-sm text-gray-400">Site Başlığı</label>
                                <input type="text" value="Metehan Erkan Portfolio" className="input-dark" readOnly />
                                <label className="block text-sm text-gray-400">E-posta Bildirimleri</label>
                                <input type="text" value="Aktif" className="input-dark" readOnly />
                                <p className="text-xs text-yellow-500 pt-2">* Ayarlar modülü geliştirme aşamasındadır.</p>
                            </form>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="flex min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">

            {/* SOL MENÜ (SIDEBAR) */}
            <aside className="w-72 bg-gray-950 border-r border-gray-900 fixed h-full flex flex-col z-20 top-0 left-0">
                <div className="p-8 border-b border-gray-900">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent tracking-tight">
                        Admin Paneli
                    </h1>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">Kontrol Merkezi</p>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <button onClick={() => setActiveTab('stats')} className={`nav-item ${activeTab === 'stats' ? 'active' : ''}`}>
                        <FaChartBar /> İstatistikler
                    </button>

                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 mt-6 ml-4">İçerik</div>
                    <button onClick={() => { setActiveTab('projects'); setSubTab('list') }} className={`nav-item ${activeTab === 'projects' ? 'active' : ''}`}>
                        <FaProjectDiagram /> Projeler
                    </button>
                    <button onClick={() => { setActiveTab('blogs'); setSubTab('list') }} className={`nav-item ${activeTab === 'blogs' ? 'active' : ''}`}>
                        <FaPenNib /> Blog Yazıları
                    </button>

                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 mt-6 ml-4">Sistem</div>
                    <button onClick={() => setActiveTab('messages')} className={`nav-item ${activeTab === 'messages' ? 'active' : ''}`}>
                        <div className="flex justify-between w-full items-center">
                            <span className="flex items-center gap-3"><FaEnvelope /> Mesajlar</span>
                            {messages.length > 0 && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">{messages.length}</span>}
                        </div>
                    </button>
                    <button onClick={() => setActiveTab('settings')} className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}>
                        <FaCog /> Ayarlar
                    </button>
                </nav>
                <div className="p-4 border-t border-gray-900 space-y-2">
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-900 rounded-xl transition text-sm">
                        <FaEye /> Siteyi Görüntüle
                    </Link>
                    <form action={logout}>
                        <button className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition text-sm">
                            <FaSignOutAlt /> Güvenli Çıkış
                        </button>
                    </form>
                </div>
            </aside>

            {/* SAĞ İÇERİK ALANI */}
            <main className="flex-1 ml-72 p-10 bg-black min-h-screen">
                <div className="max-w-6xl mx-auto">
                    {renderContent()}
                </div>
            </main>

            {/* Stillendirme (Tailwind + CSS) */}
            <style jsx global>{`
        .input-dark {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          background-color: #0f172a; /* Slate 900 */
          border: 1px solid #1e293b;
          color: white;
          outline: none;
          transition: all 0.2s;
        }
        .input-dark:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }
        .nav-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          color: #94a3b8;
          transition: all 0.2s;
          font-weight: 500;
        }
        .nav-item:hover {
          background-color: #111827;
          color: white;
        }
        .nav-item.active {
          background-color: #1d4ed8;
          color: white;
          box-shadow: 0 4px 12px rgba(29, 78, 216, 0.3);
        }
        .btn-primary {
          background-color: #2563eb;
          color: white;
          padding: 0.75rem;
          border-radius: 0.75rem;
          font-weight: bold;
          transition: background-color 0.2s;
        }
        .btn-primary:hover { background-color: #1d4ed8; }
        
        .btn-success {
          background-color: #16a34a;
          color: white;
          padding: 0.75rem;
          border-radius: 0.75rem;
          font-weight: bold;
          transition: background-color 0.2s;
        }
        .btn-success:hover { background-color: #15803d; }

        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}