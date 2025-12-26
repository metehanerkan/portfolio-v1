'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { Resend } from 'resend';
import { randomBytes } from 'crypto';

// Müşteriye Fiyat ve Süre Teklifi Gönder
export async function sendProposal(formData: FormData) {
    const id = formData.get('id') as string;
    const price = formData.get('price') as string;
    const adminDeadline = formData.get('adminDeadline') as string; // Senin belirlediğin tarih
    const adminNotes = formData.get('adminNotes') as string; // Varsa ek notun

    try {
        // 1. Projeyi Güncelle (Statü: Fiyat Gönderildi)
        const project = await db.clientProject.update({
            where: { id },
            data: {
                budget: price, // 'budget' alanını artık kesin fiyat olarak kullanabiliriz veya ayrı 'finalPrice' açabiliriz. Şimdilik budget'ı güncelleyelim.
                deadline: adminDeadline,
                adminNotes: adminNotes,
                status: 'PRICING_SENT' // Yeni Statü: Teklif Gönderildi
            }
        });

        // 2. Müşteriye Mail At
        if (process.env.RESEND_API_KEY) {
            await resend.emails.send({
                from: 'Metehan Erkan <onboarding@resend.dev>',
                to: project.email,
                subject: '🔔 Projeniz İçin Fiyat Teklifi Hazır!',
                html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #2563eb;">Teklifiniz Hazır! 💼</h2>
            <p>Merhaba <strong>${project.name}</strong>,</p>
            <p>Gönderdiğiniz detayları inceledim ve projeniz için bir yol haritası çıkardım.</p>
            
            <p>Fiyat ve teslim tarihi teklifimi görmek, onaylamak veya revize istemek için lütfen panele giriş yapın.</p>
            
            <br/>
            <a href="https://portfolio-v1-eta-taupe.vercel.app/portal" style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Teklifi İncele</a>
          </div>
        `
            });
        }

        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Teklif gönderilemedi.' };
    }
}

const resend = new Resend(process.env.RESEND_API_KEY);

// --- YARDIMCI FONKSİYONLAR ---

// Rastgele 6 haneli kod üretici (Örn: A7B-9X2)
function generateAccessCode() {
    return randomBytes(3).toString('hex').toUpperCase().match(/.{1,3}/g)?.join('-') || 'CODE';
}

// --- PROJE İŞLEMLERİ (PORTFOLIO) ---

export async function addProject(formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const category = formData.get('category') as string;
    const technologies = (formData.get('technologies') as string).split(',').map(t => t.trim());
    const githubUrl = formData.get('githubUrl') as string;
    const liveUrl = formData.get('liveUrl') as string;

    await db.project.create({
        data: { title, description, imageUrl, category, technologies, githubUrl, liveUrl },
    });
    revalidatePath('/admin');
    revalidatePath('/projects');
}

export async function updateProject(formData: FormData) {
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const category = formData.get('category') as string;
    const technologies = (formData.get('technologies') as string).split(',').map(t => t.trim());
    const githubUrl = formData.get('githubUrl') as string;
    const liveUrl = formData.get('liveUrl') as string;

    await db.project.update({
        where: { id },
        data: { title, description, imageUrl, category, technologies, githubUrl, liveUrl },
    });
    revalidatePath('/admin');
    revalidatePath('/projects');
}

export async function deleteProject(formData: FormData) {
    const id = formData.get('id') as string;
    await db.project.delete({ where: { id } });
    revalidatePath('/admin');
    revalidatePath('/projects');
}

export async function toggleProjectStatus(id: string, currentStatus: boolean) {
    await db.project.update({ where: { id }, data: { isPublished: !currentStatus } });
    revalidatePath('/admin');
}

export async function toggleProjectFeatured(id: string, currentFeatured: boolean) {
    await db.project.update({ where: { id }, data: { isFeatured: !currentFeatured } });
    revalidatePath('/admin');
}

// --- BLOG İŞLEMLERİ ---

export async function addBlog(formData: FormData) {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const category = formData.get('category') as string;
    const readTime = formData.get('readTime') as string;
    const excerpt = formData.get('excerpt') as string;

    await db.blogPost.create({
        data: { title, content, imageUrl, category, readTime, excerpt },
    });
    revalidatePath('/admin');
    revalidatePath('/blog');
}

export async function updateBlog(formData: FormData) {
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const category = formData.get('category') as string;
    const readTime = formData.get('readTime') as string;
    const excerpt = formData.get('excerpt') as string;

    await db.blogPost.update({
        where: { id },
        data: { title, content, imageUrl, category, readTime, excerpt },
    });
    revalidatePath('/admin');
    revalidatePath('/blog');
}

export async function deleteBlog(formData: FormData) {
    const id = formData.get('id') as string;
    await db.blogPost.delete({ where: { id } });
    revalidatePath('/admin');
    revalidatePath('/blog');
}

export async function toggleBlogStatus(id: string, currentStatus: boolean) {
    await db.blogPost.update({ where: { id }, data: { isPublished: !currentStatus } });
    revalidatePath('/admin');
}

export async function toggleBlogFeatured(id: string, currentFeatured: boolean) {
    await db.blogPost.update({ where: { id }, data: { isFeatured: !currentFeatured } });
    revalidatePath('/admin');
}

// --- MESAJ İŞLEMLERİ ---

export async function deleteMessage(formData: FormData) {
    const id = formData.get('id') as string;
    await db.contactMessage.delete({ where: { id } });
    revalidatePath('/admin');
}

// --- 👇 MÜŞTERİ PROJE YÖNETİMİ (KABUL ETME & DETAYLANDIRMA) ---

export async function acceptProject(id: string, clientName: string, email: string, message: string, subject: string) {
    try {
        const code = generateAccessCode();

        // Mesajın konusundan "🚀 " işaretini temizleyip Proje Adı yapalım
        // Eğer konu "Genel İletişim" ise müşterinin adını kullanalım.
        let finalProjectName = clientName + " Projesi";

        if (subject && subject.includes('🚀')) {
            finalProjectName = subject.replace('🚀', '').trim();
        }

        await db.clientProject.create({
            data: {
                name: finalProjectName, // Artık Proje Adı burada!
                email,
                description: message, // Tüm detaylı form verisi burada
                accessCode: code,
                status: 'BRIEF_SUBMITTED', // İnceleme aşamasında başlatıyoruz
            }
        });

        // Mesajı sil
        await db.contactMessage.delete({ where: { id } });

        // Müşteriye Mail Gönder
        if (process.env.RESEND_API_KEY) {
            await resend.emails.send({
                from: 'Portfolio Admin <onboarding@resend.dev>',
                to: email,
                subject: '🚀 Projeniz Onaylandı! Panele Giriş Yapın',
                html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #2563eb;">Başvurunuz Alındı! 🎉</h2>
            <p>Merhaba <strong>${clientName}</strong>,</p>
            <p><strong>"${finalProjectName}"</strong> için gönderdiğin detayları incelemeye başladım.</p>
            <p>Sana özel fiyat teklifimi ve yol haritasını görmek için panele giriş yapabilirsin.</p>
            
            <div style="background-color: #f3f4f6; padding: 15px; margin: 20px 0; border-radius: 8px; text-align: center;">
              <span style="display: block; font-size: 12px; color: #666;">GİRİŞ KODUNUZ</span>
              <strong style="font-size: 24px; letter-spacing: 4px; color: #000;">${code}</strong>
            </div>

            <a href="https://portfolio-v1-eta-taupe.vercel.app/portal" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Panele Git</a>
          </div>
        `
            });
        }

        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'İşlem başarısız.' };
    }
}

