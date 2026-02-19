# Configurar Gmail SMTP no n8n

## Passo 1: Gerar Senha de App no Google

1. Acesse https://myaccount.google.com/security
2. Ative **Verificação em 2 etapas** (se ainda não estiver)
3. Volte para Segurança → **Senhas de app**
4. Nome: `n8n` → Gerar
5. **Copie a senha de 16 caracteres** (aparece só uma vez!)

## Passo 2: Criar Credencial SMTP no n8n

1. No n8n, vá em **Credentials** → **Add Credential**
2. Tipo: **SMTP**
3. Preencha:
   - **User**: email da Graciele (ex: graciele@gmail.com)
   - **Password**: a senha de app de 16 caracteres
   - **Host**: `smtp.gmail.com`
   - **Port**: `587`
   - **SSL/TLS**: Sim (STARTTLS)
4. Salve

## Passo 3: Usar no Workflow

No workflow de follow-up, usar o node **Send Email** com:
- **From**: Dra. Graciele Cruz <graciele@gmail.com>
- **To**: email do responsável
- **Subject**: Avaliação Fonoaudiológica - [Nome da Criança]
- **HTML**: template de follow-up
- **Credential**: a SMTP criada acima

## Limites do Gmail Gratuito
- 500 emails/dia (pessoal)
- 2000 emails/dia (Google Workspace)
- Para o volume da Grafono (poucos leads/dia), é mais que suficiente
