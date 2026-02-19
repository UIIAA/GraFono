# Pipeline de Avaliacao Inicial - Proximos Passos

**Status:** Em Progresso
**Prioridade:** P0
**Data:** 2026-02-17
**Contexto:** Fluxo completo de captacao, triagem, relatorio e follow-up via WhatsApp + Email (Gabi + n8n)

---

## Visao Geral do Pipeline

```
Mae entra em contato (WhatsApp)
    |
    v
[ETAPA 1] Gabi coleta dados basicos (nome, idade filho, queixa)  ✅ JA FUNCIONA
    |
    v
[ETAPA 2] Gabi envia link do Google Forms (ja existe)             ✅ JA EXISTE
    |
    v
[ETAPA 3] Mae preenche formulario → Webhook dispara               🔧 PROXIMO
    |
    v
[ETAPA 4] Sistema valida respostas + vincula ao contato            🔧 A FAZER
    |
    v
[ETAPA 5] Sistema gera relatorio PDF (HTML template pronto)       🔧 A FAZER
    |
    v
[ETAPA 6] Relatorio vai para Graciele revisar (via WhatsApp)      🔧 A FAZER
    |
    v
[ETAPA 7] Graciele aprova → Relatorio enviado a mae               🔧 A FAZER
    |
    v
[ETAPA 8] Mae entra no CRM como Lead (criar_lead ja existe)       ⚡ PARCIAL
    |
    v
[ETAPA 9] Se X dias sem contato → Follow-up (Email + WhatsApp)    🔧 A FAZER
    |
    v
[ETAPA 10] Agendamento da avaliacao presencial                    ✅ JA FUNCIONA
```

---

## Feature 1: Google Forms - Formulario de Triagem

**Status:** ✅ PRONTO
**Nota:** O formulario ja existe e a Gabi ja envia o link para a mae via WhatsApp.

**Pendencia:** User precisa fornecer o link do Google Forms para configurar o webhook.

---

## Feature 2: Webhook do Google Forms → n8n

**O que:** Capturar respostas do formulario automaticamente quando a mae preenche
**Status:** 🔧 PROXIMO PASSO

### Comportamento
1. Mae preenche o Google Forms
2. Google Forms dispara webhook para n8n
3. n8n recebe os dados e vincula ao telefone da mae
4. Dados ficam salvos (Redis ou DB) para consulta

### Implementacao Tecnica
- **Opcao A (recomendada):** Google Apps Script no Forms → POST webhook para n8n
  - Vantagem: controle total, inclui todos os campos
  - Script: `onFormSubmit` trigger → `UrlFetchApp.fetch(webhookUrl, payload)`
- **Opcao B:** n8n Google Forms Trigger node
  - Vantagem: sem codigo no Google
  - Desvantagem: requer credencial Google OAuth no n8n
- **Campo chave:** Telefone da mae no formulario (para vincular ao contato WhatsApp)

### Webhook payload esperado
```json
{
  "phone": "5511999999999",
  "motherName": "Amanda Ferreira",
  "childName": "Theo",
  "childAge": "5 anos",
  "mainComplaint": "Atraso na fala",
  "responses": { ... todas as respostas ... },
  "timestamp": "2026-02-17T10:30:00Z",
  "formId": "google-form-id"
}
```

### Pendencia do User
- **Link do Google Forms** — necessario para configurar o Apps Script

---

## Feature 3: Validacao de Resposta do Formulario

**O que:** Gabi precisa saber se a mae ja respondeu o formulario
**Status:** 🔧 A FAZER (depende da Feature 2)

### Comportamento
1. Gabi envia o link do formulario
2. Quando a mae responde → webhook salva no sistema
3. Se a mae diz "ja preenchi" → Gabi consulta tool `verificar_formulario`
4. Se respondido: Gabi continua o fluxo (relatorio, agendamento)
5. Se NAO respondido: Gabi pede gentilmente para verificar

### Implementacao Tecnica
- **Novo endpoint:** GET /api/n8n/form/check?phone=XXXXX
- **Nova tool n8n:** `verificar_formulario` (toolHttpRequest)
- **Retorno:** `{ respondido: true/false, dataResposta: "2026-02-17", respostas: {...} }`
- **Storage:** Salvar respostas no banco (Prisma) vinculadas ao Patient ou em tabela separada

---

## Feature 4: Geracao de Relatorio PDF

**O que:** Gerar relatorio PDF a partir das respostas do formulario, usando HTML template existente
**Status:** 🔧 A FAZER — **HTML template ja existe** (user vai colocar na pasta do projeto)

### Comportamento
1. Respostas do formulario chegam ao sistema (via Feature 2)
2. Sistema preenche o template HTML com os dados
3. HTML → PDF (renderizacao)
4. PDF salvo e vinculado ao paciente
5. URL do PDF disponivel para envio

### Implementacao Tecnica
- **Template HTML:** User vai fornecer (colocar em `docs/templates/` ou `src/templates/`)
- **Endpoint:** POST /api/n8n/report/generate
- **Input:** phone ou patientId + dados do formulario
- **Output:** URL do PDF gerado
- **Geracao PDF:** Playwright HTML→PDF (ja temos Playwright no projeto) ou puppeteer
- Possivel uso de AI (Google Generative AI) para enriquecer observacoes

