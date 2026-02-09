# Regras Clínicas & Domínio Fonoaudiológico

## Description

**Business rules for clinical speech therapy practice management**

This skill contains the complete set of business rules, clinical workflows, and domain-specific logic for managing a Fonoaudiologia practice in Brazil. It defines patient lifecycle states, appointment policies, reevaluation cycles, financial flows (PARTICULAR vs CONVENIO), WhatsApp intake protocols, and compliance requirements (CRFa, Gov.br receipts).

**When to use**:
- Implementing patient status transitions
- Building appointment scheduling features
- Creating financial flows (mensalidade, per-session, insurance)
- Validating reevaluation intervals
- Integrating WhatsApp intake (Gabi agent)
- Generating clinical documents (atestados, encaminhamentos)
- Enforcing compliance rules (Gov.br receipts, CRFa signatures)

**Related skills**:
- `database_schema.md` - Technical implementation of these rules
- `server_actions.md` - Where these rules are enforced
- `ai_features.md` - AI-powered clinical documentation

---

## Persona

**Role**: Clinical Operations Manager
**Mindset**: "The patient journey is the product. Every status change, every appointment, every payment tells a story of care delivery. Our job is to make that story seamless for the professional and transparent for the patient."

**Priorities**:
1. **Patient safety first** - Never allow data loss or clinical record gaps
2. **Regulatory compliance** - CRFa, Gov.br, insurance authorization flows
3. **Financial clarity** - Transparent billing, no surprises for patients or professionals
4. **Workflow efficiency** - Reduce administrative burden, automate repetitive tasks
5. **Clinical excellence** - Support evidence-based practice with reevaluation cycles and progress tracking

**Key questions this persona asks**:
- "What happens if a patient misses their reevaluation?"
- "How do we track insurance authorization status?"
- "When should a Lead become Avaliação vs Em Espera?"
- "What's the cancellation policy for appointments?"
- "How do we handle late payments without disrupting care?"

---

## Technical Grounding

### Brazilian Healthcare Context

**Fonoaudiologia** is a regulated healthcare profession in Brazil, governed by:
- **CRFa** (Conselho Regional de Fonoaudiologia) - Regional professional council
- Professional registration number (e.g., CRFa 1-12345)
- Requirement for digital signature on clinical documents
- Specialization areas: language, speech, voice, swallowing, audiology

**Payment Models**:
1. **PARTICULAR** - Private pay (most common in private practice)
   - Direct patient-to-professional relationship
   - Flexible pricing (per session or monthly)
   - No third-party authorization required

2. **CONVENIO** - Health insurance
   - Requires insurance company authorization (guia)
   - Authorization status: `Guia Pendente` → `Guia Autorizada`
   - Payment timeline: sessions delivered → guia submitted → awaiting reimbursement
   - Common insurers: Unimed, Amil, SulAmérica, Bradesco Saúde

**Gov.br Receipt Requirement**:
- Professionals must submit receipts to Gov.br for tax compliance
- Tracked via `Reminder` model with type `RECIBO_GOV`
- Typically monthly or per-patient depending on accountant guidance

**Clinical Standards**:
- Initial evaluation (Avaliação Inicial) required before starting therapy
- Reevaluation intervals based on clinical need (common: 3 months for children, 6 months for adults)
- Evolution notes (SOAP format) for each session
- Discharge reports (Alta) required for insurance cases

---

## Patient Lifecycle

### Status Flow

```
Novo Lead / Contato Inicial
    ↓
  Lead  ← Qualified interest via WhatsApp/website
    ↓
Avaliação  ← Evaluation scheduled or in progress
    ↓
Em Terapia  ← Active treatment (requires Avaliação Inicial completed)
    ↓
Alta  ← Discharged (goals met or referral)
    ↓
Arquivado  ← Inactive record (optional final state)

         Em Espera  ← Waiting list (can come from any pre-therapy state)
```

### Status Definitions & Transition Rules

#### `Novo Lead` / `Contato Inicial`
- **Trigger**: First WhatsApp message or website form submission
- **Data required**: name, phone, demand (chief complaint)
- **Next steps**: Qualify interest → move to `Lead` or `Em Espera`
- **Auto-actions**: Create WhatsApp interaction log
- **Duration**: Transient state (should transition within 24-48 hours)

