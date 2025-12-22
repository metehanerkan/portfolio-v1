
export async function getAllProjectsFromDB() {
    // Veritabanından projeleri çek
    return await db.project.findMany();
}

export async function createProjectInDB(data: any) {
    // Validasyon yap (Backend kuralı)
    if (!data.title) throw new Error("Başlık sız olmaz!");
    return await db.project.create({ data });
}