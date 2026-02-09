# Frontend Architecture Guide

## Description
Comprehensive guide to Grafono's frontend architecture using Next.js 16 App Router, React Server Components, and Premium UI patterns. Covers routing, component organization, state management, forms, and UI conventions for building a high-performance, accessible SaaS application.

## Persona
**Role:** Frontend Architect & React Specialist
**Mindset:** "Structure enables speed. Conventions prevent chaos. Premium UX is non-negotiable."
**Mantra:** "Server-first. Client when needed. Always accessible."

## Technical Grounding (The "Brain")
> *Auto-generated Research Notes:*
> * **Framework:** Next.js 16.1.1 (App Router, React Server Components, Turbopack dev mode).
> * **Rendering Strategy:** Server Components by default, Client Components (`"use client"`) only when necessary (interactivity, hooks, browser APIs).
> * **UI Foundation:** Tailwind CSS 4 + shadcn/ui (Radix UI primitives). Zero custom CSS files.
> * **State Management:** Zustand for global client state + TanStack Query for server state caching.
> * **Forms:** React Hook Form + Zod validation (type-safe schemas).
> * **Motion:** Framer Motion for animations (see `frontend_premium.md` for advanced patterns).
> * **DnD:** @dnd-kit for drag-and-drop (Kanban boards).

## Context & Rules
*   **Project:** Grafono - Speech Therapy Patient Management SaaS.
*   **Non-Negotiables:**
    1.  **The RSC Rule:** Start with Server Components. Only add `"use client"` when you need: `useState`, `useEffect`, `onClick`, browser APIs, or third-party libraries requiring client-side execution.
    2.  **The `_components` Rule:** Route-specific components MUST live in `src/app/(app)/[route]/_components/`. The underscore prevents Next.js from treating them as routes.
    3.  **The shadcn Rule:** NEVER modify files in `src/components/ui/`. If you need customization, compose or wrap in `src/components/`.
    4.  **The Action Rule:** Database operations MUST use Server Actions from `src/app/actions/*.ts`. No direct Prisma calls from Client Components.
    5.  **The Accessibility Rule:** All interactive elements must be keyboard-accessible. Use Radix primitives (via shadcn) to ensure ARIA compliance.

## Route Architecture

### Protected Routes (Middleware-Protected)
All routes under `src/app/(app)/` require authentication (see `src/middleware.ts`):

```
(app)/
├── dashboard/              # Main metrics dashboard
├── pacientes/              # Patient management
│   ├── [id]/
│   │   └── evolucao/       # Patient evolution notes timeline
│   └── _components/        # Kanban board, dialogs, cards
├── agenda/                 # Appointment scheduling
│   └── _components/        # Session dialogs, confirmation assistant
├── financeiro/             # Financial management
│   ├── adimplencia/        # Payment compliance tracking
│   └── _components/        # Finance dialogs, dashboard client
├── relatorios/             # Clinical reports
├── modelos/                # Document templates
├── metricas/               # Analytics dashboard
├── configuracoes/          # Professional settings
```

**⚠️ Not Protected by Middleware:**
- `/avaliacoes` - Clinical assessments
- `/exames` - Patient exams
- `/calculadora` - Clinical calculators

### Public Routes
```
(site)/
├── landing/                # Marketing landing page
├── sobre/                  # About page
└── blog/                   # Blog with MDX support

/portal                     # Patient portal (separate auth)
/login                      # Login page
```

## Component Organization

### Structural Hierarchy
```
src/
├── components/
│   ├── ui/                      # shadcn/ui primitives (DO NOT MODIFY)
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   └── ...
│   ├── patient-card.tsx         # Shared components (used across routes)
│   ├── ai/
│   │   └── ai-assistant.tsx
│   └── ...
└── app/
    └── (app)/
        └── [route]/
            ├── page.tsx         # Route entry point
            ├── layout.tsx       # Route-specific layout (optional)
            └── _components/     # Route-specific components (CONVENTION)
                ├── component-dialog.tsx
                └── component-client.tsx
```

### Naming Conventions
- **Server Components:** `component-name.tsx` (default, no "use client")
- **Client Components:** `component-name-client.tsx` or add `"use client"` directive
- **Dialogs:** `[feature]-dialog.tsx` (e.g., `patient-dialog.tsx`)
- **Forms:** `[feature]-form.tsx` (e.g., `evolution-form.tsx`)
- **Route-specific:** Always in `_components/` subdirectory

