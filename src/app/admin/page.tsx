import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import AdminClient from './AdminClient';

// Admin Page Component
export default async function AdminPage() {
    // 1. Güvenlik Kontrolü (Cookie)
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get('admin_session')?.value === 'true';

    if (!isAdmin) {
        redirect('/login');
    }

    // 2. Verileri Çek (Her kategori için ayrı ayrı)

    // A) MÜŞTERİ PROJELERİ (SaaS / Aktif İşler) -> ClientProject tablosu
    // 👇 GÜNCELLEME BURADA YAPILDI: Talepleri (requests) de çekiyoruz!
    const clientProjects = await db.clientProject.findMany({
        orderBy: { updatedAt: 'desc' }, // En son işlem gören en üstte
        include: {
            requests: {
                orderBy: { createdAt: 'desc' } // En yeni talep en üstte
            }
        }
    });

    // B) PORTFOLIO PROJELERİ (Vitrin) -> Project tablosu
    const portfolioProjects = await db.project.findMany({
        orderBy: { createdAt: 'desc' }
    });

    // C) BLOG YAZILARI -> BlogPost tablosu
    const blogs = await db.blogPost.findMany({
        orderBy: { createdAt: 'desc' }
    });

    // D) MESAJLAR -> ContactMessage tablosu
    const messages = await db.contactMessage.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <AdminClient
            clientProjects={clientProjects}
            projects={portfolioProjects}
            blogs={blogs}
            messages={messages}
        />
    );
}