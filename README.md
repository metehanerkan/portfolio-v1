# 🚀 Metehan Erkan | Personal Portfolio & Blog Architecture

> **Modern Web Teknolojileri ve Özgün Tasarımın Birleşimi.**
> Bu proje, standart bir portfolyo sitesinin ötesinde; Next.js 14 App Router mimarisi, Server Actions ve güçlü bir Admin Yönetim Paneli içeren full-stack bir web uygulamasıdır.

<div align="center">

[![Live Demo](https://img.shields.io/badge/Canlı_Demo-Visit_Site-7c3aed?style=for-the-badge&logo=vercel)]([https://metehanerkan.vercel.app](https://portfolio-v1-eta-taupe.vercel.app/))
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-Styling-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## 💡 Proje Hakkında & Vizyon

Bu proje, sadece yeteneklerimi sergilemek için değil, aynı zamanda **ölçeklenebilir**, **yönetilebilir** ve **yüksek performanslı** bir web mimarisi kurma yetkinliğimi göstermek amacıyla geliştirilmiştir. Hazır şablonlar yerine, veritabanı şemasından UI bileşenlerine kadar her satır kod, modern "Deep Purple & Neon" tasarım dili ve "Clean Code" prensipleriyle yazılmıştır.

---

## 🏗️ Teknik Mimari ve Kullanılan Teknolojiler

Proje, **Full-Stack** bir yaklaşım ile Next.js ekosistemi üzerine inşa edilmiştir.

### 🎨 Frontend (Arayüz)
* **Next.js 14 (App Router):** En güncel React mimarisi kullanılarak Client ve Server bileşenleri optimize edildi.
* **Tailwind CSS:** Özel renk paletleri (Deep Purple/Neon) ve responsive tasarım.
* **Framer Motion:** Sayfa geçişleri, scroll animasyonları ve etkileşimli mikro-animasyonlar.
* **Glassmorphism UI:** Modern, buzlu cam efektleri ve "Spotlight" ışıklandırma teknikleri.

### ⚙️ Backend & Veri Yönetimi
* **Server Actions:** API route'ları yazmadan, form işlemlerini ve veri mutasyonlarını sunucu tarafında güvenli bir şekilde işleme.
* **Prisma ORM:** Tip güvenli veritabanı sorguları.
* **Middleware:** Rota koruması ve header manipülasyonu.

### 🛡️ Güvenlik ve Yönetim
* **Custom Admin Panel:** CMS kullanmadan sıfırdan yazılan, içerik yönetim sistemi.
* **Session Management:** Cookie tabanlı güvenli oturum yönetimi.
* **Maintenance Mode System:** Veritabanı ve Middleware entegrasyonu ile tüm siteyi tek tıkla bakıma alma özelliği.

---

## 🔥 Öne Çıkan Özellikler

### 1. Dinamik Bakım Modu Sistemi
Sıradan statik sitelerin aksine, bu projede geliştirdiğim sistem sayesinde kod değiştirmeden site "Bakım Moduna" alınabilir.
* **Nasıl Çalışır?** Admin panelinden tetiklenen bir switch, veritabanındaki durumu günceller. `Middleware` ve `Layout`, gelen isteği analiz eder; eğer bakım modu aktifse ve kullanıcı admin değilse, özel tasarlanmış **"Maintenance Page"** arayüzüne yönlendirir.

### 2. Gelişmiş Admin Paneli
Site içeriğini yönetmek için harici bir dashboard'a ihtiyaç duymaz.
* **Özellikler:**
    * Proje Ekleme/Silme/Düzenleme.
    * Blog Yazısı Yönetimi (Markdown desteği).
    * Site Ayarları ve Global Konfigürasyon.
    * Neon/Dark tema ile uyumlu yönetim arayüzü.

### 3. SEO ve Performans
* Dinamik Meta Etiketleri (Next.js Metadata API).
* OpenGraph Görselleri.
* Vercel Analytics ile kullanıcı takibi.
