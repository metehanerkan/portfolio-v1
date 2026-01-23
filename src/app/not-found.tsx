'use client' // useEffect ve usePathname kullanacağımız için client component olmalı

import Link from 'next/link';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { createLog } from '@/actions/logger'; // Logger aksiyonunu içe aktardık

export default function NotFound() {
    const pathname = usePathname(); // Kullanıcının girmeye çalıştığı URL'i al

    useEffect(() => {
        // Sayfa yüklendiğinde log kaydı oluştur (UI'ı bloklamadan)
        const log404 = async () => {
            await createLog(
                `Bulunamayan sayfa isteği: ${pathname}`,
                'WARNING',
                '404 Page'
            );
        };

        log404();
    }, [pathname]);

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white px-4 relative overflow-hidden">

            {/* Arka Plan Efekti */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] -z-10 animate-pulse"></div>

            {/* 404 Başlığı */}
            <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 mb-4 animate-bounce">
                404
            </h1>

            {/* Uyarı Mesajı */}
            <div className="flex items-center gap-3 text-yellow-400 text-xl mb-6 font-mono">
                <FaExclamationTriangle />
                <span>Bir sorunumuz var!</span>
            </div>

            {/* Açıklama */}
            <p className="text-gray-400 text-lg text-center max-w-md mb-10 leading-relaxed">
                Aradığın
                <span className="text-blue-400 font-mono mx-1 bg-blue-900/30 px-1 rounded">
                    {pathname}
                </span>
                sayfası silinmiş, taşınmış veya hiç var olmamış olabilir. Ya da belki de kara delikte kayboldu?
            </p>

            {/* Ana Sayfa Butonu */}
            <Link
                href="/"
                className="px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition transform hover:scale-105 flex items-center gap-2 shadow-lg shadow-white/10"
            >
                <FaHome />
                Ana Sayfaya Işınlan
            </Link>

        </div>
    );
}