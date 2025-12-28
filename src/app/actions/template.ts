"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getTemplates(userId: string) {
    try {
        const templates = await db.template.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' }
        });
        return { success: true, data: templates };
    } catch (error) {
        console.error("Error fetching templates:", error);
        return { success: false, error: "Failed to fetch templates" };
    }
}

export async function createTemplate(userId: string, data: {
    title: string;
    content: string;
    category: string;
}) {
    try {
        const template = await db.template.create({
            data: {
                ...data,
                userId
            }
        });
        revalidatePath("/modelos");
        return { success: true, data: template };
    } catch (error) {
        console.error("Error creating template:", error);
        return { success: false, error: "Failed to create template" };
    }
}

export async function updateTemplate(id: string, data: {
    title?: string;
    content?: string;
    category?: string;
}) {
    try {
        const template = await db.template.update({
            where: { id },
            data
        });
        revalidatePath("/modelos");
        return { success: true, data: template };
    } catch (error) {
        console.error("Error updating template:", error);
        return { success: false, error: "Failed to update template" };
    }
}

export async function deleteTemplate(id: string) {
    try {
        await db.template.delete({
            where: { id }
        });
        revalidatePath("/modelos");
        return { success: true };
    } catch (error) {
        console.error("Error deleting template:", error);
        return { success: false, error: "Failed to delete template" };
    }
}

export async function getTemplateById(id: string) {
    try {
        const template = await db.template.findUnique({
            where: { id }
        });
        return { success: true, data: template };
    } catch (error) {
        console.error("Error fetching template:", error);
        return { success: false, error: "Failed to fetch template" };
    }
}
