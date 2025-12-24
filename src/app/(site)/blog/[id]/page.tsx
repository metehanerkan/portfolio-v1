import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaCalendar, FaClock, FaTag, FaImage, FaEye, FaQuoteLeft } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

// 👇 CANLI SİTE İÇİN KRİTİK AYARLAR (Cache'i tamamen kapatır)
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

interface BlogDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function BlogDetailPage(props: BlogDetailPageProps) {
    // 1. Parametreleri al
    const { id } = await props.params;

    // 2. Veriyi çek (findFirst kullanarak cache sorununu aşıyoruz)
    const post = await db.blogPost.findFirst({
        where: { id: id },
    });

    // 3. Bulunamazsa 404 ver
    if (!post) {
        return notFound();
    }

    // 4. Sayaç Artırma (Hata korumalı)
    try {
        await db.blogPost.update({
            where: { id: id },
            data: { viewCount: { increment: 1 } }
        });
        // Ekranda güncel gözükmesi için manuel artırıyoruz
        post.viewCount += 1;
    } catch (error) {
        console.error("Sayaç hatası:", error);
    }

    // 5. BLOG TASARIMI
    return (
        <div className="min-h-screen bg-black text-white py-24 px-6">
            <article className="max-w-4xl mx-auto">

                {/* Geri Dön Butonu */}
                <Link href="/blog" className="inline-flex items-center text-gray-400 hover:text-green-400 mb-8 transition-colors group">
                    <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> Tüm Yazılara Dön
                </Link>

                {/* Üst Bilgiler (Meta Data) */}
                <div className="flex flex-wrap gap-4 items-center text-sm text-gray-400 mb-6 animate-fadeIn">
                    <span className="flex items-center gap-2 text-green-400 bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20 font-medium">
                        <FaTag /> {post.category}
                    </span>
                    <span className="flex items-center gap-2 bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
                        <FaCalendar /> {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                    <span className="flex items-center gap-2 bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
                        <FaClock /> {post.readTime}
                    </span>
                    {/* GÖRÜNTÜLENME SAYISI */}
                    <span className="flex items-center gap-2 text-gray-300 bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
                        <FaEye className="text-green-500" /> {post.viewCount} okuma
                    </span>
                </div>

                {/* Başlık */}
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight animate-fadeIn">
                    {post.title}
                </h1>

                {/* BÜYÜK KAPAK RESMİ */}
                <div className="w-full h-[300px] md:h-[500px] relative rounded-3xl overflow-hidden mb-12 border border-gray-800 bg-gray-900 shadow-2xl shadow-green-900/10 animate-fadeIn delay-100">
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
                <div className="text-gray-300 leading-relaxed bg-gray-900/30 p-8 md:p-12 rounded-3xl border border-gray-800/50 shadow-xl backdrop-blur-sm animate-fadeIn delay-200">
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
                            blockquote: ({ children, ...props }) => (
                                <blockquote className="relative pl-10 py-4 my-8 bg-green-900/10 rounded-r-2xl border-l-4 border-green-500 italic text-gray-300 pr-4" {...props}>
                                    <FaQuoteLeft className="absolute top-4 left-3 text-green-500/40 text-xl" />
                                    {children}
                                </blockquote>
                            ),
                            // KOD BLOKLARI (Kopyala butonu olmadan)
                            code: ({ className, children, ...props }) => {
                                const isBlock = className || (typeof children === 'string' && children.includes('\n'));
                                if (isBlock) {
                                    return (
                                        <pre className="bg-[#0d1117] p-5 rounded-2xl border border-gray-800/80 overflow-x-auto shadow-inner my-8">
                                            <code className={`font-mono text-sm text-gray-200 ${className}`} {...props}>
                                                {children}
                                            </code>
                                        </pre>
                                    );
                                }
                                return (
                                    <code className="bg-green-900/20 text-green-300 px-2 py-1 rounded-md text-[0.9em] font-mono border border-green-900/30 mx-1" {...props}>
                                        {children}
                                    </code>
                                );
                            },
                            img: ({ ...props }) => (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img className="rounded-xl border border-gray-800 my-8 w-full shadow-lg" {...props} alt={props.alt || "blog görseli"} />
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