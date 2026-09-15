import { Link, useLocation } from "react-router-dom";
import type { BookingCase } from "../types/booking";
import { formatCurrency, formatPercent, formatTime } from "../utils/format";
import { StatusBadge } from "./StatusBadge";

export function CaseCard({ booking }: { booking: BookingCase }) {
  const location = useLocation();
  const detailPath = `/cases/${encodeURIComponent(booking.id)}?requestId=${encodeURIComponent(booking.requestId ?? "")}${location.search ? `&${location.search.slice(1)}` : ""}`;
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {booking.requestId ?? "No request ID"} · {formatTime(booking.timestamp)}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-slate-900">
            {booking.houseName}
          </h3>
          <p className="text-sm text-slate-500">
            MM: {booking.mm}
            <span className="mx-1.5 text-slate-300">·</span>
            Room: {booking.roomNumber}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {booking.bookingType} · {booking.occupancyType} · {booking.bedsRequested} beds
          </p>
        </div>
        <StatusBadge status={booking.systemStatus} />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 text-sm sm:grid-cols-4">
        <Metric label="Ask Price" value={formatCurrency(booking.askPrice)} />
        <Metric label="Discount" value={formatPercent(booking.discountPercent)} />
        <Metric label="GM" value={formatPercent(booking.gmPercent)} />
        <Metric label="Hike" value={formatPercent(booking.hikePercent)} />
      </dl>

      <Link
        to={detailPath}
        className="mt-4 flex min-h-12 w-full items-center justify-center rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white"
      >
        View Details
      </Link>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="font-semibold text-slate-900">{value}</dd>
    </div>
  );
}
