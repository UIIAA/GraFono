# 📝 Sistema de Blog - Grafono

## Como Adicionar Novos Posts

### 1. Estrutura de Arquivos

```
content/blog/
├── nome-do-post.md
├── outro-post.md
└── ...

public/images/blog/
├── nome-do-post.jpg
├── outro-post.jpg
└── ...
```

### 2. Criando um Novo Post

1. **Crie um arquivo `.md`** na pasta `content/blog/`
2. **Adicione a imagem** na pasta `public/images/blog/`
3. **Use o template abaixo:**

```markdown
---
title: "Título do Seu Post"
excerpt: "Descrição curta que aparece no carrossel (máx 150 caracteres)"
image: "/images/blog/sua-imagem.jpg"
date: "2024-08-17"
category: "Categoria"
readTime: "5 min"
---

# Título do Seu Post

Seu conteúdo em Markdown aqui...

## Subtítulo

- Lista de itens
- Outro item

**Texto em negrito**

*Texto em itálico*
```

### 3. Campos do Cabeçalho (Front Matter)

- **title**: Título que aparece no carrossel e na página do post
- **excerpt**: Resumo do post (máx 150 caracteres)
- **image**: Caminho para a imagem (`/images/blog/nome-da-imagem.jpg`)
- **date**: Data no formato `YYYY-MM-DD`
- **category**: Categoria do post (ex: "Dicas para Pais", "Desenvolvimento", "Avaliação")
- **readTime**: Tempo estimado de leitura (ex: "5 min")

### 4. Adicionando Imagens

1. **Coloque a imagem** na pasta `public/images/blog/`
2. **Formatos suportados**: JPG, PNG, WebP
3. **Tamanho recomendado**: 1200x600px (proporção 2:1)
4. **Nome do arquivo**: use kebab-case (ex: `meu-post-sobre-fala.jpg`)

### 5. Exemplo Completo

**Arquivo**: `content/blog/desenvolver-vocabulario-crianca.md`

```markdown
---
title: "Como desenvolver o vocabulário da criança"
excerpt: "Estratégias práticas e divertidas para ampliar o repertório de palavras do seu filho de forma natural."
image: "/images/blog/desenvolver-vocabulario-crianca.jpg"
date: "2024-08-17"
category: "Dicas para Pais"
readTime: "6 min"
---

# Como desenvolver o vocabulário da criança

O desenvolvimento do vocabulário é fundamental para a comunicação eficaz...

## 1. Leitura Compartilhada

A leitura é uma das formas mais eficazes...

## 2. Conversas do Dia a Dia

- Narrar atividades cotidianas
- Fazer perguntas abertas
- Expandir as respostas da criança

**Dica importante**: Seja paciente e celebre cada progresso!
```

### 6. Funcionalidades Automáticas

✅ **Carrossel responsivo** (1, 2 ou 3 colunas)
✅ **Troca automática** a cada 5 segundos
✅ **Navegação manual** com setas e indicadores
✅ **Páginas individuais** para cada post
✅ **Posts relacionados** automáticos
✅ **Fallback para imagens** (emoji se não carregar)
✅ **Ordenação por data** (mais recente primeiro)

### 7. Hospedagem

Este sistema funciona em **qualquer hospedagem** que suporte Next.js:
- Vercel (recomendado)
- Netlify
- Servidor próprio com Node.js

Os posts são lidos dos arquivos estáticos, não precisando de banco de dados!

### 8. URLs dos Posts

Cada post fica disponível em: `https://seusite.com/blog/nome-do-arquivo`

Exemplo: `desenvolver-vocabulario-crianca.md` → `https://grafono.com/blog/desenvolver-vocabulario-crianca`

---

## 🚀 Para Desenvolvedores

### Estrutura Técnica

- **Framework**: Next.js 15 com App Router
- **Parsing**: gray-matter para front matter
- **Renderização**: react-markdown para conteúdo
- **Carrossel**: Componente customizado responsivo
- **Imagens**: Next.js Image com fallback automático

### Comandos Úteis

```bash
# Adicionar novo post (exemplo)
touch content/blog/novo-post.md

# Verificar posts carregados
npm run dev
# Abrir: http://localhost:3000

# Build para produção
npm run build
```