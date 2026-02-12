import { db } from '@/lib/db';
import BlogClient from './BlogClient';
import { Locale, getDictionary } from '@/dictionaries';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
    const { lang } = await params;

    // Basit çoklu dil desteği
    const title = lang === 'tr' ? 'Blog | Metehan Erkan' : 'Blog | Metehan Erkan';
    const description = lang === 'tr'
        ? 'Yazılım, teknoloji ve web geliştirme üzerine güncel makaleler, dersler ve ipuçları.'
        : 'Latest articles, tutorials and tips on software, technology and web development.';

    return {
        title,
        description,
        openGraph: {
            title,
            description,
        }
    };
}

export default async function BlogPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = getDictionary(lang);

    // 1. Sadece "Yayında" olan blogları çek
    const posts = await db.blogPost.findMany({
        where: { isPublished: true }, // Taslakları gizle
        orderBy: { createdAt: 'desc' }
    });

    // 2. Veriyi tasarıma gönder
    return (
        <main className="min-h-screen w-full relative bg-background transition-colors duration-300">
            {/* --- SABİT ARKA PLAN KATMANI --- */}
            {/* --- SABİT ARKA PLAN KATMANI --- */}

            <div className="fixed inset-0 w-full h-full z-0 pointer-events-none block dark:hidden bg-gradient-to-b from-purple-50/50 to-white"></div>

            <div className="relative z-10 w-full">
                <BlogClient posts={posts} dict={dict.blog} lang={lang} />
            </div>
        </main>
    );
}