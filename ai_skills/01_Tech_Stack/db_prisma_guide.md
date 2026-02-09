# Database & Prisma Guide (The "Schema Truth")

## Description
Complete reference for Grafono's PostgreSQL schema via Prisma ORM. Covers all 17 models, relationships, status enums, query patterns, and data integrity rules for the speech therapy patient management system.

## Persona
**Role:** Database Architect & Data Guardian
**Mindset:** "The schema is the source of truth. Relationships are sacred. Orphaned records are bugs."
**Mantra:** "Every mutation tells a story. Every query must be precise. The singleton protects us."

## Technical Grounding (The "Foundation")
> *Database Architecture Notes:*
> * **Database:** Neon Serverless PostgreSQL (production) - connection pooling required.
> * **ORM:** Prisma 6 - type-safe queries, relationship loading, automatic migrations.
> * **Client Pattern:** Singleton instance at `src/lib/db.ts` - prevents connection exhaustion in serverless.
> * **Access Layer:** All DB operations via Server Actions in `src/app/actions/*.ts`.
> * **Schema Location:** `prisma/schema.prisma` - 17 models organized by domain.

## Context & Rules
*   **Project:** Grafono - Speech Therapy Patient Management System.
*   **Non-Negotiables:**
    1.  **The Singleton Rule:** ALWAYS import `db` from `@/lib/db`. NEVER instantiate new `PrismaClient()`.
    2.  **The Transaction Rule:** Multi-model mutations (e.g., Patient + PatientHistory) MUST use `db.$transaction`.
    3.  **The Select Rule:** Production queries MUST include explicit `select` clause. No lazy `findMany()` fetching all fields.
    4.  **The Foreign Key Rule:** NEVER delete a parent record with active children. Check relationships first or use cascading deletes.
    5.  **The Date Rule:** All DateTime fields are timezone-aware. Use `new Date()` for current timestamp, parse ISO strings for user input.
    6.  **No Raw SQL Rule:** Avoid `db.$queryRaw` unless Prisma cannot express the query. Document justification in comments.

## Schema Reference (17 Models)

### Core Domain (Identity & Patients)

#### **User** (Professionals & Patient Login Accounts)
```prisma
id: String @id @default(cuid())
email: String @unique
password: String?                    // bcrypt-hashed
name: String?
role: String @default("PROFESSIONAL") // PROFESSIONAL | PATIENT
createdAt/updatedAt: DateTime
digitalSignature: String?            // Professional signature for documents
crfa: String?                        // Professional license number
specialty: String?
address: String?

Relations:
- notifications: Notification[]
- patientProfile: Patient? @relation("UserToPatient") // 1:1 for patient portal
- templates: Template[]
```

#### **Patient** (Central Clinical Record)
```prisma
id: String @id @default(cuid())
name: String
email/phone: String?
gender: String                       // "Masculino" | "Feminino"
dateOfBirth: DateTime
status: String @default("Ativo")     // See Status Enums below
imageUrl: String?
startDate: DateTime

// Clinical Context
motherName/fatherName: String?
address: String?
observations: String?                // Stores "timesPerWeek" and "type" (legacy)

// Financial Configuration
negotiatedValue: Float?
financialSource: String @default("PARTICULAR") // PARTICULAR | CONVENIO
insuranceName/insuranceNumber: String?
authorizationStatus: String?
paymentMethod: String @default("PER_SESSION") // PER_SESSION | MONTHLY

// Reevaluation Tracking
reevaluationInterval: String?       // 3_MONTHS | 6_MONTHS | 1_YEAR | NONE
lastReevaluation/nextReevaluation: DateTime?

// CRM Fields
category: String @default("FAMILY") // FAMILY | PARTNER
responsibleEmail: String?

// Portal Access
userId: String? @unique -> User

Relations (Patient is the HUB):
- appointments: Appointment[]
- reports: Report[]
- assessments: Assessment[]
- exams: Exam[]
- goals: Goal[]
- exercises: Exercise[]
- treatmentProgress: TreatmentProgress[]
- transactions: Transaction[]
- history: PatientHistory[]
- knowledgeBase: PatientKnowledgeBase[]
- evolutions: Evolution[]
- reminders: Reminder[]
```

