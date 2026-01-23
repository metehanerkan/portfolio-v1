import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { db } from "@/lib/db";
import MaintenancePage from "../maintenance/page";
import { headers } from "next/headers";
import { Locale } from "@/dictionaries";

// const inter = Inter({ subsets: ["latin"] }); // Moved to RootLayout

export const metadata: Metadata = {
    title: {
        default: "Metehan Erkan | Full Stack Developer",
        template: "%s | Metehan Erkan"
    },
    description: "Modern web teknolojileri, Next.js ve React ile ölçeklenebilir uygulamalar geliştiren Full Stack Yazılım Geliştirici.",
    keywords: ["Metehan Erkan", "Full Stack Developer", "Next.js", "React", "Web Tasarım", "Yazılım"],
    authors: [{ name: "Metehan Erkan" }],
    creator: "Metehan Erkan",
    openGraph: {
        type: "website",
        locale: "tr_TR",
        url: "https://metehanerkan.vercel.app",
        title: "Metehan Erkan | Full Stack Developer",
        description: "Projelerimi ve blog yazılarımı inceleyin.",
        siteName: "Metehan Erkan Portfolyo"
    },
};

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
