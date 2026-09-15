import type { BookingCase, StatusFilter } from "../types/booking";
import { DatePicker } from "./DatePicker";
import { FilterChips } from "./FilterChips";
import { SearchBar } from "./SearchBar";

export function BookingControls({ bookings: _bookings, date, onDate, status, onStatus, query, onQuery, includeStatus = true, allowAll = false }: { bookings: BookingCase[]; date: string; onDate: (value: string) => void; status: StatusFilter; onStatus: (value: StatusFilter) => void; query?: string; onQuery?: (value: string) => void; includeStatus?: boolean; allowAll?: boolean }) {
  return <div className="controls-stack"><div className="controls-row"><DatePicker value={date} onChange={onDate} allowAll={allowAll} />{onQuery ? <div className="search-wrap"><SearchBar value={query ?? ""} onChange={onQuery} /></div> : null}</div>{includeStatus ? <FilterChips value={status} onChange={onStatus} /> : null}</div>;
}