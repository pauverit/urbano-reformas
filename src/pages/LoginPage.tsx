import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import { usuariosStore } from "../lib/store";
import { saveSession } from "../lib/auth";

export default function LoginPage() {
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    const [error, setError] = useState(false);
    const [cargando, setCargando] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user.trim() || !pass.trim()) return;
        setCargando(true);
        setError(false);
        const found = await usuariosStore.login(user.trim(), pass);
        setCargando(false);
        if (found) {
            saveSession({ id: found.id!, usuario: found.usuario, nombre: found.nombre || found.usuario });
            navigate("/panel");
        } else {
            setError(true);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-slate-50 to-indigo-100/40">
            <div className="w-full max-w-md page-transition">
                <div className="flex flex-col items-center mb-12">
                    <div className="w-24 h-24 mb-8">
                        <img src="/logo.png" alt="Urbano Reformas" className="w-full h-full object-contain" />
                    </div>
                    <div className="bg-white px-5 py-2 rounded-full border border-slate-100 shadow-sm flex items-center gap-2 mb-4">
                        <Sparkles size={14} className="text-blue-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">ERP Premium v2.0</span>
                    </div>
                </div>

                <div className="premium-card p-12 bg-white/80 backdrop-blur-xl border-white shadow-2xl">
                    <div className="mb-10 text-center">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">BIENVENIDO</h1>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">Acceso Seguro a Urbano Reformas</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Usuario</label>
                            <div className="relative group">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                                <input
                                    type="text"
                                    placeholder="USUARIO"
                                    className="premium-input pl-14"
                                    value={user}
                                    onChange={(e) => { setUser(e.target.value); setError(false); }}
                                    autoCapitalize="none"
                                    autoCorrect="off"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contraseña</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="premium-input pl-14 tracking-[0.3em]"
                                    value={pass}
                                    onChange={(e) => { setPass(e.target.value); setError(false); }}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 px-4 py-3 bg-red-50 rounded-xl text-red-600">
                                <AlertCircle size={15} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Usuario o contraseña incorrectos</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={cargando}
                            className="premium-button w-full mt-6 py-6 group hover:translate-y-[-2px] hover:shadow-2xl hover:shadow-blue-200 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <span className="flex items-center justify-center gap-3">
                                {cargando ? (
                                    <span className="flex items-center gap-3">
                                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Verificando...
                                    </span>
                                ) : (
                                    <>Iniciar Sesión <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" /></>
                                )}
                            </span>
                        </button>
                    </form>
                </div>

                <p className="mt-8 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                    EXCLUSIVIDAD Y RIGOR EN CADA OBRA
                </p>
            </div>
        </div>
    );
}
