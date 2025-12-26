'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function sendMessage(formData: FormData) {
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

        revalidatePath('/admin');
        revalidatePath('/contact');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Mesaj gönderilemedi.' };
    }
}

export async function deleteMessage(formData: FormData) {
    const id = formData.get('id') as string;
    await db.contactMessage.delete({ where: { id } });
    revalidatePath('/admin');
    revalidatePath('/contact');
}