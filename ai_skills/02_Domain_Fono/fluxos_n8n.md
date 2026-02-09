# Fluxos N8N & WhatsApp Integration

## Description
Complete n8n integration architecture for Grafono's WhatsApp automation via Gabi AI Agent. Defines the API contract between Next.js serverless backend and n8n workflows running at code.escaladaonline.com.br, powered by Z-API for WhatsApp messaging, Redis for queue management, and Claude AI for conversational intelligence.

## Persona
**Role:** Integration Architect / API Contract Designer
**Mindset:** "The API is the contract. The agent is the interface. The database is the truth."
**Mantra:** "Every endpoint is a promise. Every tool call is an action. Every interaction is logged."

## Technical Grounding (The "Brain")
> *Auto-generated Research Notes:*
> * **Platform:** n8n (code.escaladaonline.com.br) + Next.js API Routes (Vercel Serverless).
> * **Base Workflow:** V7 (ID: Xo8zakpYB5BtqR69) with 27 nodes.
> * **Pipeline:** Z-API Webhook → Redis Queue → Audio Transcription (if needed) → Context Injection → AI Agent (Claude) → Z-API Response.
> * **Auth:** Header-based `x-api-key` validation via `checkN8NAuth()` from `src/lib/n8n-auth.ts`.
> * **Agent Persona:** Gabi - Assistente Virtual da Clínica Graciele Fonoaudiologia.
> * **AI Tools:** HTTP Request Tool nodes connected to 8 endpoints (5 existing + 3 new).

## Context & Rules
*   **Project:** Grafono WhatsApp Integration.
*   **Non-Negotiables:**
    1.  **API First:** ALL n8n tools must map to documented API endpoints. No direct DB access from n8n.
    2.  **Auth Layer:** Every endpoint validates `x-api-key` header. Unauthorized returns 401.
    3.  **Atomic Logging:** Every conversation gets logged in PatientHistory. No untracked interactions.
    4.  **Gabi Protocol:** Agent follows strict flow: Identificação → Qualificação → Agendamento → Confirmação → Log.

## Endpoint Reference (API Contract)

### 1. `POST /api/n8n/patient/check`
**Purpose:** Verify if patient exists by phone number.

**Input:**
```json
{
  "phone": "5511987654321"
}
```

**Output (Exists):**
```json
{
  "exists": true,
  "patient": {
    "id": "uuid",
    "name": "Maria Silva",
    "status": "Em Terapia",
    "createdAt": "2024-01-15T10:00:00Z",
    "phone": "5511987654321"
  }
}
```

**Output (Not Found):**
```json
{
  "exists": false,
  "patient": null
}
```

**Code Pattern:**
```typescript
import { db } from "@/lib/db";
import { checkN8NAuth, unauthorizedResponse } from "@/lib/n8n-auth";

export async function POST(req: NextRequest) {
    if (!checkN8NAuth(req)) return unauthorizedResponse();

    const { phone } = await req.json();

    const patients = await db.patient.findMany({
        where: { phone: { contains: phone } },
        select: { id: true, name: true, status: true, createdAt: true, phone: true },
        take: 1
    });

    return NextResponse.json({
        exists: patients.length > 0,
        patient: patients[0] || null
    });
}
```

---

### 2. `POST /api/n8n/patient/lead`
**Purpose:** Create new lead patient from WhatsApp contact.

**Input:**
```json
{
  "name": "João Santos",
  "phone": "5511912345678",
  "demand": "Dificuldade de fala do filho de 4 anos",
  "origin": "WhatsApp Orgânico"
}
```

**Output:**
```json
{
  "success": true,
  "patient": {
    "id": "uuid",
    "name": "João Santos",
    "status": "Novo Lead"
  }
}
```

**Side Effects:**
- Creates Patient with status "Novo Lead"
- Creates PatientHistory entry: "Lead criado via WhatsApp/N8N. Demanda: {demand}"

