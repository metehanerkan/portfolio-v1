import { db } from '@/lib/db';
import AdminClient from './AdminClient';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
    const projects = await db.project.findMany({
        orderBy: { createdAt: 'desc' }
    });

    const blogs = await db.blogPost.findMany({
        orderBy: { createdAt: 'desc' }
    });

    const messages = await db.contactMessage.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <AdminClient
            projects={projects}
            blogs={blogs}
            messages={messages}
        />
    );
}