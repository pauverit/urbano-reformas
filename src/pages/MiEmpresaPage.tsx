import { useState, useEffect } from "react";
import { empresaStore, usuariosStore, type Empresa, type Usuario } from "../lib/store";
import { Building2, Save, CheckCircle2, Upload, CreditCard, FileText, KeyRound, UserPlus, Pencil, Trash2, Eye, EyeOff, X, Check } from "lucide-react";

// ——— Sección Usuarios ———
function SeccionUsuarios() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [cargando, setCargando] = useState(true);
    const [editId, setEditId] = useState<string | null>(null);
    const [modoNuevo, setModoNuevo] = useState(false);
    const [form, setForm] = useState({ usuario: '', password: '', pass2: '', nombre: '', activo: true });
    const [verPass, setVerPass] = useState(false);
    const [msg, setMsg] = useState<{ tipo: 'ok' | 'err'; texto: string } | null>(null);

    const cargar = async () => {
        setCargando(true);
        setUsuarios(await usuariosStore.getAll());
        setCargando(false);
    };

    useEffect(() => { cargar(); }, []);

    const mostrarMsg = (tipo: 'ok' | 'err', texto: string) => {
        setMsg({ tipo, texto });
        setTimeout(() => setMsg(null), 3000);
    };

    const abrirEdicion = (u: Usuario) => {
        setEditId(u.id!);
        setForm({ usuario: u.usuario, password: '', pass2: '', nombre: u.nombre, activo: u.activo });
        setModoNuevo(false);
        setVerPass(false);
    };

    const abrirNuevo = () => {
        setEditId(null);
        setModoNuevo(true);
        setForm({ usuario: '', password: '', pass2: '', nombre: '', activo: true });
        setVerPass(false);
    };

    const cancelar = () => { setEditId(null); setModoNuevo(false); };

    const guardarEdicion = async () => {
        if (!form.usuario.trim()) return mostrarMsg('err', 'El nombre de usuario es obligatorio.');
        if (form.password && form.password !== form.pass2) return mostrarMsg('err', 'Las contraseñas no coinciden.');
        const payload: Partial<Usuario> = { usuario: form.usuario, nombre: form.nombre, activo: form.activo };
        if (form.password) payload.password = form.password;
        const ok = await usuariosStore.update(editId!, payload);
        if (ok) { mostrarMsg('ok', 'Usuario actualizado.'); cancelar(); cargar(); }
        else mostrarMsg('err', 'Error al guardar. Inténtalo de nuevo.');
    };

    const guardarNuevo = async () => {
        if (!form.usuario.trim()) return mostrarMsg('err', 'El nombre de usuario es obligatorio.');
        if (!form.password) return mostrarMsg('err', 'La contraseña es obligatoria.');
        if (form.password !== form.pass2) return mostrarMsg('err', 'Las contraseñas no coinciden.');
        const u = await usuariosStore.create({ usuario: form.usuario, password: form.password, nombre: form.nombre, activo: form.activo });
        if (u) { mostrarMsg('ok', 'Usuario creado.'); cancelar(); cargar(); }
        else mostrarMsg('err', 'Error al crear. ¿Ya existe ese usuario?');
    };

    const eliminar = async (u: Usuario) => {
        if (usuarios.length <= 1) return mostrarMsg('err', 'Debe haber al menos un usuario.');
        if (!confirm(`¿Eliminar el usuario "${u.usuario}"?`)) return;
        await usuariosStore.remove(u.id!);
        cargar();
    };

    return (
        <div className="premium-card p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <KeyRound size={20} className="text-violet-500" />
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Acceso y Usuarios</h3>
                </div>
                {!modoNuevo && !editId && (
                    <button onClick={abrirNuevo} className="flex items-center gap-2 px-4 py-2 bg-violet-50 text-violet-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-violet-100 transition-all">
                        <UserPlus size={14} /> Nuevo Usuario
                    </button>
                )}
            </div>

            {msg && (
                <div className={`px-4 py-3 rounded-xl text-[11px] font-bold uppercase tracking-wide ${msg.tipo === 'ok' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                    {msg.texto}
                </div>
            )}

            {cargando ? (
                <div className="flex justify-center py-6"><div className="animate-spin w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full" /></div>
            ) : (
                <div className="space-y-3">
                    {usuarios.map(u => (
                        <div key={u.id} className="border border-slate-100 rounded-2xl overflow-hidden">
                            {/* Fila normal */}
                            {editId !== u.id && (
                                <div className="flex items-center justify-between px-5 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 font-black text-sm uppercase">
                                            {(u.nombre || u.usuario).charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-black text-slate-800 text-sm">{u.nombre || u.usuario}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">@{u.usuario}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${u.activo ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                            {u.activo ? 'Activo' : 'Inactivo'}
                                        </span>
                                        <button onClick={() => abrirEdicion(u)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                                            <Pencil size={14} />
                                        </button>
                                        <button onClick={() => eliminar(u)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Formulario edición */}
                            {editId === u.id && (
                                <div className="p-5 bg-slate-50/50 space-y-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Editando usuario</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Nombre</label>
                                            <input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} className="premium-input" placeholder="Nombre completo" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Usuario (login)</label>
                                            <input value={form.usuario} onChange={e => setForm(f => ({ ...f, usuario: e.target.value }))} className="premium-input" placeholder="carlos" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Nueva Contraseña <span className="text-slate-300">(dejar vacío para no cambiar)</span></label>
                                            <div className="relative">
                                                <input type={verPass ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className="premium-input pr-12" placeholder="••••••" />
                                                <button type="button" onClick={() => setVerPass(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                                    {verPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Repetir Contraseña</label>
                                            <input type={verPass ? 'text' : 'password'} value={form.pass2} onChange={e => setForm(f => ({ ...f, pass2: e.target.value }))} className="premium-input" placeholder="••••••" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={form.activo} onChange={e => setForm(f => ({ ...f, activo: e.target.checked }))} className="w-4 h-4 accent-violet-600" />
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Usuario activo</span>
                                        </label>
                                    </div>
                                    <div className="flex gap-3 pt-1">
                                        <button onClick={guardarEdicion} className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-violet-700 transition-all">
                                            <Check size={14} /> Guardar
                                        </button>
                                        <button onClick={cancelar} className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                                            <X size={14} /> Cancelar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Formulario nuevo usuario */}
                    {modoNuevo && (
                        <div className="border border-violet-100 rounded-2xl p-5 bg-violet-50/30 space-y-4">
                            <p className="text-[10px] font-black text-violet-500 uppercase tracking-widest mb-3">Nuevo usuario</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Nombre</label>
                                    <input value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} className="premium-input" placeholder="Nombre completo" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Usuario (login) *</label>
                                    <input value={form.usuario} onChange={e => setForm(f => ({ ...f, usuario: e.target.value }))} className="premium-input" placeholder="carlos" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Contraseña *</label>
                                    <div className="relative">
                                        <input type={verPass ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} className="premium-input pr-12" placeholder="••••••" />
                                        <button type="button" onClick={() => setVerPass(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                            {verPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1.5 block">Repetir Contraseña *</label>
                                    <input type={verPass ? 'text' : 'password'} value={form.pass2} onChange={e => setForm(f => ({ ...f, pass2: e.target.value }))} className="premium-input" placeholder="••••••" />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-1">
                                <button onClick={guardarNuevo} className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-violet-700 transition-all">
                                    <UserPlus size={14} /> Crear Usuario
                                </button>
                                <button onClick={cancelar} className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                                    <X size={14} /> Cancelar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ——— Página principal ———
export default function MiEmpresaPage() {
    const [empresa, setEmpresa] = useState<Empresa | null>(null);
    const [cargando, setCargando] = useState(true);
    const [guardado, setGuardado] = useState(false);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    useEffect(() => {
        (async () => { setCargando(true); const e = await empresaStore.get(); setEmpresa(e); if (e?.logo_url) setLogoPreview(e.logo_url); setCargando(false); })();
    }, []);

    const update = (field: keyof Empresa, value: string) => {
        if (!empresa) return;
        setEmpresa({ ...empresa, [field]: value });
    };

    const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            setLogoPreview(base64);
            if (empresa) setEmpresa({ ...empresa, logo_url: base64 });
        };
        reader.readAsDataURL(file);
    };

    const guardar = async () => {
        if (!empresa) return;
        const { id, ...rest } = empresa;
        await empresaStore.update(rest);
        setGuardado(true);
        setTimeout(() => setGuardado(false), 2000);
    };

    if (cargando) return <div className="flex items-center justify-center h-96"><div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>;
    if (!empresa) return <div className="premium-card p-20 text-center"><p className="text-xl font-black text-slate-300 uppercase">Ejecuta supabase_schema_v2.sql primero</p></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-10 page-transition">
            <header>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">Mi Empresa</h1>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest italic">Datos Fiscales, Logo e Información de Facturación</p>
            </header>

            {/* Logo */}
            <div className="premium-card p-8 flex flex-col md:flex-row items-center gap-8">
                <div className="w-32 h-32 rounded-[32px] bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden group relative">
                    {logoPreview ? (
                        <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-2" />
                    ) : (
                        <Building2 size={48} className="text-slate-200" />
                    )}
                </div>
                <div className="flex-1 space-y-3">
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Logo de la Empresa</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Se mostrará en presupuestos, facturas y recibos</p>
                    <label className="inline-flex items-center gap-2 px-5 py-3 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-blue-100 transition-all">
                        <Upload size={16} /> Subir Logo
                        <input type="file" accept="image/*" className="hidden" onChange={handleLogo} />
                    </label>
                </div>
            </div>

            {/* Datos Fiscales */}
            <div className="premium-card p-8 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <Building2 size={20} className="text-blue-500" />
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Datos Fiscales</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Nombre Comercial *</label>
                        <input value={empresa.nombre_comercial} onChange={e => update('nombre_comercial', e.target.value)} className="premium-input" />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Razón Social</label>
                        <input value={empresa.razon_social} onChange={e => update('razon_social', e.target.value)} className="premium-input" placeholder="Ej: Carlos Pérez García" />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">NIF / CIF</label>
                        <input value={empresa.nif} onChange={e => update('nif', e.target.value)} className="premium-input" placeholder="12345678A" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Dirección</label>
                        <input value={empresa.direccion} onChange={e => update('direccion', e.target.value)} className="premium-input" placeholder="Calle Mayor, 10" />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Código Postal</label>
                        <input value={empresa.cp} onChange={e => update('cp', e.target.value)} className="premium-input" />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Población</label>
                        <input value={empresa.poblacion} onChange={e => update('poblacion', e.target.value)} className="premium-input" />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Provincia</label>
                        <input value={empresa.provincia} onChange={e => update('provincia', e.target.value)} className="premium-input" />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Teléfono</label>
                        <input value={empresa.telefono} onChange={e => update('telefono', e.target.value)} className="premium-input" />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Email</label>
                        <input value={empresa.email} onChange={e => update('email', e.target.value)} className="premium-input" />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Web</label>
                        <input value={empresa.web} onChange={e => update('web', e.target.value)} className="premium-input" placeholder="www.urbanoreformas.es" />
                    </div>
                </div>
            </div>

            {/* Datos Bancarios */}
            <div className="premium-card p-8 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <CreditCard size={20} className="text-emerald-500" />
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Datos Bancarios</h3>
                </div>
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">IBAN</label>
                    <input value={empresa.iban} onChange={e => update('iban', e.target.value)} className="premium-input font-mono" placeholder="ES12 3456 7890 1234 5678 9012" />
                </div>
            </div>

            {/* Configuración de Documentos */}
            <div className="premium-card p-8 space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <FileText size={20} className="text-purple-500" />
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Documentos</h3>
                </div>
                <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Condiciones de Presupuesto (pie de documento)</label>
                    <textarea value={empresa.condiciones_presupuesto} onChange={e => update('condiciones_presupuesto', e.target.value)} rows={3} className="premium-input resize-none" />
                </div>
            </div>

            {/* Acceso y Usuarios */}
            <SeccionUsuarios />

            {/* Botón Guardar empresa */}
            <div className="flex justify-end">
                <button onClick={guardar} className={`px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3 shadow-xl transition-all active:scale-95 border-none ${guardado ? 'bg-emerald-500 text-white shadow-emerald-100' : 'bg-blue-600 text-white shadow-blue-100 hover:bg-blue-700'}`}>
                    {guardado ? <><CheckCircle2 size={18} /> Guardado</> : <><Save size={18} /> Guardar Cambios</>}
                </button>
            </div>
        </div>
    );
}
