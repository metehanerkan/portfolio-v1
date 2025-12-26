import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import DashboardClient from './DashboardClient'; // 👈 YENİ: Tüm UI buraya taşındı

export default async function DashboardPage() {
    const cookieStore = await cookies();
    const accessCode = cookieStore.get('client_access_code')?.value;

    if (!accessCode) {
        redirect('/portal/login');
    }

    // Projeyi ve Talepleri Çek
    const project = await db.clientProject.findUnique({
        where: { accessCode },
        include: {
            requests: {
                orderBy: { createdAt: 'desc' } // En yeni talep en üstte
            }
        }
    });

    if (!project) {
        redirect('/portal/login');
    }

    // Tarih verilerini string'e çevir (Client Component'e aktarmak için şart)
    const serializedProject = {
        ...project,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
        startDate: project.startDate ? project.startDate.toISOString() : null,
        // Taleplerin tarihlerini de çevir
        requests: project.requests.map((r) => ({
            ...r,
            createdAt: r.createdAt.toISOString()
        }))
    };

    // Tüm yükü Client Component'e veriyoruz
    return <DashboardClient project={serializedProject} />;
}