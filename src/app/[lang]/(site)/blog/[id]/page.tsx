import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowLeft, FaCalendar, FaClock, FaTag, FaImage, FaQuoteLeft } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import ViewCounter from '@/components/ViewCounter';
import ReadingBar from '@/components/ReadingBar';
import { Metadata } from 'next';
import Script from 'next/script';

// 👇 CANLI SİTE İÇİN KRİTİK AYARLAR (Cache'i tamamen kapatır)
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

interface BlogDetailPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
    const { id } = await params;
    const post = await db.blogPost.findFirst({ where: { id } });
    if (!post) return { title: 'Blog Bulunamadı' };

    const ogUrl = new URL('https://metehanerkan.vercel.app/api/og');
    ogUrl.searchParams.set('title', post.title);
    ogUrl.searchParams.set('type', 'Blog');

    return {
        title: post.title,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: [{
                url: ogUrl.toString(),
                width: 1200,
                height: 630,
            }],
        }
    };
}

export default async function BlogDetailPage(props: BlogDetailPageProps) {
    // 1. Parametreleri al
    const { id } = await props.params;

    // 2. Veriyi çek
    const post = await db.blogPost.findFirst({
        where: { id: id },
    });

    // 3. Bulunamazsa 404 ver
    if (!post) {
        return notFound();
    }

    // 4. BLOG TASARIMI
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.excerpt,
        image: post.imageUrl ? [post.imageUrl] : [],
        datePublished: post.createdAt,
        dateModified: post.updatedAt || post.createdAt,
        author: {
            '@type': 'Person',
            name: 'Metehan Erkan',
            url: 'https://metehanerkan.vercel.app'
        }
    };

    const breadcrumbJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Ana Sayfa',
                item: 'https://metehanerkan.vercel.app'
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Blog',
                item: 'https://metehanerkan.vercel.app/blog'
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: post.title,
                item: `https://metehanerkan.vercel.app/blog/${post.id}`
            }
        ]
    };

    return (
        <main className="min-h-screen bg-white dark:bg-[#030014] text-gray-900 dark:text-white py-32 px-6 relative overflow-hidden transition-colors duration-300">
            <Script
                id="blog-json-ld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Script
                id="breadcrumb-json-ld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <ReadingBar />

            {/* 👇 SAYAÇ BİLEŞENİ */}
            <ViewCounter id={id} type="blog" />

            {/* --- ARKA PLAN IŞIK EFEKTLERİ (SABİT) --- */}
            <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
                {/* Navbar Arkası Tepe Işığı */}
                <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-purple-500/10 dark:from-purple-900/50 via-transparent dark:via-[#1a0b2e]/30 to-transparent blur-[80px] opacity-80" />

                {/* Ana Spot */}
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-600/5 dark:bg-purple-600/10 rounded-full blur-[120px] opacity-40"></div>

                {/* Sol Alt Işık */}
                <div className="absolute bottom-0 left-[-10%] w-[500px] h-[500px] bg-indigo-500/5 dark:bg-indigo-900/10 rounded-full blur-[100px] opacity-50"></div>
            </div>

            <article className="max-w-4xl mx-auto relative z-10">

                {/* Geri Dön Butonu */}
                <Link href="/blog" className="inline-flex items-center text-gray-600 dark:text-purple-200/60 hover:text-purple-600 dark:hover:text-white mb-8 transition-colors group font-medium">
                    <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> Tüm Yazılara Dön
                </Link>

                {/* Üst Bilgiler (Meta Data) */}
                <div className="flex flex-wrap gap-3 items-center text-sm mb-6 animate-fadeIn">
                    <span className="flex items-center gap-2 text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-500/10 px-4 py-1.5 rounded-full border border-purple-200 dark:border-purple-500/20 font-medium backdrop-blur-md shadow-sm">
                        <FaTag className="text-xs" /> {post.category}
                    </span>
                    <span className="flex items-center gap-2 bg-white/60 dark:bg-[#0a0a0a]/60 text-gray-600 dark:text-purple-200/60 px-4 py-1.5 rounded-full border border-gray-200 dark:border-white/10 backdrop-blur-md">
                        <FaCalendar className="text-xs" /> {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                    <span className="flex items-center gap-2 bg-white/60 dark:bg-[#0a0a0a]/60 text-gray-600 dark:text-purple-200/60 px-4 py-1.5 rounded-full border border-gray-200 dark:border-white/10 backdrop-blur-md">
                        <FaClock className="text-xs" /> {post.readTime}
                    </span>
                </div>

                {/* Başlık */}
                <h1 className="text-3xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-10 leading-tight animate-fadeIn bg-clip-text text-transparent bg-gradient-to-r from-purple-800 via-purple-600 to-purple-800 dark:from-white dark:via-purple-100 dark:to-purple-300 ">
                    {post.title}
                </h1>

                {/* BÜYÜK KAPAK RESMİ */}
                <div className="w-full h-[300px] md:h-[500px] relative rounded-3xl overflow-hidden mb-12 border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-[#0a0a0a]/50 shadow-2xl animate-fadeIn delay-100 group">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 dark:from-[#030014]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                    {post.imageUrl && post.imageUrl.length > 5 ? (
                        <Image
                            src={post.imageUrl}
                            alt={post.title}
                            fill
                            className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                            priority
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-purple-200/30">
                            <FaImage size={64} className="mb-4 opacity-40" />
                            <p className="font-medium">Görsel Yok</p>
                        </div>
                    )}
                </div>

                {/* İÇERİK ALANI (ÖZEL MARKDOWN TASARIMI) */}
                <div className="text-gray-700 dark:text-purple-100/80 leading-relaxed bg-white/50 dark:bg-[#0a0a0a]/40 p-8 md:p-12 rounded-3xl border border-gray-200 dark:border-white/10 shadow-xl backdrop-blur-md animate-fadeIn delay-200">
                    <ReactMarkdown
                        components={{
                            h1: ({ ...props }) => <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-12 mb-6 pb-4 border-b border-gray-200 dark:border-white/10" {...props} />,
                            h2: ({ ...props }) => <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4" {...props} />,
                            h3: ({ ...props }) => <h4 className="text-xl font-bold text-purple-700 dark:text-purple-400 mt-8 mb-3" {...props} />,
                            p: ({ ...props }) => <p className="mb-6 text-lg leading-relaxed text-gray-700 dark:text-purple-100/80" {...props} />,
                            ul: ({ ...props }) => <ul className="list-disc list-inside mb-6 space-y-2 text-gray-700 dark:text-purple-100/80 marker:text-purple-600 dark:marker:text-purple-500" {...props} />,
                            ol: ({ ...props }) => <ol className="list-decimal list-inside mb-6 space-y-2 text-gray-700 dark:text-purple-100/80 marker:text-purple-600 dark:marker:text-purple-500" {...props} />,
                            li: ({ ...props }) => <li className="pl-1" {...props} />,
                            a: ({ ...props }) => <a className="text-purple-600 dark:text-purple-400 font-medium hover:text-purple-800 dark:hover:text-white border-b border-purple-300 dark:border-purple-500/30 hover:border-purple-600 dark:hover:border-white transition-all no-underline" target="_blank" rel="noopener noreferrer" {...props} />,

                            // ALINTI BLOKLARI
                            blockquote: ({ children, ...props }) => (
                                <blockquote className="relative pl-10 py-6 my-8 bg-purple-50 dark:bg-purple-900/10 rounded-r-2xl border-l-4 border-purple-500 italic text-purple-800 dark:text-purple-200/90 pr-4 shadow-[0_0_20px_rgba(168,85,247,0.05)]" {...props}>
                                    <FaQuoteLeft className="absolute top-6 left-3 text-purple-400 dark:text-purple-500/40 text-xl" />
                                    {children}
                                </blockquote>
                            ),

                            // GÖRSELLER
                            img: ({ ...props }) => (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img className="rounded-2xl border border-gray-200 dark:border-white/10 my-10 w-full shadow-lg" {...props} alt={props.alt || "blog görseli"} />
                            ),

                            // KOD BLOKLARI (Mac Style)
                            code: ({ className, children, ...props }) => {
                                const isBlock = className || (typeof children === 'string' && children.includes('\n'));
                                if (isBlock) {
                                    return (
                                        <div className="my-8 rounded-2xl border border-gray-700 dark:border-white/10 overflow-hidden bg-gray-900 dark:bg-[#050508] shadow-lg relative group">
                                            {/* Mac Pencere Başlığı */}
                                            <div className="flex items-center gap-2 px-4 py-3 bg-gray-800 dark:bg-white/5 border-b border-gray-700 dark:border-white/5">
                                                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                                                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                                                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                                            </div>
                                            {/* Kod İçeriği */}
                                            <pre className="p-6 overflow-x-auto">
                                                <code className={`font-mono text-sm text-gray-100 dark:text-purple-100/90 ${className}`} {...props}>
                                                    {children}
                                                </code>
                                            </pre>
                                        </div>
                                    );
                                }
                                return (
                                    <code className="bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-md text-[0.9em] font-mono border border-purple-200 dark:border-purple-500/20 mx-1" {...props}>
                                        {children}
                                    </code>
                                );
                            },
                        }}
                    >
                        {post.content}
                    </ReactMarkdown>
                </div>

            </article>
        </main>
    );
}