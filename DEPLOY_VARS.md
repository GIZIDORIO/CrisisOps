# Variáveis de Ambiente para Deploy

## Railway (Backend)
Adicione estas variáveis no painel Railway → seu serviço → Variables:

```
GOOGLE_CLIENT_ID=36359322873-jvo192506b9duqhglggkv7g8gc7j1g34.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
SECRET_KEY=5dc21c67c22830bf438ef19baf58394c02af5b258c86807c79fa4596f3392fd9
FRONTEND_URL=https://SEU-PROJETO.vercel.app
DATABASE_URL=  ← gerado automaticamente pelo Railway PostgreSQL
```

## Vercel (Frontend)
Adicione estas variáveis em Vercel → projeto → Settings → Environment Variables:

```
NEXT_PUBLIC_API_URL=https://SEU-BACKEND.railway.app
NEXT_PUBLIC_GOOGLE_CLIENT_ID=36359322873-jvo192506b9duqhglggkv7g8gc7j1g34.apps.googleusercontent.com
```

## Google OAuth — URLs de Produção
Adicione no Google Cloud Console → Credenciais → seu Client ID:
- Authorized JavaScript origins: https://SEU-PROJETO.vercel.app
- Authorized redirect URIs: https://SEU-PROJETO.vercel.app
