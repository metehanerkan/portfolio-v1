'use server'

import { db } from '@/lib/db'

export interface SystemHealth {
    dbStatus: 'online' | 'offline'
    dbLatency: number
    apiStatus: 'online' | 'offline'
    apiLatency: number
    lastChecked: Date
}

export async function checkSystemHealth(): Promise<SystemHealth> {
    const startDb = Date.now()
    let dbStatus: 'online' | 'offline' = 'online'
    try {
        // Basit bir sorgu ile DB bağlantısını ve hızını test et
        await db.project.findFirst({ select: { id: true } })
    } catch (error) {
        dbStatus = 'offline'
    }
    const dbLatency = Date.now() - startDb

    const startApi = Date.now()
    let apiStatus: 'online' | 'offline' = 'online'
    try {
        // Google'a ping atarak internet çıkışını kontrol et
        const response = await fetch('https://www.google.com', { method: 'HEAD', cache: 'no-store' })
        if (!response.ok) throw new Error('Network error')
    } catch (error) {
        apiStatus = 'offline'
    }
    const apiLatency = Date.now() - startApi

    // Metrikleri Kaydet (Grafik İçin)
    try {
        await (db as any).systemMetric.create({
            data: {
                dbLatency: dbStatus === 'online' ? dbLatency : 0,
                apiLatency: apiStatus === 'online' ? apiLatency : 0
            }
        })
    } catch (e) { /* ignore log error */ }

    return {
        dbStatus,
        dbLatency: dbStatus === 'online' ? dbLatency : -1,
        apiStatus,
        apiLatency: apiStatus === 'online' ? apiLatency : -1,
        lastChecked: new Date()
    }
}

export async function getSystemHistory() {
    try {
        const history = await (db as any).systemMetric.findMany({
            orderBy: { createdAt: 'desc' },
            take: 20 // Son 20 ölçüm
        })

        return history.map((h: any) => ({
            time: h.createdAt.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
            db: h.dbLatency,
            api: h.apiLatency
        })).reverse()
    } catch (e) {
        return []
    }
}
