import { skills } from "@/data/skills";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-black text-white pt-24 px-6 pb-12">
            <div className="max-w-6xl mx-auto space-y-16">

                {/* BÖLÜM 1: Giriş ve Hikaye */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Sol: Metin */}
                    <div className="space-y-6">
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                            Kod Yazmak Benim İçin Bir Tutku.
                        </h1>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            Merhaba! Ben Metehan. Teknolojiyle tanıştığım ilk günden beri, karmaşık problemleri basit ve estetik çözümlere dönüştürmeyi seviyorum.
                        </p>
                        <p className="text-gray-400 leading-relaxed">
                            Full Stack geliştirme yolculuğumda, sadece kod yazmayı değil, aynı zamanda **ölçeklenebilir mimariler** kurmayı ve **kullanıcı deneyimini (UX)** en üst düzeye çıkarmayı hedefliyorum. Sürekli öğrenme modundayım; bugün React ekosistemini keşfederken, yarın Yapay Zeka entegrasyonlarıyla uğraşıyorum.
                        </p>

                        {/* İstatistikler (Opsiyonel Havalı Kısım) */}
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

                    {/* Sağ: Görsel (Senin fotoğrafın veya temsili bir kod görseli) */}
                    <div className="relative group">
                        {/* Arkadaki Bulanık Efekt */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>

                        <div className="relative aspect-square bg-gray-900 rounded-2xl border border-gray-800 flex items-center justify-center overflow-hidden">
                            {/* İleride buraya kendi fotoğrafını koyacaksın: <Image src="/ben.jpg" ... /> */}
                            <div className="text-center p-8">
                                <span className="text-6xl mb-4 block">👨‍💻</span>
                                <p className="text-gray-500">Fotoğraf Alanı</p>
                            </div>
                        </div>
                    </div>
                </section>


                {/* BÖLÜM 2: Yeteneklerim (Tech Stack) */}
                <section>
                    <h2 className="text-3xl font-bold mb-8 text-center border-b border-gray-800 pb-4">
                        Kullandığım Teknolojiler
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {skills.map((skill) => (
                            <div
                                key={skill.name}
                                className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 flex flex-col items-center justify-center gap-4 hover:border-gray-600 hover:bg-gray-800 transition duration-300 group"
                            >
                                {/* İkon */}
                                <div className={`text-4xl ${skill.color} group-hover:scale-110 transition-transform duration-300 drop-shadow-lg`}>
                                    {skill.icon}
                                </div>

                                {/* İsim ve Seviye */}
                                <div className="text-center">
                                    <h3 className="font-bold text-gray-200">{skill.name}</h3>
                                    <span className="text-xs text-gray-500 mt-1 block">{skill.level}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </main>
    );
}