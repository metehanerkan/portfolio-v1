import { skills } from "@/data/skills";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#030014] text-white pt-32 px-6 pb-20 relative overflow-hidden">

            {/* --- ARKA PLAN IŞIK EFEKTLERİ --- */}
            <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[120vh] bg-purple-600/20 rounded-full blur-[120px] opacity-50"></div>
                <div className="absolute bottom-0 left-[-10%] w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[100px] opacity-60"></div>
            </div>

            <div className="max-w-6xl mx-auto space-y-24 relative z-10">

                {/* --- GİRİŞ BÖLÜMÜ (HERO) --- */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

                    {/* Yazı Alanı */}
                    <div className="space-y-8">
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent leading-tight drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                            Kod Yazmak Benim İçin Bir Tutku.
                        </h1>

                        <div className="space-y-6 text-purple-100/70 text-lg leading-relaxed">
                            <p>
                                Merhaba! Ben <span className="text-white font-medium">Metehan</span>. Teknolojiyle tanıştığım ilk günden beri, karmaşık problemleri basit ve estetik çözümlere dönüştürmeyi seviyorum.
                            </p>
                            <p>
                                Full Stack geliştirme yolculuğumda, sadece kod yazmayı değil, aynı zamanda ölçeklenebilir mimariler kurmayı ve kullanıcı deneyimini (UX) en üst düzeye çıkarmayı hedefliyorum. Sürekli öğrenme modundayım; bugün React ekosistemini keşfederken, yarın Yapay Zeka entegrasyonlarıyla uğraşıyorum.
                            </p>
                        </div>

                        {/* İstatistikler */}
                        <div className="grid grid-cols-3 gap-6 pt-8 border-t border-purple-500/20">
                            <div>
                                <span className="block text-4xl font-bold text-white drop-shadow-md">10+</span>
                                <span className="text-sm text-purple-200/50 uppercase tracking-wide">Tamamlanan Proje</span>
                            </div>
                            <div>
                                <span className="block text-4xl font-bold text-white drop-shadow-md">2+</span>
                                <span className="text-sm text-purple-200/50 uppercase tracking-wide">Yıl Deneyim</span>
                            </div>
                            <div>
                                <span className="block text-4xl font-bold text-white drop-shadow-md">∞</span>
                                <span className="text-sm text-purple-200/50 uppercase tracking-wide">Öğrenme Aşkı</span>
                            </div>
                        </div>
                    </div>

                    {/* ✨ GÜNCELLEME: Kod Editörü Görünümü (VS Code Style) */}
                    <div className="relative group mx-auto md:mx-0 w-full max-w-md">
                        {/* Arkadaki Renkli Glow */}
                        <div className="absolute -inset-1 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition duration-1000"></div>

                        {/* Editör Penceresi */}
                        <div className="relative bg-[#0e0e11]/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">

                            {/* Pencere Başlığı (Mac Style Dots) */}
                            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/5">
                                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                                <div className="ml-auto text-xs text-purple-200/30 font-mono">metehan.tsx</div>
                            </div>

                            {/* Kod İçeriği */}
                            <div className="p-6 font-mono text-sm md:text-base leading-relaxed overflow-x-auto">
                                <div className="flex">
                                    <span className="text-purple-200/30 select-none mr-4">1</span>
                                    <span className="text-purple-400">const</span> <span className="text-blue-400 ml-2">Developer</span> <span className="text-white ml-2">=</span> <span className="text-yellow-400 ml-2">{`{`}</span>
                                </div>
                                <div className="flex">
                                    <span className="text-purple-200/30 select-none mr-4">2</span>
                                    <span className="ml-4 text-purple-300">name:</span> <span className="text-green-400 ml-2">'Metehan Erkan'</span>,
                                </div>
                                <div className="flex">
                                    <span className="text-purple-200/30 select-none mr-4">3</span>
                                    <span className="ml-4 text-purple-300">role:</span> <span className="text-green-400 ml-2">'Full Stack Dev'</span>,
                                </div>
                                <div className="flex">
                                    <span className="text-purple-200/30 select-none mr-4">4</span>
                                    <span className="ml-4 text-purple-300">traits:</span> <span className="text-yellow-400 ml-2">[</span>
                                </div>
                                <div className="flex">
                                    <span className="text-purple-200/30 select-none mr-4">5</span>
                                    <span className="ml-8 text-green-400">'Problem Solver'</span>,
                                </div>
                                <div className="flex">
                                    <span className="text-purple-200/30 select-none mr-4">6</span>
                                    <span className="ml-8 text-green-400">'Continuous Learner'</span>,
                                </div>
                                <div className="flex">
                                    <span className="text-purple-200/30 select-none mr-4">7</span>
                                    <span className="ml-8 text-green-400">'Detail Oriented'</span>
                                </div>
                                <div className="flex">
                                    <span className="text-purple-200/30 select-none mr-4">8</span>
                                    <span className="ml-4 text-yellow-400">]</span>,
                                </div>
                                <div className="flex">
                                    <span className="text-purple-200/30 select-none mr-4">9</span>
                                    <span className="ml-4 text-purple-300">hardWorker:</span> <span className="text-blue-400 ml-2">true</span>
                                </div>
                                <div className="flex">
                                    <span className="text-purple-200/30 select-none mr-4">10</span>
                                    <span className="text-yellow-400">{'}'}</span>;
                                </div>
                                {/* Yanıp sönen imleç */}
                                <div className="mt-2 h-4 w-2 bg-purple-500 animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                </section>

                {/* --- TEKNOLOJİLER (SKILLS) --- */}
                <section>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent drop-shadow-lg">
                            Kullandığım Teknolojiler
                        </h2>
                        <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-indigo-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {skills.map((skill, index) => (
                            <div
                                key={index}
                                className="group bg-white/5 border border-white/10 p-8 rounded-2xl flex flex-col items-center gap-6 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_-10px_rgba(168,85,247,0.3)] backdrop-blur-sm"
                            >
                                <div
                                    className="text-4xl transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                                    style={{ color: skill.color }}
                                >
                                    {skill.icon}
                                </div>

                                <div className="text-center">
                                    <h3 className="font-bold text-white text-xl mb-1">{skill.name}</h3>
                                    <p className="text-xs text-purple-200/40 uppercase tracking-wider font-semibold">{skill.level}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </main>
    );
}