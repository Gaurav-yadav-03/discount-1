export type SystemStatus =
  | "Needs Review"
  | "Approved"
  | "Duplicate"
  | "Rejected"
  | "On Hold";

export type MyCheckStatus = "NOT_CHECKED" | "CHECKED";
export type ReviewAction = "Approved" | "Rejected" | "Duplicate";

export interface ReviewRecord {
  customerPhone: string;
  action: ReviewAction;
  reviewedAt: string;
}

export interface BookingCase {
  id: string;
  requestId?: string;
  timestamp: string;
  name?: string;
  houseName: string;
  houseCategory?: string;
  mm: string;
  roomNumber: string;
  bookingCategory: string;
  bookingType: string;
  occupancyType: string;
  customerId: string;
  customerPhone: string;
  bookingTenure: string;
  paymentFrequency: string;
  sigmaPrice: number;
  askPrice: number;
  amcIncluded: boolean;
  amcAmount: number;
  currentMonthlyRent: number;
  discountPerMonth: number;
  discountPercent: number;
  totalDiscount: number;
  gmPercent: number;
  hikePercent: number;
  remarks: string;
  bedsRequested: number;
  systemStatus: SystemStatus;
  circle?: string;
  statusForKundan?: string;
  myCheckStatus: MyCheckStatus;
}

export type StatusFilter =
  | "All"
  | "Needs Review"
  | "Approved"
  | "Duplicate"
  | "Rejected"
  | "Other";

export type DateSelection = string | "ALL";

export interface DashboardSummary {
  dateLabel: string;
  totalNotChecked: number;
  needsReview: number;
  approved: number;
  duplicate: number;
  other: number;
}