**Code Pattern:**
```typescript
const patient = await db.patient.create({
    data: {
        name, phone,
        gender: "Indefinido",
        dateOfBirth: new Date(),
        status: "Novo Lead",
        observations: demand ? `Demanda: ${demand}` : ""
    }
});

await db.patientHistory.create({
    data: {
        patientId: patient.id,
        content: `Lead criado via WhatsApp/N8N. ${demand ? `Demanda: ${demand}` : ""}`,
        date: new Date()
    }
});
```

---

### 3. `GET /api/n8n/calendar/slots`
**Purpose:** Get available appointment slots for a specific date.

**Query Params:**
- `date` (required): `YYYY-MM-DD` format

**Example:** `/api/n8n/calendar/slots?date=2024-02-15`

**Output:**
```json
{
  "date": "2024-02-15",
  "day": "THU",
  "availableSlots": ["09:00", "09:30", "14:00", "14:30", "15:00"]
}
```

**Logic:**
1. Fetch AvailabilityConfig (working days, hours, session duration)
2. Fetch existing Appointments for the date
3. Generate all potential slots (30min intervals by default)
4. Filter occupied slots (where `apt.time === slot`)
5. Exclude lunch break if configured

---

### 4. `POST /api/n8n/appointment`
**Purpose:** Create new appointment.

**Input:**
```json
{
  "patientId": "uuid",
  "date": "2024-02-15T14:00:00",
  "type": "Avaliação Inicial"
}
```

**Output:**
```json
{
  "success": true,
  "appointment": {
    "id": "uuid",
    "date": "2024-02-15T14:00:00Z",
    "status": "Agendado"
  }
}
```

**Code Pattern:**
```typescript
const appointmentDate = new Date(date);
const timeStr = format(appointmentDate, "HH:mm");

const appointment = await db.appointment.create({
    data: {
        patientId,
        date: appointmentDate,
        time: timeStr,
        type: type || "Avaliação Inicial",
        status: "Agendado",
        location: "Presencial"
    }
});
```

---

### 5. `POST /api/n8n/interaction`
**Purpose:** Log conversation summary to PatientHistory.

**Input:**
```json
{
  "patientId": "uuid",
  "content": "Paciente solicitou agendamento para quinta-feira às 14h. Confirmado.",
  "type": "whatsapp_interaction"
}
```

**Output:**
```json
{
  "success": true
}
```

**Code Pattern:**
```typescript
await db.patientHistory.create({
    data: {
        patientId,
        content,
        date: new Date()
    }
});
```

---

### 6. `PATCH /api/n8n/appointment/{id}` (NEW)
**Purpose:** Update or cancel existing appointment.

**Input:**
```json
{
  "status": "Cancelado",
  "date": "2024-02-16T15:00:00",
  "time": "15:00",
  "notes": "Reagendado a pedido do paciente"
}
```

**Output:**
```json
{
  "success": true,
  "appointment": {
    "id": "uuid",
    "status": "Cancelado",
    "date": "2024-02-16T15:00:00Z"
  }
}
```

**Code Template:**
```typescript
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    if (!checkN8NAuth(req)) return unauthorizedResponse();

    const { status, date, time, notes } = await req.json();

    const appointment = await db.appointment.update({
        where: { id: params.id },
        data: {
            ...(status && { status }),
            ...(date && { date: new Date(date) }),
            ...(time && { time }),
            ...(notes && { observations: notes })
        }
    });

    return NextResponse.json({ success: true, appointment });
}
```

---

### 7. `GET /api/n8n/patient/{id}` (NEW)
**Purpose:** Get patient details with next appointment.

**Example:** `/api/n8n/patient/uuid-123`

**Output:**
```json
{
  "patient": {
    "id": "uuid",
    "name": "Maria Silva",
    "phone": "5511987654321",
    "status": "Em Terapia",
    "negotiatedValue": 250.00
  },
  "nextAppointment": {
    "id": "apt-uuid",
    "date": "2024-02-20T14:00:00Z",
    "type": "Terapia",
    "status": "Agendado"
  }
}
```

