import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaCalendar, FaClock, FaTag, FaImage } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

interface BlogDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function BlogDetailPage(props: BlogDetailPageProps) {
    const params = await props.params;
    const post = await db.blogPost.findUnique({
        where: { id: params.id },
    });

    if (!post) {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-black text-white py-24 px-6">
            <article className="max-w-3xl mx-auto">

                <Link href="/blog" className="inline-flex items-center text-gray-400 hover:text-green-400 mb-8 transition-colors">
                    <FaArrowLeft className="mr-2" /> Tüm Yazılara Dön
                </Link>

                {/* Üst Bilgiler */}
                <div className="flex flex-wrap gap-4 items-center text-sm text-gray-400 mb-6">
                    <span className="flex items-center gap-2 text-green-400 bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20">
                        <FaTag /> {post.category}
                    </span>
                    <span className="flex items-center gap-2">
                        <FaCalendar /> {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                    <span className="flex items-center gap-2">
                        <FaClock /> {post.readTime}
                    </span>
                </div>

                <h1 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
                    {post.title}
                </h1>

                {/* RESİM ALANI - GÜVENLİK KONTROLÜ EKLENDİ */}
                <div className="w-full h-[400px] relative rounded-2xl overflow-hidden mb-12 border border-gray-800 bg-gray-900">
                    {post.imageUrl && post.imageUrl.length > 5 ? (
                        <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        /* Resim yoksa */
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-600">
                            <FaImage size={64} className="mb-4 opacity-30" />
                            <p>Görsel Yok</p>
                        </div>
                    )}
                </div>

                <div className="prose prose-invert prose-lg max-w-none text-gray-300">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>

            </article>
        </div>
    );
}