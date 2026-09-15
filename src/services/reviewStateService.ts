import type { MyCheckStatus, ReviewAction, ReviewRecord } from "../types/booking";

const STATUS_KEY = "booking-approval-my-check-status-v1";
const HISTORY_KEY = "booking-approval-review-history-v1";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function getReviewStatuses(): Record<string, MyCheckStatus> {
  return read(STATUS_KEY, {});
}

export function getReviewHistory(): ReviewRecord[] {
  return read(HISTORY_KEY, []);
}

export function recordReview(customerPhone: string, action: ReviewAction): ReviewRecord {
  const reviewedAt = new Date().toISOString();
  const record = { customerPhone, action, reviewedAt };
  const statuses = getReviewStatuses();
  statuses[customerPhone] = "CHECKED";
  window.localStorage.setItem(STATUS_KEY, JSON.stringify(statuses));
  window.localStorage.setItem(
    HISTORY_KEY,
    JSON.stringify([record, ...getReviewHistory().filter((item) => item.customerPhone !== customerPhone)]),
  );
  return record;
}

export function clearReviewHistory(): void {
  window.localStorage.removeItem(STATUS_KEY);
  window.localStorage.removeItem(HISTORY_KEY);
}