import { blogs } from '@/data/blogs';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { FaArrowLeft, FaCalendarAlt, FaClock, FaTag } from 'react-icons/fa';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

// (İsteğe Bağlı) Build sırasında sayfaları statik oluşturur, site hızlanır.
export async function generateStaticParams() {
    return blogs.map((post) => ({
        slug: post.id,
    }));
}

export default async function BlogPostPage({ params }: PageProps) {
    // URL'den slug (id) bilgisini al
    const { slug } = await params;

    // İlgili blog yazısını bul
    const post = blogs.find((p) => p.id === slug);

    // Yazı bulunamazsa 404 sayfasına yönlendir
    if (!post) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-black text-white pt-24 px-6 pb-20">
            <article className="max-w-4xl mx-auto">

                {/* Geri Dön Butonu */}
                <Link
                    href="/blog"
                    className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition group"
                >
                    <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Bloglara Dön
                </Link>

                {/* Başlık ve Meta Bilgiler */}
                <header className="mb-10 text-center">
                    {/* Kategori Etiketi */}
                    <div className="flex justify-center gap-2 mb-6">
                        <span className="bg-blue-900/30 text-blue-400 px-3 py-1 rounded-full text-sm font-semibold border border-blue-800 flex items-center gap-2">
                            <FaTag size={12} /> {post.category}
                        </span>
                    </div>

                    {/* Başlık */}
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        {post.title}
                    </h1>

                    {/* Tarih ve Süre */}
                    <div className="flex flex-wrap justify-center items-center gap-6 text-gray-400 text-sm">
                        <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-gray-500" />
                            <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <FaClock className="text-gray-500" />
                            <span>{post.readTime} okuma</span>
                        </div>
                    </div>
                </header>

                {/* Kapak Görseli */}
                <div className="w-full aspect-video rounded-2xl overflow-hidden border border-gray-800 mb-12 relative shadow-2xl shadow-blue-900/10">
                    <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* İçerik (Markdown) */}
                {/* 'prose' sınıfları metni otomatik güzelleştirir */}
                <div className="prose prose-invert prose-lg max-w-none prose-headings:text-blue-100 prose-a:text-blue-400 prose-code:text-pink-400 prose-img:rounded-xl">
                    <ReactMarkdown>
                        {post.content}
                    </ReactMarkdown>
                </div>

            </article>

            {/* Alt Footer */}
            <div className="max-w-4xl mx-auto mt-20 pt-10 border-t border-gray-800 text-center">
                <p className="text-gray-500 italic">
                    Bu yazıyı okuduğunuz için teşekkürler! 👋
                </p>
            </div>

        </main>
    );
}