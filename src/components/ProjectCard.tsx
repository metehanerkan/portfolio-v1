'use client';

import Link from 'next/link';
import { FaGithub, FaExternalLinkAlt, FaImage } from 'react-icons/fa';
import { Dictionary } from '@/dictionaries';

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
    dict?: Dictionary['projects']['card']; // Optional for now to support simple usage if needed, or mandatory
}

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function ProjectCard({ project, dict }: ProjectCardProps) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        x.set(clientX - left - width / 2);
        y.set(clientY - top - height / 2);
    }

    const rotateX = useTransform(mouseY, [-300, 300], [5, -5]); // Hafif eğim
    const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);

    // Fallback texts if dict is not provided (should be provided)
    const t = dict || {
        noImage: "Görsel Yok",
        code: "Kodlar",
        private: "Gizli",
        demo: "Demo",
        review: "İncele"
    };

    return (
        <motion.div
            onMouseMove={onMouseMove}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="group relative bg-white/50 dark:bg-[#0a0a0a]/40 border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden hover:border-purple-500/30 transition-all duration-500 hover:shadow-[0_0_30px_-10px_rgba(168,85,247,0.2)] flex flex-col h-full backdrop-blur-md"
        >

            <Link href={`/projects/${project.id}`} className="flex flex-col flex-grow cursor-pointer">

                {/* 1. ÜST KISIM: GÖRSEL */}
                <div className="relative h-56 overflow-hidden w-full bg-gray-100 dark:bg-[#030014]">
                    {/* Resim Varsa */}
                    {project.imageUrl ? (
                        <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                    ) : (
                        /* Resim Yoksa */
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-purple-200/30 group-hover:text-purple-500 dark:group-hover:text-purple-200/50 transition-colors">
                            <FaImage size={40} className="mb-2 opacity-50" />
                            <span className="text-xs font-medium">{t.noImage}</span>
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
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/10 dark:from-[#0a0a0a] via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                </div>

                {/* 2. ORTA KISIM: BAŞLIK VE TEKNOLOJİLER */}
                <div className="p-6 pb-2 flex flex-col flex-grow">

                    {/* Başlık */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors line-clamp-1">
                        {project.title}
                    </h3>

                    {/* Teknolojiler */}
                    <div className="flex flex-wrap gap-2 mt-auto">
                        {project.technologies.slice(0, 4).map((tech, index) => (
                            <span
                                key={index}
                                className="px-2.5 py-1 text-xs font-medium bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-purple-200/70 border border-gray-200 dark:border-white/5 rounded-lg group-hover:border-purple-500/20 group-hover:text-purple-700 dark:group-hover:text-purple-100 transition-colors"
                            >
                                {tech}
                            </span>
                        ))}
                        {project.technologies.length > 4 && (
                            <span className="px-2 py-1 text-xs text-gray-400 dark:text-purple-200/40">+{project.technologies.length - 4}</span>
                        )}
                    </div>
                </div>
            </Link>

            {/* 3. ALT KISIM: BUTONLAR */}
            <div className="p-6 pt-4 mt-auto">
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 dark:border-white/10">
                    {project.githubUrl ? (
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-purple-200/70 hover:text-black dark:hover:text-white text-sm font-medium transition-all group/btn border border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20 z-20 relative"
                        >
                            <FaGithub className="group-hover/btn:scale-110 transition-transform" /> {t.code}
                        </a>
                    ) : (
                        <span className="flex items-center justify-center py-2.5 rounded-xl bg-gray-100 dark:bg-[#0a0a0a]/30 text-gray-400 dark:text-purple-200/30 text-sm border border-gray-200 dark:border-white/5 cursor-not-allowed">
                            {t.private}
                        </span>
                    )}

                    {project.liveUrl ? (
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-medium transition-all shadow-lg shadow-purple-900/20 hover:shadow-purple-600/30 group/btn z-20 relative border border-white/10"
                        >
                            <FaExternalLinkAlt className="group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 transition-transform text-xs" /> {t.demo}
                        </a>
                    ) : (
                        <Link
                            href={`/projects/${project.id}`}
                            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-800 dark:bg-white/10 hover:bg-gray-700 dark:hover:bg-white/20 text-white text-sm font-medium transition-all z-20 relative border border-white/10"
                        >
                            {t.review}
                        </Link>
                    )}
                </div>
            </div>

        </motion.div>
    );
}