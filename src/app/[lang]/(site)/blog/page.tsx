import { db } from '@/lib/db';
import BlogClient from './BlogClient';
import { Locale, getDictionary } from '@/dictionaries';

export const dynamic = 'force-dynamic';

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
            <div className="fixed inset-0 w-full h-full z-0 pointer-events-none hidden dark:block">
                <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-purple-900/30 via-[#1a0b2e]/20 to-transparent blur-[80px] opacity-50" />
                <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[140vw] h-[100vh] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-800/20 via-[#0b0318]/40 to-transparent blur-[100px]" />
                <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-purple-800/10 rounded-full blur-[120px] mix-blend-screen" />
            </div>
            <div className="fixed inset-0 w-full h-full z-0 pointer-events-none block dark:hidden bg-gradient-to-b from-purple-50/50 to-white"></div>

            <div className="relative z-10 w-full">
                <BlogClient posts={posts} dict={dict.blog} lang={lang} />
            </div>
        </main>
    );
}