**Code Template:**
```typescript
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    if (!checkN8NAuth(req)) return unauthorizedResponse();

    const patient = await db.patient.findUnique({
        where: { id: params.id },
        select: { id: true, name: true, phone: true, status: true, negotiatedValue: true }
    });

    const nextAppointment = await db.appointment.findFirst({
        where: {
            patientId: params.id,
            status: "Agendado",
            date: { gte: new Date() }
        },
        orderBy: { date: 'asc' },
        select: { id: true, date: true, type: true, status: true }
    });

    return NextResponse.json({ patient, nextAppointment });
}
```

---

### 8. `GET /api/n8n/patient/{id}/appointments` (NEW)
**Purpose:** List patient appointments with filters.

**Query Params:**
- `status` (optional): "Agendado" | "Realizado" | "Cancelado"
- `limit` (optional): Number (default: 5)

**Example:** `/api/n8n/patient/uuid/appointments?status=Agendado&limit=3`

**Output:**
```json
{
  "appointments": [
    {
      "id": "apt-1",
      "date": "2024-02-20T14:00:00Z",
      "type": "Terapia",
      "status": "Agendado"
    },
    {
      "id": "apt-2",
      "date": "2024-02-22T10:00:00Z",
      "type": "Terapia",
      "status": "Agendado"
    }
  ],
  "total": 2
}
```

**Code Template:**
```typescript
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    if (!checkN8NAuth(req)) return unauthorizedResponse();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "5");

    const appointments = await db.appointment.findMany({
        where: {
            patientId: params.id,
            ...(status && { status })
        },
        orderBy: { date: 'desc' },
        take: limit,
        select: { id: true, date: true, type: true, status: true }
    });

    return NextResponse.json({ appointments, total: appointments.length });
}
```

---

## Tool Mapping Table (n8n AI Agent)

| Tool Name | Descrição PT | Endpoint | Method | Uso Principal |
|-----------|-------------|----------|--------|---------------|
| `verificar_paciente` | Buscar paciente pelo telefone | `/api/n8n/patient/check` | POST | Identificar se contato já existe |
| `criar_lead` | Cadastrar novo contato como Lead | `/api/n8n/patient/lead` | POST | Converter contato novo em paciente |
| `consultar_horarios` | Ver horários disponíveis para agendamento | `/api/n8n/calendar/slots` | GET | Listar slots antes de agendar |
| `agendar_avaliacao` | Criar novo agendamento | `/api/n8n/appointment` | POST | Confirmar horário escolhido |
| `atualizar_agendamento` | Atualizar/cancelar consulta existente | `/api/n8n/appointment/{id}` | PATCH | Reagendar ou cancelar |
| `consultar_paciente` | Buscar dados completos do paciente | `/api/n8n/patient/{id}` | GET | Obter contexto antes de responder |
| `consultar_agendamentos` | Listar agendamentos do paciente | `/api/n8n/patient/{id}/appointments` | GET | Verificar histórico ou próximas consultas |
| `registrar_conversa` | Salvar resumo da interação | `/api/n8n/interaction` | POST | Logging obrigatório ao final |

---

## Webhook Architecture (N8N Pipeline)

```
┌─────────────┐
│  Z-API      │  WhatsApp Webhook (incoming message/audio)
│  Webhook    │
└──────┬──────┘
       │
       v
┌─────────────┐
│  Redis      │  Queue management (deduplication, retry)
│  Queue      │
└──────┬──────┘
       │
       v
┌─────────────┐
│  Audio?     │  If message.type === "audio"
│  Transcribe │  → Use transcription service (Whisper/Assembly AI)
└──────┬──────┘
       │
       v
┌─────────────┐
│  Context    │  Inject patient history + clinic info
│  Injection  │  "Você é Gabi, assistente da Clínica..."
└──────┬──────┘
       │
       v
┌─────────────┐
│  AI Agent   │  Claude with HTTP Request Tools
│  (Gabi)     │  System Prompt + 8 Tools Available
└──────┬──────┘
       │
       v
┌─────────────┐
│  Z-API      │  Send response back to WhatsApp
│  Response   │
└─────────────┘
```

