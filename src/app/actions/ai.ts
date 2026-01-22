"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { getPatientHistory } from "./patient";
import { db } from "@/lib/db";

// Initialize Gemini - Using gemini-2.0-flash-lite as primary model
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");
const AI_MODEL = "gemini-2.0-flash-lite"; // Options: gemini-2.0-flash-lite, gemini-2.0-flash, gemini-1.5-flash

export async function generateTherapyPlan(patientId: string, clinicalParams: {
    complexity: number;
    severity: number;
    frequency: string;
    diagnosis: string;
}) {
    try {
        // 1. Fetch Patient Context
        const patient = await db.patient.findUnique({
            where: { id: patientId },
            include: {
                assessments: {
                    orderBy: { date: 'desc' },
                    take: 2 // Last 2 assessments
                },
                reports: {
                    orderBy: { date: 'desc' },
                    take: 2 // Last 2 reports
                }
            }
        });

        if (!patient) {
            return { success: false, error: "Patient not found" };
        }

        // 2. Construct Prompt
        const model = genAI.getGenerativeModel({ model: AI_MODEL });

        const prompt = `
            Atue como um Especialista Fonoaudiólogo Sênior. Análise os dados do seguinte paciente e gere uma estimativa de tratamento.

            DADOS DO PACIENTE:
            - Nome: ${patient.name}
            - Data de Nascimento: ${patient.dateOfBirth?.toISOString().split('T')[0]}
            - Diagnóstico Principal: ${clinicalParams.diagnosis}
            
            CONFIGURAÇÃO CLÍNICA (Definida pelo Fonoaudiólogo):
            - Severidade: ${clinicalParams.severity}/10
            - Complexidade Cognitiva: ${clinicalParams.complexity}/5
            - Frequência Sugerida: ${clinicalParams.frequency}x por semana

            HISTÓRICO RECENTE:
            ${patient.assessments.map(a => `- Avaliação (${a.date.toISOString().split('T')[0]}): ${a.title} - ${a.status}`).join('\n')}
            ${patient.reports.map(r => `- Relatório (${r.type} - ${r.date.toISOString().split('T')[0]}): ${r.title}`).join('\n')}

            TAREFA:
            Com base nesses dados (especialmente severidade e diagnóstico), gere um plano de tratamento estruturado.
            
            RETORNE APENAS UM JSON VÁLIDO com o seguinte formato, sem markdown:
            {
                "estimatedMonths": number,
                "totalSessions": number,
                "successChance": number (0-100),
                "shortTermGoal": "string (objetivo curto e direto)",
                "cognitiveFocus": "string (foco cognitivo principal)",
                "explanation": "string (breve justificativa)"
            }
        `;

        // 3. Call AI
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        // 4. Parse JSON
        // Clean markdown code blocks if present
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(jsonString);

        return { success: true, data };

    } catch (error) {
        console.error("AI Generation Error:", error);
        return { success: false, error: "Failed to generate plan. Please check API Key and try again." };
    }
}

export async function generateMetricsInsights(metrics: any) {
    try {
        const model = genAI.getGenerativeModel({ model: AI_MODEL });

        const prompt = `
            Atue como um Consultor de Gestão de Clínicas de Fonoaudiologia. Analise os seguintes KPIs mensais e sugira melhorias.

            DADOS FINAIS DO MÊS:
            - Pacientes Ativos: ${metrics.activePatients}
            - Sessões Realizadas: ${metrics.sessions}
            - Faturamento: ${metrics.revenue}
            - Taxa de Presença: ${metrics.attendanceRate}
            - Distribuição por Patologia: ${JSON.stringify(metrics.pathologies)}

            TAREFA:
            Identifique pontos de atenção (ex: baixa retenção, faturamento abaixo do potencial, nicho pouco explorado) e sugira 3 ações práticas.

            RETORNE APENAS UM JSON VÁLIDO:
            {
                "analysis": "Visão geral curta e direta (máx 2 linhas)",
                "suggestions": [
                    {
                        "title": "Título da Ação (ex: Otimizar Agenda)",
                        "description": "Explicação prática do que fazer."
                    }
                ]
            }
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(jsonString);

        return { success: true, data };

    } catch (error) {
        console.error("AI Insights Error:", error);
        return { success: false, error: "Failed to generate insights." };
    }
}

export async function generateGenericInsight(contextName: string, contextData: any, userPrompt?: string) {
    try {
        const model = genAI.getGenerativeModel({ model: AI_MODEL });

        const startPrompt = userPrompt
            ? `O usuário fez uma pergunta específica sobre a tela/contexto "${contextName}": "${userPrompt}"`
            : `Atue como um Especialista/Consultor analisando a tela/contexto "${contextName}".`;

        const prompt = `
            ${startPrompt}

            DADOS DO CONTEXTO ATUAL (JSON):
            ${JSON.stringify(contextData, null, 2)}

            TAREFA:
            1. Analise os dados fornecidos.
            2. ${userPrompt ? 'Responda à pergunta do usuário usando os dados.' : 'Identifique insights, tendências, gargalos ou oportunidades.'}
            3. Seja prático, direto e profissional.

            RETORNE APENAS UM JSON VÁLIDO (sem markdown):
            {
                "title": "Título do Insight ou Resposta",
                "analysis": "Análise/Resposta detalhada (pode usar markdown simples se necessário, mas evite blocos de código complexos)",
                "suggestions": [
                    {
                        "title": "Ação Sugerida 1",
                        "description": "Como implementar..."
                    },
                    {
                        "title": "Ação Sugerida 2",
                        "description": "..."
                    }
                ]
            }
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Clean markdown
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const data = JSON.parse(jsonString);

        return { success: true, data };

    } catch (error) {
        console.error("AI Generic Insight Error:", error);
        return { success: false, error: "Falha ao gerar insights." };
    }
}
