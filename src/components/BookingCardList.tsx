import type { BookingCase } from "../types/booking";
import { CaseCard } from "./CaseCard";

export function BookingCardList({ bookings }: { bookings: BookingCase[] }) {
  return (
    <div className="space-y-3">
      {bookings.map((booking, index) => (
        <CaseCard key={`${booking.id}-${booking.requestId ?? "row"}-${index}`} booking={booking} />
      ))}
    </div>
  );
}