import { useState } from 'react';
import { DashboardLayout, type AdminPage } from './layouts/DashboardLayout';
import { ManagementPage } from './pages/ManagementPage';
export function App() { const [page, setPage] = useState<AdminPage>('Dashboard'); return <DashboardLayout selected={page} onSelect={setPage}><ManagementPage title={page} /></DashboardLayout>; }
