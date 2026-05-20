-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    avatar_url TEXT,
    google_id TEXT UNIQUE,
    role TEXT DEFAULT 'member',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- Work Fronts
CREATE TABLE IF NOT EXISTS work_fronts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    owner_name TEXT,
    status TEXT DEFAULT 'on_track',
    progress INTEGER DEFAULT 0,
    color TEXT DEFAULT '#3B82F6',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- Tasks
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
    owner_name TEXT,
    work_front_id UUID REFERENCES work_fronts(id) ON DELETE SET NULL,
    deadline DATE,
    status TEXT DEFAULT 'pending',
    priority TEXT DEFAULT 'medium',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- Agenda Items
CREATE TABLE IF NOT EXISTS agenda_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    committee TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    priority TEXT DEFAULT 'medium',
    requester_name TEXT,
    estimated_duration INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- Meetings
CREATE TABLE IF NOT EXISTS meetings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    committee TEXT NOT NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    location TEXT,
    attendees TEXT,
    status TEXT DEFAULT 'scheduled',
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- Minutes
CREATE TABLE IF NOT EXISTS minutes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE NOT NULL,
    summary TEXT,
    decisions TEXT,
    action_items TEXT,
    next_steps TEXT,
    approved_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- Seed data for demo
INSERT INTO work_fronts (name, description, owner_name, status, progress, color) VALUES
    ('Comunicação & Mídia', 'Gestão de comunicados, assessoria e monitoramento de mídia', 'Ana Silva', 'at_risk', 60, '#F59E0B'),
    ('Operações & Logística', 'Continuidade operacional e gestão de supply chain', 'Carlos Mendes', 'on_track', 75, '#10B981'),
    ('Jurídico & Compliance', 'Riscos legais, contratos e regulatório', 'Dra. Beatriz Costa', 'critical', 30, '#EF4444'),
    ('Financeiro', 'Fluxo de caixa, provisões e stakeholders financeiros', 'Roberto Alves', 'on_track', 85, '#3B82F6'),
    ('RH & Pessoas', 'Comunicação interna, bem-estar e gestão de equipe', 'Mariana Lopes', 'on_track', 90, '#8B5CF6');
