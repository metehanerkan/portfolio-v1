'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

// Log Oluşturma Fonksiyonu
export async function createLog(
    message: string,
    level: 'INFO' | 'ERROR' | 'WARNING' | 'SUCCESS' = 'INFO',
    source: string = 'System'
) {
    try {
        await db.systemLog.create({
            data: {
                message,
                level,
                source
            }
        })
        revalidatePath('/admin')
    } catch (e) {
        console.error('Loglama hatası:', e)
    }
}

// Logları Okuma Fonksiyonu (Admin Paneli için)
export async function getLogs() {
    try {
        // Hata ayıklama: Veritabanı bağlantısını kontrol et
        const logs = await db.systemLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50
        })
        return logs
    } catch (error) {
        console.error("Loglar çekilemedi:", error)
        return [] // Hata durumunda boş dizi dön ki arayüz patlamasın
    }
}

// Logları Temizle
export async function clearLogs() {
    try {
        await db.systemLog.deleteMany()
        revalidatePath('/admin')
        return { success: true }
    } catch (error) {
        return { success: false, error: 'Temizleme başarısız' }
    }
}