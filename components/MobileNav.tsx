import Link from "next/link";
import {
    LayoutDashboard,
    FileDigit,
    Calendar,
    Users,
    Wallet
} from "lucide-react";

export default function MobileNav() {
    const items = [
        { icon: LayoutDashboard, href: "/panel", label: "Inicio" },
        { icon: FileDigit, href: "/presupuestos", label: "Ptos" },
        { icon: Wallet, href: "/recibos", label: "Pagos" },
        { icon: Calendar, href: "/agenda", label: "Agenda" },
        { icon: Users, href: "/personal", label: "Equipo" },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-4 flex items-center justify-between z-50 shadow-2xl rounded-t-[32px]">
            {items.map((item) => (
                <Link key={item.label} href={item.href} className="flex flex-col items-center gap-1 group">
                    <div className="p-2 rounded-xl group-hover:bg-slate-50 transition-colors">
                        <item.icon size={22} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest group-hover:text-blue-600">{item.label}</span>
                </Link>
            ))}
        </div>
    );
}
