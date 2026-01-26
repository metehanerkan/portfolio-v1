'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Varsayılan Ayarlar (Seeding)
const DEFAULT_ABOUT = `Kod Yazmak Benim İçin Bir Tutku.

Merhaba! Ben **Metehan**. Teknolojiyle tanıştığım ilk günden beri, karmaşık problemleri basit ve estetik çözümlere dönüştürmeyi seviyorum.

Full Stack geliştirme yolculuğumda, sadece kod yazmayı değil, aynı zamanda ölçeklenebilir mimariler kurmayı ve kullanıcı deneyimini (UX) en üst düzeye çıkarmayı hedefliyorum. Sürekli öğrenme modundayım; bugün React ekosistemini keşfederken, yarın Yapay Zeka entegrasyonlarıyla uğraşıyorum.`;

const DEFAULT_SKILLS = JSON.stringify([
    { name: "Docker", icon: "FaDocker", level: "Temel Seviye", color: "#3b82f6" },
    { name: "MongoDB", icon: "SiMongodb", level: "Temel Seviye", color: "#4ade80" },
    { name: "Next.js", icon: "SiNextdotjs", level: "Orta Seviye", color: "#ffffff" },
    { name: "React", icon: "FaReact", level: "Orta Seviye", color: "#60a5fa" },
    { name: "TypeScript", icon: "SiTypescript", level: "Orta Seviye", color: "#2563eb" },
    { name: "Tailwind CSS", icon: "SiTailwindcss", level: "Orta Seviye", color: "#22d3ee" },
    { name: "Python", icon: "FaPython", level: "Orta Seviye", color: "#facc15" },
    { name: "Git & GitHub", icon: "FaGitAlt", level: "İleri Seviye", color: "#ea580c" },
    { name: "JavaScript", icon: "SiJavascript", level: "Orta Seviye", color: "#f59e0b" },
    { name: "Node.js", icon: "FaNodeJs", level: "Temel Seviye", color: "#16a34a" },
    { name: "HTML5", icon: "SiHtml5", level: "İleri Seviye", color: "#ee4213ff" },
    { name: "CSS3", icon: "SiCss3", level: "İleri Seviye", color: "#3b82f6" },
    { name: "Kotlin", icon: "SiKotlin", level: "Orta Seviye", color: "#7f52ff" },
    { name: "Android Studio", icon: "SiAndroidstudio", level: "Orta Seviye", color: "#3ddc84" }
]);

export async function getSettings() {
    let settings = await db.siteSettings.findFirst();

    // 1. Hiç kayıt yoksa oluştur (Seed)
    if (!settings) {
        settings = await db.siteSettings.create({
            data: {
                siteTitle: "Metehan Erkan Portfolio",
                siteDesc: "Modern web teknolojileri ile ölçeklenebilir, kullanıcı dostu ve estetik dijital çözümler üretiyorum.",
                aboutText: DEFAULT_ABOUT,
                primaryColor: "#3b82f6",
                contactEmail: "metehanerkan08@gmail.com",
                contactAddress: "Afyonkarahisar / Türkiye",
                socialGithub: "https://github.com/metehanerkan",
                socialLinkedin: "https://linkedin.com/in/metehan-erkan-b9a52a1b8/",
                skills: DEFAULT_SKILLS,
                maintenanceMode: false
            }
        });
    }
    // 2. Kayıt var ama yeni alanlar boşsa (Migration sonrası durum)
    else if (!settings.aboutText || !settings.skills || settings.aboutText.trim() === '') {
        settings = await db.siteSettings.update({
            where: { id: settings.id },
            data: {
                siteTitle: settings.siteTitle || "Metehan Erkan Portfolio",
                siteDesc: settings.siteDesc || "Modern web teknolojileri ile ölçeklenebilir, kullanıcı dostu ve estetik dijital çözümler üretiyorum.",
                aboutText: settings.aboutText || DEFAULT_ABOUT,
                primaryColor: settings.primaryColor || "#3b82f6",
                contactEmail: settings.contactEmail || "metehanerkan08@gmail.com",
                skills: settings.skills || DEFAULT_SKILLS,

                // Eksik kalan sosyal medya alanları
                socialGithub: settings.socialGithub || "https://github.com/metehanerkan",
                socialLinkedin: settings.socialLinkedin || "https://linkedin.com/in/metehan-erkan-b9a52a1b8/",
                socialTwitter: settings.socialTwitter || "",
                socialInstagram: settings.socialInstagram || "",

                contactPhone: settings.contactPhone || "",
                contactAddress: settings.contactAddress || "Afyonkarahisar / Türkiye",
                cvUrl: settings.cvUrl || "",

                // @ts-ignore: Prisma update lag
                aboutTitle: settings.aboutTitle || "Kod Yazmak Benim İçin Bir Tutku.",
                // @ts-ignore
                statProjects: settings.statProjects || "5+",
                // @ts-ignore
                statYears: settings.statYears || "1+",
                // @ts-ignore
                statLearnings: settings.statLearnings || "∞"
            }
        });
    }

    return settings;
}

