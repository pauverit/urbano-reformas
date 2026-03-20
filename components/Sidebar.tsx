import Link from "next/link";
import {
    LayoutDashboard,
    Calendar,
    Users,
    FileText,
    Settings,
    PlusCircle,
    FileDigit,
    Heart,
    Megaphone,
    Hammer,
    Wallet
} from "lucide-react";

const navItems = [
    { name: "Panel", href: "/panel", icon: LayoutDashboard, color: "text-blue-500" },
    { name: "Presupuestos", href: "/presupuestos", icon: FileDigit, color: "text-pink-500" },
    { name: "Recibos/Pagos", href: "/recibos", icon: Wallet, color: "text-blue-600" },
    { name: "Agenda", href: "/agenda", icon: Calendar, color: "text-blue-500" },
    { name: "Personal", href: "/personal", icon: Users, color: "text-purple-500" },
    { name: "Fidelización", href: "#", icon: Heart, color: "text-emerald-500" },
    { name: "Marketing", href: "#", icon: Megaphone, color: "text-amber-500" },
    { name: "Trabajos", href: "/agenda", icon: Hammer, color: "text-blue-500" },
];

export default function Sidebar() {
    return (
        <div className="w-64 bg-white border-r border-slate-100 min-h-screen flex flex-col p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-10 px-2 mt-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-sm">
                    <span className="font-bold text-xs">UR</span>
                </div>
                <span className="font-extrabold text-slate-900 tracking-tight text-sm uppercase">URBANO REFORMAS</span>
            </div>

            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Módulos</p>

            <nav className="flex-1 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-slate-50 transition-all text-slate-600 hover:text-slate-900 group"
                    >
                        <item.icon size={18} className={`${item.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
                        <span className="font-semibold text-sm">{item.name}</span>
                    </Link>
                ))}
            </nav>

            <div className="mt-auto pt-10 px-2 space-y-4">
                <Link
                    href="/presupuestos/new"
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-bold transition-all shadow-md shadow-blue-100 active:scale-95"
                >
                    <PlusCircle size={20} />
                    <span className="text-sm">Nueva Obra</span>
                </Link>

                <div className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer border-t border-slate-50 pt-6">
                    <Settings size={18} />
                    <span className="font-bold text-xs uppercase tracking-wider">Ajustes</span>
                </div>
            </div>
        </div>
    );
}
