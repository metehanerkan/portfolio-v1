'use client';

import { useState } from 'react';
import { blogs } from '@/data/blogs'; // Veriyi buradan çekiyoruz
import BlogCard from '@/components/BlogCard'; // Yeni kart bileşenini kullanıyoruz

export default function BlogPage() {
    const [activeCategory, setActiveCategory] = useState<'Tümü' | 'Yazılım' | 'Kariyer' | 'Teknoloji'>('Tümü');

    // Filtreleme Mantığı
    const filteredBlogs = activeCategory === 'Tümü'
        ? blogs
        : blogs.filter(blog => blog.category === activeCategory);

    const categories = ['Tümü', 'Yazılım', 'Teknoloji', 'Kariyer'];

    return (
        <main className="min-h-screen bg-black text-white pt-24 px-6 pb-20">
            <div className="max-w-7xl mx-auto">

                {/* Başlık */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-4">
                        Blog & Yazılar
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Teknoloji dünyasındaki deneyimlerimi, öğrendiklerimi ve ipuçlarını burada paylaşıyorum.
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

                {/* Blog Grid Listesi */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredBlogs.map((post) => (
                        <div key={post.id} className="animate-fadeIn">
                            <BlogCard post={post} />
                        </div>
                    ))}
                </div>

                {/* Boş Durum Kontrolü */}
                {filteredBlogs.length === 0 && (
                    <div className="text-center py-20 bg-gray-900/50 rounded-xl border border-gray-800">
                        <p className="text-gray-400">Bu kategoride henüz bir yazı yok.</p>
                    </div>
                )}

            </div>
        </main>
    );
}