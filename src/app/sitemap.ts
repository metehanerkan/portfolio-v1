import { MetadataRoute } from 'next'
import { db } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://metehanerkan.vercel.app'
    const languages = ['tr', 'en']

    // Projeleri çek (Son eklenenler önce)
    const projects = await db.project.findMany({
        where: { isPublished: true },
        select: { id: true, updatedAt: true },
    })

    // Blogları çek
    const posts = await db.blogPost.findMany({
        where: { isPublished: true },
        select: { id: true, updatedAt: true },
    })

    const sitemapEntries: MetadataRoute.Sitemap = []

    for (const lang of languages) {
        // 1. Statik Sayfalar
        sitemapEntries.push(
            {
                url: `${baseUrl}/${lang}`,
                lastModified: new Date(),
                changeFrequency: 'yearly',
                priority: 1,
            },
            {
                url: `${baseUrl}/${lang}/about`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.8,
            },
            {
                url: `${baseUrl}/${lang}/contact`,
                lastModified: new Date(),
                changeFrequency: 'yearly',
                priority: 0.5,
            },
            {
                url: `${baseUrl}/${lang}/blog`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
            },
            {
                url: `${baseUrl}/${lang}/projects`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.9,
            }
        )

        // 2. Dinamik Projeler
        projects.forEach((project) => {
            sitemapEntries.push({
                url: `${baseUrl}/${lang}/projects/${project.id}`,
                lastModified: project.updatedAt,
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            })
        })

        // 3. Dinamik Bloglar
        posts.forEach((post) => {
            sitemapEntries.push({
                url: `${baseUrl}/${lang}/blog/${post.id}`,
                lastModified: post.updatedAt,
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            })
        })
    }

    return sitemapEntries
}
