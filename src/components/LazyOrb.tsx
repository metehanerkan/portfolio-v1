'use client';

import dynamic from 'next/dynamic';

const Orb = dynamic(() => import('./Orb'), {
    ssr: false,
    loading: () => <div className="w-full h-full opacity-0" />
});

export default function LazyOrb(props: any) {
    return <Orb {...props} />;
}
