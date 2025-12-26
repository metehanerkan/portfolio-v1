'use server';

import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginClient(formData: FormData) {
    const code = formData.get('accessCode') as string;

    // 1. Kodu veritabanında ara
    const project = await db.clientProject.findUnique({
        where: { accessCode: code }
    });

    // 2. Proje yoksa hata döndür
    if (!project) {
        return { success: false, error: 'Geçersiz erişim kodu! Lütfen kontrol edin.' };
    }

    // 3. Varsa çerez (cookie) oluştur
    const cookieStore = await cookies();
    cookieStore.set('client_access_code', code, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 Hafta açık kalsın
        path: '/'
    });

    // 4. Panele yönlendir
    redirect('/portal/dashboard');
}

export async function logoutClient() {
    const cookieStore = await cookies();
    cookieStore.delete('client_access_code');
    redirect('/portal/login');
}