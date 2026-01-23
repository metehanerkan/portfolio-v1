import { db } from '@/lib/db';
import ProjectsClient from './ProjectsClient';
import { Locale, getDictionary } from '@/dictionaries';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = getDictionary(lang);

    const projects = await db.project.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' }
    });

    return <ProjectsClient projects={projects} dict={dict.projects} />;
}