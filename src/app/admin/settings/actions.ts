'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Ayarları Getir
export async function getSettings() {
    return await db.siteSettings.findFirst();
}

// Bakım Modunu Değiştir
export async function toggleMaintenance(currentState: boolean) {
    // İlk kaydı bul veya oluştur
    const setting = await db.siteSettings.findFirst();

    if (setting) {
        await db.siteSettings.update({
            where: { id: setting.id },
            data: { maintenanceMode: !currentState }
        });
    } else {
        await db.siteSettings.create({
            data: { maintenanceMode: true } // İlk kez oluşturuluyorsa true yap
        });
    }

    revalidatePath('/'); // Tüm siteyi yenile
    return { success: true };
}