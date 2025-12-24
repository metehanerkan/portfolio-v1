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
        <div className="group relative bg-gray-900/40 border border-gray-800/50 rounded-3xl overflow-hidden hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/10 flex flex-col h-full backdrop-blur-sm">

            <Link href={`/projects/${project.id}`} className="flex flex-col flex-grow cursor-pointer">

                {/* 1. ÜST KISIM: GÖRSEL */}
                <div className="relative h-56 overflow-hidden w-full bg-gray-950">
                    {/* Resim Varsa */}
                    {project.imageUrl ? (
                        <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                    ) : (
                        /* Resim Yoksa */
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-700 group-hover:text-gray-600 transition-colors">
                            <FaImage size={40} className="mb-2 opacity-50" />
                            <span className="text-xs">Görsel Yok</span>
                        </div>
                    )}

                    {/* Kategori Etiketi (Sol Üst) */}
                    <div className="absolute top-4 left-4 z-10">
                        <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
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

                    {/* Hover Overlay (Siyah Perde) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                </div>

                {/* 2. ORTA KISIM: BAŞLIK VE TEKNOLOJİLER (Açıklama Silindi) */}
                <div className="p-6 pb-2 flex flex-col flex-grow">

                    {/* Başlık */}
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors line-clamp-1">
                        {project.title}
                    </h3>

                    {/* Teknolojiler (Kartın içine aldık, boşluk doldursun) */}
                    <div className="flex flex-wrap gap-2 mt-auto">
                        {project.technologies.slice(0, 4).map((tech, index) => (
                            <span
                                key={index}
                                className="px-2.5 py-1 text-xs font-medium bg-blue-500/5 text-blue-300 border border-blue-500/10 rounded-lg group-hover:border-blue-500/20 transition-colors"
                            >
                                {tech}
                            </span>
                        ))}
                        {project.technologies.length > 4 && (
                            <span className="px-2 py-1 text-xs text-gray-500">+{project.technologies.length - 4}</span>
                        )}
                    </div>
                </div>
            </Link>

            {/* 3. ALT KISIM: BUTONLAR (Ayrı Tıklanabilir Alan) */}
            <div className="p-6 pt-4 mt-auto">
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-800/50">
                    {project.githubUrl ? (
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-800/50 hover:bg-gray-800 text-gray-300 hover:text-white text-sm font-medium transition-all group/btn border border-transparent hover:border-gray-700 z-20 relative"
                        >
                            <FaGithub className="group-hover/btn:scale-110 transition-transform" /> Kodlar
                        </a>
                    ) : (
                        <span className="flex items-center justify-center py-2.5 rounded-xl bg-gray-900/30 text-gray-600 text-sm border border-gray-800/30 cursor-not-allowed">
                            Gizli
                        </span>
                    )}

                    {project.liveUrl ? (
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all shadow-lg shadow-blue-900/20 hover:shadow-blue-600/30 group/btn z-20 relative"
                        >
                            <FaExternalLinkAlt className="group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform" /> Demo
                        </a>
                    ) : (
                        <Link
                            href={`/projects/${project.id}`}
                            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-800 text-white text-sm font-medium hover:bg-gray-700 transition-all z-20 relative"
                        >
                            İncele
                        </Link>
                    )}
                </div>
            </div>

        </div>
    );
}