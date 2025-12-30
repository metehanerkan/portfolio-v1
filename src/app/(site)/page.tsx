import { db } from '@/lib/db';
import HeroTypewriter from '@/components/HeroTypewriter';
import Link from 'next/link';
import { FaGithub, FaLinkedin, FaArrowRight } from 'react-icons/fa';
import ProjectCard from '@/components/ProjectCard';
import BlogCard from '@/components/BlogCard';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const featuredProjects = await db.project.findMany({
    where: { isPublished: true, isFeatured: true },
    take: 3,
    orderBy: { createdAt: 'desc' }
  });

  const recentBlogs = await db.blogPost.findMany({
    where: { isPublished: true, isFeatured: true },
    take: 3,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main className="min-h-screen w-full relative bg-[#030014]">

      {/* --- SABİT ARKA PLAN KATMANI (HAFİFLETİLMİŞ IŞIK EFEKTLERİ) --- */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">

        {/* 1. Tepe Işığı (Siyah bandı önleyen - Hafifletildi) */}
        {/* opacity-80 -> opacity-50, from-purple-900/50 -> from-purple-900/30 */}
        <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-purple-900/30 via-[#1a0b2e]/20 to-transparent blur-[80px] opacity-50" />

        {/* 2. Ana Spot (Hafifletildi) */}
        {/* from-purple-700/40 -> from-purple-800/20 (Daha soluk mor) */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[140vw] h-[100vh] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-800/20 via-[#0b0318]/40 to-transparent blur-[100px]" />

        {/* 3. Logo Arkası Parlama (Hafifletildi) */}
        {/* bg-purple-600/20 -> bg-purple-600/10 */}
        <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-purple-800/10 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      {/* --- İÇERİK ALANI --- */}
      <div className="relative z-10 flex flex-col items-center w-full">

        {/* HERO SECTION */}
        {/* pt-24 -> pt-16 (Yazılar yukarı taşındı) */}
        <section className="min-h-screen w-full flex flex-col items-center justify-center px-4 pt-1">

          <div className="max-w-4xl mx-auto w-full flex flex-col items-center text-center">


            {/* Başlık */}
            <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight ">
              Merhaba,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-purple-300">Ben Metehan.</span>
            </h1>

            {/* Typewriter */}
            <div className="mb-8">
              <HeroTypewriter />
            </div>

            {/* Açıklama */}
            <p className="text-purple-100/70 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed drop-shadow-sm">
              Modern web teknolojileri ile ölçeklenebilir, kullanıcı dostu ve estetik dijital çözümler üretiyorum.
            </p>

            {/* Butonlar */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/projects"
                className="px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition transform hover:scale-105 flex items-center gap-2 shadow-sm"
              >
                Projelerimi Gör <FaArrowRight />
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 bg-purple-600/5 border border-purple-500/30 text-white rounded-full font-bold hover:bg-purple-600/10 transition backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.2)]"
              >
                İletişime Geç
              </Link>
            </div>

            {/* Sosyal İkonlar */}
            <div className="mt-12 flex gap-6 text-purple-200/50">
              <a href="https://github.com/metehanerkan" target="_blank" className="hover:text-white hover:scale-110 transition duration-300"><FaGithub size={28} /></a>
              <a href="https://www.linkedin.com/in/metehan-erkan-b9a52a1b8/" target="_blank" className="hover:text-blue-400 hover:scale-110 transition duration-300"><FaLinkedin size={28} /></a>
            </div>
          </div>
        </section>

        {/* --- SON PROJELER --- */}
        <section className="py-24 px-6 w-full relative z-20">
          {/* Bölüm ayırıcı çizgi de hafifletildi */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 bg-gradient-to-r from-purple-300 to-white bg-clip-text text-transparent drop-shadow-lg text-center md:text-left">
              Son Projelerim
            </h2>
            {featuredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400">Henüz proje eklenmedi.</p>
            )}
          </div>
        </section>

        {/* --- BLOG YAZILARI --- */}
        <section className="py-24 px-6 w-full relative z-20 pb-40">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 bg-gradient-to-r from-purple-300 to-white bg-clip-text text-transparent drop-shadow-lg text-center md:text-left">
              Blogdan Son Yazılar
            </h2>
            {recentBlogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recentBlogs.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400">Henüz yazı yayınlanmadı.</p>
            )}
          </div>
        </section>

      </div>
    </main>
  );
}