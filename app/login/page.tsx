"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, CheckCircle2, Loader2 } from "lucide-react";

export default function LoginPage() {
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulación de login con los datos proporcionados
        setTimeout(() => {
            if (user.toLowerCase() === "carlos" && pass === "1234") {
                router.push("/panel");
            } else {
                alert("Credenciales incorrectas. (Pista: carlos / 1234)");
                setLoading(false);
            }
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Orbs for Premium Look */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100/30 rounded-full blur-[120px]"></div>

            <div className="w-full max-w-md page-transition">
                <div className="bg-white rounded-[48px] shadow-[0_32px_80px_rgba(0,0,0,0.06)] border border-white/50 p-12 relative z-10">

                    <div className="flex flex-col items-center mb-12">
                        <div className="w-20 h-20 mb-6 drop-shadow-sm">
                            <img src="/logo.png" alt="Logo Urbano Reformas" className="w-full h-full object-contain" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-1">Urbano Reformas</h2>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Portal de Gestión</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">USUARIO</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={user}
                                    onChange={(e) => setUser(e.target.value)}
                                    placeholder="Introduce tu usuario"
                                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-5 font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-300"
                                    required
                                />
                                <User className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">CONTRASEÑA</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={pass}
                                    onChange={(e) => setPass(e.target.value)}
                                    placeholder="••••••"
                                    className="w-full bg-slate-50 border-none rounded-2xl px-6 py-5 font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-300"
                                    required
                                />
                                <Lock className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-950 hover:bg-slate-900 disabled:bg-slate-200 text-white font-black uppercase text-xs tracking-[0.2em] py-6 rounded-[32px] transition-all shadow-xl shadow-slate-200 active:scale-[0.98] flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                "Entrar"
                            )}
                        </button>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Digital Market Granada © 2026</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
