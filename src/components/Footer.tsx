import Link from 'next/link';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-black border-t border-gray-800 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

                    {/* Bölüm 1: Logo ve Açıklama */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            Metehan.
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                            Modern web teknolojileri ile kullanıcı dostu, hızlı ve estetik dijital deneyimler tasarlıyorum.
                        </p>
                    </div>

                    {/* Bölüm 2: Hızlı Linkler */}
                    <div className="space-y-4">
                        <h4 className="text-white font-bold text-lg">Hızlı Linkler</h4>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><Link href="/projects" className="hover:text-blue-400 transition">Projeler</Link></li>
                            <li><Link href="/blog" className="hover:text-blue-400 transition">Blog Yazıları</Link></li>
                            <li><Link href="/about" className="hover:text-blue-400 transition">Hakkımda</Link></li>
                            <li><Link href="/contact" className="hover:text-blue-400 transition">İletişim</Link></li>
                        </ul>
                    </div>

                    {/* Bölüm 3: İletişim */}
                    <div className="space-y-4">
                        <h4 className="text-white font-bold text-lg">İletişim</h4>
                        <p className="text-gray-400 text-sm">
                            Projeleriniz veya sorularınız için her zaman ulaşabilirsiniz.
                        </p>
                        <a
                            href="mailto:metehanerkan08@gmail.com"
                            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition"
                        >
                            <FaEnvelope /> metehanerkan08@gmail.com

                        </a>
                        <div className="flex gap-4 pt-2">
                            <a href="https://github.com/metehanerkan" target="_blank" className="text-gray-400 hover:text-white transition transform hover:scale-110"><FaGithub size={20} /></a>
                            <a href="https://linkedin.com/in/metehan-erkan-b9a52a1b8/" target="_blank" className="text-gray-400 hover:text-[#0077b5] transition transform hover:scale-110"><FaLinkedin size={20} /></a>
                        </div>
                    </div>

                </div>

                <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm text-center md:text-left">
                        © {currentYear} Metehan Erkan. Tüm hakları saklıdır.
                    </p>
                </div>

            </div>
        </footer>
    );
}