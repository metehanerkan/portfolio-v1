'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { logVisit } from '@/actions/analytics'

export default function AnalyticsListener() {
    const pathname = usePathname()

    useEffect(() => {
        // Tüm sayfaları logla (i18n uyumlu olması için '/' kontrolünü kaldırdık)
        logVisit(pathname)
    }, [pathname])

    return null // Görünmez bileşen
}