### Pendencia do User
- **HTML do relatorio** — colocar na pasta do projeto para analise

---

## Feature 5: Aprovacao pela Graciele (via WhatsApp)

**O que:** Graciele recebe o relatorio via WhatsApp para revisar antes de enviar a mae
**Status:** 🔧 A FAZER (depende da Feature 4)

### Comportamento
1. Relatorio PDF gerado automaticamente
2. Gabi envia mensagem para Graciele via WhatsApp (Cloud API):
   > "Novo relatorio de triagem pronto para revisao:
   > Paciente: Theo (mae: Amanda Ferreira)
   > [PDF anexo ou link para visualizar]
   > Responda APROVAR para enviar, ou AJUSTAR + suas observacoes"
3. Graciele responde "APROVAR" → sistema envia PDF para mae via WhatsApp
4. Graciele responde "AJUSTAR precisa incluir X" → sistema regenera e reenvia para aprovacao

### Implementacao Tecnica
- Mensagem para Graciele via Cloud API (numero profissional1: +55 11 99155-6534)
- Controle de estado: `relatorio_pendente_aprovacao` no Redis/DB
- Detectar resposta de Graciele no pipeline (diferenciar de msgs normais)
- Enviar PDF via WhatsApp Cloud API (media message)

### Regras de Negocio
- Graciele SEMPRE revisa antes do envio (nunca automatico)
- Timeout: se Graciele nao responder em 24h, lembrete automatico
- Historico de aprovacoes salvo no sistema

---

## Feature 6: Follow-up Automatico (Email + WhatsApp)

**O que:** Se a mae nao entrar em contato apos X dias, enviar follow-up por EMAIL e WHATSAPP
**Status:** 🔧 A FAZER

### Comportamento
1. Lead criado no CRM com data de ultimo contato
2. Cron job (n8n Schedule Trigger) roda diariamente
3. Verifica leads com status "Lead" e ultimo contato > X dias
4. Envia follow-up por **Email** E **WhatsApp** simultaneamente:

   **WhatsApp:**
   > "Oi [Nome]! Aqui e a Gabi, assistente da Dra. Graciele.
   > Passando para saber se ficou alguma duvida sobre a avaliacao do [Nome filho].
   > Estamos com horarios disponiveis esta semana.
   > Gostaria de agendar a avaliacao inicial presencial?"

   **Email:**
   > Assunto: "Avaliacao Fonoaudiologica - [Nome filho]"
   > Corpo: versao mais formal com dados da clinica, CTA para agendar

5. Se mae responder (por qualquer canal) → conversa normal com Gabi
6. Se nao responder apos mais Y dias → segundo follow-up (diferente)
7. Maximo de 2-3 follow-ups, depois marca como "Frio" no CRM

### Implementacao Tecnica
- **Novo endpoint:** GET /api/n8n/patient/stale-leads?days=7
- **n8n workflow separado:** "Follow-up Automatico"
  - Schedule Trigger (diario, 10h)
  - HTTP Request → GET /stale-leads
  - Loop → Para cada lead:
    - Enviar WhatsApp (Cloud API)
    - Enviar Email (n8n Send Email node ou Gmail API)
  - Registrar interacao (registrar_conversa)

### Regras de Follow-up
| Dias sem contato | Acao |
|------------------|------|
| 3 dias | Mensagem leve: "ficou alguma duvida?" |
| 7 dias | Mensagem com urgencia suave: "temos horarios esta semana" |
| 14 dias | Ultima tentativa: "reservamos um horario especial" |
| 21+ dias | Marca como "Frio" no CRM, para de enviar |

### Configuracoes
- Horario de envio: 10h (comercial)
- Nunca enviar sabado/domingo
- Follow-up max: 3 tentativas

### Pendencia do User
- **Servico de email** da Graciele — Gmail profissional? Outlook? (necessario para configurar envio)

---

## Ordem de Implementacao

1. **Webhook Forms** (Feature 2) — base para tudo, precisa do link do Forms
2. **Validacao de resposta** (Feature 3) — Gabi sabe se mae preencheu
3. **Relatorio PDF** (Feature 4) — precisa do HTML template do user
4. **Aprovacao Graciele** (Feature 5) — via WhatsApp
5. **Follow-up automatico** (Feature 6) — email + WhatsApp

---

## Pendencias do User (para proxima sessao)

- [ ] **Link do Google Forms** — para configurar webhook (Apps Script)
- [ ] **HTML do relatorio** — colocar em pasta do projeto (ex: `docs/templates/relatorio-triagem.html`)
- [ ] **Servico de email** — qual email Graciele usa? (Gmail, Outlook, etc.)

---

## Dependencias Externas

- [ ] Google Apps Script configurado no Forms
- [ ] Definir dias de follow-up com Graciele
- [ ] Cloud API configurada para envio de media (PDF via WhatsApp)

---

## Notas Tecnicas

- Workflow principal: `Xo8zakpYB5BtqR69` (V11 Dual Provider) — NAO poluir com follow-up
- Follow-up deve ser workflow n8n separado
- API key compartilhada: `grafono-n8n-2026-a7b3c9d4e5f6`
- Pipeline principal (Gabi) testado e funcionando end-to-end (exec 34827)
- Agent: GPT-4o com Tools Agent v1.6, 7 tools autenticadas
- Todas as tools com `valueProvider: "fieldValue"` nos headers
