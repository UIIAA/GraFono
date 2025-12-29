# 🚀 Requisitos para Migração Serverless (Vercel)

Este documento detalha o plano para transformar o projeto **GraFono** em uma aplicação **Fully Serverless**, compatível com a infraestrutura da Vercel, eliminando o servidor customizado (`server.ts`) e dependências de processos de longa duração (`socket.io` self-hosted).

---

## 📋 1. Visão Geral dos Problemas Atuais

Atualmente, o projeto utiliza um **Custom Server** (`server.ts`) para rodar o Next.js junto com o `socket.io`.
- **Problema:** A Vercel (e arquiteturas serverless em geral) não suporta servidores Node.js persistentes. As funções serverless "nascem e morrem" em milissegundos.
- **Impacto:** O `server.ts` impede o deploy padrão da Vercel. Se forçado, o WebSocket não funcionará porque não haverá um processo mestre ouvindo conexões.
- **Diagnóstico:** Verificamos que **não há uso ativo** de WebSockets no frontend atual (chat ou notificações reais). O código existente é apenas um boilerplate de "Eco".

---

## 🛠️ 2. Opções de Solução para Real-Time (Futuro)

Caso o projeto necessite de funcionalidades em tempo real (Chat, notificações instantâneas, status online), estas são as 3 arquiteturas recomendadas para Vercel:

### Opção A: Pusher (Recomendada para Produção) 🏆
Backend-as-a-Service focado em Pub/Sub. Extremamente estável e fácil de integrar com Next.js Server Actions/API Routes.

*   **Prós:** SDK robusto, debug console excelente, escalabilidade infinita sem gerenciar servidores.
*   **Contras:** Pago após limite grátis (mas limite é generoso: 200k msgs/dia/200 conexões).
*   **Ideal para:** Chat profissional, notificações críticas.

### Opção B: Ably (Melhor Plano Gratuito) 💰
Similar ao Pusher, mas com cotas gratuitas ligeiramente maiores em alguns aspectos e garantia de entrega de mensagens.

*   **Prós:** Alta confiabilidade, histórico de mensagens persistente.
*   **Contras:** API um pouco mais complexa que o Pusher.
*   **Ideal para:** Apps com muitos usuários simultâneos no plano free.

### Opção C: Server Sent Events (SSE) (Nativo/Grátis) 🛠️
Usar conexões HTTP persistentes (uni-direcional: Server -> Client) nativas do navegador.

*   **Prós:** Custo Zero (usa infra serverless padrão), sem vendor lock-in.
*   **Contras:** Limitações de conexão na Vercel (Duration Limit da função serverless), difícil de escalar para chat bi-direcional.
*   **Ideal para:** Apenas notificações simples (ex: "Relatório pronto").

---

## ✅ 3. Checklist de Implementação (Migração Imediata)

Como o Socket.io atual **não está sendo usado**, a migração é uma **Remoção de Débito Técnico**.

- [ ] **1. Limpeza de Dependências**
    - Remover `socket.io` e `socket.io-client` do `package.json`.
    - Remover `@types/socket.io` (se houver).
- [ ] **2. Remoção do Custom Server**
    - Excluir arquivo `server.ts`.
    - Excluir arquivo `src/lib/socket.ts` (lógica de eco não utilizada).
- [ ] **3. Ajuste de Scripts**
    - Alterar script `dev` no `package.json` para usar `next dev` padrão.
    - Alterar script `start` no `package.json` para usar `next start` padrão.
- [ ] **4. Validação**
    - Rodar `npm run dev` e garantir que o site carrega sem o servidor customizado.

---

## ⏱️ 4. Estimativa de Esforço

*   **Cenário Atual (Remoção):** ~30 minutos. (Baixo Risco)
*   **Cenário Implementação Real-Time (Pusher):** ~4 a 6 horas. (Médio Risco - envolve Frontend e Backend).

---

## 💰 5. Estimativa de Custos (Real-Time)

| Serviço | Plano Free | Plano Pro |
| :--- | :--- | :--- |
| **Pusher** | 200k msgs/dia, 100 conexões | ~$49/mês |
| **Ably** | 6M msgs/mês, 200 conexões | ~$29/mês |
| **Vercel (Serverless)** | Incluído no plano (limites de tempo) | Incluído (pay-as-you-go) |

---

## 📝 6. Exemplos de Código (Se formos usar Pusher)

**Instalação:**
```bash
npm install pusher pusher-js
```

**Server Action (Enviar Notificação):**
```typescript
// src/lib/pusher.ts
import Pusher from "pusher";

export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: "us2",
  useTLS: true
});

// src/app/actions/notify.ts
"use server"
import { pusherServer } from "@/lib/pusher";

export async function notifyUser(userId: string, message: string) {
  await pusherServer.trigger(`user-${userId}`, "notification", {
    message: message
  });
}
```

**Client Component (Receber Notificação):**
```tsx
"use client"
import PusherClient from "pusher-js";
import { useEffect } from "react";

export function NotificationListener({ userId }: { userId: string }) {
  useEffect(() => {
    const pusher = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: 'us2'
    });

    const channel = pusher.subscribe(`user-${userId}`);
    channel.bind("notification", (data: any) => {
      alert(data.message); // Ou usar Toast
    });

    return () => pusher.unsubscribe(`user-${userId}`);
  }, [userId]);

  return null;
}
```

---

## 🗑️ 7. Arquivos a Deletar (Agora)

Para transformar em Serverless **hoje**:

1.  `DELETE` -> `/server.ts`
2.  `DELETE` -> `/src/lib/socket.ts`
3.  `MODIFY` -> `package.json` (Scripts e Dependencies)
