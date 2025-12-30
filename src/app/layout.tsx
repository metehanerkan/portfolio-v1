import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import ScrollToTop from "@/components/ScrollToTop";
import { Toaster } from 'react-hot-toast';
import { db } from "@/lib/db";
import MaintenancePage from "./maintenance/page";
import { headers } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

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
}: Readonly<{
  children: React.ReactNode;
}>) {

  // 1. AYARLARI ÇEK
  const settings = await db.siteSettings.findFirst();
  const isMaintenance = settings?.maintenanceMode || false;

  // 2. URL KONTROLÜ (Admin panelini engellememek için)
  // ✨ DÜZELTME: headers() fonksiyonu 'await' ile beklendi.
  const headersList = await headers();

  const headerUrl = headersList.get('x-url') || headersList.get('x-invoke-path') || "";
  const isAdminPage = headerUrl.includes('/admin');

  // 3. BAKIM MODU KONTROLÜ
  if (isMaintenance && !isAdminPage) {
    return (
      <html lang="tr">
        <body className={`${inter.className} bg-[#030014]`}>
          <MaintenancePage />
        </body>
      </html>
    );
  }

  // 4. NORMAL SİTE AKIŞI
  return (
    <html lang="tr">
      <body className={inter.className}>
        <Toaster position="top-center" toastOptions={{ duration: 3000, style: { background: '#333', color: '#fff' } }} />

        <div className="pt-16 min-h-screen flex flex-col">
          {children}
        </div>

        <ScrollToTop />
        <Analytics />
      </body>
    </html>
  );
}