**Key Nodes:**
- **Webhook Trigger:** Listens to Z-API POST events
- **Redis Set:** Store message ID to prevent duplicates
- **Switch (Audio Check):** Route to transcription if needed
- **HTTP Request (AI):** Call Claude API with tools config
- **HTTP Request (Tools):** 8 nodes mapped to Grafono endpoints
- **Z-API Send:** Final response delivery

---

## System Prompt Reference (Gabi Persona)

```markdown
# Gabi - Assistente Virtual da Clínica Graciele Fonoaudiologia

Você é Gabi, assistente virtual especializada em atendimento humanizado para clínica de fonoaudiologia.

## Personalidade
- Acolhedora e empática
- Profissional sem ser técnica demais (evite jargão médico)
- Objetiva e clara nas instruções
- Paciente com dúvidas repetidas

## Fluxo de Atendimento
1. **Identificação:** Pergunte o nome e número de telefone (se não identificado)
2. **Qualificação:**
   - Se novo: Pergunte demanda principal e ofereça avaliação inicial
   - Se existente: Consulte histórico e próximos agendamentos
3. **Agendamento:**
   - Consulte horários disponíveis
   - Confirme data/hora escolhida
   - Crie ou atualize agendamento
4. **Confirmação:** Resuma informações e peça confirmação final
5. **Log:** SEMPRE registre resumo da conversa ao final

## Ferramentas Disponíveis
- verificar_paciente: Buscar por telefone
- criar_lead: Cadastrar novo contato
- consultar_horarios: Ver agenda
- agendar_avaliacao: Confirmar horário
- atualizar_agendamento: Remarcar/cancelar
- consultar_paciente: Ver dados completos
- consultar_agendamentos: Histórico
- registrar_conversa: Salvar interação (obrigatório)

## Regras de Ouro
- NUNCA invente horários. Sempre consulte antes.
- NUNCA confirme agendamento sem verificar disponibilidade.
- SEMPRE registre a conversa ao final (compliance).
- Se dúvida técnica: "Vou transferir para a Dra. Graciele."
```

---

## Auth & Security

### Environment Variables
```bash
# .env.local / Vercel Dashboard
N8N_API_KEY=seu_token_secreto_aqui_min_32_chars
```

### Auth Helper (`src/lib/n8n-auth.ts`)
```typescript
import { NextRequest, NextResponse } from "next/server";

export function checkN8NAuth(req: NextRequest) {
    const apiKey = req.headers.get("x-api-key");
    const validKey = process.env.N8N_API_KEY;

    if (!validKey || apiKey !== validKey) {
        return false;
    }
    return true;
}

export function unauthorizedResponse() {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

### Usage Pattern (Every Endpoint)
```typescript
import { checkN8NAuth, unauthorizedResponse } from "@/lib/n8n-auth";

export async function POST(req: NextRequest) {
    if (!checkN8NAuth(req)) {
        return unauthorizedResponse();
    }

    // Continue with logic...
}
```

---

## Error Handling Standards

### Response Format
```typescript
// Success
{ success: true, data: {...} }

// Client Error (400)
{ error: "INVALID_INPUT", message: "Phone number required" }

// Unauthorized (401)
{ error: "Unauthorized" }

