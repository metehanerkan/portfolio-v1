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
            <div className="group relative bg-gray-900/40 border border-gray-800/50 rounded-3xl overflow-hidden hover:border-green-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-green-900/10 flex flex-col h-full backdrop-blur-sm">

                <div className="relative h-56 overflow-hidden w-full bg-gray-950">
                    {post.imageUrl && post.imageUrl.length > 5 ? (
                        <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-700 group-hover:text-gray-600 transition-colors">
                            <FaImage size={32} className="mb-2 opacity-50" />
                            <span className="text-xs">Görsel Yok</span>
                        </div>
                    )}

                    <div className="absolute top-4 left-4">
                        <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            {post.category}
                        </span>
                    </div>

                    {post.isFeatured && (
                        <div className="absolute top-4 right-4 z-10">
                            <span className="bg-yellow-500/20 text-yellow-300 text-xs font-bold px-3 py-1.5 rounded-full border border-yellow-500/30 shadow-lg backdrop-blur-md flex items-center gap-1">
                                ★
                            </span>
                        </div>
                    )}
                </div>

                <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                        <FaClock className="text-green-500" />
                        <span>{post.readTime} okuma</span>
                        <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                        <span>{new Date(post.createdAt).toLocaleDateString('tr-TR')}</span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors line-clamp-2">
                        {post.title}
                    </h3>

                    <p className="text-gray-400 text-sm line-clamp-3 mb-4 flex-grow">
                        {post.excerpt}
                    </p>

                    <div className="flex items-center text-green-400 text-sm font-semibold group-hover:translate-x-1 transition-transform mt-auto">
                        Devamını Oku <FaArrowRight className="ml-2" />
                    </div>
                </div>
            </div>
        </Link>
    );
}