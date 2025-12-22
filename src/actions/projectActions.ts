'use server' // <--- BU SİHİRLİ KOD. Bu kodun sunucuda çalışacağını garanti eder.

import { getAllProjectsFromDB } from '@/services/projectService';

export async function fetchProjects() {
    // Buraya güvenlik kontrolü ekleyebilirsin (Kullanıcı admin mi?)
    const projects = await getAllProjectsFromDB();
    return projects;
}