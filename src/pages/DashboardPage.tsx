import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppData } from "../AppDataContext";
import { BookingCardList } from "../components/BookingCardList";
import { BookingControls } from "../components/BookingControls";
import { EmptyState, PageHeader } from "../components/PageHeader";
import { filterBookings, formatDateKey } from "../services/bookingService";
import type { StatusFilter } from "../types/booking";

export function DashboardPage() {
  const { bookings, loading, error } = useAppData();
  const today = formatDateKey(new Date());
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedDate = searchParams.get("date");
  const requestedDateValue = requestedDate ? new Date(`${requestedDate}T12:00:00`) : null;
  const hasValidDate = Boolean(
    requestedDate &&
      /^\d{4}-\d{2}-\d{2}$/.test(requestedDate) &&
      requestedDateValue &&
      !Number.isNaN(requestedDateValue.getTime()) &&
      formatDateKey(requestedDateValue) === requestedDate,
  );
  const date = hasValidDate ? requestedDate! : today;
  const [status, setStatus] = useState<StatusFilter>("All");
  const selectedToday = date === today;
  const cases = useMemo(() => filterBookings(bookings, { date, status, includeChecked: !selectedToday }), [bookings, date, selectedToday, status]);
  const pending = selectedToday ? cases : cases.filter((booking) => booking.myCheckStatus === "NOT_CHECKED");
  const counts = { pending: pending.length, needs: pending.filter((item) => item.systemStatus === "Needs Review").length, approved: pending.filter((item) => item.systemStatus === "Approved").length, duplicate: pending.filter((item) => item.systemStatus === "Duplicate").length, rejected: pending.filter((item) => item.systemStatus === "Rejected").length };
  const handleDateChange = (value: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("date", value || today);
    setSearchParams(next);
  };
  return <><PageHeader eyebrow="OPERATIONS / HOME" title="Good morning" description={selectedToday ? "Your review queue for today." : "A quick view of historical booking activity."} /><BookingControls bookings={bookings} date={date} onDate={handleDateChange} status={status} onStatus={setStatus} /><div className="summary-grid"><SummaryCard label={selectedToday ? "Pending review" : "Bookings"} value={counts.pending} accent="navy" /><SummaryCard label="Needs review" value={counts.needs} accent="amber" /><SummaryCard label="Approved" value={counts.approved} accent="green" /><SummaryCard label="Duplicate" value={counts.duplicate} accent="slate" /><SummaryCard label="Rejected" value={counts.rejected} accent="red" /></div><section className="section-heading"><div><p className="eyebrow">{selectedToday ? "TODAY'S WORK" : "HISTORICAL VIEW"}</p><h2>Priority cases</h2></div><span className="result-count">{pending.length} records</span></section>{error ? <div className="error-state">{error}</div> : loading ? <div className="loading-state">Loading booking data...</div> : pending.length ? <BookingCardList bookings={pending.slice(0, 6)} /> : <EmptyState title={selectedToday ? "No bookings for today" : "No bookings found"} description={selectedToday ? "Your inbox is clear for this date." : "Try another date from the CSV."} />}</>;
}

function SummaryCard({ label, value, accent }: { label: string; value: number; accent: string }) { return <div className={`summary-card accent-${accent}`}><span>{label}</span><strong>{value}</strong></div>; }
