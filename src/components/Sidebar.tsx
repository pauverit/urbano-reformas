import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    FileDigit,
    Calendar,
    Users,
    Wallet,
    LogOut,
    ChevronRight,
    UserCircle,
    Package,
    Receipt,
    ShoppingCart,
    BarChart3,
    Building2
} from "lucide-react";

{ name: "Inicio", href: "/panel", icon: LayoutDashboard, color: "text-blue-500" },
{ name: "Clientes", href: "/clientes", icon: UserCircle, color: "text-cyan-500" },
{ name: "Artículos", href: "/articulos", icon: Package, color: "text-orange-500" },
{ name: "Presupuestos", href: "/presupuestos", icon: FileDigit, color: "text-indigo-500" },
{ name: "Facturas", href: "/facturas", icon: Receipt, color: "text-purple-500" },
{ name: "Recibos", href: "/recibos", icon: Wallet, color: "text-emerald-500" },
{ name: "Gastos", href: "/gastos", icon: ShoppingCart, color: "text-amber-500" },
{ name: "Informes", href: "/informes", icon: BarChart3, color: "text-rose-500" },
{ name: "Agenda", href: "/agenda", icon: Calendar, color: "text-teal-500" },
{ name: "Equipo", href: "/personal", icon: Users, color: "text-pink-500" },
];

export default function Sidebar() {
    const location = useLocation();

    return (
        <div className="w-72 bg-white border-r border-slate-100 h-full flex flex-col p-6 shadow-[10px_0_40px_rgba(0,0,0,0.01)] overflow-y-auto">
            <div className="flex items-center gap-4 mb-10">
                <div className="w-10 h-10">
                    <img src="/logo.png" alt="UR" className="w-full h-full object-contain" />
                </div>
                <div>
                    <span className="block font-black text-slate-900 tracking-tighter text-sm uppercase leading-none">Urbano</span>
                    <span className="block font-bold text-slate-300 text-[9px] uppercase tracking-[0.2em] mt-0.5">Reformas v4.0</span>
                </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl mb-8 flex items-center gap-3 border border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm border border-slate-100">
                    <Users size={16} />
                </div>
                <div className="overflow-hidden">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none mb-0.5">Admin</p>
                    <p className="text-xs font-black text-slate-800 truncate uppercase">Carlos</p>
                </div>
            </div>

            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] mb-4 ml-2">Menú</p>

            <nav className="flex-1 space-y-1">
                {navItems.map((item) => {
                    const isActive = location.pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all group ${isActive ? 'bg-slate-50 text-slate-900 border border-slate-100 shadow-sm' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/50'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon size={18} className={`${item.color} ${isActive ? 'opacity-100' : 'opacity-70'} group-hover:opacity-100 transition-opacity`} />
                                <span className="font-bold text-xs uppercase tracking-tight">{item.name}</span>
                            </div>
                            <ChevronRight size={12} className={`transition-all ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-8px] group-hover:opacity-100 group-hover:translate-x-0'}`} />
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto space-y-2 pt-6">
                <Link to="/mi-empresa" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-900 transition-colors border-t border-slate-50 pt-6">
                    <Building2 size={16} />
                    <span className="font-black text-[9px] uppercase tracking-widest">Mi Empresa</span>
                </Link>
                <Link to="/login" className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-700 transition-colors">
                    <LogOut size={16} />
                    <span className="font-black text-[9px] uppercase tracking-widest">Salir</span>
                </Link>
            </div>
        </div>
    );
}
