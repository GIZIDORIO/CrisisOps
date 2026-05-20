import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const statusLabels: Record<string, string> = {
  // work front statuses
  on_track: "No Prazo",
  at_risk: "Em Risco",
  critical: "Crítico",
  completed: "Concluído",
  // task/action statuses
  pending: "Pendente",
  in_progress: "Em Andamento",
  in_validation: "Em Validação",
  blocked: "Bloqueado",
  paused: "Pausado",
  cancelled: "Cancelado",
  // meeting statuses
  scheduled: "Agendada",
  // backlog statuses
  triaging: "Em Triagem",
  prioritized: "Priorizado",
  discussed: "Discutido",
  escalated: "Escalado",
  approved: "Aprovado",
  rejected: "Rejeitado",
  deferred: "Postergado",
  archived: "Arquivado",
};

export const statusColors: Record<string, string> = {
  on_track: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  at_risk: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  critical: "text-red-400 bg-red-400/10 border-red-400/20",
  completed: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20",
  pending: "text-gray-400 bg-gray-400/10 border-gray-400/20",
  in_progress: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  in_validation: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
  blocked: "text-red-400 bg-red-400/10 border-red-400/20",
  paused: "text-slate-400 bg-slate-400/10 border-slate-400/20",
  cancelled: "text-gray-500 bg-gray-500/10 border-gray-500/20",
  scheduled: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  triaging: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  prioritized: "text-violet-400 bg-violet-400/10 border-violet-400/20",
  discussed: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  escalated: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  approved: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  rejected: "text-red-400 bg-red-400/10 border-red-400/20",
  deferred: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  archived: "text-gray-500 bg-gray-500/10 border-gray-500/20",
  // priorities
  P0: "text-red-400 bg-red-400/10 border-red-400/20",
  P1: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  P2: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  P3: "text-gray-400 bg-gray-400/10 border-gray-400/20",
};

export const priorityLabels: Record<string, string> = {
  P0: "P0 — Crítica",
  P1: "P1 — Alta",
  P2: "P2 — Média",
  P3: "P3 — Baixa",
};

export const committeeLabels: Record<string, string> = {
  executive: "Comitê Executivo",
  tactical: "Comitê Tático-Operacional",
  area_alignment: "Alinhamento por Área",
};

export const itemTypeLabels: Record<string, string> = {
  decision: "Decisão Executiva",
  action: "Ação Operacional",
  diagnosis: "Diagnóstico",
  project: "Projeto",
  routine: "Rotina",
  risk: "Risco",
  idea: "Ideia Futura",
  closure: "Encerramento",
};
