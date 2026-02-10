'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { sendMail } from '@/lib/sendMail';

// 1. Proje Bilgilerini Getir
export async function getProjectByCode(code: string) {
    if (!code) return null;

    const project = await db.clientProject.findUnique({
        where: { accessCode: code }
    });

    return project;
}

// 2. Müşteri Detay Formunu Kaydet
export async function saveProjectBrief(formData: FormData) {
    const code = formData.get('code') as string;
    const budget = formData.get('budget') as string;
    const deadline = formData.get('deadline') as string;
    const features = formData.getAll('features'); // Checkboxlar array olarak gelir
    const notes = formData.get('notes') as string;

    try {
        await db.clientProject.update({
            where: { accessCode: code },
            data: {
                budget,
                deadline,
                features: features.join(', '), // "Admin, SEO, Blog" gibi kaydeder
                notes,
                status: 'BRIEF_SUBMITTED' // Statüyü değiştiriyoruz: "Detaylar Gönderildi"
            }
        });

        revalidatePath('/portal/dashboard');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Kaydedilemedi.' };
    }
}

// 3. Proje Onaylama
export async function approveProposal(code: string) {
    try {
        await db.clientProject.update({
            where: { accessCode: code },
            data: {
                status: 'APPROVED', // Yeni Statü: Onaylandı / Geliştirme Başlıyor
                startDate: new Date() // Başlangıç tarihini bugün yapıyoruz
            }
        });

        revalidatePath('/portal/dashboard');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Onay işlemi başarısız.' };
    }
}

// 4. Revize / Karşı Teklif Gönderme
export async function submitCounterOffer(formData: FormData) {
    const code = formData.get('code') as string;
    const offerPrice = formData.get('offerPrice') as string;
    const offerDeadline = formData.get('offerDeadline') as string;
    const offerNotes = formData.get('offerNotes') as string;

    try {
        const project = await db.clientProject.update({
            where: { accessCode: code },
            data: {
                clientOfferPrice: offerPrice,
                clientOfferDeadline: offerDeadline,
                clientOfferNotes: offerNotes,
                status: 'NEGOTIATION' // Statüyü "Pazarlık" moduna çekiyoruz
            }
        });

        // SANA BİLDİRİM MAİLİ (Opsiyonel: Mail sistemin çalışıyorsa burası kalsın)
        // SANA BİLDİRİM MAİLİ
        await sendMail({
            to: process.env.SMTP_USER || 'metehanerkan08@gmail.com',
            subject: `🔥 PAZARLIK VAR: ${project.name}`,
            html: `
              <h3>Müşteri Teklifi Revize Etmek İstiyor</h3>
              <p><strong>${project.name}</strong> verdiğin teklife karşılık bir öneri sundu.</p>
              <ul>
                <li><strong>Fiyat:</strong> ${offerPrice}</li>
                <li><strong>Tarih:</strong> ${offerDeadline}</li>
              </ul>
              <a href="https://metehan.dev/admin">Admin Paneline Git</a>
            `
        });

        revalidatePath('/portal/dashboard');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Teklif gönderilemedi.' };
    }
}

// 👇 GÜNCELLENEN KISIM: YENİ TALEP SİSTEMİ (MESAJ YERİNE REQUEST)
export async function submitProjectRequest(formData: FormData) {
    const code = formData.get('code') as string;
    const requestType = formData.get('type') as string; // 'new_feature', 'change', 'cancel'
    const message = formData.get('message') as string;
    const attachmentUrl = formData.get('attachmentUrl') as string | null;

    // Projeyi bul
    const project = await db.clientProject.findUnique({ where: { accessCode: code } });
    if (!project) return { success: false, error: 'Proje bulunamadı.' };

    // Yeni sistem: ContactMessage değil, ProjectRequest oluşturuyoruz
    await db.projectRequest.create({
        data: {
            projectId: project.id,
            type: requestType,
            message: message,
            attachmentUrl,
            status: 'PENDING'
        }
    });

    // E-POSTA BİLDİRİMİ
    await sendMail({
        to: process.env.SMTP_USER || 'metehanerkan08@gmail.com',
        subject: `🚀 YENİ TALEP: ${project.name}`,
        html: `
          <h3>Müşteriden Yeni Talep Var</h3>
          <p><strong>${project.name}</strong> projesi için yeni bir işlem bildirildi.</p>
          <ul>
            <li><strong>Tür:</strong> ${requestType}</li>
            <li><strong>Mesaj:</strong> ${message}</li>
          </ul>
          <a href="https://metehan.dev/admin">Admin Paneline Git</a>
        `
    });

    revalidatePath('/portal/dashboard');
    revalidatePath('/admin'); // Admin de anında görsün
    return { success: true };
}