'use server' // BU SATIR ÇOK ÖNEMLİ: Bu kodun sunucuda çalışacağını belirtir.

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function addProject(formData: FormData) {
    // Formdan gelen verileri al
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const imageUrl = formData.get("imageUrl") as string
    const category = formData.get("category") as string
    const githubUrl = formData.get("githubUrl") as string

    // Teknolojileri virgülle ayırarak diziye çevir (Örn: "React, Next.js" -> ["React", "Next.js"])
    const techString = formData.get("technologies") as string
    const technologies = techString.split(",").map(t => t.trim())

    // Veritabanına kaydet
    await db.project.create({
        data: {
            title,
            description,
            imageUrl,
            category,
            technologies,
            githubUrl
        }
    })

    // Ana sayfayı yenile ki yeni proje hemen görünsün
    revalidatePath("/")

    // İşlem bitince admin sayfasına geri dön (Temizlensin)
    redirect("/admin")
}