import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProjectRequestBtn from '@/components/ProjectRequestBtn';
import { Locale, getDictionary } from '@/dictionaries';

export default async function SiteLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: Locale }>;
}) {
    const { lang } = await params;
    const dict = getDictionary(lang);

    return (
        <>
            <Navbar lang={lang} dict={dict.nav} />
            <main>{children}</main>
            <Footer lang={lang} dict={{ ...dict.footer, nav: dict.nav }} />
            <ProjectRequestBtn />
        </>
    );
}