import { useState, useEffect } from "react";
import { facturasStore, clientesStore, type Factura, type Cliente } from "../lib/store";
import { FileText, Download } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const ESTADO_COLORES: Record<string, { bg: string; text: string }> = {
    pendiente: { bg: "bg-amber-50", text: "text-amber-600" },
    parcial: { bg: "bg-blue-50", text: "text-blue-600" },
    cobrada: { bg: "bg-emerald-50", text: "text-emerald-600" },
};

export default function FacturasPage() {
    const [facturas, setFacturas] = useState<Factura[]>([]);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [cargando, setCargando] = useState(true);

    const cargar = async () => { setCargando(true); setFacturas(await facturasStore.getAll()); setClientes(await clientesStore.getAll()); setCargando(false); };
    useEffect(() => { cargar(); }, []);

    const getCliente = (id: string) => clientes.find(c => c.id === id);

    const descargarPDF = (f: Factura) => {
        const cliente = getCliente(f.cliente_id);
        const doc = new jsPDF();
        const pw = doc.internal.pageSize.getWidth();
        doc.setFillColor(15, 23, 42); doc.rect(0, 0, pw, 45, "F");
        doc.setTextColor(255, 255, 255); doc.setFontSize(24); doc.setFont("helvetica", "bold");
        doc.text("FACTURA", 20, 28); doc.setFontSize(12); doc.text(f.numero || '', pw - 20, 28, { align: "right" });
        doc.setFontSize(9); doc.text(`Fecha: ${f.fecha}`, pw - 20, 38, { align: "right" });
        doc.setTextColor(15, 23, 42); doc.setFontSize(10); let y = 58;
        doc.setFont("helvetica", "bold"); doc.text("DATOS DEL CLIENTE:", 20, y); doc.setFont("helvetica", "normal");
        if (cliente) { doc.text(cliente.nombre, 20, y + 7); doc.text(`NIF: ${cliente.nif}`, 20, y + 14); doc.text(`${cliente.direccion}, ${cliente.cp} ${cliente.poblacion}`, 20, y + 21); }
        autoTable(doc, { startY: y + 32, head: [["DESCRIPCIÓN", "CANT.", "UD.", "PRECIO", "TOTAL"]], body: (f.lineas || []).map(l => [l.descripcion.toUpperCase(), String(l.cantidad), l.unidad, `${Number(l.precio).toFixed(2)} €`, `${(l.cantidad * Number(l.precio)).toFixed(2)} €`]), theme: "striped", headStyles: { fillColor: [37, 99, 235], fontSize: 9 }, styles: { fontSize: 8, cellPadding: 5 }, columnStyles: { 0: { cellWidth: 80 }, 4: { halign: "right", fontStyle: "bold" } } });
        const fy = (doc as any).lastAutoTable.finalY + 10;
        doc.setFontSize(10); doc.text(`Base Imponible: ${Number(f.subtotal).toFixed(2)} €`, pw - 20, fy, { align: "right" }); doc.text(`IVA (21%): ${Number(f.iva).toFixed(2)} €`, pw - 20, fy + 7, { align: "right" });
        doc.setFontSize(14); doc.setFont("helvetica", "bold"); doc.text(`TOTAL: ${Number(f.total).toFixed(2)} €`, pw - 20, fy + 18, { align: "right" });
        doc.save(`factura-${f.numero}.pdf`);
    };

    return (
        <div className="space-y-10 page-transition">
            <header><h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2 uppercase">Facturas</h1><p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest italic">Generadas desde Presupuestos Aceptados</p></header>
            {cargando ? (
                <div className="premium-card p-20 text-center"><div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div></div>
            ) : facturas.length === 0 ? (
                <div className="premium-card p-20 text-center space-y-4"><FileText size={48} className="mx-auto text-slate-200" /><p className="text-xl font-black text-slate-300 uppercase">Sin facturas</p><p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Acepta un presupuesto y pásalo a factura</p></div>
            ) : (
                <div className="space-y-4">
                    {facturas.map(f => {
                        const cliente = getCliente(f.cliente_id);
                        const color = ESTADO_COLORES[f.estado];
                        return (
                            <div key={f.id} className="premium-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group border-l-4 border-l-purple-500">
                                <div className="flex items-center gap-6">
                                    <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center"><FileText size={24} /></div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1"><span className="text-[10px] font-black text-purple-500 bg-purple-50 px-3 py-1 rounded-full">{f.numero}</span><span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${color.bg} ${color.text}`}>{f.estado}</span></div>
                                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">{cliente?.nombre || "—"}</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{f.fecha} • {(f.lineas || []).length} líneas</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right"><p className="text-2xl font-black text-slate-900 tracking-tighter">{Number(f.total).toFixed(2)} €</p></div>
                                    <button onClick={() => descargarPDF(f)} className="p-4 bg-slate-50 rounded-2xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"><Download size={22} /></button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
