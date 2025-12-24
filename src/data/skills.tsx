import { FaReact, FaPython, FaGitAlt, FaNodeJs, FaDocker } from "react-icons/fa";
import { SiNextdotjs, SiTailwindcss, SiTypescript, SiPostgresql, SiMongodb, SiFirebase } from "react-icons/si";

export interface Skill {
    name: string;
    icon: React.ReactNode;
    level: string;
    color: string; // Artık buraya Hex kodu gelecek
}

export const skills: Skill[] = [
    {
        name: "Node.js",
        icon: <FaNodeJs />,
        level: "Temel Seviye",
        color: "#16a34a" // text-green-600
    },
    {
        name: "Docker",
        icon: <FaDocker />,
        level: "Temel Seviye",
        color: "#3b82f6" // text-blue-500
    },
    {
        name: "MongoDB",
        icon: <SiMongodb />,
        level: "Orta Seviye",
        color: "#4ade80" // text-green-400
    },
    {
        name: "Next.js",
        icon: <SiNextdotjs />,
        level: "İleri Seviye",
        color: "#ffffff" // text-white
    },
    {
        name: "React",
        icon: <FaReact />,
        level: "İleri Seviye",
        color: "#60a5fa" // text-blue-400
    },
    {
        name: "TypeScript",
        icon: <SiTypescript />,
        level: "Orta Seviye",
        color: "#2563eb" // text-blue-600
    },
    {
        name: "Tailwind CSS",
        icon: <SiTailwindcss />,
        level: "İleri Seviye",
        color: "#22d3ee" // text-cyan-400
    },
    {
        name: "Python",
        icon: <FaPython />,
        level: "Orta Seviye",
        color: "#facc15" // text-yellow-400
    },
    {
        name: "PostgreSQL",
        icon: <SiPostgresql />,
        level: "Temel Seviye",
        color: "#93c5fd" // text-blue-300
    },
    {
        name: "Git & GitHub",
        icon: <FaGitAlt />,
        level: "İleri Seviye",
        color: "#ea580c" // text-orange-600
    },
    {
        name: "Firebase",
        icon: <SiFirebase />,
        level: "Orta Seviye",
        color: "#eab308" // text-yellow-500
    }
];