import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['tr', 'en'];
const defaultLocale = 'tr';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. YOL BİLGİSİNİ HEADER'A EKLE (Herkes için)
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-invoke-path', pathname);

    // 2. EXCLUDE (Dışlanan Yollar)
    // API, Admin, Next.js dahili dosyalar ve statik dosyalar için i18n yapma
    if (
        pathname.startsWith('/api') ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/admin') ||
        pathname.includes('.') // Dosya uzantısı olanlar (favicon.ico, robots.txt vb.)
    ) {
        // ADMIN KORUMASI (Sadece /admin için çalışır)
        if (pathname.startsWith('/admin')) {
            const isAdmin = request.cookies.get('admin_session')?.value === 'true';

            // Koruma
            if (pathname !== '/admin/login' && !isAdmin) {
                return NextResponse.redirect(new URL('/admin/login', request.url));
            }

            // Zaten giriş yapmışsa login'den at
            if (pathname === '/admin/login' && isAdmin) {
                return NextResponse.redirect(new URL('/admin', request.url));
            }
        }

        return NextResponse.next({
            request: { headers: requestHeaders },
        });
    }

    // 3. i18n YÖNLENDİRMESİ
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (pathnameHasLocale) {
        return NextResponse.next({
            request: { headers: requestHeaders },
        });
    }

    // Locale yoksa Default Locale'e yönlendir
    const locale = defaultLocale;
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
}

export const config = {
    matcher: [
        '/((?!_next).*)',
    ],
};