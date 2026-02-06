'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Locale } from '@/dictionaries';
import { useState } from 'react';
import { FaGlobe } from 'react-icons/fa';

export default function LanguageSwitcher({ currentLang }: { currentLang: Locale }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const switchLanguage = (newLang: Locale) => {
        if (!pathname) return;
        const segments = pathname.split('/');
        // segmentler: ['', 'tr', 'projects']
        // Eğer route group yüzünden url farklı ise düzeltmemiz gerekebilir ama
        // şu anki yapıda /[lang]/... olduğu için segments[1] her zaman dildir (middleware ile).
        segments[1] = newLang;
        const newPath = segments.join('/');
        router.push(newPath);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 dark:text-purple-200 hover:text-purple-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all font-medium text-sm"
            >
                <FaGlobe />
                <span className="uppercase">{currentLang}</span>
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-24 bg-white dark:bg-[#030014] border border-gray-200 dark:border-purple-500/30 rounded-xl shadow-xl overflow-hidden animate-fadeIn">
                    <button
                        onClick={() => switchLanguage('tr')}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-purple-600/30 transition-colors ${currentLang === 'tr' ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-gray-600 dark:text-gray-300'}`}
                    >
                        Türkçe
                    </button>
                    <button
                        onClick={() => switchLanguage('en')}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-purple-600/30 transition-colors ${currentLang === 'en' ? 'text-purple-600 dark:text-purple-400 font-bold' : 'text-gray-600 dark:text-gray-300'}`}
                    >
                        English
                    </button>
                </div>
            )}
        </div>
    );
}
