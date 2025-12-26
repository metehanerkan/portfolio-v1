import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. ADMİN KORUMASI
    // Eğer kullanıcı /admin sayfasına girmeye çalışıyorsa
    if (pathname.startsWith('/admin')) {
        // Çerezlerde 'admin_session' var mı diye bak
        const isAdmin = request.cookies.get('admin_session')?.value === 'true';

        // Yoksa, giriş sayfasına at
        if (!isAdmin) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // 2. LOGİN SAYFASI KONTROLÜ
    // Eğer zaten giriş yapmışsa ve tekrar /login sayfasına gitmeye çalışırsa
    if (pathname === '/login') {
        const isAdmin = request.cookies.get('admin_session')?.value === 'true';
        if (isAdmin) {
            return NextResponse.redirect(new URL('/admin', request.url)); // Direkt panele at
        }
    }

    return NextResponse.next();
}

// Hangi sayfalarda çalışacağını belirtiyoruz
export const config = {
    matcher: ['/admin/:path*', '/login'],
};