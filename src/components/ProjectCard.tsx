import { Project } from "@/types";
import Link from 'next/link';
import { FaGithub, FaExternalLinkAlt, FaArrowRight } from 'react-icons/fa'; // İkonları import etmeyi unutma

interface ProjectCardProps {
    project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
    return (
        <div className="border border-gray-800 bg-gray-900 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 group flex flex-col h-full">

            {/* Üst Kısım: Resim ve İçerik (Link ile sararak başlığa tıklanabilir yaptık) */}
            <Link href={`/projects/${project.id}`} className="block flex-grow">
                <div className="h-40 bg-gray-800 rounded-lg mb-4 flex items-center justify-center text-gray-600 group-hover:bg-gray-750 transition overflow-hidden">
                    {/* Resim Alanı */}
                    <span className="text-sm">🖼️ {project.title}</span>
                </div>

                <h2 className="text-xl font-bold mb-2 text-white group-hover:text-blue-400 transition">
                    {project.title}
                </h2>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech) => (
                        <span key={tech} className="bg-blue-900/20 text-blue-300 text-xs px-2 py-1 rounded border border-blue-900/30">
                            {tech}
                        </span>
                    ))}
                </div>
            </Link>

            {/* Alt Kısım: Aksiyon Butonları (Footer) */}
            <div className="mt-auto pt-4 border-t border-gray-800 flex items-center justify-between">

                {/* SOL Taraf: Kaynak Kod & Demo */}
                <div className="flex gap-3">
                    {project.githubUrl && (
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white transition p-2 hover:bg-gray-800 rounded-full"
                            title="GitHub Kodları"
                        >
                            <FaGithub size={20} />
                        </a>
                    )}
                    {project.liveUrl && (
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-blue-400 transition p-2 hover:bg-gray-800 rounded-full"
                            title="Canlı Demo"
                        >
                            <FaExternalLinkAlt size={18} />
                        </a>
                    )}
                </div>

                {/* SAĞ Taraf: Detay Butonu */}
                <Link
                    href={`/projects/${project.id}`}
                    className="flex items-center gap-2 bg-white/5 hover:bg-blue-600 hover:text-white border border-gray-700 hover:border-blue-500 text-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group/btn"
                >
                    İncele
                    <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" size={12} />
                </Link>

            </div>
        </div>
    );
}