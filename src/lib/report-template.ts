/**
 * HTML template for preliminary speech therapy assessment report.
 * Pure HTML/CSS — no React, no Recharts. Designed for server-side PDF generation.
 */

interface ReportData {
  childName: string;
  childAge: string;
  responsibleName: string;
  assessmentDate: string;
  // Development scores (0-100%)
  linguagemReceptiva: number;
  linguagemExpressiva: number;
  pragmatica: number;
  // Skills (0-5 scale)
  contatoVisual: number;
  atencaoCompartilhada: number;
  brincarSimbolico: number;
  interacaoSocial: number;
  imitacao: number;
  comunicacaoIntencional: number;
  // Clinical observations
  mainComplaint: string;
  pontosAtencao: string[];
  pontoForte: string;
  conclusao: string;
  // Treatment plan
  frequencia: string;
  duracao: string;
  duracaoInicial: string;
  foco: string;
  urgencia: string;
}

function bar(label: string, value: number, expected: number, color: string): string {
  const pct = Math.round((value / expected) * 100);
  return `
    <div style="margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;margin-bottom:4px">
        <span style="font-weight:600;color:#334155">${label}</span>
        <span style="font-weight:700;color:${color}">${pct}%</span>
      </div>
      <div style="background:#e2e8f0;border-radius:8px;height:16px;overflow:hidden;position:relative">
        <div style="background:${color};height:100%;width:${pct}%;border-radius:8px;transition:width 0.3s"></div>
      </div>
      <div style="font-size:11px;color:#94a3b8;margin-top:2px">${value} meses vs. ${expected} meses esperados</div>
    </div>`;
}

function skillBar(label: string, value: number, max: number): string {
  const pct = Math.round((value / max) * 100);
  const color = pct >= 60 ? "#4ade80" : pct >= 40 ? "#f59e0b" : "#ef4444";
  return `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
      <span style="width:180px;font-size:13px;color:#475569">${label}</span>
      <div style="flex:1;background:#e2e8f0;border-radius:6px;height:12px;overflow:hidden">
        <div style="background:${color};height:100%;width:${pct}%;border-radius:6px"></div>
      </div>
      <span style="font-size:12px;font-weight:600;color:#475569;width:36px;text-align:right">${value}/${max}</span>
    </div>`;
}

function impactBar(label: string, efficacy: number, color: string): string {
  return `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px">
      <span style="width:80px;font-size:13px;font-weight:500;color:#475569">${label}</span>
      <div style="flex:1;background:#e2e8f0;border-radius:6px;height:14px;overflow:hidden">
        <div style="background:${color};height:100%;width:${efficacy}%;border-radius:6px"></div>
      </div>
      <span style="font-size:13px;font-weight:600;width:40px;text-align:right">${efficacy}%</span>
    </div>`;
}

