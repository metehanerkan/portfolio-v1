import { db } from '@/lib/db';
import ProjectsClient from './ProjectsClient';
import { Locale, getDictionary } from '@/dictionaries';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = getDictionary(lang);

    const rawProjects = await db.project.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' }
    });

    // Serialize plain objects for Client Component
    const projects = rawProjects.map(project => ({
        ...project,
        createdAt: project.createdAt.toISOString(),
        updatedAt: project.updatedAt.toISOString(),
        // Add other date fields if necessary, or just use JSON.parse(JSON.stringify(project)) for a quick fix
    }));

    return (
        <main className="min-h-screen w-full relative bg-background transition-colors duration-300">
            {/* --- SABİT ARKA PLAN KATMANI --- */}
            {/* --- SABİT ARKA PLAN KATMANI --- */}

            <div className="fixed inset-0 w-full h-full z-0 pointer-events-none block dark:hidden bg-gradient-to-b from-purple-50/50 to-white"></div>

            <div className="relative z-10 w-full">
                <ProjectsClient projects={projects} dict={dict.projects} />
            </div>
        </main>
    );
}