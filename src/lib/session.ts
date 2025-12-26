import 'server-only';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

// Güvenlik anahtarı (Bunu .env dosyana SESSION_SECRET olarak eklemen iyi olur, yoksa varsayılanı kullanır)
const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

// 1. OTURUM DOĞRULAMA (Admin sayfasının aradığı fonksiyon bu)
export async function verifySession() {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;

    if (!session) {
        return null;
    }

    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (error) {
        console.log('Session doğrulama hatası:', error);
        return null;
    }
}

// 2. OTURUM OLUŞTURMA (Giriş yaparken kullanılır)
export async function createSession(userId: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 Günlük oturum
    const session = await new SignJWT({ userId, role: 'admin' })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(encodedKey);

    const cookieStore = await cookies();
    cookieStore.set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    });
}

// 3. OTURUM SİLME (Çıkış yaparken kullanılır)
export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
}