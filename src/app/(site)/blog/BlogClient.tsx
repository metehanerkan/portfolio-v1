'use client';

import { useState } from 'react';
import BlogCard from '@/components/BlogCard';

interface BlogClientProps {
    posts: any[]; // Veritabanından gelen blog listesi
}

// Admin paneliyle uyumlu kategoriler + "Tümü" seçeneği
const CATEGORIES = ['Tümü', 'Yazılım', 'Kariyer', 'Teknoloji', 'Rehber', 'Diğer'];

export default function BlogClient({ posts }: BlogClientProps) {
    const [activeCategory, setActiveCategory] = useState('Tümü');

    // Filtreleme Mantığı
    const filteredPosts = activeCategory === 'Tümü'
        ? posts
        : posts.filter(post => post.category === activeCategory);

    return (
        <div className="min-h-screen bg-black text-white py-24 px-6">
            <div className="max-w-7xl mx-auto">

                {/* Başlık */}
                <header className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-6">
                        Blog & Yazılar
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Yazılım, teknoloji ve kariyer üzerine edindiğim tecrübeleri ve notlarımı paylaşıyorum.
                    </p>
                </header>

                {/* Kategori Butonları (Filtreler) */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-6 py-2 rounded-full border transition-all duration-300 font-medium
                        ${activeCategory === category
                                    ? 'bg-green-600 border-green-600 text-white shadow-lg shadow-green-600/25'
                                    : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-green-600 hover:text-white'
                                }
                    `}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Blog Listesi */}
                {filteredPosts.length === 0 ? (
                    <div className="text-center py-20 bg-gray-900/50 rounded-xl border border-gray-800">
                        <p className="text-gray-400 text-lg">"{activeCategory}" kategorisinde henüz bir yazı yok.</p>
                        <p className="text-sm text-gray-600 mt-2">Takipte kal! 🚀</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map((post) => (
                            <div key={post.id} className="animate-fadeIn">
                                <BlogCard post={post} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}