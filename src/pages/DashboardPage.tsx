import { useEffect, useMemo, useState } from "react";
import { CaseCard } from "../components/CaseCard";
import { FilterChips } from "../components/FilterChips";
import { SearchBar } from "../components/SearchBar";
import {
  filterUncheckedCases,
  getBookings,
  getDashboardSummary,
  getTodayUncheckedCases,
  groupBySystemStatus,
} from "../services/bookingService";
import type { BookingCase, StatusFilter } from "../types/booking";

export function DashboardPage() {
  const [bookings, setBookings] = useState<BookingCase[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    getBookings()
      .then((data) => {
        if (!cancelled) {
          setBookings(data);
          setLoading(false);
        }
      })
      .catch((loadError) => {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load bookings.",
          );
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const uncheckedToday = useMemo(
    () => getTodayUncheckedCases(bookings),
    [bookings],
  );
  const summary = useMemo(
    () => getDashboardSummary(uncheckedToday),
    [uncheckedToday],
  );
  const visibleCases = useMemo(
    () => filterUncheckedCases(uncheckedToday, statusFilter, query),
    [uncheckedToday, statusFilter, query],
  );
  const grouped = useMemo(
    () => groupBySystemStatus(visibleCases),
    [visibleCases],
  );

  return (
    <div className="min-h-dvh bg-slate-200">
      <div className="mx-auto min-h-dvh max-w-lg bg-slate-100">
        <header className="bg-slate-900 px-4 pb-6 pt-[max(1.25rem,env(safe-area-inset-top))] text-white">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Booking Review
          </p>
          <h1 className="mt-1 text-2xl font-semibold">{summary.dateLabel}</h1>
          <p className="mt-1 text-sm text-slate-300">
            Today’s cases you have not personally checked
          </p>
        </header>

        <main className="space-y-4 px-4 py-4 pb-10">
          <section className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Cases not checked</p>
            <p className="mt-1 text-4xl font-semibold tracking-tight text-slate-900">
              {loading ? "—" : summary.totalNotChecked}
            </p>
            <dl className="mt-4 space-y-2 text-sm">
              <BreakdownRow label="Needs Review" value={summary.needsReview} />
              <BreakdownRow label="Approved" value={summary.approved} />
              <BreakdownRow label="Duplicate" value={summary.duplicate} />
              <BreakdownRow label="Other" value={summary.other} />
            </dl>
          </section>

          <SearchBar value={query} onChange={setQuery} />
          <FilterChips value={statusFilter} onChange={setStatusFilter} />

          {loading ? (
            <p className="py-10 text-center text-sm text-slate-500">Loading cases…</p>
          ) : error ? (
            <p className="rounded-2xl bg-white px-4 py-10 text-center text-sm text-red-600">
              {error}
            </p>
          ) : grouped.length === 0 ? (
            <p className="rounded-2xl bg-white px-4 py-10 text-center text-sm text-slate-500">
              No unchecked cases for today match this filter.
            </p>
          ) : (
            grouped.map((group) => (
              <section key={group.status} className="space-y-3">
                <h2 className="pt-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {group.status}
                  <span className="ml-2 text-slate-400">{group.cases.length}</span>
                </h2>
                {group.cases.map((booking) => (
                  <CaseCard key={booking.id} booking={booking} />
                ))}
              </section>
            ))
          )}
        </main>
      </div>
    </div>
  );
}

function BreakdownRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-slate-600">{label}</dt>
      <dd className="font-semibold text-slate-900">{value}</dd>
    </div>
  );
}
