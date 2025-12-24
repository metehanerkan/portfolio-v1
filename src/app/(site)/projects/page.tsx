import { db } from '@/lib/db';
import ProjectsClient from '@/app/(site)/projects/ProjectsClient';

// Sayfa her yenilendiğinde veritabanından güncel veri çeksin
export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
    // 1. Veritabanından projeleri çek (En yeniler en üstte)
    const projects = await db.project.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' }
    });


    // 2. Çekilen veriyi senin tasarımına (ProjectsClient) gönder
    return <ProjectsClient projects={projects} />;
}