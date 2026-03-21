import { useState, useEffect, useCallback } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { Calendar, ChevronLeft, ChevronRight, Plus, LogIn, LogOut, MapPin, Clock, Loader2, X, Trash2 } from "lucide-react";

const GCAL_KEY = "urbano_gcal_token";
const GCAL_USER_KEY = "urbano_gcal_user";

interface GCalEvent {
    id: string;
    summary: string;
    description?: string;
    location?: string;
    start: { dateTime?: string; date?: string };
    end: { dateTime?: string; date?: string };
    colorId?: string;
}

interface GCalUser {
    name: string;
    email: string;
    picture?: string;
}

const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const DIAS = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];

function formatHora(dateTime?: string): string {
    if (!dateTime) return "";
    const d = new Date(dateTime);
    return d.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });
}

function eventColor(colorId?: string): string {
    const map: Record<string, string> = {
        "1": "bg-blue-500", "2": "bg-green-500", "3": "bg-purple-500",
        "4": "bg-red-400", "5": "bg-yellow-500", "6": "bg-orange-500",
        "7": "bg-cyan-500", "8": "bg-gray-500", "9": "bg-blue-700",
        "10": "bg-green-700", "11": "bg-red-700",
    };
    return map[colorId || ""] || "bg-blue-500";
}

