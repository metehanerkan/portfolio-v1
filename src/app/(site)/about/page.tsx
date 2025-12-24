import { skills } from "@/data/skills";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-black text-white pt-24 px-6 pb-12">
            <div className="max-w-6xl mx-auto space-y-16">

                <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                            Kod Yazmak Benim İçin Bir Tutku.
                        </h1>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            Merhaba! Ben Metehan. Teknolojiyle tanıştığım ilk günden beri, karmaşık problemleri basit ve estetik çözümlere dönüştürmeyi seviyorum.
                        </p>
                        <p className="text-gray-400 leading-relaxed">
                            Full Stack geliştirme yolculuğumda, sadece kod yazmayı değil, aynı zamanda ölçeklenebilir mimariler kurmayı ve kullanıcı deneyimini (UX) en üst düzeye çıkarmayı hedefliyorum. Sürekli öğrenme modundayım; bugün React ekosistemini keşfederken, yarın Yapay Zeka entegrasyonlarıyla uğraşıyorum.
                        </p>

                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-800">
                            <div>
                                <span className="block text-3xl font-bold text-white">10+</span>
                                <span className="text-sm text-gray-500">Tamamlanan Proje</span>
                            </div>
                            <div>
                                <span className="block text-3xl font-bold text-white">2+</span>
                                <span className="text-sm text-gray-500">Yıl Deneyim</span>
                            </div>
                            <div>
                                <span className="block text-3xl font-bold text-white">∞</span>
                                <span className="text-sm text-gray-500">Öğrenme Aşkı</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>

                        <div className="relative aspect-square bg-gray-900 rounded-2xl border border-gray-800 flex items-center justify-center overflow-hidden">
                            <div className="text-center p-8">
                                <span className="text-6xl mb-4 block">👨‍💻</span>
                                <p className="text-gray-500">Fotoğraf Alanı</p>
                            </div>
                        </div>
                    </div>
                </section>


                <section>
                    <h2 className="text-3xl font-bold mb-8 text-center border-b border-gray-800 pb-4">
                        Kullandığım Teknolojiler
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {skills.map((skill, index) => (
                            <div
                                key={index}
                                className="group bg-gray-900 border border-gray-800 p-6 rounded-2xl flex flex-col items-center gap-4 hover:border-gray-600 transition-all duration-300 hover:-translate-y-1"
                            >
                                <div
                                    className="text-5xl transition-colors duration-300 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                                    style={{ color: skill.color }}
                                >
                                    {skill.icon}
                                </div>

                                <div className="text-center">
                                    <h3 className="font-bold text-white text-lg">{skill.name}</h3>
                                    <p className="text-xs text-gray-500 mt-1">{skill.level}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </main>
    );
}