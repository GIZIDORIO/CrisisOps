"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import { api } from "@/lib/api";
import { statusLabels, priorityLabels, cn } from "@/lib/utils";
import { Plus, Pencil, Trash2, X, ChevronDown } from "lucide-react";
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
};

type WorkFront = { id: string; name: string };

const STATUSES = ["pending", "in_progress", "completed", "blocked"];
const PRIORITIES = ["low", "medium", "high", "critical"];

function TaskModal({
  open,
  task,
  workFronts,
  onClose,
  onSave,
}: {
  open: boolean;
  task?: Task | null;
  workFronts: WorkFront[];
  onClose: () => void;
  onSave: () => void;
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    owner_name: "",
    deadline: "",
    status: "pending",
    priority: "medium",
    work_front_id: "",
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
      });
    } else {
      setForm({ title: "", description: "", owner_name: "", deadline: "", status: "pending", priority: "medium", work_front_id: "" });
    }
  }, [task, open]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, work_front_id: form.work_front_id || null, deadline: form.deadline || null };
    try {
      if (task) await api.patch(`/tasks/${task.id}`, payload);
      else await api.post("/tasks", payload);
      toast.success(task ? "Tarefa atualizada!" : "Tarefa criada!");
      onSave();
      onClose();
    } catch {
      toast.error("Erro ao salvar tarefa.");
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-lg">
        <div className="flex items-center justify-between p-5 border-b border-surface-border">
          <h2 className="font-semibold text-text-primary">{task ? "Editar Tarefa" : "Nova Tarefa"}</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={submit} className="p-5 space-y-4">
          <div>
            <label className="text-xs text-text-secondary mb-1 block">Título *</label>
            <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <label className="text-xs text-text-secondary mb-1 block">Descrição</label>
            <textarea className="input resize-none" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Responsável</label>
              <input className="input" value={form.owner_name} onChange={(e) => setForm({ ...form, owner_name: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Prazo</label>
              <input type="date" className="input" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Status</label>
              <select className="select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {STATUSES.map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Prioridade</label>
              <select className="select" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                {PRIORITIES.map((p) => <option key={p} value={p}>{priorityLabels[p]}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-text-secondary mb-1 block">Frente de Trabalho</label>
            <select className="select" value={form.work_front_id} onChange={(e) => setForm({ ...form, work_front_id: e.target.value })}>
              <option value="">— Nenhuma —</option>
              {workFronts.map((wf) => <option key={wf.id} value={wf.id}>{wf.name}</option>)}
            </select>
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
    if (!confirm("Excluir esta tarefa?")) return;
    await api.delete(`/tasks/${id}`);
    toast.success("Tarefa excluída.");
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
          subtitle="Gerencie tarefas, responsáveis e prazos"
          action={
            <button
              onClick={() => { setEditTask(null); setModalOpen(true); }}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" /> Nova Tarefa
            </button>
          }
        />

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <select className="select w-40" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">Todos os status</option>
            {STATUSES.map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}
          </select>
          <select className="select w-40" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
            <option value="">Todas prioridades</option>
            {PRIORITIES.map((p) => <option key={p} value={p}>{priorityLabels[p]}</option>)}
          </select>
          <span className="text-text-muted text-sm flex items-center">{filtered.length} tarefas</span>
        </div>

        {loading ? (
          <div className="text-center py-16 text-text-secondary">Carregando...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
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
                    <p className="text-xs text-text-muted text-center py-4">Sem tarefas</p>
                  )}
                  {grouped[status]?.map((task) => (
                    <div key={task.id} className="card p-3 group">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-text-primary flex-1 leading-snug">{task.title}</p>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <button
                            onClick={() => { setEditTask(task); setModalOpen(true); }}
                            className="p-1 text-text-muted hover:text-text-primary rounded"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-1 text-text-muted hover:text-red-400 rounded"
                          >
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
                          <span className="badge text-blue-300 bg-blue-400/10 border-blue-400/20">
                            {wfMap[task.work_front_id]}
                          </span>
                        )}
                      </div>
                      <div className="mt-2 text-xs text-text-muted">
                        {task.owner_name && <span className="mr-2">👤 {task.owner_name}</span>}
                        {task.deadline && (
                          <span className={new Date(task.deadline) < new Date() && task.status !== "completed" ? "text-red-400" : ""}>
                            📅 {format(new Date(task.deadline), "dd/MM/yyyy")}
                          </span>
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
