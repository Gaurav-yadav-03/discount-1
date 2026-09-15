import { NavLink, Outlet } from "react-router-dom";
import type { ReactNode } from "react";

const NAV_ITEMS = [
  { to: "/", label: "Home", short: "Home" },
  { to: "/inbox", label: "Inbox", short: "Inbox" },
  { to: "/explore", label: "Explore", short: "Find" },
  { to: "/analytics", label: "Analytics", short: "Stats" },
  { to: "/history", label: "History", short: "Past" },
];

export function AppShell({ children }: { children?: ReactNode }) {
  return (
    <div className="app-frame">
      <aside className="desktop-sidebar">
        <div className="brand-mark"><span>DS</span><div><strong>Decision Support</strong><small>Scholar operations</small></div></div>
        <nav className="sidebar-nav" aria-label="Primary navigation">
          {NAV_ITEMS.map((item) => <NavigationItem key={item.to} item={item} />)}
        </nav>
        <NavLink to="/settings" className={({ isActive }) => `sidebar-settings ${isActive ? "active" : ""}`}>Settings</NavLink>
        <p className="sidebar-footer">LOCAL PROTOTYPE<br />CSV source connected</p>
      </aside>
      <div className="app-content">
        <div className="mobile-topbar"><div className="brand-mark compact"><span>DS</span><strong>Booking Ops</strong></div><NavLink to="/settings" className="topbar-link">Settings</NavLink></div>
        <main className="page-container">{children ?? <Outlet />}</main>
        <nav className="mobile-nav" aria-label="Mobile navigation">
          {NAV_ITEMS.map((item) => <NavigationItem key={item.to} item={item} mobile />)}
        </nav>
      </div>
    </div>
  );
}

function NavigationItem({ item, mobile = false }: { item: (typeof NAV_ITEMS)[number]; mobile?: boolean }) {
  return <NavLink to={item.to} end={item.to === "/"} className={({ isActive }) => `${mobile ? "mobile-nav-item" : "sidebar-nav-item"} ${isActive ? "active" : ""}`}><span className="nav-dot" />{mobile ? item.short : item.label}</NavLink>;
}