export function generateReportHTML(data: ReportData): string {
  const recPct = data.linguagemReceptiva;
  const expPct = data.linguagemExpressiva;
  const pragPct = data.pragmatica;

  // Estimated months based on percentages (assuming 30-month baseline)
  const recMonths = Math.round((recPct / 100) * 30);
  const expMonths = Math.round((expPct / 100) * 30);
  const pragPoints = Math.round((pragPct / 100) * 20);

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Relatório de Avaliação - ${data.childName}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; color: #334155; background: #f8fafc; line-height: 1.6; }
  .container { max-width: 800px; margin: 0 auto; background: white; }
  .header { background: linear-gradient(135deg, #4361ee, #3f37c9); color: white; padding: 32px; text-align: center; }
  .header h1 { font-size: 22px; margin-bottom: 6px; }
  .header .subtitle { opacity: 0.85; font-size: 15px; }
  .header-info { display: flex; justify-content: space-between; margin-top: 20px; }
  .header-info div { text-align: center; }
  .header-info .label { opacity: 0.7; font-size: 12px; }
  .header-info .value { font-weight: 600; font-size: 14px; }
  .section { padding: 24px 32px; }
  .section-title { font-size: 18px; font-weight: 700; color: #1e293b; margin-bottom: 16px; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; }
  .message-box { background: #eff6ff; border-left: 4px solid #4361ee; padding: 16px 20px; border-radius: 0 8px 8px 0; margin-bottom: 24px; }
  .message-box p { color: #1e40af; font-size: 14px; }
  .cards-row { display: flex; gap: 16px; margin-bottom: 24px; }
  .card { flex: 1; padding: 16px; border-radius: 12px; text-align: center; }
  .card .number { font-size: 28px; font-weight: 800; }
  .card .label { font-size: 12px; margin-top: 4px; }
  .card-blue { background: #eff6ff; border: 1px solid #bfdbfe; }
  .card-blue .number { color: #4361ee; }
  .card-blue .label { color: #1e40af; }
  .card-amber { background: #fffbeb; border: 1px solid #fde68a; }
  .card-amber .number { color: #d97706; }
  .card-amber .label { color: #92400e; }
  .interpretation { background: #fffbeb; border: 1px solid #fde68a; padding: 16px 20px; border-radius: 8px; margin-bottom: 16px; }
  .interpretation h3 { color: #92400e; font-size: 14px; margin-bottom: 8px; }
  .interpretation p { color: #a16207; font-size: 13px; }
  .attention-item { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 10px; }
  .attention-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; margin-top: 6px; }
  .dot-amber { background: #f59e0b; }
  .dot-green { background: #4ade80; }
  .projection-box { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 16px 20px; border-radius: 8px; margin-top: 16px; }
  .projection-box h3 { color: #166534; font-size: 14px; margin-bottom: 12px; }
  .projection-box p { color: #15803d; font-size: 13px; }
  .gain-row { display: flex; gap: 16px; margin-bottom: 12px; }
  .gain-item { flex: 1; text-align: center; }
  .gain-item .number { font-size: 24px; font-weight: 800; color: #16a34a; }
  .gain-item .label { font-size: 11px; color: #15803d; }
  .impact-box { background: #fffbeb; border: 1px solid #fde68a; padding: 16px 20px; border-radius: 8px; margin-top: 16px; }
  .impact-box h3 { color: #92400e; font-size: 14px; margin-bottom: 8px; }
  .impact-box p { color: #a16207; font-size: 13px; }
  .conclusion { border-top: 4px solid #4361ee; padding: 24px 32px; }
  .conclusion-title { text-align: center; font-size: 18px; font-weight: 700; margin-bottom: 20px; }
  .conclusion-grid { display: flex; gap: 16px; margin-bottom: 20px; }
  .conclusion-col { flex: 1; padding: 16px; border-radius: 8px; }
  .col-blue { background: #eff6ff; border: 1px solid #bfdbfe; }
  .col-green { background: #f0fdf4; border: 1px solid #bbf7d0; }
  .conclusion-col h3 { font-size: 14px; margin-bottom: 8px; }
  .col-blue h3 { color: #1e40af; }
  .col-green h3 { color: #166534; }
  .conclusion-col p, .conclusion-col li { font-size: 13px; }
  .col-blue p { color: #1e40af; }
  .col-green li { color: #15803d; }
  .final-note { background: #eff6ff; border: 1px solid #bfdbfe; padding: 16px 20px; border-radius: 8px; text-align: center; }
  .final-note h3 { color: #1e40af; font-size: 14px; margin-bottom: 8px; }
  .final-note p { color: #1e40af; font-size: 13px; }
  .footer { text-align: center; padding: 16px 32px; color: #94a3b8; font-size: 11px; border-top: 1px solid #e2e8f0; }
  ul { list-style: disc; padding-left: 20px; }
  li { margin-bottom: 4px; }
  @media print {
    body { background: white; }
    .container { box-shadow: none; }
  }
</style>
</head>
<body>
<div class="container">

  <!-- Header -->
  <div class="header">
    <h1>Relatório de Avaliação Fonoaudiológica</h1>
    <p class="subtitle">Análise de Potencial de Desenvolvimento e Projeção de Resultados</p>
    <div class="header-info">
      <div><p class="label">Paciente</p><p class="value">${data.childName}</p></div>
      <div><p class="label">Data da Avaliação</p><p class="value">${data.assessmentDate}</p></div>
      <div><p class="label">Idade</p><p class="value">${data.childAge}</p></div>
    </div>
  </div>

  <!-- Mensagem Personalizada -->
  <div class="section">
    <div class="message-box">
      <p>Cara família, este relatório foi elaborado com base na avaliação fonoaudiológica inicial realizada.
      Os dados apresentados mostram o perfil atual de desenvolvimento de <strong>${data.childName}</strong>
      e a <strong>projeção de resultados com intervenção fonoaudiológica especializada</strong>.
      Este documento tem como objetivo auxiliar na compreensão da importância da terapia e
      no planejamento do processo terapêutico.</p>
    </div>
  </div>

  <!-- Perfil Atual -->
  <div class="section">
    <h2 class="section-title">Perfil Atual de Desenvolvimento</h2>
    <div class="cards-row">
      <div class="card ${recPct >= 50 ? "card-blue" : "card-amber"}">
        <div class="number">${recPct}%</div>
        <div class="label">Linguagem Receptiva<br><small>${recMonths} vs. 30 meses esperados</small></div>
      </div>
      <div class="card ${expPct >= 50 ? "card-blue" : "card-amber"}">
        <div class="number">${expPct}%</div>
        <div class="label">Linguagem Expressiva<br><small>${expMonths} vs. 30 meses esperados</small></div>
      </div>
      <div class="card ${pragPct >= 50 ? "card-blue" : "card-amber"}">
        <div class="number">${pragPct}%</div>
        <div class="label">Pragmática<br><small>${pragPoints} vs. 20 pontos esperados</small></div>
      </div>
    </div>

    ${bar("Linguagem Receptiva", recMonths, 30, "#4361ee")}
    ${bar("Linguagem Expressiva", expMonths, 30, "#4361ee")}
    ${bar("Pragmática", pragPoints, 20, "#d97706")}

    <div class="interpretation">
      <h3>Interpretação do Perfil Atual</h3>
      <p>${data.conclusao || `A avaliação indica que ${data.childName} apresenta um <strong>atraso no desenvolvimento da fala e linguagem</strong>, atingindo entre ${Math.min(recPct, expPct, pragPct)}% e ${Math.max(recPct, expPct, pragPct)}% do esperado para sua idade em áreas fundamentais.`}</p>
    </div>
  </div>

  <!-- Habilidades -->
  <div class="section">
    <h2 class="section-title">Habilidades Comunicativas e Sociais</h2>
    <p style="font-size:13px;color:#64748b;margin-bottom:16px">Perfil atual de desenvolvimento (escala 0-5)</p>
    ${skillBar("Contato visual", data.contatoVisual, 5)}
    ${skillBar("Atenção compartilhada", data.atencaoCompartilhada, 5)}
    ${skillBar("Brincar simbólico", data.brincarSimbolico, 5)}
    ${skillBar("Interação social", data.interacaoSocial, 5)}
    ${skillBar("Imitação", data.imitacao, 5)}
    ${skillBar("Comunicação intencional", data.comunicacaoIntencional, 5)}

    <h3 style="font-size:15px;font-weight:600;color:#475569;margin:20px 0 12px">Pontos de Atenção</h3>
    ${data.pontosAtencao.map(p => `
      <div class="attention-item">
        <div class="attention-dot dot-amber"></div>
        <p style="font-size:13px;color:#475569">${p}</p>
      </div>
    `).join("")}
    <div class="attention-item">
      <div class="attention-dot dot-green"></div>
      <p style="font-size:13px;color:#475569"><strong>Ponto forte:</strong> ${data.pontoForte}</p>
    </div>
  </div>

  <!-- Projeção -->
  <div class="section">
    <h2 class="section-title">Projeção de Evolução com Terapia</h2>
    <p style="font-size:13px;color:#64748b;margin-bottom:16px">Comparativo de desenvolvimento projetado em 6 meses</p>

    <div class="projection-box">
      <h3>Potencial de Ganho com Intervenção</h3>
      <div class="gain-row">
        <div class="gain-item">
          <div class="number">+${Math.round((100 - recPct) * 0.5)}%</div>
          <div class="label">Linguagem Receptiva</div>
        </div>
        <div class="gain-item">
          <div class="number">+${Math.round((100 - expPct) * 0.55)}%</div>
          <div class="label">Linguagem Expressiva</div>
        </div>
        <div class="gain-item">
          <div class="number">+${Math.round((100 - pragPct) * 0.6)}%</div>
          <div class="label">Habilidades Sociais</div>
        </div>
      </div>
      <p>A intervenção fonoaudiológica especializada pode proporcionar ganhos significativos no desenvolvimento
      comunicativo de ${data.childName} nos próximos 6 meses, superiores ao desenvolvimento natural esperado sem terapia.</p>
    </div>
  </div>

  <!-- Impacto do Tempo -->
  <div class="section">
    <h2 class="section-title">Impacto do Tempo na Eficácia da Intervenção</h2>
    <p style="font-size:13px;color:#64748b;margin-bottom:16px">Relação entre início da terapia e potencial de resultados</p>
    ${impactBar("Imediato", 95, "#4ade80")}
    ${impactBar("3 meses", 85, "#a3e635")}
    ${impactBar("6 meses", 70, "#facc15")}
    ${impactBar("12 meses", 50, "#f97316")}
    ${impactBar("24 meses", 30, "#ef4444")}

    <div class="impact-box">
      <h3>Janela de Oportunidade</h3>
      <p>A <strong>neuroplasticidade</strong> é maior nos primeiros anos de vida.
      Considerando a idade atual de ${data.childName} (${data.childAge}), este é um momento extremamente favorável para intervenção.
      O adiamento pode reduzir significativamente o potencial de ganhos terapêuticos.</p>
    </div>
  </div>

  <!-- Conclusão -->
  <div class="conclusion">
    <h2 class="conclusion-title">Conclusão e Recomendações</h2>
    <div class="conclusion-grid">
      <div class="conclusion-col col-blue">
        <h3>Conclusão da Avaliação</h3>
        <p>A análise indica que ${data.childName} apresenta um quadro compatível com
        <strong>atraso no desenvolvimento da fala e linguagem</strong>.
        ${data.mainComplaint ? `A principal queixa relatada é: ${data.mainComplaint}.` : ""}
        A intervenção precoce é fundamental para maximizar os ganhos terapêuticos.</p>
      </div>
      <div class="conclusion-col col-green">
        <h3>Plano Terapêutico Recomendado</h3>
        <ul>
          <li>Frequência: ${data.frequencia}</li>
          <li>Duração da sessão: ${data.duracao}</li>
          <li>Duração inicial: ${data.duracaoInicial}</li>
          <li>Abordagem: Terapia individualizada</li>
          <li>Foco: ${data.foco}</li>
        </ul>
      </div>
    </div>

    <div class="final-note">
      <h3>Observações Finais</h3>
      <p>A urgência para início da intervenção fonoaudiológica é <strong>${data.urgencia}</strong>.
      Recomendamos iniciar o tratamento o mais breve possível.
      Orientações à família e escola serão fundamentais para complementar o processo terapêutico.</p>
    </div>
  </div>

  <div class="footer">
    <p>Dra. Graciele Cruz — CRFa 2-00000 — Fonoaudiologia Infantil Especializada</p>
    <p>Este relatório é confidencial e de uso exclusivo da família.</p>
  </div>

</div>
</body>
</html>`;
}

export type { ReportData };
