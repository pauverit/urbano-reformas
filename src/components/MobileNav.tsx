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
    Clock
} from "lucide-react";

const navItems = [
    { name: "Inicio", href: "/panel", icon: LayoutDashboard },
    { name: "Ptos", href: "/presupuestos", icon: FileDigit },
    { name: "Clientes", href: "/clientes", icon: UserCircle },
    { name: "Facturas", href: "/facturas", icon: Receipt },
    { name: "Recibos", href: "/recibos", icon: Wallet },
    { name: "Gastos", href: "/gastos", icon: ShoppingCart },
    { name: "Horas", href: "/horas", icon: Clock },
    { name: "Informes", href: "/informes", icon: BarChart3 },
    { name: "Agenda", href: "/agenda", icon: Calendar },
    { name: "Equipo", href: "/personal", icon: Users },
    { name: "Artic.", href: "/articulos", icon: Package },
];

export default function MobileNav() {
    const location = useLocation();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-[100] shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
            <div className="flex overflow-x-auto whitespace-nowrap px-4 py-3 gap-6 scrollbar-hide items-center">
                {navItems.map((item) => {
                    const isActive = location.pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.name}
                            to={item.href}
                            className={`flex flex-col items-center gap-1 transition-all flex-shrink-0 min-w-[3.5rem] ${isActive ? "text-blue-600 scale-110" : "text-slate-300 hover:text-slate-600"
                                }`}
                        >
                            <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[9px] font-black uppercase tracking-widest leading-none">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