export async function deleteClientProject(formData: FormData) {
    const id = formData.get('id') as string;
    await db.clientProject.delete({ where: { id } });
    revalidatePath('/admin');
}

// 👇 YENİ: Proje İlerlemesini Güncelle
export async function updateProjectProgress(formData: FormData) {
    const id = formData.get('id') as string;
    const progress = parseInt(formData.get('progress') as string);
    const currentStage = formData.get('currentStage') as string;

    try {
        await db.clientProject.update({
            where: { id },
            data: {
                progress,
                currentStage
            }
        });

        revalidatePath('/admin');
        revalidatePath('/portal/dashboard'); // Müşteri de anında görsün
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Güncellenemedi.' };
    }
}

// ... mevcut kodların altına

// 👇 YENİ: Müşterinin Karşı Teklifini Kabul Et
export async function acceptClientOffer(formData: FormData) {
    const id = formData.get('id') as string;

    try {
        // Önce projeyi bulalım (Müşterinin girdiği verileri almak için)
        const project = await db.clientProject.findUnique({ where: { id } });
        if (!project) throw new Error("Proje bulunamadı");

        await db.clientProject.update({
            where: { id },
            data: {
                budget: project.clientOfferPrice, // Müşterinin fiyatını kabul ediyoruz
                deadline: project.clientOfferDeadline, // Müşterinin süresini kabul ediyoruz
                status: 'APPROVED', // Ve projeyi başlatıyoruz
                startDate: new Date(),
            }
        });

        // Müşteriye "Anlaştık!" Maili
        if (process.env.RESEND_API_KEY) {
            await resend.emails.send({
                from: 'Metehan Erkan <onboarding@resend.dev>',
                to: project.email,
                subject: '🎉 Anlaştık! Proje Başlıyor 🚀',
                html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #16a34a;">Teklifiniz Kabul Edildi!</h2>
            <p>Sunduğunuz revize teklifi (Fiyat ve Süre) onayladım.</p>
            <p><strong>Proje süreci resmen başlamıştır.</strong> Gelişmeleri panelden takip edebilirsiniz.</p>
            <br/>
            <a href="https://portfolio-v1-eta-taupe.vercel.app/portal" style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Panele Git</a>
          </div>
        `
            });
        }

        revalidatePath('/admin');
        return { success: true };

    } catch (error) {
        return { success: false, error: 'İşlem başarısız.' };
    }
}

export async function updateProjectStatus(formData: FormData) {
    const id = formData.get('id') as string;
    const progress = parseInt(formData.get('progress') as string);
    const currentStage = formData.get('currentStage') as string;

    // Eğer proje bitirildiyse statüyü COMPLETED yapalım, yoksa APPROVED kalsın
    const isCompleted = progress === 100;

    await db.clientProject.update({
        where: { id },
        data: {
            progress,
            currentStage,
            status: isCompleted ? 'COMPLETED' : 'APPROVED'
        }
    });

    revalidatePath('/admin');
    revalidatePath('/portal'); // Müşteri de görsün
}


// 👇 YENİ: Müşteri Taleplerini Yönet (Onayla/Reddet)
export async function updateRequestStatus(formData: FormData) {
    const requestId = formData.get('requestId') as string;
    const status = formData.get('status') as string; // 'APPROVED' veya 'REJECTED'

    try {
        await db.projectRequest.update({
            where: { id: requestId },
            data: { status }
        });

        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Talep güncellenemedi.' };
    }
}