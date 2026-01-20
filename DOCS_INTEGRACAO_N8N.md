# Arquitetura de Integração: Grafono + Agente WhatsApp (N8N)

**Status do Documento:** 🟢 Implementação Concluída / Pronto para Teste
**Data:** 18/01/2026
**Responsável:** Antigravity (IA Agent)

---

## 1. Visão Geral

**Objetivo:** Transformar o Agente WhatsApp (N8N) em um CRM simplificado e eficiente para a Clínica Graciele Fonoaudiologia, permitindo triagem, cadastro de leads e agendamento automático.

**Status Atual:**
Todos os endpoints necessários para o Agente foram implementados no Grafono e estão prontos para consumo.

---

## 2. API Routes Implementadas

Base URL: `https://[SEU-DOMINIO-VERCEL]/api/n8n`
**Segurança:** Todas as requisições exigem o Header `x-api-key` configurado no `.env` (`N8N_API_KEY`).

### A. Endpoints Essenciais

#### 1. `POST /api/n8n/patient/check`
*   **Função:** Verifica se o telefone já existe na base.
*   **Input:** `{ "phone": "5511999999999" }`
*   **Output:** `{ "exists": true, "patient": { ... } }` ou `{ "exists": false }`

#### 2. `POST /api/n8n/patient/lead`
*   **Função:** Cria um novo pré-cadastro (Lead).
*   **Input:**
    ```json
    {
      "name": "Maria Silva",
      "phone": "5511999999999",
      "origin": "WHATSAPP",
      "demand": "Atraso de fala"
    }
    ```
*   **Ação:** Cria paciente com status "Contato Inicial".

#### 3. `GET /api/n8n/calendar/slots`
*   **Função:** Retorna horários disponíveis.
*   **Input (Query):** `?date=2024-02-20`
*   **Output:**
    ```json
    {
      "date": "2024-02-20",
      "availableSlots": ["14:00", "14:30", "15:00"]
    }
    ```

#### 4. `POST /api/n8n/appointment`
*   **Função:** Cria o agendamento da avaliação.
*   **Input:**
    ```json
    {
      "patientId": "cuid...",
      "date": "2024-02-20T14:00:00",
      "type": "Avaliação Inicial"
    }
    ```

#### 5. `POST /api/n8n/interaction`
*   **Função:** Registra o resumo da conversa no histórico.
*   **Input:**
    ```json
    {
      "patientId": "cuid...",
      "type": "WHATSAPP_LOG",
      "content": "Cliente agendou avaliação para terça. Queixa principal: Troca de letras."
    }
    ```

---

## 3. Especificação Técnica (N8N - Agente)

### A. Tools do Agente (Sub-workflows)
O Agente AI no N8N deve ter acesso às seguintes ferramentas conectadas aos endpoints acima:

| Tool Name | Descrição para a AI | Ação (API) |
|---|---|---|
| `verificar_paciente` | "Use no início para buscar o paciente pelo telefone." | `POST /patient/check` |
| `criar_lead` | "Use para cadastrar um novo contato interessado." | `POST /patient/lead` |
| `consultar_horarios` | "Use para ver horários livres em uma data." | `GET /calendar/slots` |
| `agendar_avaliacao` | "Use quando o cliente confirmar o horário." | `POST /appointment` |
| `registrar_conversa` | "Use ao fim do atendimento para salvar resumo." | `POST /interaction` |

### B. System Prompt (Persona: Gabi)

```markdown
Você é a Gabi, assistente virtual da Clínica Graciele Fonoaudiologia.

## Seu Objetivo
Acolher famílias que buscam atendimento fonoaudiológico, com foco em empatia e eficiência.

## Fluxo de Atendimento Obrigatório
1. **Identificação:** Se o contexto não tiver dados do paciente, use `verificar_paciente` imediatamente.
2. **Novos Contatos:**
   - Pergunte o nome do responsável e da criança (se for o caso).
   - Registre usando `criar_lead`.
   - Investigue a queixa principal (ex: TEA, fala, escola).
3. **Pacientes Recorrentes:**
   - Cumprimente pelo nome.
   - Pergunte como pode ajudar hoje.

## Agendamento (Foco Principal)
- Quando houver interesse, use `consultar_horarios`.
- Ofereça sempre 2 ou 3 opções concretas.
- Ao confirmar, use `agendar_avaliacao`.
- Finalize enviando o link da anamnese: `https://grafono.com.br/anamnese` (Exemplo).

