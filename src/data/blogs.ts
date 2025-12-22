import { BlogPost } from "@/types"; // Tipleri merkezi dosyadan çekiyoruz

export const blogs: BlogPost[] = [
    {
        id: "1",
        title: "Yazılıma Nereden Başlamalı?",
        excerpt: "Kodlama dünyasına adım atmak istiyor ama hangi dilden başlayacağını bilmiyor musun? İşte sana özel yol haritası.",
        date: "20 Aralık 2025",
        readTime: "5 dk",
        category: "Kariyer",
        imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop",
        content: `
Yazılıma başlamak karmaşık gelebilir ama doğru haritayla çok kolaydır.

## 1. Hangi Dili Seçmeliyim?
Piyasadaki popüler diller şunlardır:
- **Python**: Yapay zeka ve veri bilimi için harikadır. Okuması İngilizceye çok yakındır.
- **JavaScript**: Web geliştirme (Frontend & Backend) için vazgeçilmezdir.
- **C# / Java**: Kurumsal firmalar ve mobil uygulama geliştirmek için idealdir.

## Örnek Kod Bloğu
Python ile basit bir "Merhaba Dünya" şöyle yazılır:

\`\`\`python
def selam_ver(isim):
    print(f"Merhaba {isim}, hoş geldin!")

selam_ver("Metehan")
\`\`\`

## Sonuç
Sabırlı olun, bol bol pratik yapın ve hata yapmaktan korkmayın. Yazılım bir maratondur, sprint değil.
    `,
    },
    {
        id: "2",
        title: "Next.js 15 ile Gelen Yenilikler",
        excerpt: "React dünyasının en popüler framework'ü yine değişti. Server Actions ve App Router hakkında bilmen gereken her şey.",
        date: "22 Aralık 2025",
        readTime: "8 dk",
        category: "Teknoloji",
        imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop",
        content: `
Next.js 15, performans ve geliştirici deneyimi açısından devrim niteliğinde özelliklerle geldi.

## Server Actions Nedir?
Artık API route yazmadan, doğrudan sunucu tarafında çalışan fonksiyonları Client bileşenlerinden çağırabiliyoruz. Bu, form işlemlerini inanılmaz hızlandırıyor.

## App Router
Eski \`pages\` yapısı yerine gelen \`app\` klasörü yapısı, Layout yönetimini ve veri çekme (Data Fetching) işlemlerini çok daha mantıklı bir hale getirdi.

\`\`\`typescript
// Örnek bir Server Component
async function getData() {
  const res = await fetch('https://api.example.com/...');
  return res.json();
}
\`\`\`
    `,
    },
    {
        id: "3",
        title: "Temiz Kod (Clean Code) Nasıl Yazılır?",
        excerpt: "Sadece bilgisayarın değil, insanların da anlayabileceği kod yazmak neden önemlidir?",
        date: "25 Aralık 2025",
        readTime: "6 dk",
        category: "Yazılım",
        imageUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1000&auto=format&fit=crop",
        content: `
Kod yazmak bir sanattır. Yazdığınız kod sadece çalışmamalı, aynı zamanda okunabilir olmalıdır.

## Neden Önemli?
Bir projeye 6 ay sonra döndüğünüzde "Bunu ben mi yazdım?" dememek için temiz kod kurallarına uymalısınız.

### Temel Prensipler
1. **İsimlendirme:** Değişken isimleri anlamlı olmalı. \`a = 5\` yerine \`userAge = 5\` kullanın.
2. **Fonksiyonlar:** Bir fonksiyon sadece tek bir iş yapmalı.
3. **Yorum Satırları:** Kodu açıklamak yerine, kodun kendisini açıklayıcı yazın. Yorumları sadece "Neden?" sorusuna cevap vermek için kullanın.
    `,
    }
];