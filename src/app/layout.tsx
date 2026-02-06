import Script from "next/script";

import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import ScrollToTop from "@/components/ScrollToTop";
import { Toaster } from 'react-hot-toast';
import AnalyticsListener from "@/components/AnalyticsListener";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Metehan Erkan | Software Engineer",
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
        <html lang="tr" suppressHydrationWarning>
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
            <body className={`${inter.className} antialiased`}>
                <Script id="json-ld" type="application/ld+json" dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@graph": [
                            {
                                "@type": "Person",
                                "name": "Metehan Erkan",
                                "url": "https://metehanerkan.vercel.app",
                                "jobTitle": "Software Engineer",
                                "sameAs": [
                                    "https://github.com/metehanerkan",
                                    "https://www.linkedin.com/in/metehan-erkan-b9a52a1b8/"
                                ]
                            },
                            {
                                "@type": "WebSite",
                                "name": "Metehan Erkan Portfolio",
                                "url": "https://metehanerkan.vercel.app",
                                "description": "Modern web teknolojileri, Next.js ve React ile ölçeklenebilir uygulamalar geliştiren Full Stack Yazılım Geliştirici."
                            }
                        ]
                    })
                }} />
                {/* Google Tag Manager (noscript) - BODY */}
                <noscript>
                    <iframe
                        src="https://www.googletagmanager.com/ns.html?id=GTM-T28PX6KH"
                        height="0"
                        width="0"
                        style={{ display: 'none', visibility: 'hidden' }}
                    ></iframe>
                </noscript>

                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Toaster position="top-center" toastOptions={{ duration: 3000, style: { background: '#333', color: '#fff' } }} />

                    {children}

                    <ScrollToTop />
                    <AnalyticsListener />
                    <Analytics />
                </ThemeProvider>
            </body>
        </html>
    );
}
