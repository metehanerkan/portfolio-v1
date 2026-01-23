'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { logVisit } from '@/actions/analytics'

export default function AnalyticsListener() {
    const pathname = usePathname()

    useEffect(() => {
        // Sadece ana sayfayı logla
        if (pathname === '/') {
            logVisit(pathname)
        }
    }, [pathname])

    return null // Görünmez bileşen
}
