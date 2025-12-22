import { projectsData } from '@/data/projects';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { FaGithub, FaExternalLinkAlt, FaArrowLeft } from 'react-icons/fa';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
    const { id } = await params;

    const project = projectsData.find((p) => p.id === Number(id));
    ""
    if (!project) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-black text-white pt-24 px-6 pb-20">
            <div className="max-w-4xl mx-auto">

                <Link href="/projects" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition gap-2">
                    <FaArrowLeft /> Tüm Projelere Dön
                </Link>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
                            {project.title}
                        </h1>
                        <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech) => (
                                <span key={tech} className="bg-gray-800 text-blue-300 px-3 py-1 rounded-full text-sm border border-gray-700">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        {project.githubUrl && (
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition border border-gray-700"
                            >
                                <FaGithub /> Kodları Gör
                            </a>
                        )}
                        {project.liveUrl && (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                            >
                                <FaExternalLinkAlt /> Canlı Demo
                            </a>
                        )}
                    </div>
                </div>

                <div className="w-full h-[400px] bg-gray-900 rounded-2xl border border-gray-800 mb-12 flex items-center justify-center relative overflow-hidden group">
                    <div className="text-gray-600 text-lg">
                        🖼️ {project.title} Görseli Buraya
                    </div>
                </div>

                <article className="prose prose-invert lg:prose-xl max-w-none">
                    {project.content ? (
                        <ReactMarkdown>{project.content}</ReactMarkdown>
                    ) : (
                        <p className="text-gray-500 italic">Bu proje için henüz detaylı açıklama eklenmedi.</p>
                    )}
                </article>

            </div>
        </main>
    );
}