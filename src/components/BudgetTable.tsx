import { useState } from "react";
import { Plus, Trash2, Edit3, Save } from "lucide-react";

export default function BudgetTable({ initialItems }: { initialItems: any[] }) {
    const [items, setItems] = useState(initialItems);

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { description: "Nuevo concepto", quantity: 1, unit: "ut", price: 0 }]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    return (
        <div className="premium-card overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3 uppercase">
                    <Edit3 size={20} className="text-blue-500" /> Detalle de Obra / Reforma
                </h3>
                <button onClick={addItem} className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100 hover:scale-105 active:scale-95 transition-all">
                    <Plus size={20} />
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/80 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
                            <th className="px-8 py-5">Descripción del Trabajo</th>
                            <th className="px-6 py-5 text-center">Cant.</th>
                            <th className="px-6 py-5 text-center">Ud.</th>
                            <th className="px-6 py-5 text-right">Precio Ud.</th>
                            <th className="px-6 py-5 text-right">Total</th>
                            <th className="px-8 py-5 text-right">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-bold text-sm text-slate-700">
                        {items.map((item, index) => (
                            <tr key={index} className="hover:bg-blue-50/30 transition-colors group">
                                <td className="px-8 py-5 w-1/2">
                                    <input
                                        type="text"
                                        value={item.description}
                                        onChange={(e) => updateItem(index, "description", e.target.value)}
                                        className="bg-transparent border-none p-0 focus:ring-0 w-full text-slate-900 font-bold uppercase placeholder:text-slate-200"
                                    />
                                </td>
                                <td className="px-6 py-5">
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => updateItem(index, "quantity", parseFloat(e.target.value))}
                                        className="bg-transparent border-none p-0 focus:ring-0 w-16 text-center mx-auto block"
                                    />
                                </td>
                                <td className="px-6 py-5">
                                    <input
                                        type="text"
                                        value={item.unit}
                                        onChange={(e) => updateItem(index, "unit", e.target.value)}
                                        className="bg-transparent border-none p-0 focus:ring-0 w-12 text-center mx-auto block uppercase text-slate-400"
                                    />
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <input
                                        type="number"
                                        value={item.price}
                                        onChange={(e) => updateItem(index, "price", parseFloat(e.target.value))}
                                        className="bg-transparent border-none p-0 focus:ring-0 w-24 text-right ml-auto block"
                                    />
                                </td>
                                <td className="px-6 py-5 text-right font-black text-slate-900">
                                    {(item.quantity * item.price).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <button onClick={() => removeItem(index)} className="p-2 text-slate-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="bg-slate-900 text-white">
                            <td colSpan={4} className="px-8 py-6 font-black uppercase tracking-[0.2em] text-[10px]">Total Presupuestado (Base Imponible)</td>
                            <td className="px-6 py-6 text-right font-black text-xl">
                                {items.reduce((sum, it) => sum + (it.quantity * it.price), 0).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                            </td>
                            <td className="px-8 py-6"></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}
