export default function PortalLayout({ children }: { children: React.ReactNode }) {
    return (
        // 👇 Bu ayarlar Portalı ana siteden izole eder ve tam ekran yapar
        <div className="fixed inset-0 z-[50] bg-black overflow-y-auto w-full h-full m-0 p-0">
            {children}
        </div>
    );
}