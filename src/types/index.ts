export interface Project {
    id: number;
    title: string;
    description: string;
    technologies: string[];
    githubUrl?: string;
    liveUrl?: string;
    imageUrl?: string;
    category: 'Web' | 'Mobil' | 'Sistem' | 'Tümü';
    content?: string;
}

export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    date: string;
    readTime: string;
    category: 'Yazılım' | 'Kariyer' | 'Teknoloji' | 'Tümü';
    imageUrl?: string;
}