#### **PatientHistory** (Audit Trail)
```prisma
id/content: String
date: DateTime
patientId -> Patient
```

### Clinical Domain (Assessments & Sessions)

#### **Appointment** (Scheduled Sessions)
```prisma
id/date: DateTime
time: String?
status: String                       // "Agendado" | "Realizado" | "Cancelado"
type: String                         // "Terapia" | "Avaliação" | "Consulta"
location: String @default("Presencial") // "Presencial" | "Online"
notes: String?
patientId -> Patient
evolutions: Evolution[]              // Session notes linked to appointment
```

#### **Evolution** (Session Notes / SOAP)
```prisma
id/date: DateTime
type: String                         // PARTICULAR | CONVENIO
emotionalStatus: String?
content: String                      // Main clinical note
fileUrl: String?                     // Uploaded file (audio/doc)
patientId -> Patient
appointmentId: String? -> Appointment
```

#### **Assessment** (Formal Evaluations)
```prisma
id/title: String?
date: DateTime
status: String                       // "Finalizada"
type: String                         // "Inicial" | "Progresso"
description: String?
metrics: String?                     // JSON-serialized evaluation scores
fileUrl/summary: String?
patientId -> Patient
```

#### **Exam** (External Test Results)
```prisma
id/title: String
date: DateTime
status: String                       // "Finalizado" | "Pendente" | "Agendado"
type: String?
fileUrl/summary: String?
patientId -> Patient
```

#### **Report** (Clinical Reports)
```prisma
id/title: String
type: String                         // "Avaliação" | "Evolução"
status: String                       // "Finalizado" | "Rascunho"
date: DateTime
content: String?                     // Rich text or AI-generated
fileUrl/summary: String?
patientId -> Patient
```

#### **PatientKnowledgeBase** (AI Indexing Layer)
```prisma
id/type: String                      // "AVALIACAO" | "EXAME" | "RELATORIO" | "OBSERVACAO"
date: DateTime
content: String                      // Indexed content for AI context
fileUrl: String?
sourceId: String                     // ID of original record
patientId -> Patient
```

#### **Goal** (Treatment Objectives)
```prisma
id/description: String
progress: Int @default(0)
status: String                       // "Em andamento" | "Concluído"
patientId -> Patient
```

#### **Exercise** (Home Exercises)
```prisma
id/title: String
description/frequency/duration: String
status: String @default("Pendente")
patientId -> Patient
```

#### **TreatmentProgress** (Monthly Attendance Tracking)
```prisma
id/month: String
attended/total: Int
attendanceRate/expected/realized: Float
patientId -> Patient
```

### Financial Domain (Revenue & Expenses)

#### **Transaction** (Income/Expense Records)
```prisma
id/description: String
amount: Float
type: String                         // "Terapia" | "Avaliação" | "Aluguel" | etc.
flow: String @default("INCOME")      // INCOME | EXPENSE
category: String?                    // FIXED | VARIABLE (for expenses)
source: String?                      // PARTICULAR | CONVENIO
status: String                       // "pago" | "pendente" | "atrasado" | "aguardando_repasse"
dueDate: DateTime
paymentDate: DateTime?
referenceId: String?                 // "MONTHLY_MMM_YYYY" or "APT_[id]"
isMonthly: Boolean
bankTransactionId: String?
patientId: String? -> Patient
paymentHistory: PaymentHistory[]
```

#### **PaymentHistory** (Payment Audit Log)
```prisma
id/action: String                    // "PAID" | "REVERTED"
amount: Float
month/year: Int
transactionId -> Transaction
```

