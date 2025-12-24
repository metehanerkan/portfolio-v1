import { db } from '@/lib/db';
import BlogClient from './BlogClient';

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
    // 1. Sadece "Yayında" olan blogları çek
    const posts = await db.blogPost.findMany({
        where: { isPublished: true }, // Taslakları gizle
        orderBy: { createdAt: 'desc' }
    });

    // 2. Veriyi tasarıma gönder
    return <BlogClient posts={posts} />;
}