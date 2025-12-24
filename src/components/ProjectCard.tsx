import Link from 'next/link';
import { FaGithub, FaExternalLinkAlt, FaCode, FaImage, FaEye } from 'react-icons/fa';

interface ProjectCardProps {
    project: {
        id: string;
        title: string;
        description: string;
        imageUrl?: string | null;
        category: string;
        technologies: string[];
        githubUrl?: string | null;
        liveUrl?: string | null;
    };
}

export default function ProjectCard({ project }: ProjectCardProps) {
    return (
        <div className="relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 group h-full flex flex-col">


            <Link
                href={`/projects/${project.id}`}
                className="absolute inset-0 z-0"
                aria-label={project.title}
            />

            <div className="relative h-48 overflow-hidden bg-gray-800">
                {project.imageUrl && project.imageUrl.length > 5 ? (
                    <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-600">
                        <FaImage size={32} className="mb-2 opacity-50" />
                        <span className="text-xs">Görsel Yok</span>
                    </div>
                )}

                <div className="absolute top-4 left-4">
                    <span className="bg-blue-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        {project.category}
                    </span>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {project.title}
                </h3>

                <p className="text-gray-400 text-sm line-clamp-3 mb-4 flex-grow">
                    {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.slice(0, 3).map((tech, index) => (
                        <span key={index} className="flex items-center gap-1 text-[10px] bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-700">
                            <FaCode size={10} /> {tech}
                        </span>
                    ))}
                    {project.technologies.length > 3 && (
                        <span className="text-[10px] text-gray-500 py-1">+{project.technologies.length - 3}</span>
                    )}
                </div>

                <div className="relative z-10 flex gap-3 mt-auto pt-4 border-t border-gray-800">
                    {project.githubUrl && (
                        <Link href={project.githubUrl} target="_blank" className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-sm transition hover:scale-105 active:scale-95">
                            <FaGithub /> Kodlar
                        </Link>
                    )}

                    {project.liveUrl && (
                        <Link href={project.liveUrl} target="_blank" className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm transition hover:scale-105 active:scale-95">
                            <FaExternalLinkAlt /> Demo
                        </Link>
                    )}

                    {!project.liveUrl && !project.githubUrl && (
                        <span className="flex-1 flex items-center justify-center gap-2 bg-gray-800 text-gray-400 py-2 rounded-lg text-sm cursor-pointer group-hover:bg-gray-700 group-hover:text-white transition">
                            <FaEye /> İncele
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}