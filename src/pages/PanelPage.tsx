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

    // Total pendiente = sum(facturas) - sum(recibos)
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
        <div className="space-y-12 page-transition">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">Panel de Control</h1>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Visión General de Urbano Reformas</p>
                </div>
                <Link to="/presupuestos/new" className="premium-button flex items-center gap-3">
                    <Plus size={18} /> Nuevo Presupuesto
                </Link>
            </header>

            {facturasVencidas.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4 flex items-center gap-4">
                    <AlertCircle size={20} className="text-amber-500 flex-shrink-0" />
                    <div className="flex-1">
                        <p className="text-[11px] font-black text-amber-700 uppercase tracking-widest">
                            {facturasVencidas.length === 1
                                ? '1 factura lleva más de 30 días sin cobrar'
                                : `${facturasVencidas.length} facturas llevan más de 30 días sin cobrar`}
                        </p>
                        <p className="text-[10px] font-bold text-amber-500 mt-0.5">
                            Total pendiente: {facturasVencidas.reduce((s, f) => s + Number(f.total), 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                        </p>
                    </div>
                    <a href="/facturas" className="text-[10px] font-black text-amber-600 uppercase tracking-widest hover:underline whitespace-nowrap">Ver facturas →</a>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {estadisticas.map((stat) => (
                    <div key={stat.titulo} className="premium-card p-8 group">
                        <div className="flex items-center justify-between mb-6">
                            <div className={`p-4 rounded-2xl ${stat.color} text-white shadow-lg`}>
                                <stat.icono size={24} />
                            </div>
                            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">
                                {stat.cambio}
                            </span>
                        </div>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{stat.titulo}</p>
                        <p className="text-3xl font-black text-slate-900 tracking-tighter">{stat.valor}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Obras en Curso</h3>
                        <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:translate-x-1 transition-transform">Ver todas →</button>
                    </div>

                    {!cargando && presupuestosAceptados.length === 0 ? (
                        <div className="premium-card p-10 flex flex-col items-center justify-center text-center text-slate-400">
                            <FileDigit size={40} className="mb-4 opacity-50" />
                            <p className="text-sm font-black uppercase tracking-tight">No hay obras activas</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest mt-1">Acepta presupuestos para verlos aquí</p>
                        </div>
                    ) : (
                        presupuestosAceptados.map((p) => (
                            <div key={p.id} className="premium-card p-8 flex items-center justify-between hover:bg-slate-50 transition-all border-l-4 border-l-blue-500 group">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-[24px] bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white transition-colors">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900 text-lg uppercase tracking-tight">Presupuesto {p.numero}</p>
                                        <div className="flex items-center gap-4 mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            <span className="flex items-center gap-1.5"><Calendar size={12} className="text-blue-500" /> {p.fecha}</span>
                                            <span className="flex items-center gap-1.5"><Clock size={12} className="text-emerald-500" /> {Number(p.total).toFixed(2)} €</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden sm:block w-32 bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-blue-500 h-full w-[20%] rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="space-y-8">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Agenda Hoy</h3>
                        <Calendar size={20} className="text-slate-300" />
                    </div>
                    <div className="bg-slate-950 p-10 rounded-[40px] text-white space-y-8 shadow-2xl shadow-blue-100/20 border border-slate-800">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="relative pl-8 border-l-2 border-slate-800 last:mb-0 mb-8 items-start group">
                                <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-blue-500 group-hover:scale-150 transition-transform"></div>
                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none mb-2">09:30 AM</p>
                                <p className="font-bold text-sm leading-tight text-slate-100 group-hover:text-white transition-colors uppercase">Reunión de Obra: Pintura y Acabados</p>
                                <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-tighter">Polígono Ind. San Fernando</p>
                            </div>
                        ))}
                        <button className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5">Abrir Agenda Completa</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
