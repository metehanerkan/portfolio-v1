'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(formData: FormData) {
    const password = formData.get('password') as string;
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (password === process.env.ADMIN_PASSWORD) {

        const cookieStore = await cookies();
        cookieStore.set('admin_session', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24,
            path: '/',
        });

        redirect('/admin');
    } else {
        return { error: 'Hatalı parola!' };
    }
}
export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
    redirect('/login');
}