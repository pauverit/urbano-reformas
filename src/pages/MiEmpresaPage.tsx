import { useState, useEffect } from "react";
import { empresaStore, type Empresa } from "../lib/store";
import { Building2, Save, CheckCircle2, Upload, CreditCard, FileText, Settings } from "lucide-react";

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

            {/* Botón Guardar */}
            <div className="flex justify-end">
                <button onClick={guardar} className={`px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3 shadow-xl transition-all active:scale-95 border-none ${guardado ? 'bg-emerald-500 text-white shadow-emerald-100' : 'bg-blue-600 text-white shadow-blue-100 hover:bg-blue-700'}`}>
                    {guardado ? <><CheckCircle2 size={18} /> Guardado</> : <><Save size={18} /> Guardar Cambios</>}
                </button>
            </div>
        </div>
    );
}
