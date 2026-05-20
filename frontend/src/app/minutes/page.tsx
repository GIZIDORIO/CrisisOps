"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import PageHeader from "@/components/ui/PageHeader";
import Badge from "@/components/ui/Badge";
import { api } from "@/lib/api";
import { committeeLabels, statusLabels } from "@/lib/utils";
import { Plus, X, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import toast from "react-hot-toast";

type Meeting = {
  id: string;
  title: string;
  committee: string;
  scheduled_at: string;
  location?: string;
  attendees?: string;
  status: string;
};

type Minute = {
  id: string;
  meeting_id: string;
  summary?: string;
  decisions?: string;
  action_items?: string;
  next_steps?: string;
  approved_by?: string;
};

function MeetingModal({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: () => void }) {
  const [form, setForm] = useState({
    title: "", committee: "strategic", scheduled_at: "", location: "", attendees: "", status: "scheduled",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/meetings", { ...form, attendees: form.attendees || null });
      toast.success("Reunião criada!");
      onSave();
      onClose();
      setForm({ title: "", committee: "strategic", scheduled_at: "", location: "", attendees: "", status: "scheduled" });
    } catch {
      toast.error("Erro ao criar reunião.");
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="card w-full max-w-lg">
        <div className="flex items-center justify-between p-5 border-b border-surface-border">
          <h2 className="font-semibold text-text-primary">Nova Reunião</h2>
          <button onClick={onClose}><X className="w-4 h-4 text-text-muted" /></button>
        </div>
        <form onSubmit={submit} className="p-5 space-y-4">
          <div>
            <label className="text-xs text-text-secondary mb-1 block">Título *</label>
            <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Comitê</label>
              <select className="select" value={form.committee} onChange={(e) => setForm({ ...form, committee: e.target.value })}>
                <option value="strategic">Estratégico</option>
                <option value="operational">Operacional</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-text-secondary mb-1 block">Data e Hora *</label>
              <input type="datetime-local" className="input" value={form.scheduled_at} onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })} required />
            </div>
          </div>
          <div>
            <label className="text-xs text-text-secondary mb-1 block">Local / Link</label>
            <input className="input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Sala X ou https://meet.google.com/..." />
          </div>
          <div>
            <label className="text-xs text-text-secondary mb-1 block">Participantes (separados por vírgula)</label>
            <input className="input" value={form.attendees} onChange={(e) => setForm({ ...form, attendees: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 btn-ghost text-sm border border-surface-border">Cancelar</button>
            <button type="submit" className="flex-1 btn-primary text-sm">Criar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function MinuteEditor({ meetingId, existing, onSaved }: { meetingId: string; existing?: Minute | null; onSaved: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ summary: "", decisions: "", action_items: "", next_steps: "", approved_by: "" });

  useEffect(() => {
    if (existing) {
      setForm({
        summary: existing.summary || "",
        decisions: existing.decisions || "",
        action_items: existing.action_items || "",
        next_steps: existing.next_steps || "",
        approved_by: existing.approved_by || "",
      });
    }
  }, [existing]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (existing) await api.patch(`/minutes/${existing.id}`, form);
      else await api.post("/minutes", { ...form, meeting_id: meetingId });
      toast.success("Ata salva!");
      onSaved();
      setOpen(false);
    } catch {
      toast.error("Erro ao salvar ata.");
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs text-brand hover:underline"
      >
        <FileText className="w-3 h-3" />
        {existing ? "Editar ata" : "Registrar ata"}
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="mt-4 space-y-3 border-t border-surface-border pt-4">
      <div>
        <label className="text-xs text-text-secondary mb-1 block">Resumo da reunião</label>
        <textarea className="input resize-none" rows={3} value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} placeholder="Principais pontos discutidos..." />
      </div>
      <div>
        <label className="text-xs text-text-secondary mb-1 block">Decisões tomadas</label>
        <textarea className="input resize-none" rows={3} value={form.decisions} onChange={(e) => setForm({ ...form, decisions: e.target.value })} placeholder="• Decisão 1&#10;• Decisão 2" />
      </div>
      <div>
        <label className="text-xs text-text-secondary mb-1 block">Itens de ação</label>
        <textarea className="input resize-none" rows={3} value={form.action_items} onChange={(e) => setForm({ ...form, action_items: e.target.value })} placeholder="• [Responsável] Ação até DD/MM" />
      </div>
      <div>
        <label className="text-xs text-text-secondary mb-1 block">Próximos passos</label>
        <textarea className="input resize-none" rows={2} value={form.next_steps} onChange={(e) => setForm({ ...form, next_steps: e.target.value })} />
      </div>
      <div>
        <label className="text-xs text-text-secondary mb-1 block">Aprovada por</label>
        <input className="input" value={form.approved_by} onChange={(e) => setForm({ ...form, approved_by: e.target.value })} />
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={() => setOpen(false)} className="btn-ghost text-sm text-xs px-3 py-1.5 border border-surface-border">Cancelar</button>
        <button type="submit" className="btn-primary text-sm text-xs px-3 py-1.5">Salvar Ata</button>
      </div>
    </form>
  );
}

function MeetingCard({ meeting, minute, onRefresh }: { meeting: Meeting; minute?: Minute | null; onRefresh: () => void }) {
  const [expanded, setExpanded] = useState(false);

  const committeeColor = meeting.committee === "strategic"
    ? "text-purple-400 bg-purple-400/10 border-purple-400/20"
    : "text-blue-400 bg-blue-400/10 border-blue-400/20";

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`badge ${committeeColor}`}>{committeeLabels[meeting.committee]}</span>
            <Badge status={meeting.status} />
            {minute && <span className="badge text-emerald-400 bg-emerald-400/10 border-emerald-400/20">Ata registrada</span>}
          </div>
          <h3 className="font-semibold text-text-primary">{meeting.title}</h3>
          <div className="flex items-center gap-3 mt-1 text-xs text-text-muted flex-wrap">
            <span>📅 {format(new Date(meeting.scheduled_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
            {meeting.location && <span>📍 {meeting.location}</span>}
          </div>
          {meeting.attendees && (
            <p className="text-xs text-text-muted mt-1">👥 {meeting.attendees}</p>
          )}
        </div>
        <button onClick={() => setExpanded(!expanded)} className="text-text-muted hover:text-text-primary p-1">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Minute preview */}
      {!expanded && minute?.summary && (
        <div className="mt-3 pt-3 border-t border-surface-border">
          <p className="text-xs text-text-muted line-clamp-2">{minute.summary}</p>
          <button onClick={() => setExpanded(true)} className="text-xs text-brand hover:underline mt-1">Ver completo</button>
        </div>
      )}

      {expanded && (
        <div className="mt-4">
          {minute && (
            <div className="space-y-3 mb-4 bg-surface-elevated rounded-lg p-4">
              {minute.summary && (
                <div>
                  <p className="text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">Resumo</p>
                  <p className="text-sm text-text-primary whitespace-pre-wrap">{minute.summary}</p>
                </div>
              )}
              {minute.decisions && (
                <div>
                  <p className="text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">Decisões</p>
                  <p className="text-sm text-text-primary whitespace-pre-wrap">{minute.decisions}</p>
                </div>
              )}
              {minute.action_items && (
                <div>
                  <p className="text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">Itens de Ação</p>
                  <p className="text-sm text-text-primary whitespace-pre-wrap">{minute.action_items}</p>
                </div>
              )}
              {minute.next_steps && (
                <div>
                  <p className="text-xs font-semibold text-text-secondary mb-1 uppercase tracking-wider">Próximos Passos</p>
                  <p className="text-sm text-text-primary whitespace-pre-wrap">{minute.next_steps}</p>
                </div>
              )}
              {minute.approved_by && (
                <p className="text-xs text-text-muted">Aprovada por: {minute.approved_by}</p>
              )}
            </div>
          )}
          <MinuteEditor meetingId={meeting.id} existing={minute} onSaved={onRefresh} />
        </div>
      )}
    </div>
  );
}

export default function MinutesPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [minutes, setMinutes] = useState<Minute[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterCommittee, setFilterCommittee] = useState("");

  const load = async () => {
    const [meetRes, minRes] = await Promise.all([api.get("/meetings"), api.get("/minutes")]);
    setMeetings(meetRes.data);
    setMinutes(minRes.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const minuteByMeeting = Object.fromEntries(minutes.map((m) => [m.meeting_id, m]));

  const filtered = meetings.filter((m) => !filterCommittee || m.committee === filterCommittee);

  return (
    <AppShell>
      <div className="p-8">
        <PageHeader
          title="Atas de Reunião"
          subtitle="Registro de decisões e encaminhamentos"
          action={
            <button
              onClick={() => setModalOpen(true)}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" /> Nova Reunião
            </button>
          }
        />

        <div className="flex gap-3 mb-6">
          <select className="select w-48" value={filterCommittee} onChange={(e) => setFilterCommittee(e.target.value)}>
            <option value="">Todos os comitês</option>
            <option value="strategic">Estratégico</option>
            <option value="operational">Operacional</option>
          </select>
          <span className="text-text-muted text-sm flex items-center">{filtered.length} reuniões</span>
        </div>

        {loading ? (
          <div className="text-center py-16 text-text-secondary">Carregando...</div>
        ) : (
          <div className="space-y-4">
            {filtered.length === 0 && (
              <div className="text-center py-16 text-text-muted">
                <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>Nenhuma reunião registrada.</p>
              </div>
            )}
            {filtered.map((meeting) => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                minute={minuteByMeeting[meeting.id]}
                onRefresh={load}
              />
            ))}
          </div>
        )}
      </div>

      <MeetingModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={load} />
    </AppShell>
  );
}
