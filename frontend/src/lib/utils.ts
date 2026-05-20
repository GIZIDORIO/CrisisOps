import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const statusLabels: Record<string, string> = {
  on_track: "No Prazo",
  at_risk: "Em Risco",
  critical: "Crítico",
  completed: "Concluído",
  pending: "Pendente",
  in_progress: "Em Andamento",
  blocked: "Bloqueado",
  scheduled: "Agendada",
  cancelled: "Cancelada",
  discussed: "Discutido",
  approved: "Aprovado",
  rejected: "Rejeitado",
  deferred: "Postergado",
};

export const statusColors: Record<string, string> = {
  on_track: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  at_risk: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  critical: "text-red-400 bg-red-400/10 border-red-400/20",
  completed: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20",
  pending: "text-gray-400 bg-gray-400/10 border-gray-400/20",
  in_progress: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  blocked: "text-red-400 bg-red-400/10 border-red-400/20",
  scheduled: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  discussed: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  approved: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  rejected: "text-red-400 bg-red-400/10 border-red-400/20",
  deferred: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  urgent: "text-red-400 bg-red-400/10 border-red-400/20",
  high: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  low: "text-gray-400 bg-gray-400/10 border-gray-400/20",
};

export const priorityLabels: Record<string, string> = {
  critical: "Crítica",
  high: "Alta",
  medium: "Média",
  low: "Baixa",
  urgent: "Urgente",
};

export const committeeLabels: Record<string, string> = {
  strategic: "Estratégico",
  operational: "Operacional",
};
