'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function sendMessage(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    // Basit doğrulama
    if (!name || !email || !message) {
        return { success: false, error: 'Lütfen tüm alanları doldurun.' };
    }

    try {
        // Veritabanına kaydet
        await db.contactMessage.create({
            data: {
                name,
                email,
                message,
            },
        });

        // Admin panelindeki mesajlar sayfasını yenile (Yeni mesaj hemen görünsün)
        revalidatePath('/admin');
        return { success: true };

    } catch (error) {
        return { success: false, error: 'Bir hata oluştu, lütfen tekrar deneyin.' };
    }
}