# Feature: Go-Live gracielefono.com.br
**Status:** In Progress
**Priority:** P0
**Date:** 2026-02-20

## Objetivo
Preparar o site institucional gracielefono.com.br para lançamento público com todos os elementos funcionando, otimizados e profissionais.

## Checklist de Tarefas

### Batch 1 — Executar Agora (Claude)
- [x] 1. **Otimizar imagem hero** — `hero-fono-crianca.png` (1.3MB → <300KB JPEG)
- [x] 2. **Menu mobile (hamburger)** — Criar nav mobile no `layout.tsx`
- [x] 3. **Sitemap.ts** — Gerar sitemap dinâmico com todas as rotas públicas
- [x] 4. **Favicon SVG** — "G" rosinha circular (mesmo design do header)
- [x] 5. **Apple Touch Icon** — PNG 180x180 do ícone G
- [x] 6. **manifest.json** — Web app manifest básico
- [x] 7. **OG Image** — Imagem 1200x630 para compartilhamento social
- [x] 8. **JSON-LD** — Dados estruturados (LocalBusiness + ProfessionalService)
- [x] 9. **GA4 placeholder** — Script pronto, ativado via env `NEXT_PUBLIC_GA_ID`
- [x] 10. **Google Search Console** — Meta tag via env `NEXT_PUBLIC_GSC_VERIFICATION`
- [x] 11. **Remover imagens não usadas** — professional-1/2/3.jpg
- [x] 12. **Suprimir blog** — Remover links/referências do blog das rotas acessíveis

### Batch 2 — Precisa do Marcos
- [ ] 13. **GA4 Measurement ID** — Criar propriedade em analytics.google.com e pegar `G-XXXXXXXXXX`
  - Ir em analytics.google.com → Criar conta/propriedade → Copiar Measurement ID
  - Adicionar no Vercel: Settings → Environment Variables → `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX`
- [ ] 14. **Google Search Console** — Verificar propriedade em search.google.com/search-console
  - Adicionar propriedade → Método "Tag HTML" → Copiar conteúdo do meta tag
  - Adicionar no Vercel: `NEXT_PUBLIC_GSC_VERIFICATION=valor_da_meta_tag`
- [ ] 15. **Links dos PDFs** — Criar pasta no Google Drive, subir PDFs, trazer links de compartilhamento
  - Atualizar `href` no array `resources` em `src/app/(institucional)/_components/resources-grid.tsx`
  - Trocar `badge: "Em breve"` para o tipo correto ("PDF Gratuito", "E-book")
- [ ] 16. **Verificar domínio** — Confirmar que gracielefono.com.br aponta corretamente no Vercel
  - Vercel Dashboard → Project → Settings → Domains → Verificar status

## Decisões Técnicas
- **Imagem hero**: Converter PNG→JPEG com quality 80 via `sharp` (de 1.3MB para ~200KB)
- **Favicon**: SVG inline no `<head>` + PNG fallback gerado via sharp
- **OG Image**: HTML→PNG via Playwright (1200x630)
- **GA4**: Script no `<head>` condicional via `NEXT_PUBLIC_GA_ID`
- **Blog**: Manter rotas mas remover todos os links internos que apontam para blog
- **Sitemap**: `src/app/sitemap.ts` com generateSitemaps do Next.js

## Como continuar na próxima sessão
```bash
# 1. Verificar o que foi feito
git log --oneline -10

# 2. Adicionar GA4 (depois de criar conta)
# No Vercel Dashboard → Settings → Environment Variables:
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# 3. Adicionar Google Search Console
# NEXT_PUBLIC_GSC_VERIFICATION=codigo_verificacao

# 4. Atualizar links dos PDFs
# Editar: src/app/(institucional)/_components/resources-grid.tsx
# Trocar href: "" para o link do Google Drive
# Trocar badge: "Em breve" para "PDF Gratuito" ou "E-book"

# 5. Deploy e verificar
vercel --prod
```

## Dependências
- Depende de: Conta GA4 (Marcos), Conta Search Console (Marcos), PDFs prontos
- Bloqueia: Lançamento público do site
