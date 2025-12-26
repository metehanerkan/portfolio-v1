import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ProjectRequestBtn from "@/components/ProjectRequestBtn";

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
    url: "https://metehanerkan.vercel.app", // BURAYA KENDİ SİTE LİNKİNİ YAZARSAN İYİ OLUR
    title: "Metehan Erkan | Full Stack Developer",
    description: "Projelerimi ve blog yazılarımı inceleyin.",
    siteName: "Metehan Erkan Portfolyo",
    // images: [
    //   {
    //     url: "/og-image.jpg", // public klasörüne bir kapak resmi atarsan WhatsApp'ta o çıkar
    //     width: 1200,
    //     height: 630,
    //     alt: "Metehan Erkan Portfolyo",
    //   },
    // ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={inter.className}>



        <div className="pt-16 min-h-screen flex flex-col">
          {children}
        </div>


        <ScrollToTop />
        <Analytics />
      </body>
    </html>
  );
}