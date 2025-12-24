'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { Resend } from 'resend';

// Resend kurulumu
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMessage(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    if (!name || !email || !message) {
        return { success: false, error: 'Lütfen tüm alanları doldurun.' };
    }

    try {
        // 1. Veritabanına Kaydet (Admin Paneli için)
        await db.contactMessage.create({
            data: { name, email, message },
        });

        // 2. Sana E-posta Gönder (Bildirim için)
        if (process.env.RESEND_API_KEY && process.env.MY_EMAIL) {
            await resend.emails.send({
                from: 'Portfolio Contact <onboarding@resend.dev>', // Ücretsiz planda burası sabit kalmalı
                to: process.env.MY_EMAIL, // .env dosyasındaki senin mailin
                subject: `🔔 Yeni Mesaj: ${name}`,
                replyTo: email, // Yanıtla deyince direkt gönderen kişiye yanıtla
                html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #e5e7eb; border-radius: 10px;">
            <h2 style="color: #2563eb;">Yeni Proje/Mesaj Talebi!</h2>
            <p><strong>Gönderen:</strong> ${name}</p>
            <p><strong>E-posta:</strong> ${email}</p>
            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <p style="font-size: 16px; color: #374151;">${message}</p>
            <br />
            <a href="mailto:${email}" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Yanıtla</a>
          </div>
        `
            });
        }

        revalidatePath('/admin');
        return { success: true };

    } catch (error) {
        console.error("Mesaj gönderme hatası:", error);
        return { success: false, error: 'Bir hata oluştu, lütfen tekrar deneyin.' };
    }
}

export async function deleteMessage(formData: FormData) {
    const id = formData.get('id') as string;
    await db.contactMessage.delete({ where: { id } });
    revalidatePath('/admin');
}