'use client';

import { useState } from 'react';
import ProjectCard from '@/components/ProjectCard';
import FadeIn from '@/components/FadeIn';
import SearchBar from '@/components/SearchBar';

interface ProjectsClientProps {
    projects: any[];
}

const CATEGORIES = ['Tümü', 'Web', 'Mobil', 'Sistem', 'Oyun', 'Diğer'];

export default function ProjectsClient({ projects }: ProjectsClientProps) {
    const [activeCategory, setActiveCategory] = useState('Tümü');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProjects = projects.filter((project) => {
        const matchesCategory = activeCategory === 'Tümü' || project.category === activeCategory;

        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
            project.title.toLowerCase().includes(searchLower) ||
            project.description.toLowerCase().includes(searchLower) ||
            project.technologies.some((tech: string) => tech.toLowerCase().includes(searchLower));

        return matchesCategory && matchesSearch;
    });

    return (
        <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">

            {/* Arka Plan Işık Efekti */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

            <div className="mb-16">

                {/* BAŞLIK ALANI (TEKRAR ORTALANDI) */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400 mb-6 pb-2 drop-shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                        Tüm Projelerim
                    </h1>
                    <p className="text-purple-200/60 text-lg max-w-2xl mx-auto leading-relaxed">
                        Fikir aşamasından canlıya aldığım, üzerinde çalıştığım tüm yazılım projelerim.
                    </p>
                </div>

                {/* ARAMA VE FİLTRELEME (TEKRAR ORTALANDI) */}
                <div className="flex flex-col items-center gap-8 mb-16 w-full">

                    {/* Arama Çubuğu Alanı */}
                    <div className="w-full md:w-[600px] relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-10 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative">
                            <SearchBar
                                value={searchQuery}
                                onChange={setSearchQuery}
                                placeholder="Proje, teknoloji veya açıklama ara..."
                            />
                        </div>
                    </div>

                    {/* Kategori Butonları */}
                    <div className="flex flex-wrap justify-center gap-3">
                        {CATEGORIES.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-6 py-2.5 rounded-full border transition-all duration-300 font-medium text-sm backdrop-blur-sm
                                ${activeCategory === category
                                        ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] scale-105'
                                        : 'bg-[#0a0a0a]/40 border-white/10 text-purple-200/50 hover:border-purple-500/50 hover:text-white hover:bg-purple-500/10'
                                    }
                            `}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* PROJE LİSTESİ */}
                {/* Kartların içindeki hizalama ProjectCard.tsx dosyasından kontrol ediliyor (text-left yapmıştık) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map((project, index) => (
                        <FadeIn key={project.id} delay={index * 0.1} direction="up">
                            <ProjectCard project={project} />
                        </FadeIn>
                    ))}
                </div>

                {/* BOŞ DURUM */}
                {filteredProjects.length === 0 && (
                    <div className="text-center py-24 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                        <p className="text-purple-200/70 text-xl font-medium">
                            "{activeCategory}" kategorisinde aradığın kriterlere uygun proje yok.
                        </p>
                        <p className="text-sm text-purple-200/40 mt-3">
                            Farklı bir kategori seçebilir veya arama terimini değiştirebilirsin. 🚀
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}