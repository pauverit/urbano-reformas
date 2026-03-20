import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    FileDigit,
    Calendar,
    Users,
    Wallet,
    Settings,
    LogOut,
    ChevronRight
} from "lucide-react";

const navItems = [
    { name: "Dashboard", href: "/panel", icon: LayoutDashboard, color: "text-blue-500" },
    { name: "Ventas / Ptos", href: "/presupuestos", icon: FileDigit, color: "text-indigo-500" },
    { name: "Recibos & Pagos", href: "/recibos", icon: Wallet, color: "text-emerald-500" },
    { name: "Agenda Obra", href: "/agenda", icon: Calendar, color: "text-amber-500" },
    { name: "Equipo Humano", href: "/personal", icon: Users, color: "text-purple-500" },
];

export default function Sidebar() {
    const location = useLocation();

    return (
        <div className="w-72 bg-white border-r border-slate-100 h-full flex flex-col p-8 shadow-[10px_0_40px_rgba(0,0,0,0.01)]">
            <div className="flex items-center gap-4 mb-16">
                <div className="w-12 h-12">
                    <img src="/logo.png" alt="UR" className="w-full h-full object-contain" />
                </div>
                <div>
                    <span className="block font-black text-slate-900 tracking-tighter text-base uppercase leading-none">Urbano</span>
                    <span className="block font-bold text-slate-300 text-[10px] uppercase tracking-[0.2em] mt-0.5">Reformas v2.0</span>
                </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-3xl mb-10 flex items-center gap-3 border border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm border border-slate-100">
                    <Users size={18} />
                </div>
                <div className="overflow-hidden">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Administrador</p>
                    <p className="text-sm font-black text-slate-800 truncate uppercase">Carlos</p>
                </div>
            </div>

            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-6 ml-2">Menú Principal</p>

            <nav className="flex-1 space-y-2">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`flex items-center justify-between px-5 py-4 rounded-[24px] transition-all group ${isActive ? 'bg-slate-50 text-slate-900 border border-slate-100 shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/50'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <item.icon size={20} className={`${item.color} ${isActive ? 'opacity-100' : 'opacity-70'} group-hover:opacity-100 transition-opacity`} />
                                <span className="font-bold text-sm uppercase tracking-tight">{item.name}</span>
                            </div>
                            <ChevronRight size={14} className={`transition-all ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0'}`} />
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto space-y-4 pt-8">
                <div className="flex items-center gap-4 px-6 py-4 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer group border-t border-slate-50 pt-8">
                    <Settings size={18} />
                    <span className="font-black text-[10px] uppercase tracking-widest">Ajustes</span>
                </div>

                <Link
                    to="/login"
                    className="flex items-center gap-4 px-6 py-4 text-red-400 hover:text-red-700 transition-colors cursor-pointer group"
                >
                    <LogOut size={18} />
                    <span className="font-black text-[10px] uppercase tracking-widest">Cerrar Sesión</span>
                </Link>
            </div>
        </div>
    );
}
