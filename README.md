# 🚀 Metehan.dev - Next Generation Portfolio & Client Portal

**Metehan.dev** is a high-performance, full-stack personal portfolio and client management system built with the latest web technologies. It serves as both a professional showcase for software engineering work and a centralized hub for managing client relationships, content, and system settings.

This project goes beyond a static site; it is a dynamic web application featuring a powerful admin dashboard, real-time analytics, and a dedicated client portal.

---

## 🌟 Key Features

### 🎨 Modern & Responsive UI
*   **"Industrial Surgical" Aesthetic:** A premium, dark-themed design language featuring glassmorphism, subtle gradients, and neon accents.
*   **Fully Responsive:** Optimized for all devices, from large desktop monitors to mobile phones.
*   **Advanced Animations:** Smooth transitions and micro-interactions powered by **Framer Motion**.
*   **Custom Components:** Bespoke UI elements including a Modal-based PDF CV Viewer, Typewriter effects, and interactive project cards.

### 🛠️ Powerful Admin Dashboard
A robust, password-protected command center to manage every aspect of the application without touching code:
*   **Content Management (CMS):** Create, edit, and delete **Portfolio Projects** and **Blog Posts** with full Markdown support.
*   **Site Settings:** Dynamically update SEO metadata (Title, Description), Footer text, Contact info, and Social links directly from the UI.
*   **CV Management:** Upload and update your CV (PDF) instantly using drag-and-drop zones (powered by **Uploadthing**).
*   **Analytics & Logs:** View real-time system logs and traffic statistics charts (powered by **Recharts**).
*   **Skill Management:** Update showcased technical skills via a JSON editor.

### 💼 Integrated Client Portal
A dedicated, secure area for freelance clients to track their project's lifecycle:
*   **Project Tracking:** Clients can log in with a unique access code to view their project status (e.g., "Designing", "Development", "Testing").
*   **Progress Visualization:** Visual progress bars and status indicators.
*   **Feedback Loop:** Mechanisms for clients to request changes or approve milestones.

### 🌍 System & Architecture
*   **Internationalization (i18n):** Built-in routing and structure for multi-language support (`[lang]` architecture).
*   **SEO Optimized:** Dynamic metadata generation based on database settings, ensuring optimal search engine visibility.
*   **Server-Side Rendering (SSR):** Leverages Next.js App Router for blazing-fast page loads and SEO benefits.
*   **Database Driven:** All data (projects, blogs, settings, logs) is persistent and managed via **PostgreSQL**.

---

## 🏗️ Technology Stack

This project is built on a cutting-edge stack designed for scalability, performance, and developer experience.

