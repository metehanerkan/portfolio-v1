'use server';

import { db } from '@/lib/db';

export async function checkAccessCode(code: string) {
    if (!code) return { success: false };

    const project = await db.clientProject.findUnique({
        where: { accessCode: code },
    });

    if (project) {
        return { success: true };
    } else {
        return { success: false };
    }
}