'use client';

import dynamic from 'next/dynamic';

const Orb = dynamic(() => import('./Orb'), {
    ssr: false,
    // Optimization: Placeholder matches container size (h-full w-full) to prevent CLS
    loading: () => <div className="w-full h-full opacity-0" />
});

export default function LazyOrb(props: any) {
    return <Orb {...props} />;
}
