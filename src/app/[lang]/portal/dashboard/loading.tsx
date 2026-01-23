import { FaRocket } from 'react-icons/fa';

export default function DashboardLoading() {
    return (
        <div className="flex flex-col min-h-full bg-black text-white font-sans">

            {/* ÜST BAR SKELETON */}
            <header className="border-b border-gray-800 bg-gray-950/80 h-16 flex items-center px-6">
                <div className="w-32 h-6 bg-gray-900 rounded animate-pulse"></div>
                <div className="ml-auto w-20 h-8 bg-gray-900 rounded animate-pulse"></div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto px-6 py-6 space-y-6 w-full">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* SOL KOLON */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* 1. KÜNYE (3 Kutu) */}
                        <div className="grid grid-cols-3 gap-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-[#0f1115] border border-gray-800 p-4 rounded-xl flex flex-col items-center gap-2 h-24 justify-center">
                                    <div className="w-8 h-8 bg-gray-900 rounded-full animate-pulse"></div>
                                    <div className="w-16 h-3 bg-gray-900 rounded animate-pulse"></div>
                                    <div className="w-12 h-4 bg-gray-800 rounded animate-pulse"></div>
                                </div>
                            ))}
                        </div>

                        {/* 2. İLERLEME KARTI (Büyük) */}
                        <div className="bg-[#0f1115] border border-gray-800 rounded-2xl p-8 h-64 relative overflow-hidden">
                            <div className="flex justify-between items-end mb-6">
                                <div className="space-y-2">
                                    <div className="w-48 h-8 bg-gray-900 rounded animate-pulse"></div>
                                    <div className="w-24 h-4 bg-gray-900 rounded animate-pulse"></div>
                                </div>
                                <div className="w-20 h-12 bg-gray-900 rounded animate-pulse"></div>
                            </div>
                            <div className="w-full h-3 bg-gray-900 rounded-full animate-pulse mb-4"></div>
                            <div className="flex justify-between">
                                <div className="w-32 h-6 bg-gray-900 rounded animate-pulse"></div>
                                <div className="w-32 h-4 bg-gray-900 rounded animate-pulse"></div>
                            </div>
                        </div>

                        {/* 3. ÖZELLİKLER LİSTESİ */}
                        <div className="bg-[#0f1115] border border-gray-800 rounded-2xl p-6">
                            <div className="w-32 h-5 bg-gray-900 rounded animate-pulse mb-4"></div>
                            <div className="grid grid-cols-2 gap-3">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="h-10 bg-gray-900 rounded-xl animate-pulse"></div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* SAĞ KOLON */}
                    <div className="space-y-6">
                        {/* Hızlı İşlemler */}
                        <div className="h-40 bg-gray-900/50 border border-gray-800 rounded-2xl animate-pulse"></div>
                        {/* Geçmiş */}
                        <div className="h-96 bg-[#0f1115] border border-gray-800 rounded-2xl p-6 space-y-4">
                            <div className="w-24 h-4 bg-gray-900 rounded animate-pulse"></div>
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-20 bg-gray-900 rounded-xl animate-pulse"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}