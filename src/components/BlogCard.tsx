'use client';

import Link from 'next/link';
import { FaClock, FaArrowRight, FaImage } from 'react-icons/fa';
import { Dictionary, Locale } from '@/dictionaries';

interface BlogCardProps {
    post: {
        id: string;
        title: string;
        excerpt: string;
        imageUrl?: string | null;
        category: string;
        readTime: string;
        createdAt: Date;
        isFeatured?: boolean;
        isPublished?: boolean;
    };
    dict?: Dictionary['blog']['card'];
    lang?: Locale;
}

export default function BlogCard({ post, dict, lang = 'tr' }: BlogCardProps) {
    const t = dict || {
        noImage: "Görsel Yok",
        readMore: "Devamını Oku",
        readTime: "okuma"
    };

    const dateLocale = lang === 'en' ? 'en-US' : 'tr-TR';

    return (
        <Link href={`/blog/${post.id}`} className="group block h-full">
            <div className="group relative bg-white/50 dark:bg-[#0a0a0a]/40 border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden hover:border-purple-500/30 transition-all duration-500 hover:shadow-[0_0_30px_-10px_rgba(168,85,247,0.2)] hover:-translate-y-1 flex flex-col h-full backdrop-blur-md">

                {/* RESİM ALANI */}
                <div className="relative h-56 overflow-hidden w-full bg-gray-100 dark:bg-[#030014]">
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/10 dark:from-[#0a0a0a] via-transparent to-transparent opacity-60 z-10"></div>

                    {post.imageUrl && post.imageUrl.length > 5 ? (
                        <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-purple-200/30 group-hover:text-purple-500 dark:group-hover:text-purple-200/50 transition-colors">
                            <FaImage size={32} className="mb-2 opacity-50" />
                            <span className="text-xs font-medium">{t.noImage}</span>
                        </div>
                    )}

                    {/* Kategori Rozeti */}
                    <div className="absolute top-4 left-4 z-20">
                        <span className="bg-purple-600/90 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-md border border-white/10">
                            {post.category}
                        </span>
                    </div>

                    {/* Öne Çıkan Rozeti */}
                    {post.isFeatured && (
                        <div className="absolute top-4 right-4 z-20">
                            <span className="bg-yellow-500/20 text-yellow-300 text-xs font-bold px-3 py-1 rounded-full border border-yellow-500/30 shadow-lg backdrop-blur-md flex items-center gap-1">
                                ★
                            </span>
                        </div>
                    )}
                </div>

                {/* İÇERİK ALANI */}
                <div className="p-6 flex flex-col flex-grow relative z-20">

                    {/* Meta Bilgiler */}
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-purple-200/50 mb-3 font-medium">
                        <FaClock className="text-purple-600 dark:text-purple-400" />
                        <span>{post.readTime} {t.readTime}</span>
                        <span className="w-1 h-1 bg-gray-300 dark:bg-purple-500/30 rounded-full"></span>
                        <span>{new Date(post.createdAt).toLocaleDateString(dateLocale)}</span>
                    </div>

                    {/* Başlık */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors line-clamp-2 leading-tight">
                        {post.title}
                    </h3>

                    {/* Özet */}
                    <p className="text-gray-600 dark:text-purple-100/60 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
                        {post.excerpt}
                    </p>

                    {/* Alt Kısım: Buton */}
                    <div className="flex items-center text-purple-600 dark:text-purple-400 text-sm font-semibold group-hover:translate-x-1 transition-transform mt-auto group-hover:text-purple-500 dark:group-hover:text-purple-300">
                        {t.readMore} <FaArrowRight className="ml-2 text-xs" />
                    </div>
                </div>
            </div>
        </Link>
    );
}