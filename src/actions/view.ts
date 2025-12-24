'use server';

import { db } from '@/lib/db';

export async function incrementView(id: string, type: 'project' | 'blog') {
    try {
        if (type === 'project') {
            await db.project.update({
                where: { id },
                data: { viewCount: { increment: 1 } },
            });
        } else {
            await db.blogPost.update({
                where: { id },
                data: { viewCount: { increment: 1 } },
            });
        }
    } catch (error) {
        console.error("Sayaç artırma hatası:", error);
    }
}