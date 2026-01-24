import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import ScrollToTop from "@/components/ScrollToTop";
import { Toaster } from 'react-hot-toast';
import AnalyticsListener from "@/components/AnalyticsListener";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: {
        default: "Metehan Erkan | Software Engineer",
        template: "%s | Metehan Erkan"
    },
    description: "Modern web teknolojileri, Next.js ve React ile ölçeklenebilir uygulamalar geliştiren Full Stack Yazılım Geliştirici.",
    keywords: ["Metehan Erkan", "Full Stack Developer", "Next.js", "React", "Web Tasarım", "Yazılım", "Metehan.dev", "Frontend", "Backend", "Fullstack", "Software Engineer", "Mobil yazılım geliştiricisi", "Ai developer", "Mobile", "Next.js", "React", "Web Tasarım", "Yazılım"],
    authors: [{ name: "Metehan Erkan" }],
    creator: "Metehan Erkan",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="tr">
            <body className={`${inter.className} bg-[#030014]`}>
                <Toaster position="top-center" toastOptions={{ duration: 3000, style: { background: '#333', color: '#fff' } }} />

                {children}

                <ScrollToTop />
                <AnalyticsListener />
                <Analytics />
            </body>
        </html>
    );
}