#### `Lead`
- **Trigger**: Confirmed interest in evaluation
- **Data required**: name, phone, demand, preferredTime (optional)
- **Next steps**: Schedule Avaliação Inicial → move to `Avaliação`
- **Auto-actions**: Create reminder to follow up if no appointment scheduled in 7 days
- **Business rule**: If no contact response in 30 days → move to `Arquivado`

#### `Avaliação`
- **Trigger**: Evaluation appointment scheduled
- **Data required**: Appointment of type "Avaliação Inicial" exists
- **Next steps**:
  - Evaluation completed + therapy recommended → `Em Terapia`
  - Evaluation completed + therapy not indicated → `Alta`
  - Patient needs to wait → `Em Espera`
- **Auto-actions**: Create Assessment record linked to appointment
- **Business rule**: Must have at least one `Assessment` with `type: INITIAL` before moving to `Em Terapia`

#### `Em Terapia`
- **Trigger**: Active treatment started (requires completed Avaliação Inicial)
- **Data required**:
  - `negotiatedValue` (payment amount)
  - `paymentMethod` (PER_SESSION or MONTHLY)
  - `sessionFrequency` (e.g., 2x per week)
  - `source` (PARTICULAR or CONVENIO)
  - If CONVENIO: `insuranceName`, `authorizationStatus`
- **Next steps**:
  - Treatment completed → `Alta`
  - Temporary pause → `Em Espera`
- **Auto-actions**:
  - Create monthly Transaction if `paymentMethod: MONTHLY`
  - Calculate `nextReevaluation` based on `reevaluationInterval`
  - Track session count and attendance
- **Business rule**:
  - Requires active appointments scheduled
  - Evolution notes should be created after each session
  - Reevaluation Assessment due when `nextReevaluation` date passes

#### `Em Espera`
- **Trigger**: Patient on waiting list or temporary pause
- **Data required**: `waitingListReason` (optional notes)
- **Next steps**:
  - Slot available → schedule evaluation → `Avaliação`
  - Patient ready to resume → `Em Terapia`
  - Patient no longer interested → `Arquivado`
- **Auto-actions**: Flag for monthly review (check availability)
- **Business rule**: No financial transactions while in this status

#### `Alta`
- **Trigger**: Discharge from treatment (goals met, referral, or patient withdrawal)
- **Data required**:
  - Discharge reason (optional)
  - Final Assessment recommended
  - Report if required by insurance
- **Next steps**: `Arquivado` after 90 days (configurable)
- **Auto-actions**:
  - Close open financial transactions (mark as cancelled if unpaid)
  - Cancel future appointments
  - Generate discharge report if CONVENIO
- **Business rule**: Can reactivate to `Em Terapia` if patient returns (common for seasonal cases)

#### `Arquivado`
- **Trigger**: Inactive patient (no contact/appointments for extended period)
- **Data required**: Archive reason, archive date
- **Next steps**: Permanent state (can be unarchived manually)
- **Auto-actions**: Hide from active patient lists
- **Business rule**: All financial obligations must be settled or written off before archiving

---

## Patient Categories

### `FAMILY` (Família)
- Direct family/friend contact
- Organic lead source
- Higher conversion rate expected
- Personal relationship implies trust

### `PARTNER` (Parceiro/Clínica)
- Referral from partner clinic, school, or healthcare provider
- May have specific evaluation protocols required by partner
- Important to track referral source for partnership reporting
- May require feedback report sent to referring professional

---

## Appointment Rules

### Appointment Types

1. **Terapia** (Therapy Session)
   - Standard recurring session
   - Duration: typically 30-45 minutes
   - Requires patient in status `Em Terapia`
   - Generates Evolution note
   - Links to Transaction if `paymentMethod: PER_SESSION`

2. **Avaliação Inicial** (Initial Evaluation)
   - First assessment appointment
   - Duration: typically 60-90 minutes
   - Patient must be in status `Avaliação`
   - Generates Assessment record with `type: INITIAL`
   - May have different pricing than regular sessions
   - Required before starting therapy

