"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import { api } from "@/lib/api";
import { statusLabels, priorityLabels, committeeLabels, itemTypeLabels } from "@/lib/utils";
import { Plus, Pencil, Trash2, X, Clock, AlertCircle } from "lucide-react";
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
  impact?: string;
  proposal?: string;
  decision_needed?: boolean;
  item_type?: string;
  suggested_owner?: string;
  next_step?: string;
};

const STATUSES = ["pending", "triaging", "prioritized", "discussed", "escalated", "approved", "deferred", "archived", "rejected"];
const PRIORITIES = ["P0", "P1", "P2", "P3"];
const COMMITTEES = ["executive", "tactical", "area_alignment"];
const ITEM_TYPES = ["decision", "action", "diagnosis", "project", "routine", "risk", "idea", "closure"];

function AgendaModal({
  open, item, onClose, onSave,
}: {
  open: boolean;
  item?: AgendaItem | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [form, setForm] = useState({
    title: "", description: "", committee: "executive",
    status: "pending", priority: "P1", requester_name: "",
    estimated_duration: "", impact: "", proposal: "",
    decision_needed: false, item_type: "action",
    suggested_owner: "", next_step: "",
  });

  useEffect(() => {
    if (item) {
      setForm({
        title: item.title,
        description: item.description || "",
        committee: item.committee,
        status: item.status,
        priority: item.priority,
        requester_name: item.requester_name || "",
        estimated_duration: item.estimated_duration?.toString() || "",
        impact: item.impact || "",
        proposal: item.proposal || "",
        decision_needed: item.decision_needed || false,
        item_type: item.item_type || "action",
        suggested_owner: item.suggested_owner || "",
        next_step: item.next_step || "",
      });
    } else {
      setForm({
        title: "", description: "", committee: "executive",
        status: "pending", priority: "P1", requester_name: "",
        estimated_duration: "", impact: "", proposal: "",
        decision_needed: false, item_type: "action",
        suggested_owner: "", next_step: "",
      });
    }
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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="card w-full max-w-2xl my-4">
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
            <label className="text-xs text-text-secondary mb-1 block">Contexto / Descrição</label>
            <textarea className="input resize-none" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-text-secondary mb-1 block">Impacto / Consequência</label>
            <textarea className="input resize-none" rows={2} value={form.impact} onChange={(e) => setForm({ ...form, impact: e.target.value })} />
          </div>
          <div>
            <label className="text-xs text-text-secondary mb-1 block">Proposta / Encaminhamento</label>
            <textarea className="input resize-none" rows={2} value={form.proposal} onChange={(e) => setForm({ ...form, proposal: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Fórum</label>
              <select className="select" value={form.committee} onChange={(e) => setForm({ ...form, committee: e.target.value })}>
                {COMMITTEES.map((c) => <option key={c} value={c}>{committeeLabels[c]}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Tipo</label>
              <select className="select" value={form.item_type} onChange={(e) => setForm({ ...form, item_type: e.target.value })}>
                {ITEM_TYPES.map((t) => <option key={t} value={t}>{itemTypeLabels[t]}</option>)}
              </select>
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
              <label className="text-xs text-text-secondary mb-1 block">Solicitante</label>
              <input className="input" value={form.requester_name} onChange={(e) => setForm({ ...form, requester_name: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Responsável Sugerido</label>
              <input className="input" value={form.suggested_owner} onChange={(e) => setForm({ ...form, suggested_owner: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Próximo Passo</label>
              <input className="input" value={form.next_step} onChange={(e) => setForm({ ...form, next_step: e.target.value })} />
            </div>
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Duração estimada (min)</label>
              <input type="number" className="input" value={form.estimated_duration} onChange={(e) => setForm({ ...form, estimated_duration: e.target.value })} min="0" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="decision_needed"
              checked={form.decision_needed}
              onChange={(e) => setForm({ ...form, decision_needed: e.target.checked })}
              className="w-4 h-4 accent-brand"
            />
            <label htmlFor="decision_needed" className="text-sm text-text-secondary cursor-pointer">
              Requer decisão executiva
            </label>
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

const COLUMN_CONFIG = [
  { key: "executive",       label: committeeLabels.executive,       color: "border-purple-500" },
  { key: "tactical",        label: committeeLabels.tactical,        color: "border-blue-500"   },
  { key: "area_alignment",  label: committeeLabels.area_alignment,  color: "border-emerald-500"},
];

function AgendaColumn({ title, items, color, onEdit, onDelete }: {
  title: string; items: AgendaItem[]; color: string;
  onEdit: (item: AgendaItem) => void; onDelete: (id: string) => void;
}) {
  return (
    <div className="flex-1 min-w-0">
      <div className={`flex items-center gap-2 mb-4 pb-2 border-b-2 ${color}`}>
        <h2 className="font-semibold text-text-primary text-sm">{title}</h2>
        <span className="text-xs text-text-muted bg-surface-elevated px-2 py-0.5 rounded-full">{items.length}</span>
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
              {item.decision_needed && (
                <span className="badge text-orange-400 bg-orange-400/10 border-orange-400/20 flex items-center gap-1">
                  <AlertCircle className="w-2.5 h-2.5" /> Decisão
                </span>
              )}
              {item.estimated_duration && (
                <span className="badge text-text-muted border-surface-border bg-transparent flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" /> {item.estimated_duration}min
                </span>
              )}
            </div>
            {(item.requester_name || item.suggested_owner) && (
              <p className="text-xs text-text-muted mt-2">
                {item.requester_name && <span className="mr-3">👤 {item.requester_name}</span>}
                {item.suggested_owner && <span>→ {item.suggested_owner}</span>}
              </p>
            )}
            {item.next_step && (
              <p className="text-xs text-text-muted mt-1 italic line-clamp-1">📌 {item.next_step}</p>
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

  const byCommittee = (key: string) => items.filter((i) => i.committee === key);

  return (
    <AppShell>
      <div className="p-8">
        <PageHeader
          title="Backlog Estratégico"
          subtitle="Registro e triagem de temas por fórum de governança"
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
          <div className="flex gap-6">
            {COLUMN_CONFIG.map((col, idx) => (
              <>
                <AgendaColumn
                  key={col.key}
                  title={col.label}
                  items={byCommittee(col.key)}
                  color={col.color}
                  onEdit={(i) => { setEditItem(i); setModalOpen(true); }}
                  onDelete={deleteItem}
                />
                {idx < COLUMN_CONFIG.length - 1 && (
                  <div key={`div-${idx}`} className="w-px bg-surface-border flex-shrink-0" />
                )}
              </>
            ))}
          </div>
        )}
      </div>

      <AgendaModal open={modalOpen} item={editItem} onClose={() => setModalOpen(false)} onSave={load} />
    </AppShell>
  );
}
