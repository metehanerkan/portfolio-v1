import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { db } from "@/lib/db";
import MaintenancePage from "../maintenance/page";
import { headers } from "next/headers";
import { Locale } from "@/dictionaries";

// const inter = Inter({ subsets: ["latin"] }); // Moved to RootLayout

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
    const { lang } = await params;
    const baseUrl = 'https://metehanerkan.vercel.app';

    const settings = await db.siteSettings.findFirst();
    const siteTitle = settings?.siteTitle || "Metehan Erkan | Software Engineer";
    const siteDesc = settings?.siteDesc || (lang === 'tr'
        ? "Modern web teknolojileri, Next.js ve React ile ölçeklenebilir uygulamalar geliştiren Full Stack Yazılım Geliştirici."
        : "Full Stack Software Developer building scalable applications with modern web technologies, Next.js, and React.");

    return {
        title: {
            default: siteTitle,
            template: `%s | ${siteTitle}`
        },
        description: siteDesc,
        keywords: ["Metehan Erkan", "Full Stack Developer", "Next.js", "React", "Web Tasarım", "Yazılım", "Metehan.dev", "Frontend", "Backend", "Fullstack", "Software Engineer", "Mobil yazılım geliştiricisi", "Ai developer", "Mobile"],
        authors: [{ name: "Metehan Erkan" }],
        creator: "Metehan Erkan",
        openGraph: {
            type: "website",
            locale: lang === 'tr' ? 'tr_TR' : 'en_US',
            url: `${baseUrl}/${lang}`,
            title: siteTitle,
            description: siteDesc,
            siteName: siteTitle
        },
        alternates: {
            canonical: `${baseUrl}/${lang}`,
            languages: {
                'tr': `${baseUrl}/tr`,
                'en': `${baseUrl}/en`,
            },
        },
    };
}

export default async function RootLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ lang: Locale }>;
}) {
    const { lang } = await params;

    // 1. AYARLARI ÇEK
    const settings = await db.siteSettings.findFirst();
    const isMaintenance = settings?.maintenanceMode || false;

    // 2. BAKIM MODU KONTROLÜ
    // Admin kontrolü burada gerekmez çünkü AdminLayout ayrı.
    // Sadece bakım modu varsa göster.
    if (isMaintenance) {
        return (
            <MaintenancePage />
        );
    }

    // 3. NORMAL SİTE AKIŞI
    return (
        <div className="pt-16 min-h-screen flex flex-col">
            {children}
        </div>
    );
}
