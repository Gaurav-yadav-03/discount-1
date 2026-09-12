import type { SystemStatus } from "../types/booking";

const STATUS_STYLES: Record<string, string> = {
  "Needs Review": "bg-amber-100 text-amber-800",
  Approved: "bg-emerald-100 text-emerald-800",
  Duplicate: "bg-slate-200 text-slate-700",
  Rejected: "bg-red-100 text-red-700",
  "On Hold": "bg-violet-100 text-violet-800",
};

export function StatusBadge({ status }: { status: SystemStatus | string }) {
  const style = STATUS_STYLES[status] ?? "bg-slate-100 text-slate-700";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${style}`}
    >
      {status}
    </span>
  );
}
