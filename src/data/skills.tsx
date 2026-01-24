import { FaReact, FaPython, FaGitAlt, FaNodeJs, FaDocker } from "react-icons/fa";
import { SiNextdotjs, SiTailwindcss, SiTypescript, SiPostgresql, SiMongodb, SiFirebase, SiAndroidstudio, SiKotlin, SiCss3, SiJavascript, SiHtml5 } from "react-icons/si";

export interface Skill {
    name: string;
    icon: React.ReactNode;
    level: string;
    color: string; // Artık buraya Hex kodu gelecek
}

export const skills: Skill[] = [
    {
        name: "Docker",
        icon: <FaDocker />,
        level: "Temel Seviye",
        color: "#3b82f6"
    },
    {
        name: "MongoDB",
        icon: <SiMongodb />,
        level: "Temel Seviye",
        color: "#4ade80"
    },
    {
        name: "Next.js",
        icon: <SiNextdotjs />,
        level: "Orta Seviye",
        color: "#ffffff"
    },
    {
        name: "React",
        icon: <FaReact />,
        level: "Orta Seviye",
        color: "#60a5fa"
    },
    {
        name: "TypeScript",
        icon: <SiTypescript />,
        level: "Orta Seviye",
        color: "#2563eb"
    },
    {
        name: "Tailwind CSS",
        icon: <SiTailwindcss />,
        level: "Orta Seviye",
        color: "#22d3ee"
    },
    {
        name: "Python",
        icon: <FaPython />,
        level: "Orta Seviye",
        color: "#facc15"
    },
    {
        name: "Git & GitHub",
        icon: <FaGitAlt />,
        level: "İleri Seviye",
        color: "#ea580c"
    },
    {
        name: "JavaScript",
        icon: <SiJavascript />,
        level: "Orta Seviye",
        color: "#f59e0b"
    },
    {
        name: "Node.js",
        icon: <FaNodeJs />,
        level: "Temel Seviye",
        color: "#16a34a"
    },
    {
        name: "HTML5",
        icon: <SiHtml5 />,
        level: "İleri Seviye",
        color: "#ee4213ff"
    },
    {
        name: "CSS3",
        icon: <SiCss3 />,
        level: "İleri Seviye",
        color: "#3b82f6"
    },
    {
        name: "Kotlin",
        icon: <SiKotlin />,
        level: "Orta Seviye",
        color: "#7f52ff"
    },
    {
        name: "Android Studio",
        icon: <SiAndroidstudio />,
        level: "Orta Seviye",
        color: "#3ddc84"
    },
];