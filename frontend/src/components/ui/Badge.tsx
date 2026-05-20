import { cn, statusColors, statusLabels } from "@/lib/utils";

interface BadgeProps {
  status: string;
  label?: string;
  className?: string;
}

export default function Badge({ status, label, className }: BadgeProps) {
  return (
    <span className={cn("badge", statusColors[status] || "text-gray-400 bg-gray-400/10 border-gray-400/20", className)}>
      {label || statusLabels[status] || status}
    </span>
  );
}
