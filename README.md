# CrisisOps — Governança de Comitês de Crise

Sistema web de governança para comitês de crise com dashboard executivo, plano de ação, backlog de pauta e registro de atas.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind CSS |
| Backend | FastAPI + SQLAlchemy |
| Banco de dados | PostgreSQL via Supabase |
| Autenticação | Google OAuth 2.0 + JWT |
| Gráficos | Recharts |

## Funcionalidades

- **Dashboard** — KPIs de tarefas, gauge de conclusão, status das frentes de trabalho
- **Plano de Ação** — Kanban de tarefas (Pendente / Em Andamento / Concluído / Bloqueado) com CRUD completo
- **Backlog de Pauta** — Itens separados por Comitê Estratégico e Operacional
- **Atas de Reunião** — Registro de reuniões com sumário, decisões, itens de ação e próximos passos
- **Login Google OAuth** — Autenticação segura com conta Google

## Configuração

### 1. Google OAuth

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um projeto → **APIs & Services → Credentials → Create OAuth 2.0 Client ID**
3. Tipo: **Web application**
4. Authorized origins: `http://localhost:3000`
5. Authorized redirect URIs: `http://localhost:3000`
6. Copie o **Client ID** e **Client Secret**

### 2. Supabase (produção) ou PostgreSQL local (dev)

**Para desenvolvimento local com Docker:**
```bash
# DATABASE_URL para o compose local
DATABASE_URL=postgresql://crisisops:crisisops_dev@db:5432/crisisops
```

**Para Supabase:**
1. Crie projeto em [supabase.com](https://supabase.com)
2. Vá em **Settings → Database** e copie a Connection String
3. Execute o migration em **SQL Editor**: cole o conteúdo de `supabase/migrations/001_initial_schema.sql`

### 3. Backend `.env`

```bash
cp backend/.env.example backend/.env
# Edite com seus valores
```

```env
DATABASE_URL=postgresql://crisisops:crisisops_dev@localhost:5432/crisisops
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=sua-chave-anon
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu-secret
SECRET_KEY=gere-uma-chave-forte-aqui
FRONTEND_URL=http://localhost:3000
```

### 4. Frontend `.env.local`

```bash
cp frontend/.env.local.example frontend/.env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
```

## Rodando com Docker Compose

```bash
docker-compose up --build
```

Acesse: http://localhost:3000

## Rodando sem Docker

**Backend:**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # ou .venv\Scripts\activate no Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Estrutura do Projeto

```
CrisisOps/
├── backend/
│   ├── app/
│   │   ├── api/routes/     # Endpoints FastAPI
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── auth.py         # JWT + Google OAuth
│   │   ├── config.py       # Settings
│   │   ├── database.py     # SQLAlchemy engine
│   │   └── main.py         # App FastAPI
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── dashboard/  # Dashboard KPIs
│       │   ├── action-plan/# Kanban de tarefas
│       │   ├── agenda/     # Backlog de pauta
│       │   └── minutes/    # Atas de reunião
│       ├── components/     # Sidebar, AppShell, UI
│       └── lib/            # API client, store, utils
├── supabase/
│   └── migrations/         # SQL de criação das tabelas
└── docker-compose.yml
```

## API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/v1/auth/google` | Login com Google token |
| GET | `/api/v1/auth/me` | Usuário atual |
| GET | `/api/v1/dashboard` | KPIs do dashboard |
| CRUD | `/api/v1/work-fronts` | Frentes de trabalho |
| CRUD | `/api/v1/tasks` | Tarefas do plano de ação |
| CRUD | `/api/v1/agenda` | Backlog de pauta |
| CRUD | `/api/v1/meetings` | Reuniões |
| CRUD | `/api/v1/minutes` | Atas |

Documentação interativa: http://localhost:8000/docs
