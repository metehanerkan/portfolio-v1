import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaGithub, FaExternalLinkAlt, FaCode, FaImage } from 'react-icons/fa';

interface ProjectDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage(props: ProjectDetailPageProps) {
    const params = await props.params;
    const project = await db.project.findUnique({
        where: { id: params.id },
    });

    if (!project) {
        return notFound();
    }

    return (
        <main className="min-h-screen bg-black text-white py-24 px-6">
            <div className="max-w-4xl mx-auto">

                {/* Geri Dön Butonu */}
                <Link href="/projects" className="inline-flex items-center text-gray-400 hover:text-blue-400 mb-8 transition-colors">
                    <FaArrowLeft className="mr-2" /> Tüm Projelere Dön
                </Link>

                {/* Başlık ve Kategori */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm font-bold border border-blue-600/30">
                            {project.category}
                        </span>
                        {project.isFeatured && (
                            <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-bold border border-yellow-500/30">
                                ★ Öne Çıkan
                            </span>
                        )}
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                        {project.title}
                    </h1>
                </div>

                {/* RESİM ALANI - GÜVENLİK KONTROLÜ EKLENDİ */}
                <div className="w-full h-[300px] md:h-[500px] bg-gray-900 rounded-3xl overflow-hidden border border-gray-800 mb-12 shadow-2xl shadow-blue-900/10">
                    {project.imageUrl && project.imageUrl.length > 5 ? (
                        <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        /* Resim yoksa gösterilecek alan */
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-600">
                            <FaImage size={64} className="mb-4 opacity-30" />
                            <p>Bu proje için görsel bulunmuyor.</p>
                        </div>
                    )}
                </div>

                {/* İçerik ve Linkler */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                    {/* Sol: Açıklama */}
                    <div className="md:col-span-2 space-y-6">
                        <h3 className="text-2xl font-bold text-white">Proje Hakkında</h3>
                        <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-line">
                            {project.description}
                        </p>
                    </div>

                    {/* Sağ: Bilgiler ve Linkler */}
                    <div className="space-y-8">

                        {/* Teknolojiler */}
                        <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <FaCode className="text-blue-500" /> Teknolojiler
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {project.technologies.map((tech, i) => (
                                    <span key={i} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-lg text-sm border border-gray-700">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Linkler */}
                        <div className="space-y-3">
                            {project.liveUrl && (
                                <Link href={project.liveUrl} target="_blank" className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold transition shadow-lg shadow-blue-600/20">
                                    <FaExternalLinkAlt /> Canlı Demo
                                </Link>
                            )}
                            {project.githubUrl && (
                                <Link href={project.githubUrl} target="_blank" className="flex items-center justify-center gap-2 w-full bg-gray-800 hover:bg-gray-700 text-white py-4 rounded-xl font-bold transition border border-gray-700">
                                    <FaGithub /> Kaynak Kodları
                                </Link>
                            )}
                        </div>

                    </div>
                </div>

            </div>
        </main>
    );
}