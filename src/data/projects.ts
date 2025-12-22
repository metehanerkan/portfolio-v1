import { Project } from "@/types";
export const projectsData: Project[] = [
    {
        id: 1,
        title: "Kişisel Portfolyo Sitesi",
        description: "Next.js ve Tailwind CSS kullanarak geliştirdiğim, SEO uyumlu kişisel web sitem.",
        technologies: ["Next.js", "React", "Tailwind CSS", "TypeScript"],
        githubUrl: "https://github.com/kullaniciadi/portfolio",
        category: 'Web',
        content: `
Bu proje, modern web teknolojilerini kullanarak kendimi tanıtmak amacıyla geliştirildi.

## 🎯 Projenin Amacı
Geleneksel CV'ler yerine, yeteneklerimi interaktif ve görsel bir şekilde sunmak istedim. Ayrıca Next.js 15'in yeni özelliklerini (App Router, Server Actions) deneyimlemek için bir fırsat oldu.

## 🛠️ Kullanılan Teknolojiler
- **Next.js 14:** SEO ve performans için.
- **Tailwind CSS:** Hızlı stil geliştirme ve responsive tasarım için.
- **TypeScript:** Tip güvenliği ve hatasız kod için.
- **Framer Motion:** Sayfa geçiş animasyonları için.

## 💡 Karşılaşılan Zorluklar
Proje sırasında en büyük zorluk, **Markdown** dosyalarını dinamik olarak render etmek ve Next.js 15'in *async params* yapısına uyum sağlamaktı. Bu sorunu \`react-markdown\` kütüphanesi ve doğru asenkron yapı ile çözdüm.

## 🚀 Sonuç
Şu an incelediğiniz bu site ortaya çıktı! Tamamen mobil uyumlu, karanlık moda sahip ve yüksek performanslı.
    `
    },
    {
        id: 2,
        title: "E-Ticaret API",
        description: ".NET Core ile yazılmış, katmanlı mimariye sahip RESTful API.",
        technologies: [".NET 8", "PostgreSQL", "Entity Framework"],
        githubUrl: "https://github.com/kullaniciadi/api",
        liveUrl: "https://api.ornek.com",
        category: 'Sistem',
    },
    {
        id: 3,
        title: "Fitness Takip Uygulaması",
        description: "React Native ile geliştirilen, kalori ve antrenman takibi yapan mobil uygulama.",
        technologies: ["React Native", "Firebase", "Redux"],
        githubUrl: "https://github.com/kullaniciadi/fitness-app",
        imageUrl: "/images/project3.jpg",
        category: "Mobil"
    }
]