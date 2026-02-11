'use client';

import { useState } from 'react';
import BlogCard from '@/components/BlogCard';
import FadeIn from '@/components/FadeIn';
import SearchBar from '@/components/SearchBar';
import { Dictionary, Locale } from '@/dictionaries';

interface BlogClientProps {
    posts: any[];
    dict: Dictionary['blog'];
    lang: Locale;
}

const CATEGORIES = ['Tümü', 'Yazılım', 'Kariyer', 'Teknoloji', 'Rehber', 'Diğer'];

export default function BlogClient({ posts, dict, lang }: BlogClientProps) {
    const [activeCategory, setActiveCategory] = useState('Tümü');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPosts = posts.filter((post) => {
        const matchesCategory = activeCategory === 'Tümü' || post.category === activeCategory;
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
            post.title.toLowerCase().includes(searchLower) ||
            post.content.toLowerCase().includes(searchLower);

        return matchesCategory && matchesSearch;
    });

    return (
        <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">

            {/* Arka Plan Işık Efekti (Sayfa Özel) */}
            {/* Arka Plan Işık Efekti (Sayfa Özel) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

            {/* ✨ DÜZELTME: Buradaki 'text-center' kaldırıldı. Artık sadece wrapper görevi görüyor. */}
            <div className="mb-16">

                {/* BAŞLIK ALANI (Burayı ortaladık) */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 via-purple-500 to-purple-700 dark:from-white dark:via-purple-200 dark:to-purple-400 mb-6 pb-2 drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                        {dict.title}
                    </h1>
                    <p className="text-gray-600 dark:text-purple-200/60 text-lg max-w-2xl mx-auto leading-relaxed">
                        {dict.desc}
                    </p>
                </div>

                {/* ARAMA VE FİLTRELEME (Burayı ortaladık) */}
                <div className="flex flex-col items-center gap-8 mb-16 w-full">

                    {/* Arama Çubuğu */}
                    <div className="w-full md:w-[600px] relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg blur opacity-10 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative">
                            <SearchBar
                                value={searchQuery}
                                onChange={setSearchQuery}
                                placeholder="Yazı veya konu ara..."
                            />
                        </div>
                    </div>

                    {/* Kategori Butonları */}
                    <div className="flex flex-wrap justify-center gap-3">
                        {CATEGORIES.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-6 py-2.5 rounded-full text-sm font-medium border transition-all duration-300 backdrop-blur-md
                                ${activeCategory === category
                                        ? 'bg-[#6d28d9] border-transparent text-white shadow-lg shadow-purple-900/20 scale-105'
                                        : 'bg-white/40 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-white/10 hover:border-purple-400/30 hover:scale-105'
                                    }
                                `}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* BLOG LİSTESİ */}
                {/* Burası artık parent'tan text-center almıyor, kartlar kendi içinde (sola) hizalanacak. */}
                {filteredPosts.length === 0 ? (
                    <div className="text-center py-24 bg-white/50 dark:bg-white/5 rounded-3xl border border-gray-200 dark:border-white/10 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                        <p className="text-gray-600 dark:text-purple-200/70 text-xl font-medium">
                            "{activeCategory}" kategorisinde henüz bir yazı yok.
                        </p>
                        <p className="text-sm text-gray-400 dark:text-purple-200/40 mt-3">Takipte kal! 🚀</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map((post, index) => (
                            <FadeIn key={post.id} delay={index * 0.1} direction="up">
                                <BlogCard post={post} dict={dict.card} lang={lang} />
                            </FadeIn>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}