import type { PropsWithChildren } from 'react';
const pages = ['Dashboard', 'Users', 'Providers', 'Bookings', 'Categories', 'Payments', 'Reports & analytics'] as const;
export type AdminPage = typeof pages[number];
export function DashboardLayout({ selected, onSelect, children }: PropsWithChildren<{ selected: AdminPage; onSelect: (page: AdminPage) => void }>) {
  return <div className="shell"><aside><div className="logo">Smart Service<span>ADMIN WORKSPACE</span></div>
    <nav aria-label="Administration">{pages.map(page => <button key={page} aria-current={page === selected ? 'page' : undefined} className={page === selected ? 'active' : ''} onClick={() => onSelect(page)}>{page}</button>)}</nav>
    <p className="sidebar-note">Built for local services.<br />Made for Sri Lanka.</p></aside>
    <div className="workspace"><header><strong>Smart Service Booking</strong><span>Admin preview</span></header><main>{children}</main></div></div>;
}
