'use server'

import { db } from '@/lib/db';

export async function fetchProjects() {
    // Tüm portfolio projelerini çek
    const projects = await db.project.findMany({
        orderBy: { createdAt: 'desc' },
        where: { isPublished: true } // İsteğe bağlı: Sadece yayında olanları çekebiliriz
    });
    return projects;
}