'use server'

import { db } from '@/lib/db'
import { headers } from 'next/headers'
import { UAParser } from 'ua-parser-js'

// IP Anonymization (Basit Hashleme)
async function hashIP(ip: string) {
    const encoder = new TextEncoder()
    const secret = process.env.SESSION_SECRET || 'fallback-secret'
    const data = encoder.encode(ip + secret) // Salt olarak secret kullan
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function logVisit(path: string) {
    try {
        const headersList = await headers()
        const ip = headersList.get('x-forwarded-for') || 'unknown'
        const userAgent = headersList.get('user-agent') || ''

        // User Agent Parse Et
        // @ts-ignore - UAParser type definition mismatch fix
        const parser = new UAParser(userAgent)
        const browser = parser.getBrowser().name || 'Unknown'
        const os = parser.getOS().name || 'Unknown'
        const device = parser.getDevice().type || 'Desktop'

        const ipHash = await hashIP(ip)

        // Veritabanına Yaz
        await db.visitLog.create({
            data: {
                ipHash,
                path,
                userAgent,
                browser,
                os,
                device,
                country: headersList.get('x-vercel-ip-country') || null,
                city: headersList.get('x-vercel-ip-city') || null
            }
        })
    } catch (error) {
        console.error('Ziyaret loglanamadı:', error)
    }
}

export async function getAnalyticsStats() {
    try {
        const logs = await db.visitLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 1000
        })

        // Tarayıcı İstatistiği
        const browserStats: Record<string, number> = {}
        logs.forEach((log: any) => {
            const b = log.browser || 'Diğer'
            browserStats[b] = (browserStats[b] || 0) + 1
        })

        // Cihaz İstatistiği
        const deviceStats: Record<string, number> = {}
        logs.forEach((log: any) => {
            const d = log.device || 'Desktop'
            deviceStats[d] = (deviceStats[d] || 0) + 1
        })

        // Son 7 Günlük Ziyaret Grafiği
        const dailyStats: Record<string, number> = {}
        logs.forEach((log: any) => {
            const date = log.createdAt.toISOString().split('T')[0]
            dailyStats[date] = (dailyStats[date] || 0) + 1
        })

        return {
            total: logs.length,
            browsers: Object.entries(browserStats).map(([name, value]) => ({ name, value })),
            devices: Object.entries(deviceStats).map(([name, value]) => ({ name, value })),
            daily: Object.entries(dailyStats).map(([date, count]) => ({ date, count })).reverse()
        }
    } catch (error) {
        console.error(error)
        return null
    }
}
