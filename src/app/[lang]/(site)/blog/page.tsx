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
    return <BlogClient posts={posts} dict={dict.blog} lang={lang} />;
}