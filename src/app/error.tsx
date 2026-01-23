'use client' // Error componentleri client olmak zorundadır

import { useEffect } from 'react'
import { createLog } from '@/actions/logger' // Yolunu kendine göre ayarla

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Hatayı veritabanına gizlice kaydet
        // Not: Server Action'ı client component içinde çağırıyoruz
        createLog(`Kritik Hata: ${error.message}`, 'ERROR', 'Global Error Boundary')
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-xl font-bold text-red-500">Bir şeyler ters gitti!</h2>
            <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => reset()}
            >
                Tekrar Dene
            </button>
        </div>
    )
}