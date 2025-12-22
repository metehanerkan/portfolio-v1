import Link from 'next/link';
import { BlogPost } from '@/types'; // Tipleri buradan çekiyoruz
import { FaClock, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';

interface BlogCardProps {
    post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
    return (
        <Link href={`/blog/${post.id}`} className="group h-full block">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 flex flex-col h-full">

                {/* Resim Alanı */}
                <div className="h-48 overflow-hidden relative">
                    <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Kategori Etiketi (Resmin sol üstünde) */}
                    <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-blue-400 text-xs font-bold px-3 py-1 rounded-full border border-blue-500/30">
                        {post.category}
                    </div>
                </div>

                {/* İçerik Alanı */}
                <div className="p-6 flex flex-col flex-grow">
                    {/* Tarih ve Süre */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                            <FaCalendarAlt />
                            <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <FaClock />
                            <span>{post.readTime} okuma</span>
                        </div>
                    </div>

                    {/* Başlık */}
                    <h2 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">
                        {post.title}
                    </h2>

                    {/* Özet (Excerpt) */}
                    <p className="text-gray-400 text-sm line-clamp-3 mb-4 flex-grow">
                        {post.excerpt}
                    </p>

                    {/* "Devamını Oku" Butonu */}
                    <div className="flex items-center text-blue-400 text-sm font-semibold group-hover:translate-x-2 transition-transform duration-300 mt-auto">
                        Devamını Oku <FaArrowRight className="ml-2" />
                    </div>
                </div>
            </div>
        </Link>
    );
}