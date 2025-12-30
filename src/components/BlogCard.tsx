import Link from 'next/link';
import { FaClock, FaArrowRight, FaImage } from 'react-icons/fa';

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
}

export default function BlogCard({ post }: BlogCardProps) {
    return (
        <Link href={`/blog/${post.id}`} className="group block h-full">
            <div className="group relative bg-[#0a0a0a]/40 border border-white/10 rounded-3xl overflow-hidden hover:border-purple-500/30 transition-all duration-500 hover:shadow-[0_0_30px_-10px_rgba(168,85,247,0.2)] hover:-translate-y-1 flex flex-col h-full backdrop-blur-md">

                {/* RESİM ALANI */}
                <div className="relative h-56 overflow-hidden w-full bg-[#030014]">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60 z-10"></div>

                    {post.imageUrl && post.imageUrl.length > 5 ? (
                        <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-purple-200/30 group-hover:text-purple-200/50 transition-colors">
                            <FaImage size={32} className="mb-2 opacity-50" />
                            <span className="text-xs font-medium">Görsel Yok</span>
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
                    <div className="flex items-center gap-2 text-xs text-purple-200/50 mb-3 font-medium">
                        <FaClock className="text-purple-400" />
                        <span>{post.readTime} okuma</span>
                        <span className="w-1 h-1 bg-purple-500/30 rounded-full"></span>
                        <span>{new Date(post.createdAt).toLocaleDateString('tr-TR')}</span>
                    </div>

                    {/* Başlık */}
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors line-clamp-2 leading-tight">
                        {post.title}
                    </h3>

                    {/* Özet */}
                    <p className="text-purple-100/60 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
                        {post.excerpt}
                    </p>

                    {/* Alt Kısım: Buton */}
                    <div className="flex items-center text-purple-400 text-sm font-semibold group-hover:translate-x-1 transition-transform mt-auto group-hover:text-purple-300">
                        Devamını Oku <FaArrowRight className="ml-2 text-xs" />
                    </div>
                </div>
            </div>
        </Link>
    );
}