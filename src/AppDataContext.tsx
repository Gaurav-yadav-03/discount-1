import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getBookings, refreshBookings } from "./services/bookingService";
import { getReviewHistory, recordReview } from "./services/reviewStateService";
import type { BookingCase, ReviewAction, ReviewRecord } from "./types/booking";

interface AppDataContextValue {
  bookings: BookingCase[];
  history: ReviewRecord[];
  loading: boolean;
  error: string | null;
  review: (booking: BookingCase, action: ReviewAction) => ReviewRecord;
  reload: () => void;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<BookingCase[]>([]);
  const [history, setHistory] = useState<ReviewRecord[]>(getReviewHistory());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    getBookings()
      .then(setBookings)
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Unable to load booking data."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const review = (booking: BookingCase, action: ReviewAction) => {
    const record = recordReview(booking.customerPhone, action);
    setHistory(getReviewHistory());
    setBookings((current) =>
      current.map((item) =>
        item.customerPhone === booking.customerPhone ? { ...item, myCheckStatus: "CHECKED" } : item,
      ),
    );
    return record;
  };

  return (
    <AppDataContext.Provider value={{ bookings, history, loading, error, review, reload: load }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData(): AppDataContextValue {
  const context = useContext(AppDataContext);
  if (!context) throw new Error("useAppData must be used inside AppDataProvider");
  return context;
}

export function clearCachedBookings(): void {
  refreshBookings();
}