### Example: Patient Module Structure
```
pacientes/
├── page.tsx                     # Server Component (data fetching)
├── types.ts                     # TypeScript interfaces
└── _components/
    ├── board-column.tsx         # Kanban column (Client Component - DnD)
    ├── patient-dialog.tsx       # Create/Edit dialog (Client - form state)
    ├── patient-mobile-card.tsx  # Mobile view card
    ├── task-card.tsx            # Draggable card wrapper
    └── history-dialog.tsx       # Patient history viewer
```

## State Management

### Server State (TanStack Query)
Use for data fetching and caching:

```typescript
"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPatients, savePatient } from "@/app/actions/patient";

export function PatientsClient() {
  const queryClient = useQueryClient();

  // Fetch data with caching
  const { data: patients, isLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => await getPatients(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Mutations with optimistic updates
  const mutation = useMutation({
    mutationFn: savePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });

  return (
    <div>
      {isLoading ? <Skeleton /> : <PatientList patients={patients} />}
    </div>
  );
}
```

### Client State (Zustand)
Use for UI state (modals, filters, local preferences):

```typescript
// src/stores/ui-store.ts
import { create } from "zustand";

interface UIStore {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  currentView: "kanban" | "table";
  setView: (view: "kanban" | "table") => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  currentView: "kanban",
  setView: (view) => set({ currentView: view }),
}));

// Usage in component
"use client";
import { useUIStore } from "@/stores/ui-store";

export function ViewToggle() {
  const { currentView, setView } = useUIStore();
  return (
    <Tabs value={currentView} onValueChange={setView}>
      <TabsList>
        <TabsTrigger value="kanban">Kanban</TabsTrigger>
        <TabsTrigger value="table">Tabela</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
```

### When to Use What?
- **Server Components + Server Actions:** Default for data fetching/mutations
- **TanStack Query:** Client-side caching, polling, infinite scroll
- **Zustand:** Global UI state (theme, sidebar, filters)
- **useState:** Local component state (form inputs, toggles)

## Form Patterns

### React Hook Form + Zod Integration
Standard pattern for all forms in Grafono:

```typescript
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { savePatient } from "@/app/actions/patient";

// Zod schema (type-safe validation)
const patientSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().regex(/^\d{10,11}$/, "Telefone inválido"),
  birthDate: z.string().optional(),
  negotiatedValue: z.number().positive("Valor deve ser positivo"),
});

type PatientFormData = z.infer<typeof patientSchema>;

export function PatientForm({ onSuccess }: { onSuccess?: () => void }) {
  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      negotiatedValue: 0,
    },
  });

  const onSubmit = async (data: PatientFormData) => {
    const result = await savePatient(data);
    if (result.success) {
      form.reset();
      onSuccess?.();
    } else {
      // Handle error (show toast, etc.)
      console.error(result.error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input placeholder="(11) 99999-9999" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Salvando..." : "Salvar Paciente"}
        </Button>
      </form>
    </Form>
  );
}
```

### Form Best Practices
1. **Always use Zod schemas** - Type safety and runtime validation
2. **Use `FormField` wrapper** - Automatic label/error binding
3. **Handle loading states** - `isSubmitting` for buttons
4. **Reset after success** - `form.reset()` to clear fields
5. **Server-side validation** - Validate again in Server Actions (see `backend_deep.md`)

## UI Conventions

### Premium Styling (Aceternity Standard)
See `frontend_premium.md` for full guide. Key patterns:

#### Glass Cards
```tsx
<div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-indigo-500/30 transition-colors">
  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity" />
  <div className="relative z-10">{children}</div>
</div>
```

#### Pill Tabs (Premium Pattern)
```tsx
<Tabs defaultValue="overview" className="w-full">
  <TabsList className="bg-muted/50 p-1 rounded-full">
    <TabsTrigger value="overview" className="rounded-full px-6">
      Overview
    </TabsTrigger>
    <TabsTrigger value="details" className="rounded-full px-6">
      Detalhes
    </TabsTrigger>
  </TabsList>
</Tabs>
```

#### Micro-Interactions (Framer Motion)
```tsx
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  whileHover={{ y: -2 }}
  transition={{ duration: 0.3 }}
>
  {children}
</motion.div>
```

### Tailwind Conventions
- **Spacing:** Use consistent scale (`p-4`, `gap-6`, `space-y-8`)
- **Typography:** `text-sm`, `text-base`, `text-lg` (never custom px values)
- **Colors:** Use semantic tokens (`bg-background`, `text-foreground`, `border-border`)
- **Responsive:** Mobile-first (`md:`, `lg:` for larger screens)
- **Dark Mode:** Automatic via Tailwind dark mode (`dark:bg-card`)

