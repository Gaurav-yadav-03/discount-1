import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <header className="page-header"><div><p className="eyebrow">{eyebrow ?? "BOOKING OPERATIONS"}</p><h1>{title}</h1>{description ? <p className="page-description">{description}</p> : null}</div>{action}</header>;
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return <div className="empty-state"><div className="empty-icon">--</div><h2>{title}</h2>{description ? <p>{description}</p> : null}</div>;
}