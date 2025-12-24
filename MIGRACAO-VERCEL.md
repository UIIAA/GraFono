# Plano de Migração Grafono para Vercel

## 📋 Resumo
Este documento detalha os passos necessários para migrar a aplicação Grafono do servidor customizado atual para deploy na Vercel, mantendo todas as funcionalidades principais.

## 🎯 Objetivos
- Migrar de servidor customizado para arquitetura serverless Vercel
- Manter funcionalidades do blog e API routes
- Substituir SQLite por banco cloud
- Adaptar ou remover funcionalidades Socket.IO

## 📊 Status Atual
- **Framework**: Next.js 15.3.5 com servidor customizado
- **Banco**: SQLite local com Prisma
- **WebSocket**: Socket.IO para comunicação em tempo real
- **Deploy**: Desenvolvimento local

## 🚀 Fases da Migração

### **Fase 1: Preparação do Banco de Dados**
**Tempo estimado: 2-3 horas**

#### 1.1 Escolher provedor de banco
- **Opção A**: Vercel Postgres (integração nativa)
- **Opção B**: Supabase (mais generoso no plano gratuito)
- **Opção C**: PlanetScale (MySQL, descontinuado para novos projetos)

#### 1.2 Configurar novo banco
```bash
# Se escolher Vercel Postgres
npm install @vercel/postgres
# Ou se escolher Supabase
npm install @supabase/supabase-js
```

#### 1.3 Atualizar schema Prisma
```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql" // muda de sqlite
  url      = env("DATABASE_URL")
}
```

#### 1.4 Migrar dados
- Fazer backup dos dados SQLite existentes
- Executar `prisma migrate dev` no novo banco
- Importar dados se necessário

### **Fase 2: Remover Servidor Customizado**
**Tempo estimado: 1-2 horas**

#### 2.1 Arquivos para remover/modificar
- ❌ `server.ts` (remover completamente)
- ❌ `src/lib/socket.ts` (remover)
- ❌ `examples/websocket/` (remover ou mover para pasta docs)

#### 2.2 Atualizar package.json
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build", 
    "start": "next start"
  }
}
```

#### 2.3 Remover dependências Socket.IO
```bash
npm uninstall socket.io socket.io-client
```

### **Fase 3: Substituir Funcionalidades WebSocket**
**Tempo estimado: 3-4 horas**

#### Opção A: Remover (Recomendado para MVP)
- Simplesmente remover as funcionalidades de chat/websocket
- Focar no blog e funcionalidades estáticas

#### Opção B: Server-Sent Events
```typescript
// src/app/api/events/route.ts
export async function GET() {
  const encoder = new TextEncoder();
  
  const customReadable = new ReadableStream({
    start(controller) {
      // Implementar SSE
    }
  });
  
  return new Response(customReadable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  });
}
```

#### Opção C: Polling com React Query
```typescript
// Usar React Query para fazer polling
const { data } = useQuery({
  queryKey: ['messages'],
  queryFn: fetchMessages,
  refetchInterval: 5000, // poll a cada 5s
});
```

### **Fase 4: Configurar para Vercel**
**Tempo estimado: 1 hora**

#### 4.1 Criar vercel.json (se necessário)
```json
{
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 10
    }
  },
  "crons": []
}
```

#### 4.2 Configurar variáveis de ambiente
No painel Vercel, adicionar:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- Outras variáveis necessárias

#### 4.3 Testar build local
```bash
npm run build
npm run start
```

### **Fase 5: Deploy e Otimizações**
**Tempo estimado: 2 horas**

#### 5.1 Deploy inicial
- Conectar repositório ao Vercel
- Configurar build settings
- Fazer primeiro deploy

#### 5.2 Otimizações
- Configurar ISR para posts do blog
- Otimizar imagens com next/image
- Configurar cache headers apropriados
- Monitorar performance

## ⚠️ Pontos de Atenção

### Limitações Vercel Free
- 100 execuções serverless/dia
- 10s timeout por função
- 100GB bandwidth/mês

### Funcionalidades que serão perdidas
- WebSocket em tempo real
- Servidor sempre ativo

### Testes necessários
- [ ] Build funciona sem erros
- [ ] API routes respondem corretamente
- [ ] Blog carrega posts corretamente
- [ ] Banco de dados conecta
- [ ] Imagens carregam
- [ ] Performance adequada

## 📱 Comandos Úteis

```bash
# Testar build local
npm run build

# Instalar Vercel CLI
npm i -g vercel

# Deploy de teste
vercel --prod

# Ver logs
vercel logs [deployment-url]

# Gerenciar variáveis de ambiente
vercel env add [name]
```

## 🔄 Rollback Plan
Em caso de problemas:
1. Manter servidor atual funcionando
2. Fazer deploy em domínio de teste primeiro
3. Validar todas funcionalidades
4. Só migrar domínio principal após confirmação

## ✅ Checklist Final
- [ ] Banco migrado e funcionando
- [ ] Build sem erros
- [ ] Deploy de teste realizado
- [ ] Performance testada
- [ ] Backup dos dados realizado
- [ ] Domínio configurado
- [ ] Monitoramento ativo

---

**Estimativa total**: 8-12 horas de trabalho
**Complexidade**: Média
**Risco**: Baixo (com testes adequados)