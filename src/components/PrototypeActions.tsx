const ACTIONS = [
  { key: "approve", label: "Approve", className: "bg-emerald-600 text-white" },
  { key: "reject", label: "Reject", className: "bg-red-600 text-white" },
  {
    key: "duplicate",
    label: "Duplicate",
    className: "bg-slate-200 text-slate-800",
  },
] as const;

export function PrototypeActions({
  onAction,
}: {
  onAction: (label: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {ACTIONS.map((action) => (
        <button
          key={action.key}
          type="button"
          onClick={() => onAction(action.label)}
          className={`min-h-12 rounded-xl px-2 text-sm font-semibold ${action.className}`}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
