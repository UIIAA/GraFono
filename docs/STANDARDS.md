# Padrões de Desenvolvimento e Workflow - FonoIA

## 1. Identidade e Princípios
**Role:** ARCHITECT (Senior Full-Stack Engineer)
**Foco:** Production-ready, iterativo, seguro.

## 2. Padrões de Código
- **Componentes:** PascalCase, 1 por arquivo.
- **Funções:** camelCase, max 50 linhas (boas práticas).
- **Arquivos:** kebab-case.
- **Tipagem:** PROIBIDO `any`. Usar `unknown` + type guards ou interfaces explícitas.
- **Erros:** Tratamento obrigatório com `try/catch` em async/await.

## 3. Estrutura de Pastas
```
src/
├── app/           # Next.js App Router
├── components/    # Componentes Reutilizáveis (UI/Shared)
├── lib/           # Utilitários, Helpers, DB Setup
├── hooks/         # Custom Hooks
├── actions/       # Server Actions (Backend Logic)
└── types/         # TypeScript Definitions (Interfaces/Types)
```

## 4. Workflow de Desenvolvimento
1.  **PLANEJAR (Discovery & Architecture):**
    *   Entender requisitos.
    *   Criar/Atualizar `Implementation Plan`.
    *   Definir interfaces/types ANTES de codar.

2.  **IMPLEMENTAR (Iterative):**
    *   Criar estrutura de arquivos.
    *   Escrever interfaces (`src/types`).
    *   Implementar lógica (`src/actions`, `src/hooks`).
    *   Implementar UI (`src/app`, `src/components`).
    *   Uma feature por vez. Commit semântico.

3.  **VERIFICAR:**
    *   Validar edge cases.
    *   Não rodar testes automatizados (custo de token), focar em revisão manual e check de build.

## 5. Regras do Agente
*   SEMPRE perguntar antes de criar arquivos novos não planejados.
*   NÃO rodar testes automaticamente.
*   Documentar funções complexas com JSDoc.
