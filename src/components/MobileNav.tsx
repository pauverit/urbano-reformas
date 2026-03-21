import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    FileDigit,
    Calendar,
    Users,
    Wallet,
    UserCircle,
    Package,
    Receipt,
    ShoppingCart,
    BarChart3,
    Clock,
    Building2
} from "lucide-react";

const navItems = [
    { name: "Inicio", href: "/panel", icon: LayoutDashboard },
    { name: "Ptos", href: "/presupuestos", icon: FileDigit },
    { name: "Facturas", href: "/facturas", icon: Receipt },
    { name: "Gastos", href: "/gastos", icon: ShoppingCart },
    { name: "Clientes", href: "/clientes", icon: UserCircle },
    { name: "Horas", href: "/horas", icon: Clock },
    { name: "Recibos", href: "/recibos", icon: Wallet },
    { name: "Informes", href: "/informes", icon: BarChart3 },
    { name: "Agenda", href: "/agenda", icon: Calendar },
    { name: "Equipo", href: "/personal", icon: Users },
    { name: "Artic.", href: "/articulos", icon: Package },
    { name: "Empresa", href: "/mi-empresa", icon: Building2 },
];

export default function MobileNav() {
    const location = useLocation();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-[100] shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
            <div className="flex overflow-x-auto whitespace-nowrap px-2 py-2 gap-1 scrollbar-hide items-center">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.href || (item.href !== '/panel' && location.pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`flex flex-col items-center gap-1 transition-all flex-shrink-0 px-3 py-2 rounded-xl min-w-[3.5rem] ${
                                isActive
                                    ? "text-blue-600 bg-blue-50"
                                    : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
                            }`}
                        >
                            <item.icon size={19} strokeWidth={isActive ? 2.5 : 1.8} />
                            <span className="text-[8.5px] font-black uppercase tracking-widest leading-none">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
