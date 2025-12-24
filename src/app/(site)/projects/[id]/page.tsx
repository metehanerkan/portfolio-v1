import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown'; // Mevcut importların kalsın

// Bu ayarlar sayfayı her girişte yeniden oluşturur (Cache kapatır)
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
    params: Promise<{ id: string }>; // Next.js 15+ uyumlu
    // Eğer Next.js 14 ve altıysa: params: { id: string };
}

export default async function ProjectDetailPage({ params }: PageProps) {
    // Hem eski hem yeni versiyonu garantiye almak için params'ı çözümlüyoruz
    const { id } = await params;

    // 1. ÖNCE VERİYİ ÇEK (Hata vermeden)
    const project = await db.project.findUnique({
        where: { id: id },
    });

    // --- DEBUG MODU (Bunu canlıda ekranda göreceksin) ---
    if (!project) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-10 text-center">
                <h1 className="text-4xl text-red-500 font-bold mb-4">HATA: Proje Bulunamadı</h1>
                <div className="bg-gray-900 p-6 rounded-xl text-left font-mono text-sm border border-gray-800">
                    <p className="text-yellow-400">Aranan ID: <span className="text-white">{id}</span></p>
                    <p className="text-blue-400 mt-2">Veritabanı Durumu:</p>
                    <p>Bağlantı başarılı ama bu ID'ye ait kayıt yok.</p>
                    <p className="text-gray-500 mt-4">Lütfen Admin paneline gidip ID'leri kontrol edin.</p>
                </div>
            </div>
        );
    }
    // ----------------------------------------------------

    // 2. SAYAÇ ARTIRMA (Hata olsa da sayfayı bozmaz)
    try {
        await db.project.update({
            where: { id: id },
            data: { viewCount: { increment: 1 } }
        });
    } catch (e) {
        console.log("Sayaç artırılamadı, önemli değil.");
    }

    // BURADAN SONRASI SENİN NORMAL TASARIM KODLARIN...
    // return ( <main> ... </main> )
    // (Mevcut return kodunu buraya yapıştır)

    // Geçici olarak basit return (Kendi tasarımınla değiştirmeyi unutma):
    return (
        <div className="min-h-screen bg-black text-white p-20">
            <h1 className="text-4xl font-bold">{project.title}</h1>
            <p>{project.description}</p>
        </div>
    );
}