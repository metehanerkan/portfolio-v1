'use client';

import Link from 'next/link';
import { FaGithub, FaExternalLinkAlt, FaImage } from 'react-icons/fa';

interface ProjectCardProps {
    project: {
        id: string;
        title: string;
        description: string;
        imageUrl?: string | null;
        category: string;
        technologies: string[];
        githubUrl?: string | null;
        liveUrl?: string | null;
        isFeatured?: boolean;
        isPublished?: boolean;
    };
}

export default function ProjectCard({ project }: ProjectCardProps) {
    return (
        <div className="group relative bg-[#0a0a0a]/40 border border-white/10 rounded-3xl overflow-hidden hover:border-purple-500/30 transition-all duration-500 hover:shadow-[0_0_30px_-10px_rgba(168,85,247,0.2)] flex flex-col h-full backdrop-blur-md hover:-translate-y-1">

            <Link href={`/projects/${project.id}`} className="flex flex-col flex-grow cursor-pointer">

                {/* 1. ÜST KISIM: GÖRSEL */}
                <div className="relative h-56 overflow-hidden w-full bg-[#030014]">
                    {/* Resim Varsa */}
                    {project.imageUrl ? (
                        <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                    ) : (
                        /* Resim Yoksa */
                        <div className="w-full h-full flex flex-col items-center justify-center text-purple-200/30 group-hover:text-purple-200/50 transition-colors">
                            <FaImage size={40} className="mb-2 opacity-50" />
                            <span className="text-xs font-medium">Görsel Yok</span>
                        </div>
                    )}

                    {/* Kategori Etiketi (Sol Üst) */}
                    <div className="absolute top-4 left-4 z-10">
                        <span className="bg-purple-600/90 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-md border border-white/10">
                            {project.category}
                        </span>
                    </div>

                    {/* Öne Çıkan Yıldızı (Sağ Üst) */}
                    {project.isFeatured && (
                        <div className="absolute top-4 right-4 z-10">
                            <span className="bg-yellow-500/20 text-yellow-300 text-xs font-bold px-3 py-1.5 rounded-full border border-yellow-500/30 shadow-lg backdrop-blur-md flex items-center gap-1">
                                ★
                            </span>
                        </div>
                    )}

                    {/* Hover Overlay (Mor Perde) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                </div>

                {/* 2. ORTA KISIM: BAŞLIK VE TEKNOLOJİLER */}
                <div className="p-6 pb-2 flex flex-col flex-grow">

                    {/* Başlık */}
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors line-clamp-1">
                        {project.title}
                    </h3>

                    {/* Teknolojiler */}
                    <div className="flex flex-wrap gap-2 mt-auto">
                        {project.technologies.slice(0, 4).map((tech, index) => (
                            <span
                                key={index}
                                className="px-2.5 py-1 text-xs font-medium bg-white/5 text-purple-200/70 border border-white/5 rounded-lg group-hover:border-purple-500/20 group-hover:text-purple-100 transition-colors"
                            >
                                {tech}
                            </span>
                        ))}
                        {project.technologies.length > 4 && (
                            <span className="px-2 py-1 text-xs text-purple-200/40">+{project.technologies.length - 4}</span>
                        )}
                    </div>
                </div>
            </Link>

            {/* 3. ALT KISIM: BUTONLAR */}
            <div className="p-6 pt-4 mt-auto">
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
                    {project.githubUrl ? (
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-purple-200/70 hover:text-white text-sm font-medium transition-all group/btn border border-white/5 hover:border-white/20 z-20 relative"
                        >
                            <FaGithub className="group-hover/btn:scale-110 transition-transform" /> Kodlar
                        </a>
                    ) : (
                        <span className="flex items-center justify-center py-2.5 rounded-xl bg-[#0a0a0a]/30 text-purple-200/30 text-sm border border-white/5 cursor-not-allowed">
                            Gizli
                        </span>
                    )}

                    {project.liveUrl ? (
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-medium transition-all shadow-lg shadow-purple-900/20 hover:shadow-purple-600/30 group/btn z-20 relative border border-white/10"
                        >
                            <FaExternalLinkAlt className="group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform text-xs" /> Demo
                        </a>
                    ) : (
                        <Link
                            href={`/projects/${project.id}`}
                            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all z-20 relative border border-white/10"
                        >
                            İncele
                        </Link>
                    )}
                </div>
            </div>

        </div>
    );
}