### Accessibility Checklist
- ✅ All buttons have visible focus states (Radix handles this)
- ✅ Form fields have associated labels (`FormLabel` component)
- ✅ Dialogs trap focus and close on Escape (Radix Dialog)
- ✅ Color contrast meets WCAG AA (test with browser tools)
- ✅ Keyboard navigation works for all interactive elements

## Templates

### Component Template (Client Component)
```tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface ComponentProps {
  title: string;
  onAction?: () => void;
  className?: string;
}

export function ComponentName({ title, onAction, className }: ComponentProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async () => {
    setIsLoading(true);
    try {
      await onAction?.();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleAction} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Executar Ação
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
```

### Page Template (Server Component with Client Wrapper)
```tsx
// src/app/(app)/feature/page.tsx
import { Suspense } from "react";
import { getFeatureData } from "@/app/actions/feature";
import { FeatureClient } from "./_components/feature-client";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic"; // Disable static optimization

export default async function FeaturePage() {
  // Server-side data fetching
  const initialData = await getFeatureData();

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Feature Title</h1>
        <p className="text-muted-foreground">Feature description</p>
      </div>

      <Suspense fallback={<Skeleton className="h-96" />}>
        <FeatureClient initialData={initialData} />
      </Suspense>
    </div>
  );
}
```

### Dialog Template (Modal Pattern)
```tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const schema = z.object({
  field: z.string().min(1, "Campo obrigatório"),
});

type FormData = z.infer<typeof schema>;

interface FeatureDialogProps {
  onSave?: (data: FormData) => void;
  trigger?: React.ReactNode;
}

export function FeatureDialog({ onSave, trigger }: FeatureDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleSubmit = async (data: FormData) => {
    await onSave?.(data);
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>Abrir Dialog</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>
            Dialog description text
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="field"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campo</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

## Performance Optimization

### Server Component Patterns
```tsx
// ✅ GOOD: Fetch data in Server Component
export default async function Page() {
  const data = await getData(); // Direct Server Action call
  return <ClientComponent data={data} />;
}

// ❌ BAD: Fetch data in Client Component (unless needed for caching/polling)
"use client";
export default function Page() {
  const [data, setData] = useState([]);
  useEffect(() => {
    getData().then(setData); // Unnecessary client-side fetch
  }, []);
}
```

### Code Splitting
```tsx
// Dynamic imports for heavy components
import dynamic from "next/dynamic";

const HeavyChart = dynamic(() => import("@/components/heavy-chart"), {
  loading: () => <Skeleton className="h-64" />,
  ssr: false, // Client-only rendering
});

export function Dashboard() {
  return (
    <div>
      <HeavyChart data={chartData} />
    </div>
  );
}
```

### Image Optimization
```tsx
import Image from "next/image";

<Image
  src="/patient-avatar.jpg"
  alt="Patient photo"
  width={64}
  height={64}
  className="rounded-full"
  priority // For above-the-fold images
/>
```

## Common Patterns

### Loading States
```tsx
"use client";
import { Skeleton } from "@/components/ui/skeleton";

export function PatientList() {
  const { data, isLoading } = useQuery({ queryKey: ["patients"], queryFn: getPatients });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  return <div>{/* Render data */}</div>;
}
```

### Error Boundaries
```tsx
// src/app/(app)/feature/error.tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-96">
      <h2 className="text-2xl font-bold">Algo deu errado</h2>
      <p className="text-muted-foreground mb-4">{error.message}</p>
      <Button onClick={reset}>Tentar novamente</Button>
    </div>
  );
}
```

### Infinite Scroll (TanStack Query)
```tsx
"use client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

export function InfiniteList() {
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["items"],
    queryFn: ({ pageParam = 0 }) => fetchItems(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div>
      {data?.pages.map((page) =>
        page.items.map((item) => <ItemCard key={item.id} {...item} />)
      )}
      {hasNextPage && <div ref={ref}>Loading more...</div>}
    </div>
  );
}
```

## Related Guides
- **Backend Integration:** See `backend_deep.md` for Server Actions patterns
- **Premium UI:** See `frontend_premium.md` for advanced animations and styling
- **Database:** See `db_prisma_guide.md` for data modeling
- **Design System:** See `design_architecture.md` for visual language
