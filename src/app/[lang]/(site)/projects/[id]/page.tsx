import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaGithub, FaExternalLinkAlt, FaImage, FaQuoteLeft } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import ViewCounter from '@/components/ViewCounter';

// Cache Ayarları
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

interface ProjectDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage(props: ProjectDetailPageProps) {
    const { id } = await props.params;

    const project = await db.project.findFirst({
        where: { id: id },
    });

    if (!project) {
        return notFound();
    }

    return (
        <main className="min-h-screen bg-white dark:bg-[#030014] text-gray-900 dark:text-white pt-32 px-6 pb-20 relative overflow-hidden transition-colors duration-300">

            {/* 👇 SAYAÇ BİLEŞENİ (GİZLİ) */}
            <ViewCounter id={id} type="project" />

            {/* --- ARKA PLAN IŞIK EFEKTLERİ (SABİT) --- */}
            <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
                {/* Navbar Arkası Tepe Işığı */}
                <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-purple-500/10 dark:from-purple-900/50 via-transparent dark:via-[#1a0b2e]/30 to-transparent blur-[80px] opacity-80" />

                {/* Ana Spot (Daha hafif) */}
                <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[120vh] bg-purple-600/5 dark:bg-purple-600/10 rounded-full blur-[120px] opacity-40"></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">

                {/* ÜST KISIM: GERİ DÖN BUTONU */}
                <Link href="/projects" className="inline-flex items-center text-gray-600 dark:text-purple-200/60 hover:text-purple-600 dark:hover:text-white mb-8 transition-colors font-medium group">
                    <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> Tüm Projelere Dön
                </Link>

                {/* BAŞLIK VE KATEGORİ */}
                <div className="mb-8">
                    <div className="flex flex-wrap items-center gap-3 mb-4 animate-fadeIn">
                        {/* Kategori Rozeti (Gölge azaltıldı) */}
                        <span className="bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-medium border border-purple-200 dark:border-purple-500/20 backdrop-blur-md">
                            {project.category}
                        </span>

                        {project.isFeatured && (
                            <span className="bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 px-3 py-1 rounded-full text-sm font-medium border border-yellow-200 dark:border-yellow-500/20 flex items-center gap-1 backdrop-blur-md">
                                <span className="text-lg">★</span> Öne Çıkan
                            </span>
                        )}
                    </div>
                    {/* Başlık (Gölge azaltıldı) */}
                    <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-700 via-purple-500 to-purple-700 dark:from-white dark:via-purple-100 dark:to-purple-300 animate-fadeIn text-fill-current">
                        {project.title}
                    </h1>
                </div>


                {/* ✨ GÜNCELLENMİŞ GRID: RESİM (SOL) - TEKNOLOJİLER & BUTONLAR (SAĞ) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 animate-fadeIn delay-100 items-stretch">

                    {/* SOL: RESİM ALANI (2/3 Genişlik) */}
                    <div className="lg:col-span-2 h-full min-h-[350px] md:min-h-[450px] bg-gray-100 dark:bg-[#0a0a0a]/50 rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 group relative backdrop-blur-sm shadow-sm">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 dark:from-[#030014]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                        {project.imageUrl && project.imageUrl.length > 5 ? (
                            <img
                                src={project.imageUrl}
                                alt={project.title}
                                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-purple-200/30 bg-gray-50 dark:bg-[#0a0a0a]">
                                <FaImage size={50} className="mb-4 opacity-50" />
                                <p className="font-medium text-sm">Görsel yok.</p>
                            </div>
                        )}
                    </div>

                    {/* SAĞ: BİLGİ PANELİ (1/3 Genişlik - Teknolojiler + Butonlar) */}
                    <div className="bg-white/50 dark:bg-[#0a0a0a]/40 p-6 rounded-2xl border border-gray-200 dark:border-white/10 h-full backdrop-blur-md flex flex-col shadow-sm">

                        {/* 1. Kısım: Teknolojiler */}
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 pb-3 border-b border-gray-200 dark:border-white/10 flex items-center gap-2">
                                <span className="w-1 h-5 bg-purple-600 dark:bg-purple-500 rounded-full"></span> Teknolojiler
                            </h3>
                            <div className="flex flex-wrap gap-2 content-start">
                                {project.technologies.map((tech, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1.5 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-purple-200/80 rounded-lg text-sm font-medium border border-gray-200 dark:border-white/5 hover:border-purple-500/30 hover:text-purple-700 dark:hover:text-white hover:bg-purple-50 dark:hover:bg-white/10 transition-all duration-200 cursor-default"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Boşluk (İçeriği ayırmak ve butonları alta itmek için) */}
                        <div className="mt-auto"></div>

                        {/* 2. Kısım: Bağlantı Butonları (Buraya Taşındı) */}
                        <div className="flex flex-col gap-3 pt-6 border-t border-white/5">
                            {project.liveUrl && (
                                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600/90 to-indigo-600/90 hover:from-purple-500 hover:to-indigo-500 text-white px-5 py-3 rounded-xl font-bold transition-all w-full shadow-sm hover:shadow-md hover:-translate-y-0.5 group border border-transparent dark:border-white/10 text-sm">
                                    <FaExternalLinkAlt className="group-hover:rotate-45 transition-transform text-xs" /> Canlı Demo
                                </a>
                            )}
                            {project.githubUrl && (
                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-800 dark:text-white px-5 py-3 rounded-xl font-bold transition-all border border-gray-200 dark:border-white/10 hover:border-purple-300 dark:hover:border-white/20 w-full hover:shadow-md hover:-translate-y-0.5 group text-sm">
                                    <FaGithub size={18} className="group-hover:scale-110 transition-transform" /> Kaynak Kod
                                </a>
                            )}
                        </div>

                    </div>
                </div>


                {/* AÇIKLAMA (MARKDOWN) */}
                <div className="bg-white/50 dark:bg-[#0a0a0a]/30 p-8 md:p-10 rounded-2xl border border-gray-200 dark:border-white/5 mb-12 shadow-sm animate-fadeIn delay-200 backdrop-blur-md">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-white/10">
                        Proje Detayları
                    </h2>

                    <article className="prose prose-lg max-w-none text-gray-600 dark:text-purple-100/80 prose-headings:text-gray-900 dark:prose-headings:text-white prose-strong:text-gray-900 dark:prose-strong:text-white prose-a:text-purple-600 dark:prose-a:text-purple-400">
                        <ReactMarkdown
                            components={{
                                h1: ({ ...props }) => <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4 pb-2 border-b border-gray-200 dark:border-white/10" {...props} />,
                                h2: ({ ...props }) => <h4 className="text-lg font-bold text-gray-900 dark:text-white mt-6 mb-3" {...props} />,
                                h3: ({ ...props }) => <h5 className="text-base font-bold text-purple-700 dark:text-purple-300 mt-5 mb-2" {...props} />,
                                p: ({ ...props }) => <p className="mb-5 leading-relaxed text-gray-600 dark:text-purple-100/70" {...props} />,
                                ul: ({ ...props }) => <ul className="list-disc list-inside mb-5 space-y-2 text-gray-600 dark:text-purple-100/80 marker:text-purple-500/70" {...props} />,
                                ol: ({ ...props }) => <ol className="list-decimal list-inside mb-5 space-y-2 text-gray-600 dark:text-purple-100/80 marker:text-purple-500/70" {...props} />,
                                li: ({ ...props }) => <li className="pl-2" {...props} />,
                                a: ({ ...props }) => <a className="text-purple-600 dark:text-purple-400 font-medium hover:text-purple-800 dark:hover:text-white border-b border-purple-500/30 hover:border-purple-600 dark:hover:border-white transition-all no-underline" target="_blank" rel="noopener noreferrer" {...props} />,
                                blockquote: ({ children, ...props }) => (
                                    <blockquote className="relative pl-8 py-3 my-6 bg-purple-50 dark:bg-purple-900/5 rounded-r-xl border-l-4 border-purple-500/50 italic text-purple-800 dark:text-purple-200/80 pr-4" {...props}>
                                        <FaQuoteLeft className="absolute top-3 left-2 text-purple-500/30 text-base" />
                                        {children}
                                    </blockquote>
                                ),
                                code: ({ className, children, ...props }) => {
                                    const isBlock = className || (typeof children === 'string' && children.includes('\n'));
                                    if (isBlock) {
                                        return (
                                            <pre className="bg-gray-900 dark:bg-[#050508]/80 p-4 rounded-xl border border-gray-700 dark:border-white/5 overflow-x-auto my-6 relative group">
                                                <code className={`font-mono text-sm text-gray-100 dark:text-purple-100/90 ${className}`} {...props}>
                                                    {children}
                                                </code>
                                            </pre>
                                        );
                                    }
                                    return (
                                        <code className="bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 px-1.5 py-0.5 rounded-md text-[0.9em] font-mono border border-purple-200 dark:border-purple-500/10 mx-1" {...props}>
                                            {children}
                                        </code>
                                    );
                                },
                            }}
                        >
                            {project.description}
                        </ReactMarkdown>
                    </article>
                </div>

            </div>
        </main>
    );
}