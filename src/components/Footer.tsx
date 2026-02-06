import Link from 'next/link';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import NewsletterForm from './NewsletterForm';
import { Locale, Dictionary } from '@/dictionaries';

interface FooterProps {
    lang: Locale;
    dict: Dictionary['footer'] & { nav: Dictionary['nav'] }; // footer + nav (for links)
}

import { getPublicSettings } from '@/app/admin/settings/actions';

export default async function Footer({ lang, dict }: FooterProps) {
    const currentYear = new Date().getFullYear();
    const settings = await getPublicSettings();

    return (
        // ✨ GÜNCELLEME: Arka plan #030014 ve üstte mor ışık çizgisi
        <footer className="relative bg-white dark:bg-[#030014] pt-20 pb-10 border-t border-gray-200 dark:border-purple-500/10 overflow-hidden transition-colors duration-300">

            {/* Üst Parlayan Çizgi (Bölüm ayırıcı) */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>

            {/* Arka Plan Ortam Işığı (Footer'ın dibinde hafif morluk) */}
            <div className="absolute -bottom-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-500/5 dark:bg-purple-700/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                <div className="mb-20">
                    <NewsletterForm />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">

                    {/* MARKA ALANI */}
                    <div className="space-y-4">
                        <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-700 via-purple-500 to-purple-700 dark:from-white dark:via-purple-200 dark:to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                            Metehan.dev
                        </h3>
                        <p className="text-gray-600 dark:text-purple-200/60 text-sm leading-relaxed max-w-xs">
                            {settings?.footerText || dict.brandDesc}
                        </p>
                    </div>

                    {/* HIZLI LİNKLER */}
                    <div className="space-y-6">
                        <h4 className="text-gray-900 dark:text-white font-bold text-lg tracking-wide">{dict.quickLinks}</h4>
                        <ul className="space-y-3 text-gray-600 dark:text-purple-200/60 text-sm">
                            <li>
                                <Link href={`/${lang}/projects`} className="hover:text-purple-600 dark:hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">
                                    {dict.nav.projects}
                                </Link>
                            </li>
                            <li>
                                <Link href={`/${lang}/blog`} className="hover:text-purple-600 dark:hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">
                                    {dict.nav.blog}
                                </Link>
                            </li>
                            <li>
                                <Link href={`/${lang}/about`} className="hover:text-purple-600 dark:hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">
                                    {dict.nav.about}
                                </Link>
                            </li>
                            <li>
                                <Link href={`/${lang}/contact`} className="hover:text-purple-600 dark:hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">
                                    {dict.nav.contact}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* İLETİŞİM */}
                    <div className="space-y-6">
                        <h4 className="text-gray-900 dark:text-white font-bold text-lg tracking-wide">{dict.contact}</h4>
                        <p className="text-gray-600 dark:text-purple-200/60 text-sm">
                            Projeleriniz veya sorularınız için her zaman ulaşabilirsiniz.
                        </p>

                        <a
                            href={`mailto:${settings?.contactEmail || 'metehanerkan08@gmail.com'}`}
                            className="inline-flex items-center gap-3 text-purple-700 dark:text-purple-300 hover:text-white transition-colors duration-300 bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-3 rounded-lg hover:bg-purple-600 dark:hover:bg-white/10 hover:border-purple-500/50 group shadow-sm hover:shadow-md"
                        >
                            <FaEnvelope className="group-hover:scale-110 transition-transform duration-300" />
                            <span className="text-sm border-gray-200 dark:border-transparent group-hover:text-white">{settings?.contactEmail || 'metehanerkan08@gmail.com'}</span>
                        </a>

                        <div className="flex gap-4 pt-2">
                            <a
                                href={settings?.socialGithub || "https://github.com/metehanerkan"}
                                target="_blank"
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-white hover:bg-black dark:hover:bg-white/10 hover:border-black dark:hover:border-purple-500/50 transition-all duration-300 hover:scale-110"
                            >
                                <FaGithub size={20} />
                            </a>
                            <a
                                href={settings?.socialLinkedin || "https://linkedin.com/in/metehan-erkan-b9a52a1b8/"}
                                target="_blank"
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-white hover:bg-[#0077b5] dark:hover:bg-white/10 hover:border-[#0077b5] dark:hover:border-[#0077b5]/50 transition-all duration-300 hover:scale-110"
                            >
                                <FaLinkedin size={20} />
                            </a>
                        </div>
                    </div>

                </div>

                {/* ALT TELİF ALANI */}
                <div className="border-t border-gray-200 dark:border-purple-500/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 dark:text-purple-200/40 text-sm text-center md:text-left">
                        © {currentYear} Metehan Erkan {dict.rights}
                    </p>
                </div>

            </div>
        </footer>
    );
}