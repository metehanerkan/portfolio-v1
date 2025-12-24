'use client';

import { useState } from 'react';
import BlogCard from '@/components/BlogCard';
import FadeIn from '@/components/FadeIn';
import SearchBar from '@/components/SearchBar';



interface BlogClientProps {
    posts: any[];
}

const CATEGORIES = ['Tümü', 'Yazılım', 'Kariyer', 'Teknoloji', 'Rehber', 'Diğer'];


export default function BlogClient({ posts }: BlogClientProps) {
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
        <div className="max-w-7xl mx-auto px-6 py-12">

            <div className="text-center mb-12">

                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500 mb-4 pb-2">
                    Blog & Yazılar
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Yazılım, teknoloji ve kariyer üzerine edindiğim tecrübeleri ve notlarımı paylaşıyorum.
                </p>
            </div>

            <div className="flex flex-col items-center gap-8 mb-16 w-full">

                <div className="w-full md:w-[600px]">
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Yazı veya konu ara..."
                    />
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-6 py-2 rounded-full text-sm font-medium border transition-all duration-300
                ${activeCategory === category
                                    ? 'bg-green-600 border-green-600 text-white shadow-lg shadow-green-600/25 scale-105'
                                    : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-green-600 hover:text-white'
                                }
              `}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {filteredPosts.length === 0 ? (
                <div className="text-center py-20 bg-gray-900/50 rounded-xl border border-gray-800">
                    <p className="text-gray-400 text-lg">"{activeCategory}" kategorisinde henüz bir yazı yok.</p>
                    <p className="text-sm text-gray-600 mt-2">Takipte kal! 🚀</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPosts.map((post, index) => (
                        <FadeIn key={post.id} delay={index * 0.1} direction="up">
                            <BlogCard post={post} />
                        </FadeIn>
                    ))}
                </div>
            )}
        </div>
    );
}