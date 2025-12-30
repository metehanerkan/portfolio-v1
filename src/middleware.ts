import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. ÖNEMLİ: URL BİLGİSİNİ HEADER'A EKLE
    // Layout.tsx dosyasının hangi sayfada olduğunu anlaması için bunu ekliyoruz.
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-invoke-path', pathname);

    // 2. ADMİN KORUMASI
    // Eğer kullanıcı /admin sayfasına girmeye çalışıyorsa VE gittiği yer zaten giriş sayfası değilse
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        // Çerezlerde 'admin_session' var mı diye bak
        const isAdmin = request.cookies.get('admin_session')?.value === 'true';

        // Yoksa, giriş sayfasına at
        if (!isAdmin) {
            // Önceki kodunda '/login' vardı, dosya yapına uygun olarak '/admin/login' yaptım.
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    // 3. LOGİN SAYFASI KONTROLÜ
    // Eğer zaten giriş yapmışsa ve tekrar login sayfasına gitmeye çalışırsa panele geri at
    if (pathname === '/admin/login' || pathname === '/login') {
        const isAdmin = request.cookies.get('admin_session')?.value === 'true';
        if (isAdmin) {
            return NextResponse.redirect(new URL('/admin', request.url));
        }
    }

    // 4. İŞLEME DEVAM ET (Yeni header'ları ekleyerek)
    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

// 5. CONFIG AYARI
// Middleware'in TÜM sayfalarda çalışması lazım ki 'x-invoke-path' header'ı her yerde oluşsun.
// Eğer sadece '/admin' yaparsan, ana sayfada bakım modu kontrolü çalışmaz.
export const config = {
    matcher: [
        /*
         * Aşağıdakiler HARIÇ tüm yollarda çalış:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};