import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaGithub, FaExternalLinkAlt, FaImage, FaLink, FaQuoteLeft, FaEye } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import ViewCounter from '@/components/ViewCounter'; // 👈 YENİ IMPORT

// Cache Ayarları
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

interface ProjectDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage(props: ProjectDetailPageProps) {
    const { id } = await props.params;

    // Sadece veriyi çekiyoruz (Artırma işini ViewCounter yapacak)
    const project = await db.project.findFirst({
        where: { id: id },
    });

    if (!project) {
        return notFound();
    }

    return (
        <main className="min-h-screen bg-black text-white py-24 px-6">
            {/* 👇 SAYAÇ BİLEŞENİ BURADA (GİZLİ ÇALIŞIR) */}
            <ViewCounter id={id} type="project" />

            <div className="max-w-5xl mx-auto">
                {/* ... (Geri kalan tüm tasarım kodların AYNI kalacak) ... */}

                {/* ÜST KISIM */}
                <Link href="/projects" className="inline-flex items-center text-gray-400 hover:text-blue-400 mb-8 transition-colors font-medium group">
                    <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> Tüm Projelere Dön
                </Link>

                <div className="mb-10">
                    <div className="flex flex-wrap items-center gap-3 mb-4 animate-fadeIn">
                        <span className="bg-blue-500/10 text-blue-400 px-4 py-1.5 rounded-full text-sm font-bold border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                            {project.category}
                        </span>

                        {project.isFeatured && (
                            <span className="bg-yellow-500/10 text-yellow-400 px-4 py-1.5 rounded-full text-sm font-bold border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.2)] flex items-center gap-1">
                                <span className="text-lg">★</span> Öne Çıkan
                            </span>
                        )}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 animate-fadeIn">
                        {project.title}
                    </h1>
                </div>

                {/* RESİM ALANI */}
                <div className="w-full h-[300px] md:h-[500px] bg-gray-900/50 rounded-3xl overflow-hidden border border-gray-800/50 mb-16 shadow-2xl shadow-blue-900/5 animate-fadeIn delay-100 group relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    {project.imageUrl && project.imageUrl.length > 5 ? (
                        <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 bg-gray-950">
                            <FaImage size={64} className="mb-4 opacity-30" />
                            <p className="font-medium">Bu proje için görsel bulunmuyor.</p>
                        </div>
                    )}
                </div>

                {/* AÇIKLAMA (MARKDOWN) */}
                <div className="bg-gray-900/30 p-8 md:p-10 rounded-3xl border border-gray-800/50 mb-12 shadow-xl animate-fadeIn delay-200 backdrop-blur-sm">
                    <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3 pb-4 border-b border-gray-800/50">
                        <span className="w-1.5 h-8 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
                        Proje Hakkında
                    </h2>

                    <article className="text-gray-300 prose prose-invert prose-lg max-w-none">
                        <ReactMarkdown
                            components={{
                                h1: ({ ...props }) => <h3 className="text-xl font-bold text-white mt-8 mb-4 pb-2 border-b border-gray-800" {...props} />,
                                h2: ({ ...props }) => <h4 className="text-lg font-bold text-white mt-6 mb-3" {...props} />,
                                h3: ({ ...props }) => <h5 className="text-base font-bold text-blue-300 mt-5 mb-2" {...props} />,
                                p: ({ ...props }) => <p className="mb-6 leading-relaxed text-gray-300/90" {...props} />,
                                ul: ({ ...props }) => <ul className="list-disc list-inside mb-6 space-y-2 text-gray-300 marker:text-blue-500" {...props} />,
                                ol: ({ ...props }) => <ol className="list-decimal list-inside mb-6 space-y-2 text-gray-300 marker:text-blue-500" {...props} />,
                                li: ({ ...props }) => <li className="pl-2" {...props} />,
                                a: ({ ...props }) => <a className="text-blue-400 font-medium hover:text-blue-300 border-b border-blue-400/30 hover:border-blue-300 transition-all no-underline" target="_blank" rel="noopener noreferrer" {...props} />,
                                blockquote: ({ children, ...props }) => (
                                    <blockquote className="relative pl-10 py-4 my-8 bg-blue-900/10 rounded-r-2xl border-l-4 border-blue-500 italic text-gray-300 pr-4" {...props}>
                                        <FaQuoteLeft className="absolute top-4 left-3 text-blue-500/40 text-xl" />
                                        {children}
                                    </blockquote>
                                ),
                                code: ({ className, children, ...props }) => {
                                    const isBlock = className || (typeof children === 'string' && children.includes('\n'));
                                    if (isBlock) {
                                        return (
                                            <pre className="bg-[#0d1117] p-5 rounded-2xl border border-gray-800/80 overflow-x-auto shadow-inner my-6">
                                                <code className={`font-mono text-sm text-gray-200 ${className}`} {...props}>
                                                    {children}
                                                </code>
                                            </pre>
                                        );
                                    }
                                    return (
                                        <code className="bg-blue-900/20 text-blue-300 px-2 py-1 rounded-md text-[0.9em] font-mono border border-blue-900/30 mx-1" {...props}>
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

                {/* ALT KISIM: TEKNOLOJİLER VE BUTONLAR */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch animate-fadeIn delay-300">
                    {/* SOL: Teknolojiler */}
                    <div className="bg-gray-900/30 p-8 rounded-3xl border border-gray-800/50 h-full shadow-xl backdrop-blur-sm flex flex-col">
                        <h3 className="text-xl font-bold text-white mb-6 pb-4 border-b border-gray-800/50">
                            Teknolojiler
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {project.technologies.map((tech, index) => (
                                <span
                                    key={index}
                                    className="px-4 py-2 bg-gradient-to-br from-gray-800 to-gray-900/50 text-blue-300 rounded-xl text-sm font-medium border border-blue-900/20 shadow-sm hover:shadow-blue-500/20 hover:border-blue-500/40 hover:text-blue-200 hover:-translate-y-0.5 transition-all duration-300 cursor-default"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* SAĞ: Linkler */}
                    <div className="flex flex-col gap-5 p-8 bg-gray-900/30 rounded-3xl border border-gray-800/50 h-full justify-center shadow-xl backdrop-blur-sm">
                        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-3 pb-4 border-b border-gray-800/50">
                            <FaLink className="text-blue-500" /> Bağlantılar
                        </h3>
                        {project.liveUrl && (
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-6 py-4 rounded-2xl font-bold transition-all w-full shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 hover:-translate-y-0.5 group">
                                <FaExternalLinkAlt className="group-hover:rotate-45 transition-transform" /> Canlı Demo
                            </a>
                        )}
                        {project.githubUrl && (
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 bg-gray-800/80 hover:bg-gray-800 text-white px-6 py-4 rounded-2xl font-bold transition-all border border-gray-700/50 hover:border-gray-600 w-full shadow-md hover:shadow-xl hover:-translate-y-0.5 group">
                                <FaGithub size={22} className="group-hover:scale-110 transition-transform" /> Kaynak Kodları
                            </a>
                        )}
                    </div>
                </div>

            </div>
        </main>
    );
}