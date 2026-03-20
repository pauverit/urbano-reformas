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
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 px-4 py-3 flex items-center justify-between z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] rounded-t-[32px]">
            {items.map((item) => (
                <Link key={item.label} href={item.href} className="flex flex-col items-center gap-1 group flex-1">
                    <div className="p-2.5 rounded-2xl group-hover:bg-blue-50 transition-colors">
                        <item.icon size={20} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-tighter group-hover:text-blue-600 transition-colors whitespace-nowrap">{item.label}</span>
                </Link>
            ))}
        </div>
    );
}
