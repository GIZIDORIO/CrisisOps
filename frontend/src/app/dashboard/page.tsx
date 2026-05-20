"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import { api } from "@/lib/api";
import { statusLabels } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  Calendar,
  ClipboardList,
  Activity,
  Users,
} from "lucide-react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DashboardData {
  task_stats: { total: number; completed: number; in_progress: number; pending: number; blocked: number; overdue: number };
  work_front_stats: { total: number; on_track: number; at_risk: number; critical: number; completed: number };
  work_fronts: any[];
  recent_tasks: any[];
  upcoming_meetings: number;
  agenda_pending: number;
}

function KPICard({
  title,
  value,
  sub,
  icon: Icon,
  color,
}: {
  title: string;
  value: number | string;
  sub?: string;
  icon: any;
  color: string;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wider mb-1">{title}</p>
          <p className="text-3xl font-bold text-text-primary">{value}</p>
          {sub && <p className="text-text-muted text-xs mt-1">{sub}</p>}
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

function WorkFrontCard({ wf }: { wf: any }) {
  const statusDot: Record<string, string> = {
    on_track: "bg-emerald-400",
    at_risk: "bg-amber-400",
    critical: "bg-red-400",
    completed: "bg-indigo-400",
  };

  return (
    <div className="card p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: wf.color }} />
          <span className="text-sm font-semibold text-text-primary">{wf.name}</span>
        </div>
        <Badge status={wf.status} />
      </div>
      {wf.owner_name && (
        <p className="text-xs text-text-muted mb-3 flex items-center gap-1">
          <Users className="w-3 h-3" />
          {wf.owner_name}
        </p>
      )}
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-surface-elevated rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${wf.progress}%`, backgroundColor: wf.color }}
          />
        </div>
        <span className="text-xs text-text-secondary font-medium w-8 text-right">{wf.progress}%</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard").then((r) => setData(r.data)).finally(() => setLoading(false));
  }, []);

  const taskCompletionPct = data
    ? Math.round((data.task_stats.completed / Math.max(data.task_stats.total, 1)) * 100)
    : 0;

  return (
    <AppShell>
      <div className="p-8">
        <PageHeader
          title="Dashboard"
          subtitle={`Situação geral em ${format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR })}`}
        />

        {loading ? (
          <div className="flex items-center justify-center h-64 text-text-secondary">Carregando...</div>
        ) : data ? (
          <>
            {/* KPI row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <KPICard
                title="Tarefas Totais"
                value={data.task_stats.total}
                sub={`${data.task_stats.completed} concluídas`}
                icon={CheckCircle2}
                color="bg-blue-500/10 text-blue-400"
              />
              <KPICard
                title="Em Andamento"
                value={data.task_stats.in_progress}
                sub={`${data.task_stats.blocked} bloqueadas`}
                icon={Activity}
                color="bg-amber-500/10 text-amber-400"
              />
              <KPICard
                title="Atrasadas"
                value={data.task_stats.overdue}
                sub="requer atenção"
                icon={AlertTriangle}
                color="bg-red-500/10 text-red-400"
              />
              <KPICard
                title="Reuniões (7d)"
                value={data.upcoming_meetings}
                sub={`${data.agenda_pending} pautas pendentes`}
                icon={Calendar}
                color="bg-purple-500/10 text-purple-400"
              />
            </div>

            {/* Middle row: completion gauge + work fronts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Gauge */}
              <div className="card p-5 flex flex-col items-center justify-center">
                <p className="text-text-secondary text-xs font-medium uppercase tracking-wider mb-4">
                  Conclusão Geral
                </p>
                <div className="relative w-36 h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      cx="50%"
                      cy="50%"
                      innerRadius="70%"
                      outerRadius="100%"
                      data={[{ value: taskCompletionPct, fill: "#E8252A" }]}
                      startAngle={90}
                      endAngle={-270}
                    >
                      <RadialBar dataKey="value" background={{ fill: "#1E2535" }} cornerRadius={6} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-text-primary">{taskCompletionPct}%</span>
                    <span className="text-xs text-text-muted">concluído</span>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 w-full text-center">
                  <div>
                    <p className="text-xl font-bold text-emerald-400">{data.work_front_stats.on_track}</p>
                    <p className="text-xs text-text-muted">No prazo</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-red-400">{data.work_front_stats.critical}</p>
                    <p className="text-xs text-text-muted">Críticas</p>
                  </div>
                </div>
              </div>

              {/* Work fronts */}
              <div className="lg:col-span-2 card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-text-primary">Frentes de Trabalho</h2>
                  <span className="badge text-text-muted border-surface-border bg-transparent">
                    {data.work_fronts.length} frentes
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.work_fronts.map((wf) => (
                    <WorkFrontCard key={wf.id} wf={wf} />
                  ))}
                </div>
              </div>
            </div>

            {/* Recent tasks */}
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-text-primary">Tarefas Recentes</h2>
                <a href="/action-plan" className="text-xs text-brand hover:underline">
                  Ver todas →
                </a>
              </div>
              <div className="divide-y divide-surface-border">
                {data.recent_tasks.length === 0 && (
                  <p className="text-text-muted text-sm py-4 text-center">Nenhuma tarefa cadastrada.</p>
                )}
                {data.recent_tasks.map((task) => (
                  <div key={task.id} className="py-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary font-medium truncate">{task.title}</p>
                      <p className="text-xs text-text-muted">
                        {task.owner_name || "Sem responsável"} ·{" "}
                        {task.deadline
                          ? format(new Date(task.deadline), "dd/MM/yyyy")
                          : "Sem prazo"}
                      </p>
                    </div>
                    <Badge status={task.priority} />
                    <Badge status={task.status} />
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <p className="text-text-muted text-center py-16">Erro ao carregar dados.</p>
        )}
      </div>
    </AppShell>
  );
}
