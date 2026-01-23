'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { headers } from 'next/headers';
import { checkRateLimit } from '@/lib/rateLimit';

import { createLog } from '@/actions/logger';

// GİRİŞ YAPMA FONKSİYONU
export async function loginAdmin(formData: FormData) {
    const ip = (await headers()).get('x-forwarded-for') || '127.0.0.1';

    // Rate Limiting Check (5 attempts per 15 mins)
    const { success } = checkRateLimit(ip, { windowMs: 15 * 60 * 1000, max: 5 });
    if (!success) {
        await createLog(`Admin giriş denemesi engellendi (Rate Limit): ${ip}`, 'WARNING', 'Auth System');
        return { success: false, error: 'Çok fazla giriş denemesi. Lütfen 15 dakika bekleyin.' };
    }
    const password = formData.get('password') as string;
    const correctPassword = process.env.ADMIN_PASSWORD;

    if (password === correctPassword) {
        const cookieStore = await cookies();

        // Cookie oluştur
        cookieStore.set('admin_session', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 // 1 gün
        });

        await createLog('Admin girişi başarılı.', 'SUCCESS', 'Auth System');
        redirect('/admin');
    } else {
        await createLog(`Hatalı admin şifresi denemesi: ${ip}`, 'WARNING', 'Auth System');
        return { success: false, error: 'Hatalı şifre!' };
    }
}

// 👇 EKSİK OLAN FONKSİYON BU: ÇIKIŞ YAPMA
export async function logout() {
    const cookieStore = await cookies();

    // Cookie'yi sil
    cookieStore.delete('admin_session');

    // Giriş sayfasına yönlendir
    redirect('/admin/login');
}