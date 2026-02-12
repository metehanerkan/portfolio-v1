'use client';

import NotFoundContent from "@/components/NotFoundContent";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
            <NotFoundContent />

            <div className="mt-8 max-w-md mx-auto">
                <p className="text-gray-500 mb-6">
                    Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
                </p>
                <a
                    href="/"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 transition"
                >
                    Ana Sayfaya Dön
                </a>
            </div>
        </div>
    );
}