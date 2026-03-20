"use client";

import { useState } from "react";
import { Plus, Trash2, Save, Euro } from "lucide-react";

interface Item {
    id: string;
    item: string;
    quantity: number;
    unit: string;
    price: number;
}

interface BudgetTableProps {
    initialItems: any[];
}

export default function BudgetTable({ initialItems }: BudgetTableProps) {
    const [filas, setFilas] = useState<Item[]>(
        initialItems.map((it, idx) => ({
            ...it,
            id: Math.random().toString(36).substr(2, 9),
            price: it.price || 0,
        }))
    );

    const añadirFila = () => {
        setFilas([...filas, { id: Math.random().toString(36).substr(2, 9), item: "Nueva partida", quantity: 1, unit: "ud", price: 0 }]);
    };

    const eliminarFila = (id: string) => {
        setFilas(filas.filter(it => it.id !== id));
    };

    const actualizarFila = (id: string, field: keyof Item, value: any) => {
        setFilas(filas.map(it => it.id === id ? { ...it, [field]: value } : it));
    };

    const totalBase = filas.reduce((sum, it) => sum + (it.quantity * it.price), 0);

    return (
        <div className="space-y-10">
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Descripción de Tarea / Material</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cant.</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Unidad</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Precio (€)</th>
                            <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Base</th>
                            <th className="px-10 py-6"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filas.map((it) => (
                            <tr key={it.id} className="hover:bg-slate-50/30 transition-colors group">
                                <td className="px-10 py-8">
                                    <input
                                        type="text"
                                        value={it.item}
                                        onChange={(e) => actualizarFila(it.id, "item", e.target.value)}
                                        className="w-full bg-transparent border-none focus:ring-0 font-bold text-slate-800 uppercase text-sm tracking-tight placeholder:text-slate-300"
                                        placeholder="Escribe el concepto..."
                                    />
                                </td>
                                <td className="px-10 py-8">
                                    <input
                                        type="number"
                                        value={it.quantity}
                                        onChange={(e) => actualizarFila(it.id, "quantity", parseFloat(e.target.value))}
                                        className="w-20 bg-transparent border-none focus:ring-0 text-slate-500 font-bold"
                                    />
                                </td>
                                <td className="px-10 py-8 text-slate-400 font-black uppercase text-[10px] tracking-widest">{it.unit}</td>
                                <td className="px-10 py-8 text-right">
                                    <input
                                        type="number"
                                        value={it.price}
                                        onChange={(e) => actualizarFila(it.id, "price", parseFloat(e.target.value))}
                                        className="w-24 bg-transparent border-none focus:ring-0 text-slate-500 font-bold text-right"
                                    />
                                </td>
                                <td className="px-10 py-8 font-black text-slate-900 text-right text-lg">
                                    {(it.quantity * it.price).toFixed(2)} €
                                </td>
                                <td className="px-10 py-8 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => eliminarFila(it.id)} className="text-slate-300 hover:text-red-500 transition-colors p-2 bg-slate-50 rounded-xl">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="p-8 bg-slate-50/50 flex items-center justify-between border-t border-slate-100">
                    <button onClick={añadirFila} className="text-blue-600 hover:text-blue-800 font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 transition-all active:scale-95">
                        <Plus size={16} /> Añadir Partida
                    </button>
                    <div className="text-right flex flex-col">
                        <span className="text-slate-400 text-[10px] uppercase font-black tracking-[0.3em] mb-1">Presupuesto Estimado</span>
                        <span className="text-4xl font-black text-slate-900 tracking-tighter">{totalBase.toFixed(2)} €</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-6">
                <button className="px-8 py-4 rounded-2xl border border-slate-200 font-black uppercase text-xs tracking-widest hover:bg-white hover:border-slate-300 transition-all text-slate-500 active:scale-95">
                    Guardar Borrador
                </button>
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 transition-all shadow-xl shadow-emerald-100 active:scale-95 uppercase tracking-widest text-xs">
                    <Save size={20} />
                    <span>Confirmar y Enviar</span>
                </button>
            </div>
        </div>
    );
}
