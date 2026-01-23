'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { checkRateLimit } from '@/lib/rateLimit';

import { createLog } from '@/actions/logger';

export async function sendMessage(formData: FormData) {
    // Rate Limit (1 hour, 3 messages)
    const ip = (await headers()).get('x-forwarded-for') || '127.0.0.1';
    const { success } = checkRateLimit(ip, { windowMs: 60 * 60 * 1000, max: 3 });
    if (!success) {
        await createLog(`İletişim formu limit aşımı: ${ip}`, 'WARNING', 'Contact Form');
        return { success: false, error: 'Çok fazla mesaj gönderdiniz. Lütfen bir süre bekleyin.' };
    }
    const honeypot = formData.get('website') as string;
    if (honeypot) {
        // Honeypot dolu, bot olabilir. Başarılı gibi dön.
        return { success: true };
    }

    const projectName = formData.get('projectName') as string;

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string || 'Genel İletişim';
    const budget = formData.get('budget') as string;
    const deadline = formData.get('deadline') as string;
    const designState = formData.get('designState') as string;
    const designUrl = formData.get('designUrl') as string;
    const referenceSites = formData.get('referenceSites') as string;

    const platforms = formData.getAll('platforms');
    const features = formData.getAll('features');
    const customFeatures = formData.getAll('customFeatures');
    const rawMessage = formData.get('message') as string;

    let finalMessage = rawMessage;

    if (budget || deadline) {
        const allFeatures = [...features, ...customFeatures];

        // Mesaj formatını güncelliyoruz (En başa Proje Adı geldi)
        finalMessage = `
📂 PROJE ADI: ${projectName.toUpperCase()}
------------------------------------------------
👤 Müşteri: ${name}
📧 E-posta: ${email}
------------------------------------------------
📱 Platformlar: ${platforms.length > 0 ? platforms.join(', ') : '-'}
💰 Bütçe: ${budget}
📅 Süre: ${deadline}
🎨 Tasarım Durumu: ${designState}
------------------------------------------------

🔗 TASARIM DETAYLARI
${designUrl ? `• Link: ${designUrl}` : ''}
${referenceSites ? `• Referanslar: ${referenceSites}` : ''}
${!designUrl && !referenceSites ? '• Tasarım detayı yok.' : ''}

🛠️ TEKNİK ÖZELLİKLER
${allFeatures.length > 0 ? allFeatures.join(', ') : 'Standart.'}

📝 NOTLAR:
${rawMessage}
    `.trim();
    }

    try {
        // Subject kısmını da güncelleyelim ki listede direkt proje adı gözüksün
        await db.contactMessage.create({
            data: {
                name,
                email,
                subject: budget ? `🚀 ${projectName}` : subject, // Konu başlığı proje adı oldu
                message: finalMessage,
            },
        });

        await createLog(`Yeni mesaj/talep: ${name} - ${subject}`, 'INFO', 'Contact Form');
        revalidatePath('/admin');
        revalidatePath('/contact');
        return { success: true };
    } catch (error) {
        await createLog(`Mesaj gönderme hatası: ${name}`, 'ERROR', 'Contact Form');
        return { success: false, error: 'Mesaj gönderilemedi.' };
    }
}

export async function deleteMessage(formData: FormData) {
    const id = formData.get('id') as string;
    await db.contactMessage.delete({ where: { id } });
    revalidatePath('/admin');
    revalidatePath('/contact');
}