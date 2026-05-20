"""
Migration script: governance framework update (v2.0)
Run once against the production DB:
  python run_migration.py

Safe to run multiple times (IF NOT EXISTS / ON CONFLICT DO NOTHING).
"""
import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL not set")

engine = create_engine(DATABASE_URL)

MIGRATIONS = [
    # --- agenda_items: new governance fields ---
    "ALTER TABLE agenda_items ADD COLUMN IF NOT EXISTS impact TEXT",
    "ALTER TABLE agenda_items ADD COLUMN IF NOT EXISTS proposal TEXT",
    "ALTER TABLE agenda_items ADD COLUMN IF NOT EXISTS decision_needed BOOLEAN DEFAULT FALSE",
    "ALTER TABLE agenda_items ADD COLUMN IF NOT EXISTS item_type VARCHAR DEFAULT 'action'",
    "ALTER TABLE agenda_items ADD COLUMN IF NOT EXISTS suggested_owner VARCHAR",
    "ALTER TABLE agenda_items ADD COLUMN IF NOT EXISTS evidence TEXT",
    "ALTER TABLE agenda_items ADD COLUMN IF NOT EXISTS next_step TEXT",

    # --- tasks: new governance fields ---
    "ALTER TABLE tasks ADD COLUMN IF NOT EXISTS support_team VARCHAR",
    "ALTER TABLE tasks ADD COLUMN IF NOT EXISTS evidence TEXT",
    "ALTER TABLE tasks ADD COLUMN IF NOT EXISTS source_committee VARCHAR",
    "ALTER TABLE tasks ADD COLUMN IF NOT EXISTS next_step TEXT",
    "ALTER TABLE tasks ADD COLUMN IF NOT EXISTS impediment TEXT",

    # --- work_fronts: replace generic seed with the 10 official strategic fronts ---
    "DELETE FROM work_fronts WHERE owner_name IN ('Ana Silva','Carlos Mendes','Dra. Beatriz Costa','Roberto Alves','Mariana Lopes')",
    """
    INSERT INTO work_fronts (id, name, description, owner_name, status, progress, color)
    VALUES
      (gen_random_uuid(), 'Sustentabilidade Financeira',
       'Fluxo de caixa, contas a pagar/receber, renegociações e previsibilidade financeira',
       'Responsável Financeiro', 'on_track', 0, '#3B82F6'),

      (gen_random_uuid(), 'ERP, Dados e Regras de Negócio',
       'Tasy como base estruturante, BI, dados autoritativos e eliminação de planilhas paralelas',
       'Responsável TI', 'at_risk', 0, '#8B5CF6'),

      (gen_random_uuid(), 'Contratos, Rateios e Receitas',
       'Contratos de gestão, rateios, aditivos, glosas e cobranças pendentes',
       'Responsável Contratos', 'at_risk', 0, '#F59E0B'),

      (gen_random_uuid(), 'Processos, Rotinas e Padronização',
       'SLAs, instruções operacionais, regras de negócio e base de conhecimento',
       'Responsável Operações', 'on_track', 0, '#10B981'),

      (gen_random_uuid(), 'Projetos e Portfólio',
       'Projetos em execução, backlog, pré-projetos e iniciativas para captação',
       'Responsável Projetos', 'on_track', 0, '#06B6D4'),

      (gen_random_uuid(), 'Unidades, Operação e Protocolos',
       'Protocolos assistenciais, auditoria de unidades e indicadores assistenciais',
       'Responsável Operações', 'on_track', 0, '#84CC16'),

      (gen_random_uuid(), 'Compliance, Jurídico e Prestação de Contas',
       'Requisitos legais, prestação de contas, órgãos públicos e matriz de riscos',
       'Jurídico', 'critical', 0, '#EF4444'),

      (gen_random_uuid(), 'Suprimentos, Manutenção e Contratações',
       'Regulamento de compras, cotações, manutenção predial e engenharia clínica',
       'Responsável Suprimentos', 'on_track', 0, '#F97316'),

      (gen_random_uuid(), 'Pessoas, Papéis e Performance',
       'Papéis e responsabilidades, avaliação de desempenho e capacidade da equipe',
       'Responsável RH', 'on_track', 0, '#EC4899'),

      (gen_random_uuid(), 'Comunicação e Stakeholders',
       'Comunicação institucional com colaboradores, fornecedores, prefeituras e órgãos externos',
       'Responsável Comunicação', 'on_track', 0, '#A78BFA')
    ON CONFLICT DO NOTHING
    """,
]


def run():
    with engine.connect() as conn:
        for sql in MIGRATIONS:
            sql = sql.strip()
            if sql:
                print(f"Running: {sql[:80]}...")
                conn.execute(text(sql))
        conn.commit()
    print("\nMigration complete.")


if __name__ == "__main__":
    run()
