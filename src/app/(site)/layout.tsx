import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProjectRequestBtn from '@/components/ProjectRequestBtn';

export default function SiteLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <ProjectRequestBtn />
        </>
    );
}