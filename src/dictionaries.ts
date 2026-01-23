

export const dictionaries = {
    tr: {
        common: {
            viewProjects: "Projelerimi Gör",
            contactMe: "İletişime Geç",
            loading: "Yükleniyor...",
            error: "Bir hata oluştu."
        },
        hero: {
            // Deprecated: Use home.title/desc instead
            title: "Dijital Dünyada ✨ İz Bırakan Çözümler",
            description: "Modern web teknolojileri, Next.js ve React ile ölçeklenebilir uygulamalar geliştiren Full Stack Yazılım Geliştirici.",
            cta: "Projelerimi İncele",
            contact: "İletişime Geç"
        },
        home: {
            hello: "Merhaba,",
            iam: "Ben Metehan.",
            desc: "Modern web teknolojileri ile ölçeklenebilir, kullanıcı dostu ve estetik dijital çözümler üretiyorum.",
            typewriter: [
                'Full Stack Geliştiriciyim.',
                'React & Next.js Uzmanıyım.',
                'Modern Web Çözümleri.',
                'Sorun Çözücüyüm.'
            ],
            latestProjects: "Son Projelerim",
            noProjects: "Henüz proje eklenmedi.",
            latestBlogs: "Blogdan Son Yazılar",
            noBlogs: "Henüz yazı yayınlanmadı."
        },
        nav: {
            home: "Ana Sayfa",
            about: "Hakkımda",
            projects: "Projeler",
            blog: "Blog",
            contact: "İletişim",
            portal: "Müşteri Portalı"
        },
        about: {
            title: "Hakkımda",
            desc: "Teknoloji tutkunu ve sürekli öğrenen bir geliştirici."
        },

        contact: {
            title: "Bir Merhaba De.",
            desc: "Proje fikirlerin, iş tekliflerin veya sadece tanışmak için bana yazabilirsin. En kısa zamanda geri dönüş yapacağım!",
            emailLabel: "E-posta",
            locationLabel: "Konum",
            locationValue: "Afyonkarahisar / Türkiye",
            socialLabel: "Sosyal Medya",
            formTitle: "Bana Ulaşın",
            nameLabel: "Adın Soyadın",
            namePlaceholder: "Örn: Metehan Erkan",
            emailInputLabel: "E-posta Adresin",
            emailPlaceholder: "ornek@email.com",
            messageLabel: "Mesajın",
            messagePlaceholder: "Mesajınızı yazın...",
            sendLoading: "Gönderiliyor...",
            sendButton: "Gönder",
            successTitle: "Mesajın İletildi! 🚀",
            successDesc: "En kısa sürede sana geri dönüş yapacağım.",
            newMessageBtn: "Yeni mesaj gönder"
        },
        projects: {
            title: "Tüm Projelerim",
            desc: "Geliştirdiğim web ve mobil uygulamalar.",
            card: {
                noImage: "Görsel Yok",
                code: "Kodlar",
                private: "Gizli",
                demo: "Demo",
                review: "İncele"
            }
        },
        blog: {
            title: "Blog Yazıları",
            desc: "Teknoloji ve yazılım üzerine notlar.",
            card: {
                noImage: "Görsel Yok",
                readMore: "Devamını Oku",
                readTime: "okuma"
            }
        },
        footer: {
            brandDesc: "Modern web teknolojileri ile kullanıcı dostu, hızlı ve estetik dijital deneyimler tasarlıyorum.",
            quickLinks: "Hızlı Linkler",
            contact: "İletişim",
            rights: "Tüm hakları saklıdır."
        }
    },
    en: {
        common: {
            viewProjects: "View Projects",
            contactMe: "Contact Me",
            loading: "Loading...",
            error: "An error occurred."
        },
        hero: {
            title: "Solutions That Leave a Mark ✨ in the Digital World",
            description: "Full Stack Software Developer building scalable applications with modern web technologies, Next.js, and React.",
            cta: "View Projects",
            contact: "Contact Me"
        },
        home: {
            hello: "Hello,",
            iam: "I am Metehan.",
            desc: "I build scalable, user-friendly, and aesthetic digital solutions using modern web technologies.",
            typewriter: [
                'a Full Stack Developer.',
                'a React & Next.js Enthusiast.',
                'building modern web apps.',
                'a Problem Solver.'
            ],
            latestProjects: "Latest Projects",
            noProjects: "No projects added yet.",
            latestBlogs: "Latest Blog Posts",
            noBlogs: "No posts published yet."
        },
        nav: {
            home: "Home",
            about: "About",
            projects: "Projects",
            blog: "Blog",
            contact: "Contact",
            portal: "Client Portal"
        },
        about: {
            title: "About Me",
            desc: "A developer passionate about technology and continuous learning."
        },
        contact: {
            title: "Say Hello.",
            desc: "Feel free to write to me for project ideas, job offers, or just to meet. I'll get back to you as soon as possible!",
            emailLabel: "Email",
            locationLabel: "Location",
            locationValue: "Afyonkarahisar / Turkey",
            socialLabel: "Social Media",
            formTitle: "Get in Touch",
            nameLabel: "Full Name",
            namePlaceholder: "Ex: John Doe",
            emailInputLabel: "Email Address",
            emailPlaceholder: "example@email.com",
            messageLabel: "Your Message",
            messagePlaceholder: "Write your message...",
            sendLoading: "Sending...",
            sendButton: "Send",
            successTitle: "Message Sent! 🚀",
            successDesc: "I'll get back to you shortly.",
            newMessageBtn: "Send new message"
        },
        projects: {
            title: "All Projects",
            desc: "Web and mobile applications I've developed.",
            card: {
                noImage: "No Image",
                code: "Code",
                private: "Private",
                demo: "Demo",
                review: "Review"
            }
        },
        blog: {
            title: "Blog Posts",
            desc: "Notes on technology and software.",
            card: {
                noImage: "No Image",
                readMore: "Read More",
                readTime: "read"
            }
        },
        footer: {
            brandDesc: "I design user-friendly, fast, and aesthetic digital experiences with modern web technologies.",
            quickLinks: "Quick Links",
            contact: "Contact",
            rights: "All rights reserved."
        }
    }
}

export type Locale = keyof typeof dictionaries;
export type Dictionary = typeof dictionaries['tr'];
export const getDictionary = (locale: Locale) => dictionaries[locale];

