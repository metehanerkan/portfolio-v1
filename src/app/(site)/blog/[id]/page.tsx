import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaCalendar, FaClock, FaTag, FaImage, FaEye } from 'react-icons/fa'; // FaEye eklendi
import ReactMarkdown from 'react-markdown';

interface BlogDetailPageProps {
    params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BlogDetailPage(props: BlogDetailPageProps) {
    const params = await props.params;

    // ÖNCE: Görüntülenmeyi artır ve veriyi çek (db.blogPost.update)
    const post = await db.blogPost.update({
        where: { id: params.id },
        data: {
            viewCount: { increment: 1 }
        }
    }).catch(() => null);

    if (!post) {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-black text-white py-24 px-6">
            <article className="max-w-3xl mx-auto">

                {/* Geri Dön Butonu */}
                <Link href="/blog" className="inline-flex items-center text-gray-400 hover:text-green-400 mb-8 transition-colors">
                    <FaArrowLeft className="mr-2" /> Tüm Yazılara Dön
                </Link>

                {/* Üst Bilgiler (Meta Data) */}
                <div className="flex flex-wrap gap-4 items-center text-sm text-gray-400 mb-6">
                    <span className="flex items-center gap-2 text-green-400 bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20 font-medium">
                        <FaTag /> {post.category}
                    </span>
                    <span className="flex items-center gap-2">
                        <FaCalendar /> {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                    <span className="flex items-center gap-2">
                        <FaClock /> {post.readTime}
                    </span>
                </div>

                {/* Başlık */}
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
                    {post.title}
                </h1>

                {/* BÜYÜK KAPAK RESMİ */}
                <div className="w-full h-[400px] relative rounded-2xl overflow-hidden mb-12 border border-gray-800 bg-gray-900 shadow-2xl shadow-green-900/10">
                    {post.imageUrl && post.imageUrl.length > 5 ? (
                        <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-600">
                            <FaImage size={64} className="mb-4 opacity-30" />
                            <p>Görsel Yok</p>
                        </div>
                    )}
                </div>

                {/* İÇERİK ALANI (ÖZEL MARKDOWN TASARIMI) */}
                <div className="text-gray-300 leading-relaxed">
                    <ReactMarkdown
                        components={{
                            h1: ({ ...props }) => <h2 className="text-3xl font-bold text-white mt-12 mb-6 pb-2 border-b border-gray-800" {...props} />,
                            h2: ({ ...props }) => <h3 className="text-2xl font-bold text-white mt-10 mb-4" {...props} />,
                            h3: ({ ...props }) => <h4 className="text-xl font-bold text-green-400 mt-8 mb-3" {...props} />,
                            p: ({ ...props }) => <p className="mb-6 text-lg leading-relaxed text-gray-300" {...props} />,
                            ul: ({ ...props }) => <ul className="list-disc list-inside mb-6 space-y-2 text-gray-300 marker:text-green-500" {...props} />,
                            ol: ({ ...props }) => <ol className="list-decimal list-inside mb-6 space-y-2 text-gray-300 marker:text-green-500" {...props} />,
                            li: ({ ...props }) => <li className="pl-1" {...props} />,
                            a: ({ ...props }) => <a className="text-green-400 font-medium hover:text-green-300 hover:underline transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
                            blockquote: ({ ...props }) => (
                                <blockquote className="border-l-4 border-green-500 pl-6 py-3 my-8 bg-gray-900/50 rounded-r-xl italic text-gray-400 text-lg" {...props} />
                            ),
                            code: ({ ...props }) => (
                                <code className="bg-gray-900 text-pink-400 px-2 py-1 rounded text-sm font-mono border border-gray-800" {...props} />
                            ),
                            img: ({ ...props }) => (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img className="rounded-xl border border-gray-800 my-8 w-full" {...props} alt={props.alt || "blog görseli"} />
                            ),
                        }}
                    >
                        {post.content}
                    </ReactMarkdown>
                </div>

            </article>
        </div>
    );
}