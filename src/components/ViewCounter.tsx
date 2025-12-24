'use client';

import { useEffect, useRef } from 'react';
import { incrementView } from '@//actions/view';

interface ViewCounterProps {
    id: string;
    type: 'project' | 'blog';
}

export default function ViewCounter({ id, type }: ViewCounterProps) {
    // useEffect'in iki kere çalışmasını önlemek için ref kullanıyoruz (React 18 Strict Mode için)
    const hasViewed = useRef(false);

    useEffect(() => {
        if (!hasViewed.current) {
            incrementView(id, type);
            hasViewed.current = true;
        }
    }, [id, type]);

    return null; // Bu bileşen ekranda görünmez, sadece iş yapar.
}