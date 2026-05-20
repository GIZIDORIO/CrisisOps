"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import { api } from "@/lib/api";
import { statusLabels, priorityLabels, committeeLabels } from "@/lib/utils";
import { Plus, Pencil, Trash2, X, Clock } from "lucide-react";
import toast from "react-hot-toast";

type AgendaItem = {
  id: string;
  title: string;
  description?: string;
  committee: string;
  status: string;
  priority: string;
  requester_name?: string;
  estimated_duration?: number;
};

const STATUSES = ["pending", "discussed", "approved", "deferred", "rejected"];
const PRIORITIES = ["urgent", "high", "medium", "low"];
const COMMITTEES = ["strategic", "operational"];

function AgendaModal({
  open,
  item,
  onClose,
  onSave,
}: {
  open: boolean;
  item?: AgendaItem | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [form, setForm] = useState({
    title: "", description: "", committee: "strategic",
    status: "pending", priority: "medium", requester_name: "", estimated_duration: "",
  });

  useEffect(() => {
    if (item) setForm({
      title: item.title, description: item.description || "",
      committee: item.committee, status: item.status, priority: item.priority,
      requester_name: item.requester_name || "",
      estimated_duration: item.estimated_duration?.toString() || "",
    });
    else setForm({ title: "", description: "", committee: "strategic", status: "pending", priority: "medium", requester_name: "", estimated_duration: "" });
  }, [item, open]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      estimated_duration: form.estimated_duration ? parseInt(form.estimated_duration) : null,
    };
    try {
      if (item) await api.patch(`/agenda/${item.id}`, payload);
      else await api.post("/agenda", payload);
      toast.success(item ? "Item atualizado!" : "Item adicionado ao backlog!");
      onSave();
      onClose();
    } catch {
      toast.error("Erro ao salvar.");
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-lg">
        <div className="flex items-center justify-between p-5 border-b border-surface-border">
          <h2 className="font-semibold text-text-primary">{item ? "Editar Item" : "Novo Item de Pauta"}</h2>
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
              <label className="text-xs text-text-secondary mb-1 block">Comitê</label>
              <select className="select" value={form.committee} onChange={(e) => setForm({ ...form, committee: e.target.value })}>
                {COMMITTEES.map((c) => <option key={c} value={c}>{committeeLabels[c]}</option>)}
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
              <label className="text-xs text-text-secondary mb-1 block">Prioridade</label>
              <select className="select" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                {PRIORITIES.map((p) => <option key={p} value={p}>{priorityLabels[p] || p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Duração estimada (min)</label>
              <input type="number" className="input" value={form.estimated_duration} onChange={(e) => setForm({ ...form, estimated_duration: e.target.value })} min="0" />
            </div>
          </div>
          <div>
            <label className="text-xs text-text-secondary mb-1 block">Solicitante</label>
            <input className="input" value={form.requester_name} onChange={(e) => setForm({ ...form, requester_name: e.target.value })} />
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

function AgendaColumn({ title, items, color, onEdit, onDelete }: {
  title: string; items: AgendaItem[]; color: string;
  onEdit: (item: AgendaItem) => void; onDelete: (id: string) => void;
}) {
  return (
    <div className="flex-1 min-w-0">
      <div className={`flex items-center gap-2 mb-4 pb-2 border-b-2 ${color}`}>
        <h2 className="font-semibold text-text-primary">{title}</h2>
        <span className="text-xs text-text-muted bg-surface-elevated px-2 py-0.5 rounded-full">
          {items.length}
        </span>
      </div>
      <div className="space-y-3">
        {items.length === 0 && (
          <p className="text-sm text-text-muted text-center py-8">Sem itens no backlog.</p>
        )}
        {items.map((item) => (
          <div key={item.id} className="card p-4 group">
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="text-sm font-medium text-text-primary flex-1 leading-snug">{item.title}</p>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onEdit(item)} className="p-1 text-text-muted hover:text-text-primary rounded">
                  <Pencil className="w-3 h-3" />
                </button>
                <button onClick={() => onDelete(item.id)} className="p-1 text-text-muted hover:text-red-400 rounded">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
            {item.description && <p className="text-xs text-text-muted mb-2 line-clamp-2">{item.description}</p>}
            <div className="flex flex-wrap gap-1.5">
              <Badge status={item.priority} />
              <Badge status={item.status} />
              {item.estimated_duration && (
                <span className="badge text-text-muted border-surface-border bg-transparent flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" /> {item.estimated_duration}min
                </span>
              )}
            </div>
            {item.requester_name && (
              <p className="text-xs text-text-muted mt-2">👤 {item.requester_name}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AgendaPage() {
  const [items, setItems] = useState<AgendaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<AgendaItem | null>(null);

  const load = async () => {
    const res = await api.get("/agenda");
    setItems(res.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const deleteItem = async (id: string) => {
    if (!confirm("Excluir item?")) return;
    await api.delete(`/agenda/${id}`);
    toast.success("Item excluído.");
    load();
  };

  const strategic = items.filter((i) => i.committee === "strategic");
  const operational = items.filter((i) => i.committee === "operational");

  return (
    <AppShell>
      <div className="p-8">
        <PageHeader
          title="Backlog de Pauta"
          subtitle="Itens pendentes por comitê"
          action={
            <button
              onClick={() => { setEditItem(null); setModalOpen(true); }}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" /> Novo Item
            </button>
          }
        />

        {loading ? (
          <div className="text-center py-16 text-text-secondary">Carregando...</div>
        ) : (
          <div className="flex gap-8">
            <AgendaColumn
              title="Comitê Estratégico"
              items={strategic}
              color="border-purple-500"
              onEdit={(i) => { setEditItem(i); setModalOpen(true); }}
              onDelete={deleteItem}
            />
            <div className="w-px bg-surface-border flex-shrink-0" />
            <AgendaColumn
              title="Comitê Operacional"
              items={operational}
              color="border-blue-500"
              onEdit={(i) => { setEditItem(i); setModalOpen(true); }}
              onDelete={deleteItem}
            />
          </div>
        )}
      </div>

      <AgendaModal open={modalOpen} item={editItem} onClose={() => setModalOpen(false)} onSave={load} />
    </AppShell>
  );
}
