import { FaReact, FaPython, FaGitAlt, FaNodeJs, FaDocker } from "react-icons/fa";
import { SiNextdotjs, SiTailwindcss, SiTypescript, SiPostgresql, SiMongodb, SiFirebase } from "react-icons/si";

export interface Skill {
    name: string;
    icon: React.ReactNode;
    level: string;
    color: string;
}

export const skills: Skill[] = [
    {
        name: "Next.js",
        icon: <SiNextdotjs />,
        level: "İleri Seviye",
        color: "text-white"
    },
    {
        name: "React",
        icon: <FaReact />,
        level: "İleri Seviye",
        color: "text-blue-400"
    },
    {
        name: "TypeScript",
        icon: <SiTypescript />,
        level: "Orta Seviye",
        color: "text-blue-600"
    },
    {
        name: "Tailwind CSS",
        icon: <SiTailwindcss />,
        level: "İleri Seviye",
        color: "text-cyan-400"
    },
    {
        name: "Python",
        icon: <FaPython />,
        level: "Orta Seviye",
        color: "text-yellow-400"
    },
    {
        name: "PostgreSQL",
        icon: <SiPostgresql />,
        level: "Temel Seviye",
        color: "text-blue-300"
    },
    {
        name: "Git & GitHub",
        icon: <FaGitAlt />,
        level: "İleri Seviye",
        color: "text-red-500"
    },
    {
        name: "Firebase",
        icon: <SiFirebase />,
        level: "Orta Seviye",
        color: "text-orange-500"
    }
];