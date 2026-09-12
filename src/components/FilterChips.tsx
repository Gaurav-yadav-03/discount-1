import type { StatusFilter } from "../types/booking";

const FILTERS: StatusFilter[] = [
  "All",
  "Needs Review",
  "Approved",
  "Duplicate",
  "Rejected",
];

export function FilterChips({
  value,
  onChange,
}: {
  value: StatusFilter;
  onChange: (filter: StatusFilter) => void;
}) {
  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
      {FILTERS.map((filter) => {
        const selected = filter === value;
        return (
          <button
            key={filter}
            type="button"
            onClick={() => onChange(filter)}
            className={`min-h-10 shrink-0 rounded-full px-4 text-sm font-medium ${
              selected
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200"
            }`}
          >
            {filter}
          </button>
        );
      })}
    </div>
  );
}
