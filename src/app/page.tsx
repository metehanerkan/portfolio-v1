'use client';

import HeroTypewriter from '@/components/HeroTypewriter';
import Link from 'next/link';
import { FaGithub, FaLinkedin, FaArrowRight } from 'react-icons/fa';
import { projectsData } from '@/data/projects';
import { blogs } from '@/data/blogs';
import ProjectCard from '@/components/ProjectCard';
import BlogCard from '@/components/BlogCard';

export default function Home() {
  const featuredProjects = projectsData.slice(0, 3);
  const recentBlogs = blogs.slice(0, 3);

  return (
    <main className="min-h-screen bg-black text-white">

      <section className="h-screen flex flex-col justify-center items-center px-6 relative overflow-hidden text-center">


        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] -z-10 animate-pulse delay-1000"></div>

        <div className="max-w-4xl mx-auto w-full z-10 flex flex-col items-center">
          <h1 className="text-4xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-6 animate-gradient leading-tight py-2">
            Merhaba, Ben Metehan.
          </h1>
          <HeroTypewriter />
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
            Modern web teknolojileri ile ölçeklenebilir, kullanıcı dostu ve estetik dijital çözümler üretiyorum.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/projects"
              className="px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition transform hover:scale-105 flex items-center gap-2"
            >
              Projelerimi Gör <FaArrowRight />
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 bg-transparent border border-white/20 text-white rounded-full font-bold hover:bg-white/10 transition backdrop-blur-sm"
            >
              İletişime Geç
            </Link>
          </div>

          <div className="mt-12 flex gap-6 text-gray-400">
            <a href="https://github.com/metehanerkan" target="_blank" className="hover:text-white transition hover:scale-110"><FaGithub size={28} /></a>
            <a href="https://www.linkedin.com/in/metehan-erkan-b9a52a1b8/" target="_blank" className="hover:text-blue-400 transition hover:scale-110"><FaLinkedin size={28} /></a>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">

            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Son Projelerim
            </h2>

            <Link href="/projects" className="hidden md:flex items-center text-blue-400 hover:text-blue-300 transition">
              Tümünü Gör <FaArrowRight className="ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link href="/projects" className="text-blue-400 hover:text-blue-300 font-medium">
              Tüm Projeleri Gör →
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Blogdan Son Yazılar
            </h2>
            <Link href="/blog" className="hidden md:flex items-center text-blue-400 hover:text-blue-300 font-medium">
              Tüm Yazıları Oku <FaArrowRight className="ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentBlogs.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link href="/blog" className="text-green-400 hover:text-green-300 font-medium">
              Tüm Yazıları Oku →
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}