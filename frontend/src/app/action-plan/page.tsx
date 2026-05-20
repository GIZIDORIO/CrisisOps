"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import { api } from "@/lib/api";
import { statusLabels, priorityLabels, committeeLabels, cn } from "@/lib/utils";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

type Task = {
  id: string;
  title: string;
  description?: string;
  owner_name?: string;
  deadline?: string;
  status: string;
  priority: string;
  work_front_id?: string;
  support_team?: string;
  evidence?: string;
  source_committee?: string;
  next_step?: string;
  impediment?: string;
};

type WorkFront = { id: string; name: string };

const STATUSES = ["pending", "in_progress", "in_validation", "blocked", "paused", "completed"];
const PRIORITIES = ["P0", "P1", "P2", "P3"];
const COMMITTEES = ["executive", "tactical", "area_alignment"];

function TaskModal({
  open, task, workFronts, onClose, onSave,
}: {
  open: boolean;
  task?: Task | null;
  workFronts: WorkFront[];
  onClose: () => void;
  onSave: () => void;
}) {
  const [form, setForm] = useState({
    title: "", description: "", owner_name: "", deadline: "",
    status: "pending", priority: "P1", work_front_id: "",
    support_team: "", evidence: "", source_committee: "",
    next_step: "", impediment: "",
  });

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description || "",
        owner_name: task.owner_name || "",
        deadline: task.deadline?.slice(0, 10) || "",
        status: task.status,
        priority: task.priority,
        work_front_id: task.work_front_id || "",
        support_team: task.support_team || "",
        evidence: task.evidence || "",
        source_committee: task.source_committee || "",
        next_step: task.next_step || "",
        impediment: task.impediment || "",
      });
    } else {
      setForm({
        title: "", description: "", owner_name: "", deadline: "",
        status: "pending", priority: "P1", work_front_id: "",
        support_team: "", evidence: "", source_committee: "",
        next_step: "", impediment: "",
      });
    }
  }, [task, open]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      work_front_id: form.work_front_id || null,
      deadline: form.deadline || null,
      source_committee: form.source_committee || null,
    };
    try {
      if (task) await api.patch(`/tasks/${task.id}`, payload);
      else await api.post("/tasks", payload);
      toast.success(task ? "Ação atualizada!" : "Ação criada!");
      onSave();
      onClose();
    } catch {
      toast.error("Erro ao salvar ação.");
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="card w-full max-w-2xl my-4">
        <div className="flex items-center justify-between p-5 border-b border-surface-border">
          <h2 className="font-semibold text-text-primary">{task ? "Editar Ação" : "Nova Ação"}</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={submit} className="p-5 space-y-4">
          <div>
            <label className="text-xs text-text-secondary mb-1 block">Ação / Entrega *</label>
            <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <label className="text-xs text-text-secondary mb-1 block">Descrição</label>
            <textarea className="input resize-none" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Responsável (Dono)</label>
              <input className="input" value={form.owner_name} onChange={(e) => setForm({ ...form, owner_name: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Apoios / Envolvidos</label>
              <input className="input" value={form.support_team} onChange={(e) => setForm({ ...form, support_team: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Prioridade</label>
              <select className="select" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                {PRIORITIES.map((p) => <option key={p} value={p}>{priorityLabels[p]}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Status</label>
              <select className="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {STATUSES.map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Prazo</label>
              <input type="date" className="input" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Comitê Origem</label>
              <select className="select" value={form.source_committee} onChange={(e) => setForm({ ...form, source_committee: e.target.value })}>
                <option value="">— Nenhum —</option>
                {COMMITTEES.map((c) => <option key={c} value={c}>{committeeLabels[c]}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-text-secondary mb-1 block">Frente Estratégica</label>
            <select className="select" value={form.work_front_id} onChange={(e) => setForm({ ...form, work_front_id: e.target.value })}>
              <option value="">— Nenhuma —</option>
              {workFronts.map((wf) => <option key={wf.id} value={wf.id}>{wf.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-text-secondary mb-1 block">Próximo Passo</label>
            <input className="input" value={form.next_step} onChange={(e) => setForm({ ...form, next_step: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-text-secondary mb-1 block">Impedimento</label>
            <input className="input" value={form.impediment} onChange={(e) => setForm({ ...form, impediment: e.target.value })} placeholder="Descreva se bloqueado" />
          </div>
          <div>
            <label className="text-xs text-text-secondary mb-1 block">Evidência</label>
            <input className="input" value={form.evidence} onChange={(e) => setForm({ ...form, evidence: e.target.value })} placeholder="Link ou descrição da evidência" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 btn-ghost text-sm border border-surface-border">Cancelar</button>
            <button type="submit" className="flex-1 btn-primary text-sm">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ActionPlanPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [workFronts, setWorkFronts] = useState<WorkFront[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");

  const load = async () => {
    const [tasksRes, wfRes] = await Promise.all([api.get("/tasks"), api.get("/work-fronts")]);
    setTasks(tasksRes.data);
    setWorkFronts(wfRes.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const deleteTask = async (id: string) => {
    if (!confirm("Excluir esta ação?")) return;
    await api.delete(`/tasks/${id}`);
    toast.success("Ação excluída.");
    load();
  };

  const filtered = tasks.filter((t) => {
    if (filterStatus && t.status !== filterStatus) return false;
    if (filterPriority && t.priority !== filterPriority) return false;
    return true;
  });

  const grouped = STATUSES.reduce((acc, s) => {
    acc[s] = filtered.filter((t) => t.status === s);
    return acc;
  }, {} as Record<string, Task[]>);

  const wfMap = Object.fromEntries(workFronts.map((w) => [w.id, w.name]));

  return (
    <AppShell>
      <div className="p-8">
        <PageHeader
          title="Plano de Ação"
          subtitle="Gerencie ações, responsáveis, prazos e evidências"
          action={
            <button
              onClick={() => { setEditTask(null); setModalOpen(true); }}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" /> Nova Ação
            </button>
          }
        />

        <div className="flex gap-3 mb-6">
          <select className="select w-44" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">Todos os status</option>
            {STATUSES.map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}
          </select>
          <select className="select w-44" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
            <option value="">Todas prioridades</option>
            {PRIORITIES.map((p) => <option key={p} value={p}>{priorityLabels[p]}</option>)}
          </select>
          <span className="text-text-muted text-sm flex items-center">{filtered.length} ações</span>
        </div>

        {loading ? (
          <div className="text-center py-16 text-text-secondary">Carregando...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
            {STATUSES.map((status) => (
              <div key={status} className="card-elevated p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge status={status} />
                    <span className="text-xs text-text-muted">({grouped[status]?.length || 0})</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {grouped[status]?.length === 0 && (
                    <p className="text-xs text-text-muted text-center py-4">Sem ações</p>
                  )}
                  {grouped[status]?.map((task) => (
                    <div key={task.id} className="card p-3 group">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-text-primary flex-1 leading-snug">{task.title}</p>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <button onClick={() => { setEditTask(task); setModalOpen(true); }} className="p-1 text-text-muted hover:text-text-primary rounded">
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button onClick={() => deleteTask(task.id)} className="p-1 text-text-muted hover:text-red-400 rounded">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      {task.description && (
                        <p className="text-xs text-text-muted mt-1 line-clamp-2">{task.description}</p>
                      )}
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <Badge status={task.priority} />
                        {task.work_front_id && wfMap[task.work_front_id] && (
                          <span className="badge text-blue-300 bg-blue-400/10 border-blue-400/20 truncate max-w-[120px]">
                            {wfMap[task.work_front_id]}
                          </span>
                        )}
                      </div>
                      <div className="mt-2 text-xs text-text-muted space-y-0.5">
                        {task.owner_name && <div>👤 {task.owner_name}</div>}
                        {task.support_team && <div className="text-text-muted/70">+ {task.support_team}</div>}
                        {task.deadline && (
                          <div className={new Date(task.deadline) < new Date() && task.status !== "completed" ? "text-red-400" : ""}>
                            📅 {format(new Date(task.deadline), "dd/MM/yyyy")}
                          </div>
                        )}
                        {task.impediment && task.status === "blocked" && (
                          <div className="text-red-400 line-clamp-1">⚠ {task.impediment}</div>
                        )}
                        {task.next_step && (
                          <div className="text-text-muted/70 italic line-clamp-1">→ {task.next_step}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <TaskModal
        open={modalOpen}
        task={editTask}
        workFronts={workFronts}
        onClose={() => setModalOpen(false)}
        onSave={load}
      />
    </AppShell>
  );
}