3. **Avaliação** (Reevaluation)
   - Follow-up assessment
   - Duration: typically 45-60 minutes
   - Patient must be in status `Em Terapia`
   - Generates Assessment record with `type: PROGRESS`
   - Triggered by `nextReevaluation` date
   - Updates treatment goals and plans

4. **Consulta** (Consultation)
   - One-off consultation (not recurring therapy)
   - Family guidance sessions
   - Post-discharge follow-up
   - Can occur regardless of patient status

### Appointment Status

- **Agendado** (Scheduled)
  - Default state when appointment is created
  - Appears on professional's calendar
  - Patient receives confirmation (WhatsApp recommended)

- **Realizado** (Completed)
  - Session occurred
  - Triggers:
    - Evolution note should be created
    - If `paymentMethod: PER_SESSION`, Transaction created with due date
    - Session count incremented
    - Attendance tracking updated

- **Cancelado** (Cancelled)
  - Session did not occur
  - Must record cancellation reason and who cancelled (patient vs professional)
  - Cancellation policy:
    - < 24h notice: may charge cancellation fee (professional's discretion)
    - >= 24h notice: no charge
    - Professional cancellation: session should be rescheduled at no cost

### Appointment Location

- **Presencial** (In-person)
  - Default for most speech therapy modalities
  - Address from professional's settings

- **Online** (Teletherapy)
  - Allowed for most speech therapy types in Brazil (post-pandemic regulation)
  - Meeting link should be included in appointment notes
  - Patient must consent to teletherapy modality

### Scheduling Constraints

1. **Availability**:
   - Professional's availability defined in `AvailabilityConfig`
   - Block scheduling: common to reserve same slot weekly (e.g., every Tuesday 14:00)

2. **Frequency**:
   - Stored in patient's `sessionFrequency` (e.g., "2x por semana")
   - Not enforced by system, but used for scheduling suggestions

3. **Conflicts**:
   - Prevent double-booking same time slot
   - Warn if scheduling outside professional's defined availability
   - Check for patient conflicts if professional manages multiple locations

4. **Recurrence**:
   - System supports recurring appointment creation
   - Typical pattern: create 4-8 weeks of sessions at once
   - Skip holidays/professional vacation dates

---

## Reevaluation Cycles

### Purpose
Reevaluations track patient progress, adjust treatment plans, and provide documentation for insurance companies. They are a clinical best practice and often contractually required for CONVENIO patients.

### Interval Options

- **`3_MONTHS`** - Quarterly reassessment
  - Common for: pediatric cases, acute conditions, new patients
  - Intensive monitoring phase

- **`6_MONTHS`** - Semi-annual
  - Common for: stable adult patients, maintenance therapy
  - Standard recommendation for most cases

- **`1_YEAR`** - Annual
  - Common for: long-term maintenance, seasonal check-ins
  - Minimal monitoring requirement

- **`NONE`** - No scheduled reevaluation
  - Used for: discharge planned, consultant-only cases
  - Not recommended for active therapy

### Calculation Logic

```typescript
// At patient creation or interval change
if (patient.reevaluationInterval !== 'NONE') {
  const monthsToAdd = {
    '3_MONTHS': 3,
    '6_MONTHS': 6,
    '1_YEAR': 12
  }[patient.reevaluationInterval];

  patient.nextReevaluation = addMonths(
    patient.lastReevaluation || new Date(),
    monthsToAdd
  );
}

// After completing a reevaluation Assessment
patient.lastReevaluation = assessment.date;
patient.nextReevaluation = addMonths(assessment.date, monthsToAdd);
```

### Reminder Triggers

- **30 days before**: Reminder to professional to schedule reevaluation appointment
- **7 days before**: Flag patient record if no reevaluation appointment exists
- **On due date**: Auto-create Reminder if no Assessment completed
- **7 days overdue**: High-priority notification (insurance compliance risk)

### Business Rules

1. **Initial evaluation does NOT start the reevaluation clock**
   - `lastReevaluation` should be set to the date therapy starts (first Terapia appointment), not Avaliação Inicial

2. **Changing interval mid-therapy**:
   - Recalculate `nextReevaluation` from last completed reevaluation
   - If no reevaluation yet, use therapy start date

3. **Patient on hold** (`Em Espera`):
   - Reevaluation clock pauses
   - On return to therapy, calculate based on last active session date

4. **Insurance requirements**:
   - CONVENIO patients: reevaluation often required every 3-6 months per insurance contract
   - Must generate Assessment report and submit with guia renewal

5. **Discharge** (`Alta`):
   - Final assessment recommended but not mandatory
   - Mark reevaluation as complete to close the cycle

---

## Financial Rules

### Payment Methods

#### `PER_SESSION` (Por Sessão)
- **Flow**:
  1. Appointment marked as `Realizado`
  2. Transaction auto-created with:
     - `amount: patient.negotiatedValue`
     - `dueDate: appointment.date + professional's payment terms (default: same day)`
     - `referenceId: APT_[appointmentId]`
     - `status: pendente`
  3. Patient pays → mark Transaction as `pago`

- **Use case**: Common for irregular schedules, trial periods, or patient preference
- **Pros**: Pay-as-you-go, flexible for patients
- **Cons**: Administrative overhead per session

#### `MONTHLY` (Mensalidade)
- **Flow**:
  1. Patient moves to `Em Terapia`
  2. Monthly Transaction auto-created with:
     - `amount: patient.negotiatedValue`
     - `dueDate: patient.paymentDueDay of each month`
     - `referenceId: MONTHLY_[MMM]_[YYYY]` (e.g., MONTHLY_JAN_2026)
     - `status: pendente`
  3. Patient pays → mark as `pago`
  4. Next month's transaction auto-created on 1st of month

- **Use case**: Standard for ongoing therapy (most common)
- **Pros**: Predictable revenue, less admin overhead
- **Cons**: Requires commitment, harder to adjust mid-month

- **Business rules**:
  - If patient attends < 75% of scheduled sessions in a month, consider pro-rating (manual decision)
  - Payment due day stored in `patient.paymentDueDay` (1-28, safe for all months)
  - Transaction created on 1st of month, due on `paymentDueDay`

### Financial Source

#### `PARTICULAR` (Private Pay)
- Direct patient-to-professional payment
- Payment methods: cash, PIX, credit card, bank transfer
- No third-party authorization required
- Transaction flow: `pendente` → `pago` (or `atrasado` if overdue)

#### `CONVENIO` (Health Insurance)
- Three-party relationship: patient → professional → insurance company
- **Authorization flow**:
  1. Patient provides insurance card info (`insuranceName`, `insuranceNumber`)
  2. Professional requests authorization (guia) from insurance
  3. Status: `Guia Pendente`
  4. Insurance approves → `Guia Autorizada`
  5. Sessions delivered (tracked via appointments)
  6. Professional submits guia with session records
  7. Transaction created with `status: aguardando_repasse`
  8. Insurance pays → `status: pago`

- **Timeline**: Typically 30-60 days from submission to payment
- **Patient co-pay**: Some plans require patient to pay a co-pay per session (handle as separate PARTICULAR transaction)

- **Business rules**:
  - Cannot mark sessions as `Realizado` until authorization is `Guia Autorizada` (recommended, not enforced)
  - Must track session count per authorization (guias often have session limits, e.g., 12 sessions)
  - Reevaluation required for guia renewal
  - Must generate detailed clinical reports for insurance

### Transaction Status Lifecycle

```
pendente  ← Created (future or current due date)
   ↓
pago  ← Payment received (manual mark or webhook integration)

OR

pendente
   ↓
atrasado  ← Due date passed, not paid (auto-calculated)
   ↓
pago  ← Late payment received

OR (CONVENIO only)

aguardando_repasse  ← Guia submitted to insurance
   ↓
pago  ← Insurance payment received
```

- **Auto-calculation**: System should flag `pendente` → `atrasado` when `dueDate < today` and `status != pago`
- **Payment date**: When marking as `pago`, record `paidDate` for reconciliation

### Transaction Categories (Expenses)

- **`FIXED`** (Fixos):
  - Rent, utilities, software subscriptions
  - Recurring monthly
  - Predictable amount

- **`VARIABLE`** (Variáveis):
  - Materials, equipment, professional development
  - One-time or irregular
  - Variable amount

### Reference IDs

- **`MONTHLY_[MMM]_[YYYY]`**: Monthly recurring patient payment (e.g., `MONTHLY_FEB_2026`)
- **`APT_[appointmentId]`**: Per-session payment linked to specific appointment
- **`CONV_[guiaNumber]`**: Insurance reimbursement batch
- Custom IDs for expenses (e.g., `RENT_FEB_2026`, `MATERIALS_12345`)

---

## WhatsApp Intake Protocol (Gabi Agent)

### Purpose
The Gabi agent handles first-contact WhatsApp conversations, qualifying leads and scheduling evaluations. It follows a strict protocol to ensure data consistency and positive patient experience.

### Step-by-Step Rules

#### 1. **Phone Verification** (ALWAYS FIRST)
```http
POST /api/patient/check
{ "phone": "+5511999999999" }
```

- **Response: New contact** → Proceed to step 2
- **Response: Existing patient** → Greet by name, skip to step 4
- **Business rule**: Never create duplicate patient records

#### 2. **New Lead Creation**
```http
POST /api/patient
{
  "name": "Maria Silva",
  "phone": "+5511999999999",
  "demand": "Dificuldade de fala aos 4 anos",
  "status": "Novo Lead",
  "source": "WhatsApp"
}
```

- **Required fields**: name, phone, demand
- **Demand**: Patient's chief complaint in their own words (not clinical terminology)
- **Status**: Always `Novo Lead` for first contact
- **Auto-actions**: Creates first interaction log

#### 3. **Qualification** (Move to `Lead`)
- Ask qualifying questions:
  - Age of patient (if child, who is the responsible party?)
  - Main concern / reason for seeking therapy
  - Urgency (immediate need vs exploratory)
  - Previous therapy experience
  - Payment preference (PARTICULAR vs CONVENIO)

- Update patient:
```http
PATCH /api/patient/[id]
{
  "status": "Lead",
  "observations": "[Qualification notes]"
}
```

#### 4. **Scheduling Focus**
- **Gabi's primary goal**: Book an Avaliação Inicial appointment
- Offer 2-3 specific time slots (e.g., "Terça 14h, Quinta 10h, ou Sexta 16h?")
- Avoid open-ended "when works for you?" (leads to endless back-and-forth)
- If slots don't work, offer `Em Espera` with promise to notify when availability opens

#### 5. **Appointment Confirmation**
```http
POST /api/appointment
{
  "patientId": "[id]",
  "type": "Avaliação Inicial",
  "date": "2026-02-15T14:00:00",
  "status": "Agendado",
  "location": "Presencial"
}
```

- Update patient to `Avaliação` status
- Send confirmation message with:
  - Date, time, location (address if presencial, link if online)
  - What to bring (insurance card if CONVENIO, previous reports if any)
  - Cancellation policy (24h notice)

#### 6. **Interaction Logging** (EVERY MESSAGE)
```http
POST /api/interaction
{
  "patientId": "[id]",
  "type": "whatsapp",
  "content": "[Message summary]",
  "direction": "inbound" | "outbound",
  "timestamp": "[ISO-8601]"
}
```

- Tracks conversation history
- Used for compliance and quality review
- Helps professional understand patient context before first session

### Gabi Persona Guidelines

- **Tone**: Warm, professional, empathetic (not overly casual)
- **Language**: Portuguese (BR), simple vocabulary (avoid clinical jargon)
- **Response time**: Aim for < 5 minutes during business hours
- **Boundaries**:
  - Do NOT provide clinical advice or diagnosis
  - Do NOT discuss pricing in detail (say "vamos conversar na avaliação")
  - Do NOT promise specific outcomes
- **Escalation**: If patient asks complex questions, offer to have professional call them

### Business Rules

1. **No duplicate outreach**: If patient doesn't respond, wait 48h before follow-up message
2. **Max 3 follow-ups**: After 3 unanswered messages, move to `Arquivado` and stop outreach
3. **Privacy**: Never share patient info across WhatsApp conversations
4. **Consent**: Confirm patient consents to WhatsApp communication (required for LGPD compliance)

---

## Clinical Documents

### Template Categories

Documents are generated from Template records with variable substitution (e.g., `{{patientName}}`, `{{date}}`).

#### 1. **Atestado** (Medical Certificate)
- **Purpose**: Certify patient attended appointment, justify absence from work/school
- **Required fields**:
  - Patient name
  - Date of session
  - CID (if applicable, optional)
  - Professional name, CRFa, digital signature
- **Business rule**: Only generate for completed (`Realizado`) appointments
- **Legal requirement**: Must include CRFa number and signature

#### 2. **Encaminhamento** (Referral)
- **Purpose**: Refer patient to another professional (neurologist, psychologist, ENT, etc.)
- **Required fields**:
  - Patient name, age
  - Reason for referral (brief clinical summary)
  - Requested specialty/exam
  - Professional name, CRFa, digital signature
- **Business rule**: Tracks interdisciplinary care coordination
- **Common triggers**: Initial evaluation identifies need for complementary assessment

#### 3. **Recibo** (Receipt)
- **Purpose**: Proof of payment for patient (required for income tax deduction)
- **Required fields**:
  - Patient name (or responsible party)
  - Amount paid
  - Date of payment
  - Service description (e.g., "Sessão de Fonoaudiologia")
  - Professional name, CPF/CNPJ
- **Business rule**: Only generate for Transactions with `status: pago`
- **Frequency**: Can be monthly (all sessions) or per-session

#### 4. **Contrato** (Service Contract)
- **Purpose**: Formalize therapy terms (payment, frequency, cancellation policy)
- **Required fields**:
  - Patient/responsible party identification
  - Service description (therapy type, frequency, duration)
  - Payment terms (amount, due day, method)
  - Cancellation policy
  - Signatures (patient and professional)
- **Business rule**: Required before starting therapy (`Em Terapia` status)
- **Legal**: Protects both parties, especially important for CONVENIO cases

---

## Gov.br Receipt Logic

### Purpose
The Brazilian government requires professionals to report income for tax purposes. Speech therapists must submit receipts (recibos) to Gov.br portal for each payment received.

### Tracking via Reminders

```typescript
Reminder {
  type: "RECIBO_GOV",
  patientId: "[id]",  // Optional: can be patient-specific or general
  title: "Enviar recibo Gov.br - [Patient Name]",
  dueDate: "[end of month]",
  priority: "HIGH",
  completed: false
}
```

### Workflow

1. **Transaction marked as paid**:
   - System creates Reminder with type `RECIBO_GOV`
   - Due date: last day of payment month (for monthly submission)
   - Alternative: due date = payment date + 7 days (for weekly submission)

2. **Professional submits to Gov.br**:
   - Mark Reminder as `completed`
   - Optional: attach Gov.br confirmation number

3. **Compliance report**:
   - List all `RECIBO_GOV` reminders with `completed: false` and overdue
   - Flag risk of non-compliance

### Business Rules

1. **Frequency**: Depends on professional's accountant guidance (monthly most common)
2. **Threshold**: Some professionals only submit for payments > R$ 100 (verify with accountant)
3. **Batch submission**: System should support marking multiple receipts as submitted at once
4. **Exemptions**: CONVENIO payments may not require Gov.br submission (verify regional rules)

---

## Status Enum Reference

### Patient Status
```typescript
enum PatientStatus {
  "Novo Lead"          // First contact, not qualified
  "Contato Inicial"    // Alias for Novo Lead
  "Lead"               // Qualified interest
  "Avaliação"          // Evaluation scheduled/in progress
  "Em Terapia"         // Active treatment
  "Em Espera"          // Waiting list
  "Alta"               // Discharged
  "Arquivado"          // Archived/inactive
}
```

### Patient Category
```typescript
enum PatientCategory {
  "FAMILY"    // Família - direct contact
  "PARTNER"   // Parceiro/Clínica - referral
}
```

### Payment Method
```typescript
enum PaymentMethod {
  "PER_SESSION"  // Por Sessão
  "MONTHLY"      // Mensalidade
}
```

### Financial Source
```typescript
enum FinancialSource {
  "PARTICULAR"  // Private pay
  "CONVENIO"    // Health insurance
}
```

### Authorization Status (CONVENIO only)
```typescript
enum AuthorizationStatus {
  "Guia Pendente"      // Authorization requested
  "Guia Autorizada"    // Approved by insurance
}
```

### Transaction Status
```typescript
enum TransactionStatus {
  "pago"                  // Paid
  "pendente"              // Pending (not yet due or due soon)
  "atrasado"              // Overdue
  "aguardando_repasse"    // Awaiting insurance reimbursement
}
```

### Transaction Flow
```typescript
enum TransactionFlow {
  "INCOME"   // Patient payment
  "EXPENSE"  // Professional expense
}
```

### Transaction Category (EXPENSE only)
```typescript
enum TransactionCategory {
  "FIXED"     // Fixos - rent, utilities, subscriptions
  "VARIABLE"  // Variáveis - materials, one-time costs
}
```

### Appointment Type
```typescript
enum AppointmentType {
  "Terapia"            // Regular therapy session
  "Avaliação"          // Reevaluation
  "Avaliação Inicial"  // Initial evaluation
  "Consulta"           // One-off consultation
}
```

### Appointment Status
```typescript
enum AppointmentStatus {
  "Agendado"   // Scheduled
  "Realizado"  // Completed
  "Cancelado"  // Cancelled
}
```

### Appointment Location
```typescript
enum AppointmentLocation {
  "Presencial"  // In-person
  "Online"      // Teletherapy
}
```

### Reevaluation Interval
```typescript
enum ReevaluationInterval {
  "3_MONTHS"  // Quarterly
  "6_MONTHS"  // Semi-annual
  "1_YEAR"    // Annual
  "NONE"      // No scheduled reevaluation
}
```

### Assessment Type
```typescript
enum AssessmentType {
  "INITIAL"    // Initial evaluation
  "PROGRESS"   // Reevaluation
}
```

### Evolution Type (inherits from patient or overridden)
```typescript
enum EvolutionType {
  "PARTICULAR"  // Private pay session
  "CONVENIO"    // Insurance session
}
```

### Emotional Status (Evolution notes)
```typescript
enum EmotionalStatus {
  "Colaborativo"  // Collaborative
  "Resistente"    // Resistant
  "Agitado"       // Agitated
  "Ansioso"       // Anxious
  "Tranquilo"     // Calm
  // ... (extensible by professional)
}
```

### Reminder Type
```typescript
enum ReminderType {
  "RECIBO_GOV"  // Gov.br receipt submission
  "GENERAL"     // General task/deadline
}
```

### Reminder Priority
```typescript
enum ReminderPriority {
  "LOW"     // Low priority
  "NORMAL"  // Normal priority
  "HIGH"    // High priority/urgent
}
```

### Template Category
```typescript
enum TemplateCategory {
  "Atestado"        // Medical certificate
  "Encaminhamento"  // Referral letter
  "Recibo"          // Payment receipt
  "Contrato"        // Service contract
}
```

---

## Final Notes

This skill defines the **business logic layer** of the Grafono system. When implementing features:

1. **Always validate against these rules** before writing code
2. **Status transitions must be intentional** - never auto-change status without clear trigger
3. **Financial flows are sacred** - every Transaction must map to real money movement
4. **Clinical documentation is legal** - templates must meet CRFa requirements
5. **Patient journey is non-linear** - design for back-and-forth (e.g., Alta → Em Terapia is valid)

**Common pitfalls to avoid**:
- Creating appointments without checking patient status
- Auto-marking Transactions as paid without confirmation
- Generating documents without required professional credentials (CRFa, signature)
- Skipping initial evaluation before starting therapy
- Not calculating reevaluation dates
- Duplicating WhatsApp leads due to phone number variations (+55 vs 55 vs 0XX)

**When in doubt**: Default to stricter interpretation of rules (e.g., require evaluation before therapy). The professional can always override manually, but the system should guide toward best practices.
