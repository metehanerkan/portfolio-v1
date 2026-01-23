import { Locale, getDictionary } from '@/dictionaries';
import ContactClient from './ContactClient';

export const dynamic = 'force-dynamic';

export default async function ContactPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = getDictionary(lang);

    return <ContactClient dict={dict.contact} />;
}