### System Domain (Configuration & Notifications)

#### **Template** (Reusable Documents)
```prisma
id/title/content: String
category: String                     // "Atestado" | "Encaminhamento" | "Recibo" | "Contrato"
userId -> User
```

#### **Notification** (User Alerts)
```prisma
id/title/content: String
type: String                         // "Payment" | "Schedule"
read: Boolean @default(false)
userId -> User
```

#### **AvailabilityConfig** (Professional Schedule)
```prisma
id/workingDays: String               // JSON array
startHour/endHour: String
lunchStart/lunchEnd: String?
timeSlots: String?                   // JSON
sessionDuration: Int @default(30)    // minutes
```

#### **Reminder** (Task Management)
```prisma
id/title/description: String?
type: String                         // "RECIBO_GOV" | "GENERAL"
priority: String @default("NORMAL")
dueDate: DateTime?
isCompleted: Boolean
link: String?
userId/patientId: String? -> User/Patient
```

#### **Diagnosis** (Diagnosis Catalog)
```prisma
id/name: String @unique
description: String?
baseSeverity: Int? @default(5)
```

## Relationship Map (The "Hub-and-Spoke")

**Patient** is the central hub. All clinical and financial data radiate from it:

```
                    User (Professional)
                         |
                    Templates
                         |
                    Reminders
                         |
    ┌────────────────────┴────────────────────┐
    │                                         │
Notifications                           Patient (HUB)
                                              │
        ┌─────────────────┬──────────────────┼──────────────────┬─────────────────┐
        │                 │                  │                  │                 │
  Appointments      Transactions        Assessments         Reports           Exams
        │                 │                  │                  │                 │
   Evolutions      PaymentHistory      Goals/Exercises   KnowledgeBase   TreatmentProgress
        │
  PatientHistory
```

**Key Cascading Relationships:**
- Deleting a Patient deletes: History, KnowledgeBase, Goals, Exercises, Progress
- Deleting a Transaction cascades to: PaymentHistory
- Appointments retain Evolutions (manual cleanup required)

## Status Enums Reference

### Patient.status
```typescript
"Lead" | "Avaliação" | "Em Terapia" | "Em Espera" | "Alta" | "Arquivado" | "Novo Lead" | "Contato Inicial"
```

### Patient.financialSource
```typescript
"PARTICULAR" | "CONVENIO"
```

### Patient.paymentMethod
```typescript
"PER_SESSION" | "MONTHLY"
```

### Patient.reevaluationInterval
```typescript
"3_MONTHS" | "6_MONTHS" | "1_YEAR" | "NONE"
```

### Transaction.flow
```typescript
"INCOME" | "EXPENSE"
```

### Transaction.status
```typescript
"pago" | "pendente" | "atrasado" | "aguardando_repasse"
```

### Appointment.status
```typescript
"Agendado" | "Realizado" | "Cancelado"
```

### Appointment.type
```typescript
"Terapia" | "Avaliação" | "Consulta"
```

### Report.status / Assessment.status
```typescript
"Finalizado" | "Rascunho"
```

## Query Patterns (The "Daily Bread")

### Pattern 1: Strict Select (Never Fetch All Fields)
```typescript
// ❌ BAD - Fetches all Patient fields (15+ columns)
const patients = await db.patient.findMany();

// ✅ GOOD - Fetch only what you need
const patients = await db.patient.findMany({
  select: {
    id: true,
    name: true,
    status: true,
    negotiatedValue: true,
  },
});
```

### Pattern 2: Nested Select (Deep Relationships)
```typescript
// Get patients with latest 3 appointments (dates only)
const patients = await db.patient.findMany({
  where: { status: "Em Terapia" },
  select: {
    id: true,
    name: true,
    appointments: {
      select: {
        date: true,
        status: true,
      },
      orderBy: { date: "desc" },
      take: 3,
    },
  },
});
```

