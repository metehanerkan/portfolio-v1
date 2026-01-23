import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const accessCode = cookieStore.get('client_access_code')?.value;

    // Cookie yoksa direkt login'e at
    if (!accessCode) {
        redirect('/portal/login');
    }

    const project = await db.clientProject.findUnique({
        where: { accessCode },
        include: {
            requests: {
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    // Proje bulunamazsa login'e at (veya cookie'yi temizlemek gerekir ama redirect yeterli)
    if (!project) {
        redirect('/portal/login');
    }

    // Tarih verilerini string'e çevir (Serialization)
    const serializedProject = {
        ...project,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
        startDate: project.startDate ? project.startDate.toISOString() : null,
        requests: project.requests.map((r) => ({
            ...r,
            createdAt: r.createdAt.toISOString()
        }))
    };

    // Sadece bileşeni döndür, kapsayıcı div koyma!
    return <DashboardClient project={serializedProject} />;
}