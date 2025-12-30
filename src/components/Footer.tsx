import Link from 'next/link';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        // ✨ GÜNCELLEME: Arka plan #030014 ve üstte mor ışık çizgisi
        <footer className="relative bg-[#030014] pt-20 pb-10 border-t border-purple-500/10 overflow-hidden">

            {/* Üst Parlayan Çizgi (Bölüm ayırıcı) */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>

            {/* Arka Plan Ortam Işığı (Footer'ın dibinde hafif morluk) */}
            <div className="absolute -bottom-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-700/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">

                    {/* MARKA ALANI */}
                    <div className="space-y-4">
                        <h3 className="text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                            Metehan.
                        </h3>
                        <p className="text-purple-200/60 text-sm leading-relaxed max-w-xs">
                            Modern web teknolojileri ile kullanıcı dostu, hızlı ve estetik dijital deneyimler tasarlıyorum.
                        </p>
                    </div>

                    {/* HIZLI LİNKLER */}
                    <div className="space-y-6">
                        <h4 className="text-white font-bold text-lg tracking-wide">Hızlı Linkler</h4>
                        <ul className="space-y-3 text-purple-200/60 text-sm">
                            <li>
                                <Link href="/projects" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">
                                    Projeler
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">
                                    Bloglar
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">
                                    Hakkımda
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-white hover:translate-x-1 transition-all duration-300 inline-block">
                                    İletişim
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* İLETİŞİM */}
                    <div className="space-y-6">
                        <h4 className="text-white font-bold text-lg tracking-wide">İletişim</h4>
                        <p className="text-purple-200/60 text-sm">
                            Projeleriniz veya sorularınız için her zaman ulaşabilirsiniz.
                        </p>

                        <a
                            href="mailto:metehanerkan08@gmail.com"
                            className="inline-flex items-center gap-3 text-purple-300 hover:text-white transition-colors duration-300 bg-white/5 border border-white/10 px-4 py-3 rounded-lg hover:bg-white/10 hover:border-purple-500/50 group"
                        >
                            <FaEnvelope className="group-hover:scale-110 transition-transform duration-300" />
                            <span className="text-sm">metehanerkan08@gmail.com</span>
                        </a>

                        <div className="flex gap-4 pt-2">
                            <a
                                href="https://github.com/metehanerkan"
                                target="_blank"
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-110"
                            >
                                <FaGithub size={20} />
                            </a>
                            <a
                                href="https://linkedin.com/in/metehan-erkan-b9a52a1b8/"
                                target="_blank"
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-[#0077b5] hover:bg-white/10 hover:border-[#0077b5]/50 transition-all duration-300 hover:scale-110"
                            >
                                <FaLinkedin size={20} />
                            </a>
                        </div>
                    </div>

                </div>

                {/* ALT TELİF ALANI */}
                <div className="border-t border-purple-500/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-purple-200/40 text-sm text-center md:text-left">
                        © {currentYear} Metehan Erkan. Tüm hakları saklıdır.
                    </p>
                </div>

            </div>
        </footer>
    );
}