### Pattern 3: Atomic Mutations with $transaction
```typescript
// Create patient + initial history entry
const patient = await db.$transaction(async (tx) => {
  const newPatient = await tx.patient.create({
    data: {
      name: "João Silva",
      dateOfBirth: new Date("1990-01-15"),
      status: "Lead",
      startDate: new Date(),
    },
  });

  await tx.patientHistory.create({
    data: {
      patientId: newPatient.id,
      content: "Cadastro inicial criado via CRM",
      date: new Date(),
    },
  });

  return newPatient;
});
```

### Pattern 4: Date Range Queries
```typescript
// Get appointments for current month
const now = new Date();
const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

const appointments = await db.appointment.findMany({
  where: {
    date: {
      gte: startOfMonth,
      lte: endOfMonth,
    },
    status: "Realizado",
  },
  select: {
    id: true,
    date: true,
    patient: {
      select: { name: true },
    },
  },
});
```

### Pattern 5: Status Filtering with Counts
```typescript
// Dashboard metrics - count patients by status
const statusCounts = await db.patient.groupBy({
  by: ["status"],
  _count: {
    id: true,
  },
});

// Result: [{ status: "Em Terapia", _count: { id: 12 } }, ...]
```

### Pattern 6: Financial Queries (Month Aggregation)
```typescript
// Get total income for a specific month
const income = await db.transaction.aggregate({
  where: {
    flow: "INCOME",
    dueDate: {
      gte: new Date("2026-02-01"),
      lt: new Date("2026-03-01"),
    },
  },
  _sum: {
    amount: true,
  },
});

// Result: { _sum: { amount: 15000 } }
```

### Pattern 7: Compliance Tracking (Overdue Payments)
```typescript
// Find overdue transactions for a patient
const overdueTransactions = await db.transaction.findMany({
  where: {
    patientId: "patient123",
    status: { in: ["pendente", "atrasado"] },
    dueDate: {
      lt: new Date(), // Before today
    },
  },
  select: {
    id: true,
    description: true,
    amount: true,
    dueDate: true,
    status: true,
  },
  orderBy: {
    dueDate: "asc",
  },
});
```

## Templates (Ready-to-Use Examples)

### Template 1: Patient with Clinical Context (Dashboard Overview)
```typescript
"use server";

import { db } from "@/lib/db";

export async function getPatientDashboard(patientId: string) {
  return await db.patient.findUnique({
    where: { id: patientId },
    select: {
      id: true,
      name: true,
      status: true,
      dateOfBirth: true,
      negotiatedValue: true,
      financialSource: true,

      // Latest assessment
      assessments: {
        where: { status: "Finalizada" },
        select: {
          id: true,
          date: true,
          type: true,
          summary: true,
        },
        orderBy: { date: "desc" },
        take: 1,
      },

      // Upcoming appointments
      appointments: {
        where: {
          status: "Agendado",
          date: { gte: new Date() },
        },
        select: {
          id: true,
          date: true,
          type: true,
        },
        orderBy: { date: "asc" },
        take: 3,
      },

      // Active goals
      goals: {
        where: { status: "Em andamento" },
        select: {
          id: true,
          description: true,
          progress: true,
        },
      },

      // Financial summary
      transactions: {
        where: {
          status: { in: ["pendente", "atrasado"] },
        },
        select: {
          id: true,
          amount: true,
          dueDate: true,
          status: true,
        },
      },
    },
  });
}
```

