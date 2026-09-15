import { useMemo, useState } from "react";
import { useAppData } from "../AppDataContext";
import { BookingCardList } from "../components/BookingCardList";
import { BookingControls } from "../components/BookingControls";
import { EmptyState, PageHeader } from "../components/PageHeader";
import { filterBookings, formatDateKey } from "../services/bookingService";
import type { StatusFilter } from "../types/booking";

export function InboxPage() {
  const { bookings, loading, error } = useAppData(); const [date, setDate] = useState(formatDateKey(new Date())); const [status, setStatus] = useState<StatusFilter>("All"); const [query, setQuery] = useState("");
  const cases = useMemo(() => filterBookings(bookings, { date, status, query, includeChecked: false }), [bookings, date, query, status]);
  return <><PageHeader eyebrow="WORK QUEUE" title="Review inbox" description="Uncheck the work that needs your attention." /><BookingControls bookings={bookings} date={date} onDate={setDate} status={status} onStatus={setStatus} query={query} onQuery={setQuery} allowAll /><div className="result-bar"><strong>{cases.length} bookings found</strong><span>Only NOT_CHECKED cases</span></div>{error ? <div className="error-state">{error}</div> : loading ? <div className="loading-state">Loading booking data...</div> : cases.length ? <BookingCardList bookings={cases} /> : <EmptyState title="No pending bookings" description="Try another date or clear your filters." />}</>;
}