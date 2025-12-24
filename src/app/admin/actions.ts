'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function addProject(formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const category = formData.get('category') as string;
    const githubUrl = formData.get('githubUrl') as string;
    const liveUrl = formData.get('liveUrl') as string;


    const technologiesRaw = formData.get('technologies') as string;
    const technologies = technologiesRaw ? technologiesRaw.split(',').map(t => t.trim()) : [];

    await db.project.create({
        data: {
            title,
            description,
            imageUrl,
            category,
            githubUrl: githubUrl || null,
            liveUrl: liveUrl || null,
            technologies,
        },
    });

    revalidatePath('/');
    revalidatePath('/projects');
    revalidatePath('/admin');
}

export async function deleteProject(formData: FormData) {
    const id = formData.get('id') as string;
    await db.project.delete({ where: { id } });

    revalidatePath('/admin');
    revalidatePath('/projects');
    revalidatePath('/');
}

export async function addBlog(formData: FormData) {
    const title = formData.get('title') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const category = formData.get('category') as string;
    const readTime = formData.get('readTime') as string;

    await db.blogPost.create({
        data: {
            title,
            excerpt,
            content,
            imageUrl,
            category,
            readTime,
        },
    });

    revalidatePath('/blog');
    revalidatePath('/admin');
    revalidatePath('/');
}

export async function deleteBlog(formData: FormData) {
    const id = formData.get('id') as string;
    await db.blogPost.delete({ where: { id } });

    revalidatePath('/admin');
    revalidatePath('/blog');
    revalidatePath('/');
}

export async function deleteMessage(formData: FormData) {
    const id = formData.get('id') as string;
    await db.contactMessage.delete({ where: { id } });

    revalidatePath('/admin');
}
export async function toggleProjectStatus(id: string, currentStatus: boolean) {
    await db.project.update({
        where: { id },
        data: { isPublished: !currentStatus }
    });
    revalidatePath('/admin');
    revalidatePath('/projects');
    revalidatePath('/');
}

export async function toggleProjectFeatured(id: string, currentStatus: boolean) {
    await db.project.update({
        where: { id },
        data: { isFeatured: !currentStatus }
    });
    revalidatePath('/admin');
    revalidatePath('/');
}

export async function toggleBlogFeatured(id: string, currentStatus: boolean) {
    await db.blogPost.update({
        where: { id },
        data: { isFeatured: !currentStatus }
    });
    revalidatePath('/admin');
    revalidatePath('/');
}

export async function toggleBlogStatus(id: string, currentStatus: boolean) {
    await db.blogPost.update({
        where: { id },
        data: { isPublished: !currentStatus }
    });
    revalidatePath('/admin');
    revalidatePath('/blog');
    revalidatePath('/');
}

export async function updateProject(formData: FormData) {
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const category = formData.get('category') as string;
    const githubUrl = formData.get('githubUrl') as string;
    const liveUrl = formData.get('liveUrl') as string;

    const technologiesRaw = formData.get('technologies') as string;
    const technologies = technologiesRaw ? technologiesRaw.split(',').map(t => t.trim()) : [];

    await db.project.update({
        where: { id },
        data: {
            title,
            description,
            imageUrl,
            category,
            githubUrl: githubUrl || null,
            liveUrl: liveUrl || null,
            technologies,
        },
    });

    revalidatePath('/');
    revalidatePath('/projects');
    revalidatePath('/admin');
}

export async function updateBlog(formData: FormData) {
    const id = formData.get('id') as string;
    const title = formData.get('title') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const category = formData.get('category') as string;
    const readTime = formData.get('readTime') as string;

    await db.blogPost.update({
        where: { id },
        data: {
            title,
            excerpt,
            content,
            imageUrl,
            category,
            readTime,
        },
    });

    revalidatePath('/');
    revalidatePath('/blog');
    revalidatePath('/admin');
}