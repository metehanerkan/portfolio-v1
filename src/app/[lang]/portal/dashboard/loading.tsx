export default function DashboardSkeleton() {
    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-black p-6 space-y-6 animate-pulse">
            {/* Header Skeleton */}
            <div className="h-16 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-gray-300 dark:bg-gray-800 rounded-full"></div>
                    <div className="h-6 w-32 bg-gray-300 dark:bg-gray-800 rounded"></div>
                </div>
                <div className="h-8 w-20 bg-gray-300 dark:bg-gray-800 rounded"></div>
            </div>

            <main className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* SOL SÜTUN */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Üst Kartlar */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-24 bg-gray-100 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800"></div>
                        ))}
                    </div>

                    {/* Proje İlerleme */}
                    <div className="bg-gray-100 dark:bg-gray-900 h-40 rounded-2xl border border-gray-200 dark:border-gray-800"></div>

                    {/* Envanter */}
                    <div className="bg-gray-100 dark:bg-gray-900 h-64 rounded-2xl border border-gray-200 dark:border-gray-800"></div>
                </div>

                {/* SAĞ SÜTUN */}
                <div className="space-y-6">
                    {/* Hızlı İşlemler */}
                    <div className="bg-gray-100 dark:bg-gray-900 h-48 rounded-2xl border border-gray-200 dark:border-gray-800"></div>

                    {/* Geçmiş */}
                    <div className="bg-gray-100 dark:bg-gray-900 h-96 rounded-2xl border border-gray-200 dark:border-gray-800"></div>
                </div>
            </main>
        </div>
    );
}