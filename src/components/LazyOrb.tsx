'use client';

import dynamic from 'next/dynamic';

import { useEffect, useState } from 'react';

const Orb = dynamic(() => import('./Orb'), {
    ssr: false,
    // Optimization: Placeholder matches container size (h-full w-full) to prevent CLS
    loading: () => <div className="w-full h-full opacity-0" />
});

export default function LazyOrb(props: any) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Check if device is mobile (md breakpoint is usually 768px)
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        // Check initially
        checkMobile();

        // Add listener for resize events
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (isMobile) {
        // Mobile Optimization: Return a static lightweight fallback instead of heavy WebGL
        // This drastically reduces TBT (Total Blocking Time) and LCP on mobile devices
        return (
            <div
                className="w-full h-full rounded-full opacity-60 blur-3xl animate-pulse"
                style={{
                    background: `radial-gradient(circle at center, ${props.hue ? `hsl(${props.hue}, 70%, 60%)` : '#a855f7'}, transparent 70%)`
                }}
            />
        );
    }

    return <Orb {...props} />;
}
