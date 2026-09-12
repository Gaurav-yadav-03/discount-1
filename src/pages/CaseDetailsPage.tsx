import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DetailRow, DetailSection } from "../components/DetailSection";
import { PrototypeActions } from "../components/PrototypeActions";
import { StatusBadge } from "../components/StatusBadge";
import { Toast } from "../components/Toast";
import {
  getBookingById,
  setMyCheckStatus,
} from "../services/bookingService";
import type { BookingCase } from "../types/booking";
import { formatCurrency, formatPercent, formatTime } from "../utils/format";

export function CaseDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingCase | undefined>();
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    getBookingById(id).then((result) => {
      if (!cancelled) {
        setBooking(result);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handlePrototypeAction = useCallback(
    (label: string) => {
      if (!booking) return;

      setMyCheckStatus(booking.customerPhone, "CHECKED");
      setBooking((current) =>
        current ? { ...current, myCheckStatus: "CHECKED" } : current,
      );
      setToast(`${label} recorded locally. Case marked as checked.`);
      window.setTimeout(() => navigate("/"), 400);
    },
    [booking, navigate],
  );

  if (loading) {
    return <PageShell>Loading case…</PageShell>;
  }

  if (!booking) {
    return (
      <PageShell>
        <p>Case not found.</p>
        <Link to="/" className="mt-4 inline-block font-semibold text-slate-900">
          Back to dashboard
        </Link>
      </PageShell>
    );
  }

  return (
    <div className="min-h-dvh bg-slate-200">
      <div className="mx-auto min-h-dvh max-w-lg bg-slate-100">
        <header className="sticky top-0 z-10 bg-slate-900 px-4 pb-4 pt-[max(1rem,env(safe-area-inset-top))] text-white">
          <Link to="/" className="inline-flex min-h-10 items-center text-sm text-slate-300">
            ← Back
          </Link>
          <div className="mt-2 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-slate-400">
                {booking.id} · {formatTime(booking.timestamp)}
              </p>
              <h1 className="text-xl font-semibold">{booking.houseName}</h1>
              <p className="text-sm text-slate-300">
                {booking.mm} · Room {booking.roomNumber}
              </p>
            </div>
            <StatusBadge status={booking.systemStatus} />
          </div>
        </header>

        <main className="space-y-3 px-4 py-4 pb-36">
          <DetailSection title="Property">
            <DetailRow label="House Name" value={booking.houseName} />
            <DetailRow label="MM" value={booking.mm} />
            <DetailRow label="Room Number" value={booking.roomNumber} />
            <DetailRow label="Beds Requested" value={String(booking.bedsRequested)} />
          </DetailSection>

          <DetailSection title="Booking">
            <DetailRow label="Request ID" value={booking.requestId ?? "—"} />
            <DetailRow label="Booking Category" value={booking.bookingCategory} />
            <DetailRow label="Booking Type" value={booking.bookingType} />
            <DetailRow label="Occupancy Type" value={booking.occupancyType} />
            <DetailRow label="Customer ID" value={booking.customerId} />
            <DetailRow label="Customer Phone" value={booking.customerPhone} />
            <DetailRow label="Booking Tenure" value={booking.bookingTenure} />
            <DetailRow label="Payment Frequency" value={booking.paymentFrequency} />
          </DetailSection>

          <DetailSection title="Pricing">
            <DetailRow label="Sigma Price" value={formatCurrency(booking.sigmaPrice)} />
            <DetailRow label="Ask Price" value={formatCurrency(booking.askPrice)} />
            <DetailRow
              label="Current Monthly Rent"
              value={
                booking.currentMonthlyRent
                  ? formatCurrency(booking.currentMonthlyRent)
                  : "—"
              }
            />
            <DetailRow
              label="Discount / Month"
              value={formatCurrency(booking.discountPerMonth)}
            />
            <DetailRow
              label="Discount %"
              value={formatPercent(booking.discountPercent)}
            />
            <DetailRow
              label="Total Discount"
              value={formatCurrency(booking.totalDiscount)}
            />
            <DetailRow label="GM" value={formatPercent(booking.gmPercent)} />
            <DetailRow label="Hike" value={formatPercent(booking.hikePercent)} />
          </DetailSection>

          <DetailSection title="AMC">
            <DetailRow
              label="AMC Included"
              value={booking.amcIncluded ? "Yes" : "No"}
            />
            <DetailRow
              label="AMC Amount"
              value={
                booking.amcIncluded ? formatCurrency(booking.amcAmount) : "—"
              }
            />
          </DetailSection>

          <DetailSection title="Notes">
            <p className="text-sm leading-6 text-slate-800">{booking.remarks}</p>
            <DetailRow label="System Status" value={booking.systemStatus} />
            <DetailRow label="My Check Status" value={booking.myCheckStatus} />
          </DetailSection>
        </main>

        <div className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
          <div className="mx-auto max-w-lg">
            <PrototypeActions onAction={handlePrototypeAction} />
          </div>
        </div>

        {toast ? <Toast message={toast} onDismiss={() => setToast(null)} /> : null}
      </div>
    </div>
  );
}

function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-slate-100 px-4 py-10 text-center text-sm text-slate-600">
      {children}
    </div>
  );
}
