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
        <main className="max-w-7xl mx-auto px-6 py-12">
            <div className="text-center mb-12">

                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500 mb-4 pb-2">
                        Tüm Projelerim
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Fikir aşamasından canlıya aldığım, üzerinde çalıştığım tüm yazılım projelerim.
                    </p>
                </div>

                <div className="flex flex-col items-center gap-8 mb-16 w-full">

                    <div className="w-full md:w-[600px]">
                        <SearchBar
                            value={searchQuery}
                            onChange={setSearchQuery}
                            placeholder="Proje, teknoloji veya açıklama ara..."
                        />
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                        {CATEGORIES.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-6 py-2 rounded-full border transition-all duration-300 font-medium
                                ${activeCategory === category
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/25'
                                        : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white'
                                    }
                            `}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map((project, index) => (
                        <FadeIn key={project.id} delay={index * 0.1} direction="up">
                            <ProjectCard project={project} />
                        </FadeIn>
                    ))}
                </div>

                {filteredProjects.length === 0 && (
                    <div className="text-center py-20 bg-gray-900/50 rounded-xl border border-gray-800">
                        <p className="text-gray-400 text-lg">"{activeCategory}" kategorisinde henüz bir proje yok.</p>
                        <p className="text-sm text-gray-600 mt-2">Ama yakında eklenecek! 🚀</p>
                    </div>
                )}
            </div>
        </main>
    );
}