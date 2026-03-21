import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import MobileNav from '../components/MobileNav';
import { getSession } from '../lib/auth';

export default function RootLayout() {
    if (!getSession()) return <Navigate to="/login" replace />;

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            <div className="hidden md:block">
                <Sidebar />
            </div>
            <main className="flex-1 overflow-y-auto p-6 pb-24 md:pb-6 md:p-10 transition-all duration-500">
                <Outlet />
            </main>
            <MobileNav />
        </div>
    );
}
