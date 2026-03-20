import { Link, useLocation } from "react-router-dom";
import {
    LayoutDashboard,
    FileDigit,
    Wallet,
    UserCircle,
    Receipt
} from "lucide-react";

const navItems = [
    { name: "Ptos", href: "/presupuestos", icon: FileDigit },
    { name: "Clientes", href: "/clientes", icon: UserCircle },
    { name: "Panel", href: "/panel", icon: LayoutDashboard },
    { name: "Facturas", href: "/facturas", icon: Receipt },
    { name: "Recibos", href: "/recibos", icon: Wallet },
];

export default function MobileNav() {
    const location = useLocation();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-4 py-3 flex justify-between items-center z-[100] shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
            {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.href);
                return (
                    <Link
                        key={item.name}
                        to={item.href}
                        className={`flex flex-col items-center gap-1 transition-all ${isActive ? "text-blue-600 scale-110" : "text-slate-300 hover:text-slate-600"
                            }`}
                    >
                        <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                        <span className="text-[9px] font-black uppercase tracking-widest leading-none">{item.name}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
