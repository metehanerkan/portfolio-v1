'use server'

import { db } from '@/lib/db'
import { Resend } from 'resend'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { checkRateLimit } from '@/lib/rateLimit'

import { createLog } from '@/actions/logger'

const resend = new Resend(process.env.RESEND_API_KEY)

// 1. Yeni Abone Kaydı
export async function subscribeToNewsletter(email: string, honeypot?: string) {
    if (honeypot) {
        // Sessizce yut, loglamaya bile gerek yok (veya spam logla)
        return { success: true }
    }

    // Rate Limit (10 mins, 5 attempts)
    const ip = (await headers()).get('x-forwarded-for') || '127.0.0.1'
    const { success: limitSuccess } = checkRateLimit(ip, { windowMs: 10 * 60 * 1000, max: 5 })
    if (!limitSuccess) {
        await createLog(`Bülten aboneliği limit aşımı: ${ip}`, 'WARNING', 'Newsletter')
        return { success: false, error: 'Çok fazla istek. Lütfen bekleyiniz.' }
    }

    try {
        const existing = await db.newsletterSubscriber.findUnique({ where: { email } })

        if (existing) {
            return { success: false, error: 'Zaten abone.' }
        }

        await db.newsletterSubscriber.create({
            data: { email }
        })

        // Hoş geldin maili (Opsiyonel)
        if (process.env.RESEND_API_KEY && process.env.MY_EMAIL) {
            // ...
        }

        await createLog(`Yeni bülten abonesi: ${email}`, 'SUCCESS', 'Newsletter')
        revalidatePath('/admin')
        return { success: true }
    } catch (e) {
        console.error(e);
        await createLog(`Bülten abonelik hatası: ${email}`, 'ERROR', 'Newsletter')
        return { success: false, error: 'Bir hata oluştu.' }
    }
}

// 2. Abonelikten Çık (Unsubscribe)
export async function unsubscribe(email: string) {
    await db.newsletterSubscriber.update({
        where: { email },
        data: { isActive: false }
    })
    return { success: true }
}

// 3. Toplu Mail Gönder (Admin İçin)
export async function sendNewsletter(formData: FormData) {
    const subject = formData.get('subject') as string
    const content = formData.get('content') as string // HTML veya Text

    try {
        // Aktif aboneleri çek
        const subscribers = await db.newsletterSubscriber.findMany({
            where: { isActive: true }
        })

        if (subscribers.length === 0) return { success: false, error: 'Hiç abone yok.' }

        // Resend "Batch Sending" veya tek tek döngü
        // Ücretsiz plan limiti 100/gün oldugu icn dikkatli olunmalı.
        // Resend batch max 100 array supports.

        const emailBatch = subscribers.map(sub => ({
            from: 'Metehan Erkan <onboarding@resend.dev>',
            to: sub.email,
            subject: subject,
            html: `
                <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
                    ${content}
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
                    <p style="font-size: 11px; color: #888;">
                        Bu maili bültenime abone olduğunuz için alıyorsunuz. 
                        <a href="https://www.metehandev.site/unsubscribe?email=${sub.email}">Abonelikten çık</a>
                    </p>
                </div>
            `
        }))

        // Batch gönderim (Sadece 100 kişiye kadar tek seferde)
        await resend.batch.send(emailBatch.slice(0, 100))

        return { success: true, count: emailBatch.length }

    } catch (error) {
        console.error(error)
        return { success: false, error: 'Gönderim başarısız.' }
    }
}

export async function getNewsletterStats() {
    try {
        const count = await db.newsletterSubscriber.count({
            where: { isActive: true }
        })
        return { count }
    } catch (error) {
        return { count: 0 }
    }
}

export async function getSubscribers() {
    try {
        return await db.newsletterSubscriber.findMany({
            orderBy: { createdAt: 'desc' }
        })
    } catch (error) {
        return []
    }
}
