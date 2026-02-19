import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkN8NAuth, unauthorizedResponse } from "@/lib/n8n-auth";
import { generateReportHTML, type ReportData } from "@/lib/report-template";

// POST /api/n8n/report/generate
// Generates a screening report from form responses
// Can be called by n8n or by the system after form submission
export async function POST(req: NextRequest) {
    if (!checkN8NAuth(req)) {
        return unauthorizedResponse();
    }

    try {
        const body = await req.json();
        const { formResponseId, phone, reportData } = body;

        if (!formResponseId && !phone) {
            return NextResponse.json(
                { error: "formResponseId or phone required" },
                { status: 400 }
            );
        }

        // Find the form response
        let formResponse;
        if (formResponseId) {
            formResponse = await db.formResponse.findUnique({
                where: { id: formResponseId },
            });
        } else {
            formResponse = await db.formResponse.findFirst({
                where: { phone: { contains: phone.replace(/\D/g, "") } },
                orderBy: { createdAt: "desc" },
            });
        }

        if (!formResponse) {
            return NextResponse.json(
                { error: "Form response not found" },
                { status: 404 }
            );
        }

        const responses = formResponse.responses as Record<string, string>;

        // Build report data from form responses + optional overrides
        const data: ReportData = {
            childName: formResponse.childName,
            childAge: reportData?.childAge || calculateAge(formResponse.childBirthDate),
            responsibleName: formResponse.responsibleName,
            assessmentDate: reportData?.assessmentDate || new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
            // Scores — can be provided by Graciele or auto-estimated from form
            linguagemReceptiva: reportData?.linguagemReceptiva ?? estimateFromForm(responses, "receptiva"),
            linguagemExpressiva: reportData?.linguagemExpressiva ?? estimateFromForm(responses, "expressiva"),
            pragmatica: reportData?.pragmatica ?? estimateFromForm(responses, "pragmatica"),
            // Skills
            contatoVisual: reportData?.contatoVisual ?? estimateSkill(responses, "contato_visual"),
            atencaoCompartilhada: reportData?.atencaoCompartilhada ?? estimateSkill(responses, "atencao"),
            brincarSimbolico: reportData?.brincarSimbolico ?? estimateSkill(responses, "brincar"),
            interacaoSocial: reportData?.interacaoSocial ?? estimateSkill(responses, "interacao"),
            imitacao: reportData?.imitacao ?? estimateSkill(responses, "imitacao"),
            comunicacaoIntencional: reportData?.comunicacaoIntencional ?? estimateSkill(responses, "comunicacao"),
            // Clinical
            mainComplaint: responses["Qual é sua principal preocupação em relação à comunicação do seu filho(a)?"] || reportData?.mainComplaint || "",
            pontosAtencao: reportData?.pontosAtencao || generateAttentionPoints(responses),
            pontoForte: reportData?.pontoForte || "Intenção comunicativa e interesse pelo brincar",
            conclusao: reportData?.conclusao || "",
            // Treatment plan
            frequencia: reportData?.frequencia || "1x por semana",
            duracao: reportData?.duracao || "60 minutos",
            duracaoInicial: reportData?.duracaoInicial || "5 meses (com reavaliação)",
            foco: reportData?.foco || "Estimulação da linguagem e aprimoramento da inteligibilidade da fala",
            urgencia: reportData?.urgencia || "alta",
        };

        const html = generateReportHTML(data);

        // Find or create patient link
        let patientId = formResponse.patientId;
        if (!patientId) {
            const patient = await db.patient.findFirst({
                where: { phone: { contains: formResponse.phone } },
                select: { id: true },
            });
            patientId = patient?.id || null;
        }

        // Save report
        const report = await db.report.create({
            data: {
                title: `Relatório de Triagem - ${formResponse.childName}`,
                type: "Avaliação",
                status: "Rascunho",
                date: new Date(),
                content: html,
                patientId: patientId || undefined,
            },
        });

        // Update form response status
        await db.formResponse.update({
            where: { id: formResponse.id },
            data: {
                status: "report_generated",
                reportUrl: `/report/${report.id}`,
            },
        });

        const baseUrl = process.env.NEXTAUTH_URL || "https://gra-fono.vercel.app";

        return NextResponse.json({
            success: true,
            reportId: report.id,
            reportUrl: `${baseUrl}/report/${report.id}`,
            childName: formResponse.childName,
            responsibleName: formResponse.responsibleName,
        });
    } catch (error) {
        console.error("Report Generate Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

function calculateAge(birthDate: string | null): string {
    if (!birthDate) return "Idade não informada";
    const birth = new Date(birthDate);
    const now = new Date();
    const years = now.getFullYear() - birth.getFullYear();
    const months = now.getMonth() - birth.getMonth();
    const totalMonths = years * 12 + months;
    const y = Math.floor(totalMonths / 12);
    const m = totalMonths % 12;
    if (y === 0) return `${m} meses`;
    if (m === 0) return `${y} ano${y > 1 ? "s" : ""}`;
    return `${y} ano${y > 1 ? "s" : ""} e ${m} mes${m > 1 ? "es" : ""}`;
}

// Estimate language scores from form responses (heuristic)
function estimateFromForm(responses: Record<string, string>, area: string): number {
    const wordCount = responses["Quantas palavras seu filho(a) usa atualmente para se comunicar?"] || "";
    const phrases = responses["Seu filho(a) consegue formar frases?"] || "";
    const comprehension = responses["Seu filho(a) compreende comandos e instruções simples?"] || "";

    let score = 50; // baseline

    if (area === "receptiva") {
        if (comprehension.includes("compreende bem")) score = 70;
        else if (comprehension.includes("simples")) score = 55;
        else if (comprehension.includes("dificuldade")) score = 40;
        else if (comprehension.includes("não parece")) score = 25;
    } else if (area === "expressiva") {
        if (wordCount.includes("200")) score = 70;
        else if (wordCount.includes("50")) score = 55;
        else if (wordCount.includes("10")) score = 40;
        else if (wordCount.includes("Nenhuma") || wordCount.includes("Menos de 10")) score = 25;

        if (phrases.includes("frases completas")) score = Math.min(score + 15, 80);
        else if (phrases.includes("duas palavras")) score = Math.min(score + 5, 65);
    } else if (area === "pragmatica") {
        const eyeContact = responses["Com que frequência seu filho(a) olha nos olhos quando você fala com ele(a)?"] || "";
        const interaction = responses["Como seu filho(a) interage com outras crianças?"] || "";
        if (eyeContact.includes("Sempre") || eyeContact.includes("frequentemente")) score = 65;
        else if (eyeContact.includes("vezes")) score = 45;
        else if (eyeContact.includes("Raramente")) score = 30;
        if (interaction.includes("ativamente")) score = Math.min(score + 10, 75);
        else if (interaction.includes("paralela")) score = Math.min(score - 5, 50);
    }

    return score;
}

function estimateSkill(responses: Record<string, string>, skill: string): number {
    const eyeContact = responses["Com que frequência seu filho(a) olha nos olhos quando você fala com ele(a)?"] || "";
    const name = responses["Seu filho(a) responde quando chamado pelo nome?"] || "";
    const interaction = responses["Como seu filho(a) interage com outras crianças?"] || "";
    const pretend = responses["Seu filho(a) brinca de faz-de-conta ou imitação?"] || "";
    const request = responses["Como seu filho(a) costuma pedir algo que deseja?"] || "";

    switch (skill) {
        case "contato_visual":
            if (eyeContact.includes("Sempre")) return 5;
            if (eyeContact.includes("frequentemente")) return 4;
            if (eyeContact.includes("vezes")) return 3;
            if (eyeContact.includes("Raramente")) return 2;
            return 1;
        case "atencao":
            if (name.includes("Sempre")) return 4;
            if (name.includes("maioria")) return 3;
            if (name.includes("vezes")) return 2;
            return 1;
        case "brincar":
            if (pretend.includes("regularmente") || pretend.includes("criativa")) return 4;
            if (pretend.includes("simples")) return 3;
            if (pretend.includes("início")) return 2;
            return 1;
        case "interacao":
            if (interaction.includes("ativamente")) return 4;
            if (interaction.includes("paralela")) return 3;
            if (interaction.includes("observa")) return 2;
            return 1;
        case "imitacao":
            if (pretend.includes("criativa")) return 4;
            if (pretend.includes("regularmente")) return 3;
            if (pretend.includes("simples")) return 2;
            return 1;
        case "comunicacao":
            if (request.includes("palavras") || request.includes("frases")) return 4;
            if (request.includes("gestos e sons")) return 3;
            if (request.includes("aponta") || request.includes("puxa")) return 2;
            return 1;
        default:
            return 3;
    }
}

function generateAttentionPoints(responses: Record<string, string>): string[] {
    const points: string[] = [];
    const complaint = responses["Qual é sua principal preocupação em relação à comunicação do seu filho(a)?"] || "";
    const words = responses["Quantas palavras seu filho(a) usa atualmente para se comunicar?"] || "";
    const comprehension = responses["Seu filho(a) compreende comandos e instruções simples?"] || "";
    const pretend = responses["Seu filho(a) brinca de faz-de-conta ou imitação?"] || "";

    if (words.includes("Nenhuma") || words.includes("Menos de 10")) {
        points.push("Comunicação expressiva muito limitada — vocabulário reduzido");
    } else if (words.includes("10 e 50")) {
        points.push("Vocabulário expressivo abaixo do esperado para a idade");
    }

    if (comprehension.includes("dificuldade") || comprehension.includes("não parece")) {
        points.push("Compreensão verbal reduzida — dificuldade com comandos");
    }

    if (pretend.includes("Não") || pretend.includes("início")) {
        points.push("Brincar simbólico reduzido — impacta desenvolvimento comunicativo");
    }

    if (complaint) {
        points.push(`Queixa principal: ${complaint}`);
    }

    return points.length > 0 ? points : ["Avaliação detalhada necessária para identificar pontos específicos"];
}
