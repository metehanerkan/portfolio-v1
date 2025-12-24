import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // 1. Kullanıcı nereye gitmeye çalışıyor?
    const path = request.nextUrl.pathname;

    // 2. Eğer gidilen yer "/admin" ile başlıyorsa kontrol et
    if (path.startsWith('/admin')) {

        // 3. Çerezlerde "admin_session" var mı?
        const adminSession = request.cookies.get('admin_session')?.value;

        // 4. Yoksa direkt Login sayfasına fırlat
        if (!adminSession) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Sorun yoksa devam et
    return NextResponse.next();
}

// Hangi yollarda çalışacağını belirt
export const config = {
    matcher: '/admin/:path*', // /admin ve altındaki her şeyde çalış
};