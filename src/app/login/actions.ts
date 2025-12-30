'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// GİRİŞ YAPMA FONKSİYONU
export async function loginAdmin(formData: FormData) {
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

        redirect('/admin');
    } else {
        return { success: false, error: 'Hatalı şifre!' };
    }
}

// 👇 EKSİK OLAN FONKSİYON BU: ÇIKIŞ YAPMA
export async function logout() {
    const cookieStore = await cookies();

    // Cookie'yi sil
    cookieStore.delete('admin_session');

    // Giriş sayfasına yönlendir
    redirect('/login');
}