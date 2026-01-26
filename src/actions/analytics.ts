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
        // ADMIN EXCLUSION: Admin sayfalarını loglama
        if (path.startsWith('/admin') || path.startsWith('/tr/admin') || path.startsWith('/en/admin')) {
            return
        }

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

        // DEDUPLICATION: Son 5 saniye içinde aynı IP ve path ile kayıt var mı?
        const fiveSecondsAgo = new Date(Date.now() - 5000)
        const existingLog = await db.visitLog.findFirst({
            where: {
                ipHash,
                path,
                createdAt: {
                    gte: fiveSecondsAgo
                }
            }
        })

        if (existingLog) {
            // Mükerrer kayıt engellendi (Strict Mode veya Spam)
            return
        }

        // Veritabanına Yaz
        await db.visitLog.create({
            data: {
                ipHash,
                path,
                userAgent,
                browser,
                os,
                device,
                country: headersList.get('x-vercel-ip-country') || (process.env.NODE_ENV === 'development' ? 'Yerel Ağ (Dev)' : null),
                city: headersList.get('x-vercel-ip-city') || (process.env.NODE_ENV === 'development' ? 'İstanbul' : null)
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
            take: 5000
        })

        // Toplam Görüntüleme (Page Views)
        const pageViews = logs.length

        // Tekil Ziyaretçi (Unique Visitors)
        // Set kullanarak benzersiz ipHash sayısını bul
        const uniqueIPs = new Set(logs.map(log => log.ipHash))
        const uniqueVisitors = uniqueIPs.size

        // En Çok Ziyaret Edilen Sayfalar (Top Pages)
        const pathStats: Record<string, number> = {}
        logs.forEach((log: any) => {
            const p = log.path || '/'
            pathStats[p] = (pathStats[p] || 0) + 1
        })
        const topPages = Object.entries(pathStats)
            .map(([path, count]) => ({ path, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10)

        // Coğrafi Dağılım (Countries)
        const countryStats: Record<string, number> = {}
        logs.forEach((log: any) => {
            const country = log.country || 'Bilinmiyor'
            countryStats[country] = (countryStats[country] || 0) + 1
        })
        const locations = Object.entries(countryStats)
            .map(([country, count]) => ({ country, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10)

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

        // Son 7 Günlük Ziyaret Grafiği (Page Views & Unique Visitors)
        // Date -> { pageViews: number, uniqueVisitors: Set<string> }
        const dailyMap: Record<string, { pageViews: number, uniqueIPs: Set<string> }> = {}

        logs.forEach((log: any) => {
            const date = log.createdAt.toISOString().split('T')[0]
            if (!dailyMap[date]) {
                dailyMap[date] = { pageViews: 0, uniqueIPs: new Set() }
            }
            dailyMap[date].pageViews += 1
            dailyMap[date].uniqueIPs.add(log.ipHash)
        })

        // Grafiğe uygun formata çevir
        // { date: '2023-10-27', pageViews: 150, uniqueVisitors: 45 }
        const daily = Object.entries(dailyMap).map(([date, data]) => ({
            date,
            pageViews: data.pageViews,
            uniqueVisitors: data.uniqueIPs.size
        })).sort((a, b) => a.date.localeCompare(b.date)).slice(-30) // Son 30 gün (Frontend'de filtrelenecek)

        return {
            pageViews,
            uniqueVisitors,
            browsers: Object.entries(browserStats).map(([name, value]) => ({ name, value })),
            devices: Object.entries(deviceStats).map(([name, value]) => ({ name, value })),
            daily,
            topPages,
            locations
        }
    } catch (error) {
        console.error(error)
        return null
    }
}
