import { useMemo } from "react";
import { formatDateKey } from "../services/bookingService";

function formatDateLabel(value: string): string {
  if (!value) return "Select date";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

export function DatePicker({
  value,
  onChange,
  allowAll = false,
}: {
  value: string;
  onChange: (value: string) => void;
  allowAll?: boolean;
}) {
  const today = useMemo(() => formatDateKey(new Date()), []);
  const isAll = value === "ALL";

  return (
    <div className="date-picker">
      <div className={`date-picker-field ${isAll ? "is-all" : ""}`}>
        <span className="calendar-icon" aria-hidden="true" />
        <span className="date-picker-label">{isAll && allowAll ? "All dates" : formatDateLabel(value)}</span>
        <input
          type="date"
          aria-label="Select date"
          value={isAll ? "" : value}
          onChange={(event) => onChange(event.target.value || today)}
        />
      </div>
      <div className="date-picker-actions">
        <button type="button" onClick={() => onChange(today)} className={value === today ? "active" : ""}>Today</button>
        {allowAll ? <button type="button" onClick={() => onChange("ALL")} className={isAll ? "active" : ""}>All dates</button> : null}
      </div>
    </div>
  );
}