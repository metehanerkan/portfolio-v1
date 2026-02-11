import { db } from '@/lib/db';
import HeroTypewriter from '@/components/HeroTypewriter';
import Link from 'next/link';
import { FaGithub, FaLinkedin, FaArrowRight } from 'react-icons/fa';
import ProjectCard from '@/components/ProjectCard';
import BlogCard from '@/components/BlogCard';
import { Locale, getDictionary } from '@/dictionaries';
import Orb from '@/components/Orb';

export const dynamic = 'force-dynamic';

export default async function Home({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const dict = getDictionary(lang);

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
    <main className="min-h-screen w-full relative bg-background transition-colors duration-300">

      {/* --- SABİT ARKA PLAN KATMANI (HAFİFLETİLMİŞ IŞIK EFEKTLERİ) --- */}
      {/* --- SABİT ARKA PLAN KATMANI (HAFİFLETİLMİŞ IŞIK EFEKTLERİ) --- */}


      {/* --- LIGHT MODE BACKGROUND (Optional: Subtle gradient for light mode) --- */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none block dark:hidden bg-gradient-to-b from-purple-50/50 to-white"></div>


      {/* --- İÇERİK ALANI --- */}
      <div className="relative z-10 flex flex-col items-center w-full">

        {/* HERO SECTION */}
        {/* pt-24 -> pt-16 (Yazılar yukarı taşındı) */}
        <section className="min-h-screen w-full flex flex-col items-center justify-center px-4 pt-1 relative">
          <div className="absolute top-[35%] md:top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 opacity-50 pointer-events-none w-full max-w-[500px] md:max-w-[700px] lg:max-w-[1080px] aspect-square flex items-center justify-center">
            {/* Added mask-image to blend Orb edges seamlessly into background */}
            <div className="w-full h-full relative" style={{ maskImage: 'radial-gradient(circle, black 60%, transparent 100%)', WebkitMaskImage: 'radial-gradient(circle, black 60%, transparent 100%)' }}>
              <Orb
                hue={310}
                hoverIntensity={0.3}
                rotateOnHover
                forceHoverState={false}
                backgroundColor="#030014"
              />
            </div>
          </div>

          <div className="max-w-4xl mx-auto w-full flex flex-col items-center text-center">


            {/* Başlık */}
            <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 leading-tight ">
              {dict.home.hello}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-purple-600 to-purple-400 dark:from-white dark:to-purple-300">{dict.home.iam}</span>
            </h1>

            {/* Typewriter */}
            <div className="mb-8">
              <HeroTypewriter words={dict.home.typewriter} />
            </div>

            {/* Açıklama */}
            <p className="text-gray-600 dark:text-purple-100/70 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed drop-shadow-sm">
              {dict.home.desc}
            </p>

            {/* Butonlar */}
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href={`/${lang}/projects`}
                className="px-8 py-4 bg-gray-900 text-white dark:bg-white dark:text-black rounded-full font-bold hover:bg-gray-700 dark:hover:bg-gray-200 transition transform hover:scale-105 flex items-center gap-2 shadow-sm"
              >
                {dict.common.viewProjects} <FaArrowRight />
              </Link>
              <Link
                href={`/${lang}/contact`}
                className="px-8 py-4 bg-purple-100/50 border border-purple-500/30 text-purple-900 dark:text-white dark:bg-purple-600/5 rounded-full font-bold hover:bg-purple-200/50 dark:hover:bg-purple-600/10 transition backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.2)]"
              >
                {dict.common.contactMe}
              </Link>
            </div>

            {/* Sosyal İkonlar */}
            <div className="mt-12 flex gap-6 text-gray-500 dark:text-purple-200/50">
              <a href="https://github.com/metehanerkan" target="_blank" className="hover:text-black dark:hover:text-white hover:scale-110 transition duration-300"><FaGithub size={28} /></a>
              <a href="https://www.linkedin.com/in/metehan-erkan-b9a52a1b8/" target="_blank" className="hover:text-blue-600 dark:hover:text-blue-400 hover:scale-110 transition duration-300"><FaLinkedin size={28} /></a>
            </div>
          </div>
        </section>

        {/* --- SON PROJELER --- */}
        <section className="py-24 px-6 w-full relative z-20">
          {/* Bölüm ayırıcı çizgi de hafifletildi */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-300 dark:to-white bg-clip-text text-transparent drop-shadow-lg text-center md:text-left">
              {dict.home.latestProjects}
            </h2>
            {featuredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} /> // NOTE: ProjectCard still might have hardcoded text
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400">{dict.home.noProjects}</p>
            )}
          </div>
        </section>

        {/* --- BLOG YAZILARI --- */}
        <section className="py-24 px-6 w-full relative z-20 pb-40">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 bg-gradient-to-r from-purple-600 to-purple-800 dark:from-purple-300 dark:to-white bg-clip-text text-transparent drop-shadow-lg text-center md:text-left">
              {dict.home.latestBlogs}
            </h2>
            {recentBlogs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recentBlogs.map((post) => (
                  <BlogCard key={post.id} post={post} /> // NOTE: BlogCard still might have hardcoded text
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400">{dict.home.noBlogs}</p>
            )}
          </div>
        </section>

      </div>
    </main>
  );
}