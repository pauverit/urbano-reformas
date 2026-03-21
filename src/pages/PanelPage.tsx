import {
    Plus,
    MapPin,
    Calendar,
    TrendingUp,
    CheckCircle2,
    Clock,
    AlertCircle,
    FileDigit
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { presupuestosStore, facturasStore, recibosStore, type Presupuesto, type Factura, type Recibo } from "../lib/store";

export default function PanelPage() {
    const [presupuestos, setPresupuestos] = useState<Presupuesto[]>([]);
    const [facturas, setFacturas] = useState<Factura[]>([]);
    const [recibos, setRecibos] = useState<Recibo[]>([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        const cargar = async () => {
            setCargando(true);
            setPresupuestos(await presupuestosStore.getAll());
            setFacturas(await facturasStore.getAll());
            setRecibos(await recibosStore.getAll());
            setCargando(false);
        };
        cargar();
    }, []);

    const parseFecha = (f: string) => {
        const p = f.split('/');
        return p.length === 3 ? new Date(+p[2], +p[1] - 1, +p[0]) : new Date();
    };
    const facturasVencidas = facturas.filter(f => {
        if (f.estado !== 'pendiente') return false;
        return (Date.now() - parseFecha(f.fecha).getTime()) / 86400000 > 30;
    });

    const obrasActivas = presupuestos.filter(p => p.estado === 'aceptado').length;
    const totalPresupuestos = presupuestos.length;

    const sumFacturas = facturas.reduce((acc, f) => acc + Number(f.total), 0);
    const sumRecibos = recibos.reduce((acc, r) => acc + Number(r.importe), 0);
    const pendiente = sumFacturas - sumRecibos;

    const estadisticas = [
        { titulo: "Obras Activas", valor: obrasActivas.toString(), cambio: "Aceptadas", icono: MapPin, color: "bg-blue-500" },
        { titulo: "Presupuestos", valor: totalPresupuestos.toString(), cambio: "Total", icono: TrendingUp, color: "bg-emerald-500" },
        { titulo: "Facturas", valor: facturas.length.toString(), cambio: "Emitidas", icono: CheckCircle2, color: "bg-indigo-500" },
        { titulo: "Pendiente", valor: pendiente.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }), cambio: "Por cobrar", icono: AlertCircle, color: "bg-amber-500" },
    ];

    const presupuestosAceptados = presupuestos.filter(p => p.estado === 'aceptado').slice(0, 3);

    return (
        <div className="space-y-8 page-transition">
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-1 uppercase">Panel de Control</h1>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Visión General de Urbano Reformas</p>
                </div>
                <Link to="/presupuestos/new" className="premium-button flex items-center gap-3 self-start sm:self-auto">
                    <Plus size={18} /> Nuevo Presupuesto
                </Link>
            </header>

            {facturasVencidas.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex items-center gap-3">
                    <AlertCircle size={18} className="text-amber-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-black text-amber-700 uppercase tracking-widest">
                            {facturasVencidas.length === 1
                                ? '1 factura lleva más de 30 días sin cobrar'
                                : `${facturasVencidas.length} facturas llevan más de 30 días sin cobrar`}
                        </p>
                        <p className="text-[10px] font-bold text-amber-500 mt-0.5">
                            Total: {facturasVencidas.reduce((s, f) => s + Number(f.total), 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                        </p>
                    </div>
                    <Link to="/facturas" className="text-[10px] font-black text-amber-600 uppercase tracking-widest hover:underline whitespace-nowrap">Ver →</Link>
                </div>
            )}

            {/* Tarjetas resumen — 2 columnas en móvil, 4 en escritorio */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {estadisticas.map((stat) => (
                    <div key={stat.titulo} className="premium-card p-5 md:p-8 group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl ${stat.color} text-white shadow-lg`}>
                                <stat.icono size={18} />
                            </div>
                            <span className="text-[9px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-widest hidden sm:block">
                                {stat.cambio}
                            </span>
                        </div>
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1 truncate">{stat.titulo}</p>
                        <p className="text-xl md:text-3xl font-black text-slate-900 tracking-tighter">{stat.valor}</p>
                    </div>
                ))}
            </div>

            {/* Obras en curso */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Obras en Curso</h3>
                    <Link to="/presupuestos" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:translate-x-1 transition-transform">Ver todas →</Link>
                </div>

                {cargando ? (
                    <div className="premium-card p-10 flex items-center justify-center">
                        <div className="animate-spin w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full" />
                    </div>
                ) : presupuestosAceptados.length === 0 ? (
                    <div className="premium-card p-10 flex flex-col items-center justify-center text-center text-slate-400">
                        <FileDigit size={36} className="mb-3 opacity-50" />
                        <p className="text-sm font-black uppercase tracking-tight">No hay obras activas</p>
                        <p className="text-[10px] font-bold uppercase tracking-widest mt-1">Acepta presupuestos para verlos aquí</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {presupuestosAceptados.map((p) => (
                            <Link key={p.id} to={`/presupuestos/${p.id}`} className="premium-card p-5 md:p-8 flex items-center justify-between hover:bg-slate-50 transition-all border-l-4 border-l-blue-500 group block">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white transition-colors flex-shrink-0">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900 text-base uppercase tracking-tight">Presupuesto {p.numero}</p>
                                        <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex-wrap">
                                            <span className="flex items-center gap-1"><Calendar size={10} className="text-blue-500" /> {p.fecha}</span>
                                            <span className="flex items-center gap-1"><Clock size={10} className="text-emerald-500" /> {Number(p.total).toFixed(2)} €</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden sm:block w-24 bg-slate-100 h-2 rounded-full overflow-hidden flex-shrink-0">
                                    <div className="bg-blue-500 h-full w-[20%] rounded-full" />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Agenda Hoy — solo en escritorio */}
            <div className="hidden lg:block">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Agenda Hoy</h3>
                    <Calendar size={18} className="text-slate-300" />
                </div>
                <div className="bg-slate-950 p-8 rounded-[32px] text-white space-y-6 shadow-2xl shadow-blue-100/20 border border-slate-800">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="relative pl-6 border-l-2 border-slate-800 group">
                            <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-blue-500" />
                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">09:30 AM</p>
                            <p className="font-bold text-sm text-slate-100 uppercase">Reunión de Obra: Pintura y Acabados</p>
                            <p className="text-[10px] font-bold text-slate-500 mt-0.5 uppercase tracking-tighter">Polígono Ind. San Fernando</p>
                        </div>
                    ))}
                    <Link to="/agenda" className="block w-full py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5 text-center">
                        Abrir Agenda Completa
                    </Link>
                </div>
            </div>
        </div>
    );
}
