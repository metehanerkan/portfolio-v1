'use server'

import { db } from '@/lib/db'

export async function createBackup() {
    try {
        const timestamp = new Date().toISOString()

        // Tüm tabloları paralel çek
        const [
            projects,
            blogPosts,
            messages,
            clientProjects,
            projectRequests,
            siteSettings,
            newsletterSubscribers
        ] = await Promise.all([
            db.project.findMany(),
            db.blogPost.findMany(),
            db.contactMessage.findMany(),
            db.clientProject.findMany({ include: { requests: true } }),
            db.projectRequest.findMany(),
            db.siteSettings.findMany(),
            db.newsletterSubscriber.findMany()
        ])

        const backupData = {
            metadata: {
                version: '1.0',
                createdAt: timestamp,
                app: 'Portfolio v1'
            },
            data: {
                projects,
                blogPosts,
                messages,
                clientProjects,
                projectRequests,
                siteSettings,
                newsletterSubscribers
            }
        }

        return { success: true, data: JSON.stringify(backupData, null, 2) }

    } catch (error) {
        console.error('Yedek alma hatası:', error)
        return { success: false, error: 'Yedek oluşturulamadı.' }
    }
}
