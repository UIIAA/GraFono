# 🔐 Como Acessar o Sistema com Login

A autenticação foi implementada! Para conseguir fazer o primeiro login, você precisa de 2 passos simples:

## 1. Configurar Variáveis na Vercel
Vá no painel da Vercel > Settings > Environment Variables e adicione:

- **Key:** `NEXTAUTH_SECRET`
- **Value:** (Gere uma string aleatória, pode digitar qualquer coisa longa e estranha, ex: `s3cr3t_v3ry_c0mpl3x_123!@#`)
- **Key:** `NEXTAUTH_URL` (Geralmente a Vercel configura sozinha, mas se der erro de redirecionamento, adicione sua URL: `https://seu-projeto.vercel.app`)

*Redeploy o projeto após adicionar as variáveis (ou espere o próximo commit).*

## 2. Definir sua Senha no Banco de Dados (Neon)
Como você já tem usuários criados, eles estão "sem senha" (`null`). Você precisa definir uma senha para o seu e-mail manualmente.

1.  Vá no Console do Neon (neon.tech).
2.  Abra o **SQL Editor**.
3.  Rode este comando (substitua `seu@email.com` pelo seu e-mail real cadastrado):

```sql
-- Define a senha como "123456" para este usuário
UPDATE "User"
SET "password" = '$2a$12$W9E/fQx.t.P4b.a/I.f/..d.f/...' 
-- Ops, melhor usar um hash válido gerado. Abaixo está o hash para "123456":
SET "password" = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'
WHERE "email" = 'seu@email.com';
```

*(Se não souber qual e-mail está cadastrado, rode `SELECT * FROM "User";` antes)*

## 3. Acessar
Vá para `/login`, digite seu e-mail e a senha `123456`.
