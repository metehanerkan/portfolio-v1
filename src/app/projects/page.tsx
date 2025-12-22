'use client';

import { useState } from 'react';
import { projectsData } from '@/data/projects';
import ProjectCard from '@/components/ProjectCard'; // Kart bileşenini yeniden kullanıyoruz

export default function ProjectsPage() {
    // Varsayılan olarak "Tümü" seçili
    const [activeCategory, setActiveCategory] = useState<'Tümü' | 'Web' | 'Mobil' | 'Sistem'>('Tümü');

    // Kategorilere göre filtreleme mantığı
    const filteredProjects = activeCategory === 'Tümü'
        ? projectsData
        : projectsData.filter(project => project.category === activeCategory);

    const categories = ['Tümü', 'Web', 'Mobil', 'Sistem'];

    return (
        <main className="min-h-screen bg-black text-white pt-24 px-6">
            <div className="max-w-7xl mx-auto">

                {/* Başlık Bölümü */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-4">
                        Tüm Projelerim
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Fikir aşamasından canlıya aldığım, üzerinde çalıştığım tüm yazılım projelerim.
                    </p>
                </div>

                {/* Filtre Butonları */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category as any)}
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

                {/* Proje Listesi (Grid) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map((projectsData) => (
                        <div key={projectsData.id} className="animate-fadeIn">
                            <ProjectCard project={projectsData} />
                        </div>
                    ))}
                </div>

                {/* Eğer Kategori Boşsa Uyarı Göster */}
                {filteredProjects.length === 0 && (
                    <div className="text-center py-20 bg-gray-900/50 rounded-xl border border-gray-800">
                        <p className="text-gray-400 text-lg">Bu kategoride henüz bir proje yok.</p>
                        <p className="text-sm text-gray-600 mt-2">Ama yakında eklenecek! 🚀</p>
                    </div>
                )}

            </div>
        </main>
    );
}