### Template 2: Monthly Financial Report (Server Action)
```typescript
"use server";

import { db } from "@/lib/db";
import { z } from "zod";

const InputSchema = z.object({
  month: z.number().min(1).max(12),
  year: z.number().min(2020),
});

export async function getMonthlyFinancialReport(rawInput: unknown) {
  const result = InputSchema.safeParse(rawInput);
  if (!result.success) {
    return { error: "INVALID_INPUT", details: result.error.flatten() };
  }

  const { month, year } = result.data;
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  try {
    const [income, expenses, transactions] = await db.$transaction([
      // Total income
      db.transaction.aggregate({
        where: {
          flow: "INCOME",
          dueDate: { gte: startDate, lte: endDate },
        },
        _sum: { amount: true },
        _count: { id: true },
      }),

      // Total expenses
      db.transaction.aggregate({
        where: {
          flow: "EXPENSE",
          dueDate: { gte: startDate, lte: endDate },
        },
        _sum: { amount: true },
        _count: { id: true },
      }),

      // Detailed transactions
      db.transaction.findMany({
        where: {
          dueDate: { gte: startDate, lte: endDate },
        },
        select: {
          id: true,
          description: true,
          amount: true,
          flow: true,
          status: true,
          dueDate: true,
          patient: {
            select: { name: true },
          },
        },
        orderBy: { dueDate: "asc" },
      }),
    ]);

    return {
      success: true,
      summary: {
        totalIncome: income._sum.amount || 0,
        incomeCount: income._count.id,
        totalExpenses: expenses._sum.amount || 0,
        expenseCount: expenses._count.id,
        netProfit: (income._sum.amount || 0) - (expenses._sum.amount || 0),
      },
      transactions,
    };
  } catch (e: any) {
    console.error("Financial report error:", e);
    return { error: "DATABASE_ERROR" };
  }
}
```

### Template 3: Reevaluation Reminder System
```typescript
"use server";

import { db } from "@/lib/db";

export async function getPatientsNeedingReevaluation() {
  const today = new Date();

  // Patients with upcoming reevaluation dates (next 30 days)
  return await db.patient.findMany({
    where: {
      status: "Em Terapia",
      nextReevaluation: {
        gte: today,
        lte: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000), // +30 days
      },
    },
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      nextReevaluation: true,
      reevaluationInterval: true,
      assessments: {
        where: { type: "Progresso" },
        select: {
          date: true,
        },
        orderBy: { date: "desc" },
        take: 1,
      },
    },
    orderBy: {
      nextReevaluation: "asc",
    },
  });
}
```

## Migration & Schema Management

### Development Workflow
```bash
# Push schema changes (development - no migration files)
npm run db:push

# Generate Prisma Client after schema changes
npm run db:generate
```

### Production Workflow (Neon)
```bash
# Create migration file
npm run db:migrate

# Deploy migration
npx prisma migrate deploy
```

### Seed Script Pattern
```typescript
// scripts/seed-example.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(async (tx) => {
    // Seed data operations
    await tx.patient.create({ data: {...} });
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

## Common Pitfalls & Solutions

### ❌ Pitfall 1: N+1 Query Problem
```typescript
// BAD - Fires 1 query for patients + N queries for appointments
const patients = await db.patient.findMany();
for (const patient of patients) {
  const appointments = await db.appointment.findMany({
    where: { patientId: patient.id },
  });
}

// GOOD - Single query with nested select
const patients = await db.patient.findMany({
  select: {
    id: true,
    name: true,
    appointments: {
      select: { date: true },
    },
  },
});
```

### ❌ Pitfall 2: Orphaned Records
```typescript
// BAD - Delete patient without cleaning up transactions
await db.patient.delete({ where: { id } });
// Transactions with patientId now point to non-existent record

// GOOD - Clean up or use onDelete cascade
await db.$transaction([
  db.transaction.updateMany({
    where: { patientId: id },
    data: { patientId: null },
  }),
  db.patient.delete({ where: { id } }),
]);
```

### ❌ Pitfall 3: Multiple PrismaClient Instances
```typescript
// BAD - Creates new connection per file
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

// GOOD - Use singleton
import { db } from "@/lib/db";
```

---

**Last Updated:** 2026-02-08
**Canonical Import:** `import { db } from "@/lib/db";`
**Schema Location:** `/Users/marcoscruz/Documents/Projetos/Grafono/prisma/schema.prisma`