### Core Framework
*   **[Next.js 16](https://nextjs.org/):** The React framework for the web, utilizing the App Router architecture for Server Components and Server Actions.
*   **[React 19](https://react.dev/):** The latest version of the library for building user interfaces.
*   **[TypeScript](https://www.typescriptlang.org/):** Static type checking for robust and error-free code.

### Styling & UI
*   **[Tailwind CSS](https://tailwindcss.com/):** A utility-first CSS framework for rapid UI development.
*   **[Framer Motion](https://www.framer.com/motion/):** Production-ready animation library for React.
*   **[React Icons](https://react-icons.github.io/react-icons/):** Comprehensive icon library.

### Backend & Database
*   **[Prisma ORM](https://www.prisma.io/):** Next-generation Node.js and TypeScript ORM for interacting with the database.
*   **[PostgreSQL](https://www.postgresql.org/):** Advanced open-source relational database.
*   **[Uploadthing](https://uploadthing.com/):** Easiest way to handle file uploads in Next.js.
*   **[Resend](https://resend.com/):** Email API for transactional emails (Contact form integration).
*   **[Jose](https://github.com/panva/jose):** "JSON Web Almost Everything" - for secure JWT handling and authentication.
*   **[React Markdown](https://github.com/remarkjs/react-markdown):** For rendering Markdown content safely.

### Tools & Utilities
*   **[Recharts](https://recharts.org/):** Composable charting library for React (used in Analytics).
*   **[React Hot Toast](https://react-hot-toast.com/):** Lightweight notifications for user feedback.
*   **[Vercel Analytics](https://vercel.com/analytics):** Privacy-friendly web analytics.

---

## 🔒 Security

*   **Admin Authentication:** Secure, session-based access to the admin panel.
*   **Rate Limiting:** Protection against abuse on public-facing APIs.
*   **Input Validation:** Robust type checking and validation on all server actions.

---

<br>
<br>

# 🇹🇷 Metehan.dev - Yeni Nesil Portfolyo & Müşteri Portalı

**Metehan.dev**, en son web teknolojileriyle oluşturulmuş yüksek performanslı, full-stack bir kişisel portfolyo ve müşteri yönetim sistemidir. Bu proje, hem yazılım mühendisliği çalışmalarım için profesyonel bir vitrin hem de müşteri ilişkilerini, içerikleri ve sistem ayarlarını yönetmek için merkezi bir merkez olarak hizmet verir.

Bu proje statik bir siteden çok daha fazlasıdır; güçlü bir admin paneli, gerçek zamanlı analizler ve özel bir müşteri portalı içeren dinamik bir web uygulamasıdır.

---

## 🌟 Temel Özellikler

### 🎨 Modern & Responsive Arayüz (UI)
*   **"Endüstriyel Cerrahi" Estetiği:** Glassmorphism, hafif gradyanlar ve neon vurgular içeren premium, koyu temalı bir tasarım dili.
*   **Tamamen Duyarlı (Responsive):** Büyük masaüstü monitörlerinden cep telefonlarına kadar tüm cihazlar için optimize edilmiştir.
*   **Gelişmiş Animasyonlar:** **Framer Motion** ile güçlendirilmiş pürüzsüz geçişler ve mikro etkileşimler.
*   **Özel Bileşenler:** Modal tabanlı PDF CV Görüntüleyici, Daktilo (Typewriter) efektleri ve etkileşimli proje kartları dahil olmak üzere özel UI öğeleri.

### 🛠️ Güçlü Yönetici (Admin) Paneli
Uygulamanın her yönünü kodlara dokunmadan yönetmek için güçlü, şifre korumalı bir komuta merkezi:
*   **İçerik Yönetimi (CMS):** Tam Markdown desteği ile **Portfolyo Projeleri** ve **Blog Yazıları** oluşturun, düzenleyin ve silin.
*   **Site Ayarları:** SEO meta verilerini (Başlık, Açıklama), Footer metnini, İletişim bilgilerini ve Sosyal medya bağlantılarını doğrudan arayüzden dinamik olarak güncelleyin.
*   **CV Yönetimi:** Sürükle-bırak alanlarını kullanarak CV'nizi (PDF) anında yükleyin ve güncelleyin (**Uploadthing** destekli).
*   **Analizler & Loglar:** Gerçek zamanlı sistem günlüklerini ve trafik istatistik grafiklerini görüntüleyin (**Recharts** destekli).
*   **Yetenek Yönetimi:** Sergilenen teknik becerileri JSON editörü aracılığıyla güncelleyin.

### 💼 Entegre Müşteri Portalı
Serbest çalışan (freelance) müşterilerin proje yaşam döngülerini takip etmeleri için özel, güvenli bir alan:
*   **Proje Takibi:** Müşteriler, proje durumlarını (örn: "Tasarım", "Geliştirme", "Test") görüntülemek için benzersiz bir erişim kodu ile giriş yapabilirler.
*   **İlerleme Görselleştirme:** Görsel ilerleme çubukları ve durum göstergeleri.
*   **Geri Bildirim Döngüsü:** Müşterilerin değişiklik talep etmesi veya aşamaları onaylaması için mekanizmalar.

### 🌍 Sistem & Mimari
*   **Uluslararasılaştırma (i18n):** Çoklu dil desteği için yerleşik yönlendirme ve yapı (`[lang]` mimarisi).
*   **SEO Optimize Edilmiş:** Veritabanı ayarlarına dayalı dinamik meta veri oluşturma, arama motorlarında optimum görünürlük sağlar.
*   **Sunucu Taraflı İşleme (SSR):** Işık hızında sayfa yüklemeleri ve SEO avantajları için Next.js App Router'dan yararlanır.
*   **Veritabanı Destekli:** Tüm veriler (projeler, bloglar, ayarlar, loglar) kalıcıdır ve **PostgreSQL** üzerinden yönetilir.

---

## 🏗️ Teknoloji Yığını

Bu proje, ölçeklenebilirlik, performans ve geliştirici deneyimi için tasarlanmış son teknoloji bir yığın üzerine inşa edilmiştir.

### Temel Çatı (Framework)
*   **[Next.js 16](https://nextjs.org/):** Web için React çerçevesi; Server Components ve Server Actions için App Router mimarisini kullanır.
*   **[React 19](https://react.dev/):** Kullanıcı arayüzleri oluşturmak için kütüphanenin en son sürümü.
*   **[TypeScript](https://www.typescriptlang.org/):** Sağlam ve hatasız kod için statik tip kontrolü.

### Stil & Arayüz
*   **[Tailwind CSS](https://tailwindcss.com/):** Hızlı UI geliştirme için "utility-first" CSS çerçevesi.
*   **[Framer Motion](https://www.framer.com/motion/):** React için prodüksiyona hazır animasyon kütüphanesi.
*   **[React Icons](https://react-icons.github.io/react-icons/):** Kapsamlı ikon kütüphanesi.

### Backend & Veritabanı
*   **[Prisma ORM](https://www.prisma.io/):** Veritabanı ile etkileşim için yeni nesil Node.js ve TypeScript ORM.
*   **[PostgreSQL](https://www.postgresql.org/):** Gelişmiş açık kaynaklı ilişkisel veritabanı.
*   **[Uploadthing](https://uploadthing.com/):** Next.js'de dosya yüklemelerini yönetmenin en kolay yolu.
*   **[Resend](https://resend.com/):** İşlemsel e-postalar için E-posta API'si (İletişim formu entegrasyonu).
*   **[Jose](https://github.com/panva/jose):** Güvenli JWT işlemleri ve kimlik doğrulama için kütüphane.
*   **[React Markdown](https://github.com/remarkjs/react-markdown):** Markdown içeriğini güvenli bir şekilde işlemek için.

### Araçlar & Yardımcılar
*   **[Recharts](https://recharts.org/):** React için şekillendirilebilir grafik kütüphanesi (Analizlerde kullanılır).
*   **[React Hot Toast](https://react-hot-toast.com/):** Kullanıcı geri bildirimleri için hafif bildirim sistemi.
*   **[Vercel Analytics](https://vercel.com/analytics):** Gizlilik dostu web analizleri.

---

## 🔒 Güvenlik

*   **Yönetici Kimlik Doğrulaması:** Yönetici paneline güvenli, oturum tabanlı erişim.
*   **Hız Sınırlaması (Rate Limiting):** Halka açık API'lerde kötüye kullanıma karşı koruma.
*   **Girdi Doğrulama:** Tüm sunucu eylemlerinde (server actions) sağlam tip kontrolü ve doğrulama.

---

*Built with ❤️ by [Metehan Erkan](https://metehanerkan.vercel.app)*
