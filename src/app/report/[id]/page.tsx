import { db } from "@/lib/db";
import { notFound } from "next/navigation";

/**
 * Public report viewer page.
 * Content is server-generated HTML from our own template (report-template.ts),
 * never user-provided, so dangerouslySetInnerHTML is safe here.
 */
export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const report = await db.report.findUnique({
        where: { id },
        select: { content: true, title: true, status: true },
    });

    if (!report || !report.content) {
        notFound();
    }

    // Content is generated server-side from our own template — safe to render
    return (
        <div
            dangerouslySetInnerHTML={{ __html: report.content }}
            style={{ minHeight: "100vh" }}
        />
    );
}