// Public tarafı için hafifletilmiş ayar okuma (import karmaşasını önlemek için)
export async function getPublicSettings() {
    const settings = await db.siteSettings.findFirst();
    return settings || null;
}

// Genel Ayarları Güncelle (Tüm alanlar için)
export async function updateSettings(formData: FormData) {
    console.log("--- updateSettings SERVER ACTION BAŞLADI ---");
    const setting = await db.siteSettings.findFirst();
    const id = setting?.id;
    console.log("Mevcut Ayar ID:", id);

    const data: any = {
        siteTitle: formData.get('siteTitle') as string,
        siteDesc: formData.get('siteDesc') as string,
        aboutText: formData.get('aboutText') as string,

        // @ts-ignore
        aboutTitle: formData.get('aboutTitle') as string,
        // @ts-ignore
        statProjects: formData.get('statProjects') as string,
        // @ts-ignore
        statYears: formData.get('statYears') as string,
        // @ts-ignore
        statLearnings: formData.get('statLearnings') as string,

        primaryColor: formData.get('primaryColor') as string,
        contactEmail: formData.get('contactEmail') as string,
        contactPhone: formData.get('contactPhone') as string,
        contactAddress: formData.get('contactAddress') as string,
        socialGithub: formData.get('socialGithub') as string,
        socialLinkedin: formData.get('socialLinkedin') as string,
        socialTwitter: formData.get('socialTwitter') as string,
        socialInstagram: formData.get('socialInstagram') as string,
        skills: formData.get('skills') as string, // JSON string olarak gelecek
    };

    // Maintenance Mode kontrolü (String "true"/"false" gelebilir)
    const maintenanceModeRaw = formData.get('maintenanceMode');
    if (maintenanceModeRaw !== null) {
        data.maintenanceMode = maintenanceModeRaw === 'true';
    }

    console.log("Güncellenecek Veri Paketi:", data);

    try {
        if (id) {
            await db.siteSettings.update({ where: { id }, data });
            console.log("UPDATE BAŞARILI");
        } else {
            await db.siteSettings.create({ data });
            console.log("CREATE BAŞARILI");
        }
    } catch (e) {
        console.error("VERİTABANI HATASI:", e);
        throw e;
    }

    console.log("REVALIDATE EDİLİYOR...");
    revalidatePath('/');
    return { success: true };
}

// CV Yükleme İşlemi (Base64 olarak alıp dosyaya yazacağız veya direkt public'e)
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function uploadCV(formData: FormData) {
    const file = formData.get('file') as File;
    if (!file) return { success: false, error: 'Dosya seçilmedi' };

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Dosyayı public klasörüne kaydet
    const path = join(process.cwd(), 'public', 'cv.pdf');
    await writeFile(path, buffer);

    // Veritabanında CV URL'ini güncelle
    const setting = await db.siteSettings.findFirst();
    if (setting) {
        await db.siteSettings.update({
            where: { id: setting.id },
            data: { cvUrl: '/cv.pdf' }
        });
    } else {
        await db.siteSettings.create({
            data: { cvUrl: '/cv.pdf' }
        });
    }

    revalidatePath('/');
    return { success: true, url: '/cv.pdf' };
}

// Bakım Modunu Değiştir (Eski fonksiyonu koruyoruz ama updateSettings içinde de yönetilebilir)
export async function toggleMaintenance(currentState: boolean) {
    const setting = await db.siteSettings.findFirst();
    if (setting) {
        await db.siteSettings.update({ where: { id: setting.id }, data: { maintenanceMode: !currentState } });
    } else {
        await db.siteSettings.create({ data: { maintenanceMode: true } });
    }
    revalidatePath('/');
    return { success: true };
}