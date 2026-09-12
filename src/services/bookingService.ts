import type {
  BookingCase,
  DashboardSummary,
  MyCheckStatus,
  StatusFilter,
  SystemStatus,
} from "../types/booking";

const CHECK_STATUS_STORAGE_KEY = "booking-approval-my-check-status-v1";

function startOfToday(): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function endOfToday(): Date {
  const date = new Date();
  date.setHours(23, 59, 59, 999);
  return date;
}

function normalizePhone(value: string): string {
  return String(value ?? "").replace(/\s+/g, "").trim();
}

function parseNumber(value: string): number {
  if (!value) return 0;

  const cleaned = value
    .replace(/[$₹,\s]/g, "")
    .replace(/%/g, "")
    .replace(/"/g, "")
    .replace(/'/g, "")
    .trim();

  if (!cleaned || cleaned === "-" || cleaned === "#N/A" || cleaned === "#REF!") {
    return 0;
  }

  const asNumber = Number(cleaned);
  return Number.isFinite(asNumber) ? asNumber : 0;
}

function parseInteger(value: string): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseBoolean(value: string): boolean {
  return String(value).trim().toLowerCase() === "yes";
}

function parseDate(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return new Date(0).toISOString();

  const parsed = new Date(trimmed);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString();
  }

  const fallback = new Date(trimmed.replace(/\//g, "/"));
  if (!Number.isNaN(fallback.getTime())) {
    return fallback.toISOString();
  }

  return new Date(0).toISOString();
}

function normalizeSystemStatus(raw: string): SystemStatus {
  const value = String(raw ?? "").trim();
  const normalized = value.toLowerCase();

  if (!normalized) return "Needs Review";
  if (normalized.includes("duplicate")) return "Duplicate";
  if (normalized.includes("reject")) return "Rejected";
  if (normalized.includes("approved")) return "Approved";
  if (normalized.includes("hold")) return "On Hold";
  if (normalized.includes("needs review")) return "Needs Review";

  return "Needs Review";
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentValue = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];

    if (char === '"') {
      if (inQuotes && text[index + 1] === '"') {
        currentValue += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      currentRow.push(currentValue);
      currentValue = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && text[index + 1] === "\n") {
        index += 1;
      }

      currentRow.push(currentValue);
      if (currentRow.some((cell) => cell.trim() !== "")) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentValue = "";
      continue;
    }

    currentValue += char;
  }

  if (currentValue.length > 0 || currentRow.length > 0) {
    currentRow.push(currentValue);
    if (currentRow.some((cell) => cell.trim() !== "")) {
      rows.push(currentRow);
    }
  }

  return rows;
}

function getHeaderIndex(headers: string[], label: string): number {
  const normalizedLabel = label.trim().toLowerCase();
  return headers.findIndex(
    (header) => header.trim().replace(/\uFEFF/g, "").toLowerCase() === normalizedLabel,
  );
}

function getCellValue(headers: string[], row: string[], label: string): string {
  const index = getHeaderIndex(headers, label);
  if (index === -1) return "";
  return String(row[index] ?? "").trim();
}

function loadCheckStatuses(): Record<string, MyCheckStatus> {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(CHECK_STATUS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, MyCheckStatus>;
    return parsed ?? {};
  } catch {
    return {};
  }
}

export function getMyCheckStatus(customerPhone: string): MyCheckStatus {
  const normalizedPhone = normalizePhone(customerPhone);
  if (!normalizedPhone) {
    return "NOT_CHECKED";
  }

  return loadCheckStatuses()[normalizedPhone] ?? "NOT_CHECKED";
}

export function setMyCheckStatus(
  customerPhone: string,
  status: MyCheckStatus,
): void {
  const normalizedPhone = normalizePhone(customerPhone);
  if (!normalizedPhone) {
    return;
  }

  if (typeof window === "undefined") {
    return;
  }

  const current = loadCheckStatuses();
  current[normalizedPhone] = status;
  window.localStorage.setItem(CHECK_STATUS_STORAGE_KEY, JSON.stringify(current));
}

export async function getBookings(): Promise<BookingCase[]> {
  const response = await fetch("/bookings.csv", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Failed to load bookings CSV (${response.status})`);
  }

  const csvText = await response.text();
  const rows = parseCsv(csvText);
  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0].map((header) => header.trim().replace(/\uFEFF/g, ""));
  const bookingRows = rows.slice(1);
  const checkStatuses = loadCheckStatuses();

  const mappedBookings: BookingCase[] = bookingRows
    .map((row) => {
      const requestId = row[0]?.trim() ?? "";
      const customerPhone = normalizePhone(getCellValue(headers, row, "Customer Phone"));
      const houseName = getCellValue(headers, row, "House Name");

      if (!customerPhone && !houseName) {
        return null;
      }

      const rawStatus = getCellValue(headers, row, "Status");
      const amcAmount = parseNumber(getCellValue(headers, row, "AMC Amount"));
      const currentMonthlyRent = parseNumber(getCellValue(headers, row, "Current Monthly Rent"));
      const discountPerMonth = parseNumber(getCellValue(headers, row, "Discount/Month"));
      const discountPercent = parseNumber(getCellValue(headers, row, "Discount %"));
      const totalDiscount = parseNumber(getCellValue(headers, row, "Total Discount"));
      const gmPercent = parseNumber(getCellValue(headers, row, "GM (%)"));
      const hikePercent = parseNumber(getCellValue(headers, row, "Hike check % w/o"));
      const bedsRequested = parseInteger(getCellValue(headers, row, "Beds Requested"));

      return {
        id: customerPhone,
        requestId: requestId || undefined,
        timestamp: parseDate(getCellValue(headers, row, "Timestamp")),
        houseName,
        mm: getCellValue(headers, row, "MM"),
        roomNumber: getCellValue(headers, row, "Room Number"),
        bookingCategory: getCellValue(headers, row, "Booking Category"),
        bookingType: getCellValue(headers, row, "Booking Type"),
        occupancyType: getCellValue(headers, row, "Occupancy Type"),
        customerId: getCellValue(headers, row, "Customer ID"),
        customerPhone,
        bookingTenure: getCellValue(headers, row, "Booking Tenure (Months)"),
        paymentFrequency: getCellValue(headers, row, "Payment Frequency"),
        sigmaPrice: parseNumber(getCellValue(headers, row, "Sigma Price (Monthly)")),
        askPrice: parseNumber(getCellValue(headers, row, "Ask Price (Monthly)")),
        amcIncluded: parseBoolean(getCellValue(headers, row, "AMC Included")) || amcAmount > 0,
        amcAmount,
        currentMonthlyRent,
        discountPerMonth,
        discountPercent,
        totalDiscount,
        gmPercent,
        hikePercent,
        remarks: getCellValue(headers, row, "Remarks"),
        bedsRequested,
        systemStatus: normalizeSystemStatus(rawStatus),
        myCheckStatus: checkStatuses[customerPhone] ?? "NOT_CHECKED",
      } satisfies BookingCase;
    })
    .filter((booking): booking is BookingCase => booking !== null);

  return mappedBookings;
}

export async function getBookingById(
  id: string,
): Promise<BookingCase | undefined> {
  const bookings = await getBookings();
  return bookings.find((booking) => booking.id === normalizePhone(id));
}

export function getTodayUncheckedCases(
  bookings: BookingCase[],
): BookingCase[] {
  return bookings.filter(
    (booking) =>
      isToday(booking.timestamp) && booking.myCheckStatus === "NOT_CHECKED",
  );
}

export function getDashboardSummary(
  uncheckedToday: BookingCase[],
): DashboardSummary {
  const needsReview = uncheckedToday.filter(
    (booking) => booking.systemStatus === "Needs Review",
  ).length;
  const approved = uncheckedToday.filter(
    (booking) => booking.systemStatus === "Approved",
  ).length;
  const duplicate = uncheckedToday.filter(
    (booking) => booking.systemStatus === "Duplicate",
  ).length;

  return {
    dateLabel: new Intl.DateTimeFormat("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date()),
    totalNotChecked: uncheckedToday.length,
    needsReview,
    approved,
    duplicate,
    other: uncheckedToday.length - needsReview - approved - duplicate,
  };
}

export function filterUncheckedCases(
  cases: BookingCase[],
  statusFilter: StatusFilter,
  query: string,
): BookingCase[] {
  const normalized = query.trim().toLowerCase();

  return cases.filter((booking) => {
    const matchesStatus =
      statusFilter === "All" || booking.systemStatus === statusFilter;

    if (!matchesStatus) {
      return false;
    }

    if (!normalized) {
      return true;
    }

    const searchText = [
      booking.houseName,
      booking.mm,
      booking.roomNumber,
      booking.customerId,
      booking.customerPhone,
    ]
      .join(" ")
      .toLowerCase();

    return searchText.includes(normalized);
  });
}

export function isToday(isoTimestamp: string): boolean {
  const value = new Date(isoTimestamp).getTime();
  return value >= startOfToday().getTime() && value <= endOfToday().getTime();
}

const STATUS_ORDER = [
  "Needs Review",
  "Approved",
  "Duplicate",
  "Rejected",
  "On Hold",
] as const;

export function groupBySystemStatus(
  cases: BookingCase[],
): { status: string; cases: BookingCase[] }[] {
  const groups = new Map<string, BookingCase[]>();

  for (const booking of cases) {
    const existing = groups.get(booking.systemStatus) ?? [];
    existing.push(booking);
    groups.set(booking.systemStatus, existing);
  }

  const ordered: { status: string; cases: BookingCase[] }[] = [];

  for (const status of STATUS_ORDER) {
    const group = groups.get(status);
    if (group?.length) {
      ordered.push({ status, cases: group });
    }
  }

  for (const [status, group] of groups) {
    if (!STATUS_ORDER.includes(status as (typeof STATUS_ORDER)[number])) {
      ordered.push({ status, cases: group });
    }
  }

  return ordered;
}
