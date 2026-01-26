import Script from "next/script";

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
    verification: {
        google: 'VWwNSKlKII-K8Th13GFr3iSG3-MYCztQDUEor4sXOdM'
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="tr">
            <head>
                {/* Google Tag Manager - HEAD */}
                <Script id="google-tag-manager" strategy="afterInteractive">
                    {`
                    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','GTM-T28PX6KH');
                    `}
                </Script>
            </head>
            <body className={`${inter.className} bg-[#030014]`}>
                {/* Google Tag Manager (noscript) - BODY */}
                <noscript>
                    <iframe
                        src="https://www.googletagmanager.com/ns.html?id=GTM-T28PX6KH"
                        height="0"
                        width="0"
                        style={{ display: 'none', visibility: 'hidden' }}
                    ></iframe>
                </noscript>

                <Toaster position="top-center" toastOptions={{ duration: 3000, style: { background: '#333', color: '#fff' } }} />

                {children}

                <ScrollToTop />
                <AnalyticsListener />
                <Analytics />
            </body>
        </html>
    );
}
