import { MetadataRoute } from 'next'
import { db } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://metehanerkan.vercel.app'

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

    const projectUrls = projects.map((project) => ({
        url: `${baseUrl}/projects/${project.id}`,
        lastModified: project.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    const postUrls = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.id}`,
        lastModified: post.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }))

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/projects`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        ...projectUrls,
        ...postUrls,
    ]
}