export default function AgendaPage() {
    const today = new Date();
    const [año, setAño] = useState(today.getFullYear());
    const [mes, setMes] = useState(today.getMonth());
    const [token, setToken] = useState<string | null>(() => localStorage.getItem(GCAL_KEY));
    const [gcalUser, setGcalUser] = useState<GCalUser | null>(() => {
        const v = localStorage.getItem(GCAL_USER_KEY);
        return v ? JSON.parse(v) : null;
    });
    const [eventos, setEventos] = useState<GCalEvent[]>([]);
    const [cargando, setCargando] = useState(false);
    const [diaSeleccionado, setDiaSeleccionado] = useState<number>(today.getDate());
    const [modalNuevo, setModalNuevo] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [guardando, setGuardando] = useState(false);
    const [nuevoEvento, setNuevoEvento] = useState({
        titulo: "",
        fecha: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`,
        horaInicio: "09:00",
        horaFin: "10:00",
        descripcion: "",
        lugar: "",
    });

    const fetchEventos = useCallback(async (tk: string) => {
        setCargando(true);
        setErrorMsg("");
        try {
            const inicio = new Date(año, mes, 1).toISOString();
            const fin = new Date(año, mes + 1, 0, 23, 59, 59).toISOString();
            const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(inicio)}&timeMax=${encodeURIComponent(fin)}&singleEvents=true&orderBy=startTime&maxResults=100`;
            const res = await fetch(url, { headers: { Authorization: `Bearer ${tk}` } });
            if (res.status === 401) {
                localStorage.removeItem(GCAL_KEY);
                localStorage.removeItem(GCAL_USER_KEY);
                setToken(null);
                setGcalUser(null);
                setErrorMsg("Sesión de Google expirada. Vuelve a conectar.");
                return;
            }
            const data = await res.json();
            setEventos(data.items || []);
        } catch {
            setErrorMsg("Error al cargar eventos. Comprueba tu conexión.");
        } finally {
            setCargando(false);
        }
    }, [año, mes]);

    const fetchUserInfo = async (tk: string) => {
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${tk}` }
        });
        const info = await res.json();
        const user: GCalUser = { name: info.name || info.email, email: info.email, picture: info.picture };
        localStorage.setItem(GCAL_USER_KEY, JSON.stringify(user));
        setGcalUser(user);
    };

    useEffect(() => {
        if (token) fetchEventos(token);
    }, [token, fetchEventos]);

    const login = useGoogleLogin({
        scope: "https://www.googleapis.com/auth/calendar.events",
        onSuccess: async (resp: { access_token: string }) => {
            const tk = resp.access_token;
            localStorage.setItem(GCAL_KEY, tk);
            setToken(tk);
            await fetchUserInfo(tk);
        },
        onError: () => setErrorMsg("No se pudo conectar con Google. Inténtalo de nuevo."),
    });

    const desconectar = () => {
        localStorage.removeItem(GCAL_KEY);
        localStorage.removeItem(GCAL_USER_KEY);
        setToken(null);
        setGcalUser(null);
        setEventos([]);
    };

    const crearEvento = async () => {
        if (!token || !nuevoEvento.titulo) return;
        setGuardando(true);
        try {
            const body = {
                summary: nuevoEvento.titulo,
                description: nuevoEvento.descripcion,
                location: nuevoEvento.lugar,
                start: { dateTime: `${nuevoEvento.fecha}T${nuevoEvento.horaInicio}:00`, timeZone: "Europe/Madrid" },
                end: { dateTime: `${nuevoEvento.fecha}T${nuevoEvento.horaFin}:00`, timeZone: "Europe/Madrid" },
            };
            const res = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (res.ok) {
                setModalNuevo(false);
                setNuevoEvento({ titulo: "", fecha: nuevoEvento.fecha, horaInicio: "09:00", horaFin: "10:00", descripcion: "", lugar: "" });
                fetchEventos(token);
            } else {
                setErrorMsg("Error al crear el evento en Google Calendar.");
            }
        } finally {
            setGuardando(false);
        }
    };

    const eliminarEvento = async (id: string) => {
        if (!token || !confirm("¿Eliminar este evento de Google Calendar?")) return;
        await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });
        fetchEventos(token);
    };

    // Generar días del calendario
    const primerDia = new Date(año, mes, 1).getDay();
    const offsetLunes = primerDia === 0 ? 6 : primerDia - 1;
    const diasEnMes = new Date(año, mes + 1, 0).getDate();
    const celdas = Array.from({ length: offsetLunes + diasEnMes }, (_, i) =>
        i < offsetLunes ? null : i - offsetLunes + 1
    );

    const eventosDelDia = (dia: number) =>
        eventos.filter(e => {
            const fecha = new Date((e.start.dateTime || e.start.date)!);
            return fecha.getFullYear() === año && fecha.getMonth() === mes && fecha.getDate() === dia;
        });

    const eventosHoySeleccionado = eventosDelDia(diaSeleccionado).sort((a, b) =>
        (a.start.dateTime || "").localeCompare(b.start.dateTime || "")
    );

    const prevMes = () => { if (mes === 0) { setAño(a => a - 1); setMes(11); } else setMes(m => m - 1); };
    const nextMes = () => { if (mes === 11) { setAño(a => a + 1); setMes(0); } else setMes(m => m + 1); };

    // ── PANTALLA SIN CONECTAR ────────────────────────────────
    if (!token) {
        return (
            <div className="space-y-10 page-transition">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">Agenda</h1>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest italic">Planificación y Google Calendar</p>
                    </div>
                </header>

                <div className="premium-card p-16 text-center space-y-8 max-w-lg mx-auto">
                    <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto">
                        <Calendar size={36} className="text-blue-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-3">Conecta Google Calendar</h2>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed">
                            Sincroniza tu agenda de Gmail para ver y crear eventos directamente desde la app.
                        </p>
                    </div>
                    {errorMsg && <p className="text-red-500 text-sm font-bold bg-red-50 px-4 py-3 rounded-xl">{errorMsg}</p>}
                    <button
                        onClick={() => login()}
                        className="premium-button flex items-center gap-3 mx-auto"
                    >
                        <LogIn size={18} />
                        Conectar con Google
                    </button>
                    <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">
                        Solo accede a tu calendario. No se almacenan contraseñas.
                    </p>
                </div>
            </div>
        );
    }

    // ── PANTALLA CONECTADA ───────────────────────────────────
    return (
        <div className="space-y-8 page-transition">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">Agenda</h1>
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest italic">Planificación y Google Calendar</p>
                </div>
                <div className="flex items-center gap-4">
                    {gcalUser && (
                        <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2">
                            {gcalUser.picture && <img src={gcalUser.picture} className="w-7 h-7 rounded-full" alt="" />}
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Google</p>
                                <p className="text-xs font-black text-slate-700">{gcalUser.name}</p>
                            </div>
                            <button onClick={desconectar} title="Desconectar" className="ml-1 text-slate-300 hover:text-red-500 transition-colors">
                                <LogOut size={14} />
                            </button>
                        </div>
                    )}
                    <button
                        onClick={() => setModalNuevo(true)}
                        className="premium-button flex items-center gap-3"
                    >
                        <Plus size={18} /> Nuevo Evento
                    </button>
                </div>
            </header>

            {errorMsg && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-sm font-bold px-5 py-3 rounded-2xl">
                    {errorMsg}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* ── CALENDARIO ── */}
                <div className="lg:col-span-3 premium-card p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                            {MESES[mes]} {año}
                        </h3>
                        <div className="flex items-center gap-3">
                            {cargando && <Loader2 size={16} className="animate-spin text-blue-500" />}
                            <button onClick={prevMes} className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-colors border border-slate-100">
                                <ChevronLeft size={18} />
                            </button>
                            <button onClick={nextMes} className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-colors border border-slate-100">
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1 mb-3">
                        {DIAS.map(d => (
                            <div key={d} className="text-center text-[9px] font-black text-slate-300 uppercase tracking-widest py-2">{d}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {celdas.map((dia, i) => {
                            if (!dia) return <div key={`empty-${i}`} />;
                            const esHoy = dia === today.getDate() && mes === today.getMonth() && año === today.getFullYear();
                            const esSeleccionado = dia === diaSeleccionado;
                            const evsDia = eventosDelDia(dia);
                            return (
                                <div
                                    key={dia}
                                    onClick={() => setDiaSeleccionado(dia)}
                                    className={`min-h-[56px] rounded-xl p-1.5 cursor-pointer transition-all border ${esSeleccionado
                                        ? "bg-blue-600 border-blue-600 shadow-lg shadow-blue-100"
                                        : esHoy
                                            ? "bg-blue-50 border-blue-200"
                                            : "border-transparent hover:bg-slate-50 hover:border-slate-100"
                                        }`}
                                >
                                    <span className={`text-xs font-black block text-center mb-1 ${esSeleccionado ? "text-white" : esHoy ? "text-blue-600" : "text-slate-700"}`}>
                                        {dia}
                                    </span>
                                    <div className="flex flex-col gap-0.5">
                                        {evsDia.slice(0, 2).map(ev => (
                                            <div key={ev.id} className={`${eventColor(ev.colorId)} rounded px-1 text-[8px] font-bold text-white truncate`}>
                                                {ev.summary}
                                            </div>
                                        ))}
                                        {evsDia.length > 2 && (
                                            <div className="text-[8px] font-black text-slate-400 text-center">+{evsDia.length - 2}</div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── PANEL DÍA ── */}
                <div className="space-y-5">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                            <Clock size={15} className="text-blue-500" />
                            {diaSeleccionado} {MESES[mes]}
                        </h3>
                        <button
                            onClick={() => {
                                setNuevoEvento(prev => ({
                                    ...prev,
                                    fecha: `${año}-${String(mes + 1).padStart(2, "0")}-${String(diaSeleccionado).padStart(2, "0")}`
                                }));
                                setModalNuevo(true);
                            }}
                            className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-700 flex items-center gap-1"
                        >
                            <Plus size={12} /> Añadir
                        </button>
                    </div>

                    {eventosHoySeleccionado.length === 0 ? (
                        <div className="premium-card p-8 text-center">
                            <Calendar size={28} className="mx-auto text-slate-200 mb-3" />
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Sin eventos</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {eventosHoySeleccionado.map(ev => (
                                <div key={ev.id} className="premium-card p-4 border-l-4 border-l-blue-500 group">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-black text-sm text-slate-900 uppercase leading-tight truncate">{ev.summary}</p>
                                            {ev.start.dateTime && (
                                                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mt-1">
                                                    {formatHora(ev.start.dateTime)} — {formatHora(ev.end.dateTime)}
                                                </p>
                                            )}
                                            {ev.location && (
                                                <div className="flex items-center gap-1 mt-1.5">
                                                    <MapPin size={10} className="text-slate-300 flex-shrink-0" />
                                                    <p className="text-[10px] font-bold text-slate-400 truncate">{ev.location}</p>
                                                </div>
                                            )}
                                            {ev.description && (
                                                <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{ev.description}</p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => eliminarEvento(ev.id)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-red-500 flex-shrink-0"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ── MODAL NUEVO EVENTO ── */}
            {modalNuevo && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="premium-card w-full max-w-md p-8 space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Nuevo Evento</h2>
                            <button onClick={() => setModalNuevo(false)} className="text-slate-300 hover:text-slate-900">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Título *</label>
                                <input
                                    className="premium-input w-full"
                                    placeholder="Visita de obra, Reunión cliente..."
                                    value={nuevoEvento.titulo}
                                    onChange={e => setNuevoEvento(p => ({ ...p, titulo: e.target.value }))}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Fecha</label>
                                <input
                                    type="date"
                                    className="premium-input w-full"
                                    value={nuevoEvento.fecha}
                                    onChange={e => setNuevoEvento(p => ({ ...p, fecha: e.target.value }))}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Hora inicio</label>
                                    <input type="time" className="premium-input w-full" value={nuevoEvento.horaInicio}
                                        onChange={e => setNuevoEvento(p => ({ ...p, horaInicio: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Hora fin</label>
                                    <input type="time" className="premium-input w-full" value={nuevoEvento.horaFin}
                                        onChange={e => setNuevoEvento(p => ({ ...p, horaFin: e.target.value }))} />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Lugar</label>
                                <input className="premium-input w-full" placeholder="Dirección de la obra..."
                                    value={nuevoEvento.lugar}
                                    onChange={e => setNuevoEvento(p => ({ ...p, lugar: e.target.value }))} />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5">Descripción</label>
                                <textarea className="premium-input w-full resize-none" rows={2}
                                    placeholder="Notas del evento..."
                                    value={nuevoEvento.descripcion}
                                    onChange={e => setNuevoEvento(p => ({ ...p, descripcion: e.target.value }))} />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button onClick={() => setModalNuevo(false)} className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
                                Cancelar
                            </button>
                            <button
                                onClick={crearEvento}
                                disabled={!nuevoEvento.titulo || guardando}
                                className="flex-1 premium-button justify-center disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {guardando ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                                Crear Evento
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
