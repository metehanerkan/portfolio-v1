import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendMail = async ({
    to,
    subject,
    html,
}: {
    to: string;
    subject: string;
    html: string;
}) => {
    try {
        if (!process.env.RESEND_API_KEY) {
            console.warn('⚠️ RESEND_API_KEY eksik, e-posta gönderilemedi.');
            return;
        }

        const data = await resend.emails.send({
            from: 'Metehan Erkan <info@metehandev.site>',
            to,
            subject,
            html,
        });

        console.log('✅ E-posta gönderildi:', data.data?.id);
        return data;
    } catch (error) {
        console.error('❌ E-posta gönderme hatası:', error);
        throw error;
    }
};
