import { Locale, getDictionary } from '@/dictionaries';
import ContactClient from './ContactClient';

export const dynamic = 'force-dynamic';

import { getPublicSettings } from '@/app/admin/settings/actions';

export default async function ContactPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = getDictionary(lang);
    const settings = await getPublicSettings();

    return <ContactClient dict={dict.contact} settings={settings} />;
}