## Tom de Voz
- Acolhedor, profissional e seguro.
- Evite "tecniquês" fonoaudiológico desnecessário.
```

---

## 4. Configuração Final

1.  **Variável de Ambiente:** Certifique-se de adicionar `N8N_API_KEY=sua-chave-secreta` no arquivo `.env` do projeto e nas configurações da Vercel.
2.  **Webhooks N8N:** Configurar as chamadas HTTP com o Header `x-api-key`.

---

## 5. Checklist de Implementação (Passo a Passo)

### 1. Configuração de Ambiente (Environment Setup)
*   [ ] **Gerar API Key:** Crie uma senha forte (ex: UUID).
*   [ ] **Configurar Local:** Adicione `N8N_API_KEY` ao `.env`.
*   [ ] **Configurar Vercel:** Adicione `N8N_API_KEY` nas Variáveis de Ambiente e faça Redeploy.

### 2. N8N: Criar as 5 Tools
Crie nós HTTP Request para cada ação:

*   **[ ] Tool: verificar_paciente**
    *   POST `.../patient/check` | Body: `{phone}` | Header: `x-api-key`
*   **[ ] Tool: criar_lead**
    *   POST `.../patient/lead` | Body: `{name, phone, demand}`
*   **[ ] Tool: consultar_horarios**
    *   GET `.../calendar/slots?date=YYYY-MM-DD`
*   **[ ] Tool: agendar_avaliacao**
    *   POST `.../appointment` | Body: `{patientId, date, type}`
*   **[ ] Tool: registrar_conversa**
    *   POST `.../interaction` | Body: `{patientId, content, type}`

### 3. N8N: Atualizar o Agente
*   [ ] **System Prompt:** Atualizar com a Persona "Gabi" (Seção 3B).
*   [ ] **Conexão:** Conectar as 5 Tools ao Agente.
*   [ ] **Pré-processamento:** Adicionar nó HTTP `/check` antes do agente para injetar contexto.

### 4. Testes & Validação
*   [ ] **Fluxo Lead:** Testar contato novo -> Lead criado no Grafono.
*   [ ] **Agendamento:** Agendar -> Verificar na Agenda do Grafono.
*   [ ] **Fluxo Recorrente:** Contato existente -> Reconhecimento por nome.


---

## 7. Guia de Execução para Estagiário (Roteiro Prático)

*Atenção: Siga este roteiro na ordem exata. Se travar em algum passo, me chame.*

### **Fase 1: Preparando o Terreno (15 min)**
1.  **API Key:**
    *   Gere uma chave segura (pode usar um site gerador de UUID).
    *   Anote essa chave, você vai usar em todo lugar.
2.  **Configurar Variáveis:**
    *   No Vercel do projeto, vá em *Settings* -> *Environment Variables*.
    *   Crie uma chave chamada `N8N_API_KEY` e cole o valor que você gerou.
    *   Faça um **Redeploy** do projeto para garantir que a chave entre em vigor.
    *   *Teste:* Tente acessar `https://[DOMINIO]/api/n8n/calendar/slots?date=2024-01-01` pelo navegador. Deve dar erro de "Unauthorized" (isso é bom! significa que a proteção está funcionando).

### **Fase 2: Mão na Massa no N8N (1 hora)**
1.  **Acesse o N8N:** Abra o workflow do Agente que já existe.
2.  **Crie as Ferramentas (Tools):**
    *   Para cada endpoint listado na **Seção 2** e **Seção 6** deste documento, crie um nó "HTTP Request".
    *   **Importante:** Em todos eles, vá em *Headers* e adicione `x-api-key` com a sua cova chave.
    *   Nomeie os nós exatamente como: `verificar_paciente`, `criar_lead`, etc.
3.  **Conecte ao Agente:**
    *   No nó do Agente AI, procure a entrada "Tools" e arraste as conexões dos nós HTTP que você criou.

### **Fase 3: Cérebro do Agente (15 min)**
1.  **Atualizar o Prompt:**
    *   Abra o nó do Agente.
    *   Copie o texto da **Seção 3B (Persona Gabi)** deste documento.
    *   Substitua o texto que está lá hoje.
    *   *Atenção:* Onde tem o link da anamnese no texto, verifique se temos o link real. Se não, crie um Google Forms rápido pedindo "Nome, Queixa principal e Melhor horário", pegue o link e coloque lá.

### **Fase 4: Hora da Verdade (Testes)**
1.  Use seu próprio WhatsApp pessoal.
2.  Mande "Oi" para o bot.
    *   Ele perguntou seu nome? (Certo)
    *   Responda com nome e uma queixa fictícia (ex: "Meu filho não fala R").
3.  Vá no Dashboard do Grafono -> Menu Pacientes.
    *   Veja se apareceu um "Lead" novo com seu nome. (Se sim, Sucesso! 🎉)
4.  Pelo WhatsApp, peça para agendar.
    *   Veja se ele oferece horários.
    *   Confirme um.
    *   Veja se apareceu na Agenda do Grafono.

**Finalização:**
Se tudo funcionou, me avise para liberarmos para a equipe!