// Server Error (500)
{ error: "Internal Server Error" }
```

### Error Codes Catalog
| Code | HTTP | Meaning | Action |
|------|------|---------|--------|
| `Unauthorized` | 401 | Missing/invalid x-api-key | Check N8N_API_KEY env var |
| `INVALID_INPUT` | 400 | Missing required field | Validate tool parameters |
| `PATIENT_NOT_FOUND` | 404 | Patient ID doesn't exist | Re-run verificar_paciente |
| `SLOT_UNAVAILABLE` | 409 | Time slot already booked | Re-fetch available slots |
| `Internal Server Error` | 500 | Unexpected failure | Check logs, retry |

---

## Templates

### HTTP Request Tool Config (n8n Node)

**Node Type:** HTTP Request
**Authentication:** Generic Credential Type (Header Auth)

**Headers:**
```json
{
  "x-api-key": "={{$credentials.apiKey}}",
  "Content-Type": "application/json"
}
```

**Example (verificar_paciente):**
```json
{
  "method": "POST",
  "url": "https://gra-fono.vercel.app/api/n8n/patient/check",
  "body": {
    "phone": "={{$json.phone}}"
  },
  "options": {
    "response": {
      "response": {
        "fullResponse": false,
        "neverError": false
      }
    }
  }
}
```

---

### New Endpoint Template

**File:** `src/app/api/n8n/[resource]/[action]/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { checkN8NAuth, unauthorizedResponse } from "@/lib/n8n-auth";
import { z } from "zod";

// Define Input Schema
const InputSchema = z.object({
    field: z.string().min(1, "Field required")
});

export async function POST(req: NextRequest) {
    // 1. Auth Check
    if (!checkN8NAuth(req)) {
        return unauthorizedResponse();
    }

    try {
        // 2. Parse & Validate
        const body = await req.json();
        const validation = InputSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: "INVALID_INPUT", details: validation.error.flatten() },
                { status: 400 }
            );
        }

        const { field } = validation.data;

        // 3. Database Operation
        const result = await db.model.create({
            data: { field },
            select: { id: true, field: true }
        });

        // 4. Success Response
        return NextResponse.json({
            success: true,
            data: result
        });

    } catch (error) {
        // 5. Error Handling
        console.error("N8N Endpoint Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
```

---

## Testing Checklist

### Local Testing (Postman/cURL)
```bash
# 1. Set API Key
export API_KEY="your_n8n_api_key"

# 2. Test Patient Check
curl -X POST http://localhost:3000/api/n8n/patient/check \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"phone":"5511987654321"}'

# 3. Test Calendar Slots
curl -X GET "http://localhost:3000/api/n8n/calendar/slots?date=2024-02-15" \
  -H "x-api-key: $API_KEY"

# 4. Test Appointment Creation
curl -X POST http://localhost:3000/api/n8n/appointment \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "patientId":"uuid-here",
    "date":"2024-02-15T14:00:00",
    "type":"Avaliação Inicial"
  }'
```

### N8N Integration Test
1. Create test workflow with single HTTP Request node
2. Point to `/api/n8n/patient/check` endpoint
3. Add credential with x-api-key
4. Execute manually and verify response structure
5. Check Next.js logs for request hits

### Production Validation
- [ ] All endpoints return correct status codes
- [ ] Unauthorized access returns 401
- [ ] Invalid input returns 400 with details
- [ ] Success responses match documented schema
- [ ] PatientHistory logs are created for interactions
- [ ] Appointments show in dashboard after creation
- [ ] Error logs appear in Vercel logs (not exposed to client)

---

## Migration Notes (5 → 8 Endpoints)

**What Changed:**
- Added 3 new endpoints for richer patient context
- All existing endpoints remain backward compatible
- No breaking changes to request/response formats

**Implementation Order:**
1. Create endpoint files (route.ts)
2. Add Zod validation schemas
3. Test locally with cURL
4. Deploy to Vercel
5. Add HTTP Request Tool nodes in n8n
6. Update AI Agent system prompt with new tool descriptions
7. Test end-to-end via WhatsApp sandbox

**Rollback Plan:**
- New endpoints fail gracefully (agent continues with limited tools)
- Existing 5 endpoints unaffected
- No database schema changes required
