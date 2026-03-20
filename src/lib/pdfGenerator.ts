import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { Empresa, Cliente } from "./store";

export async function generarPDFPresupuesto(data: {
    empresa?: Empresa;
    cliente?: Cliente;
    items: any[];
    total: number;
    firma?: string;
}) {
    const doc = new jsPDF();
    const pw = doc.internal.pageSize.getWidth();
    const emp = data.empresa;

    // Header con logo
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pw, 50, "F");

    let logoX = 20;
    if (emp?.logo_url && emp.logo_url.startsWith('data:image')) {
        try { doc.addImage(emp.logo_url, "PNG", 15, 8, 34, 34); logoX = 55; } catch { }
    }
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(emp?.nombre_comercial || "URBANO REFORMAS", logoX, 22);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    if (emp?.nif) doc.text(`NIF: ${emp.nif}`, logoX, 30);
    if (emp?.direccion) doc.text(`${emp.direccion}, ${emp.cp} ${emp.poblacion}`, logoX, 36);
    if (emp?.telefono) doc.text(`Tel: ${emp.telefono} | ${emp.email || ''}`, logoX, 42);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("PRESUPUESTO", pw - 20, 22, { align: "right" });
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Fecha: ${new Date().toLocaleDateString("es-ES")}`, pw - 20, 30, { align: "right" });

    // Datos Cliente
    let y = 62;
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("DATOS DEL CLIENTE:", 20, y);
    doc.setFont("helvetica", "normal");
    const cl = data.cliente;
    if (cl) {
        doc.text(cl.nombre, 20, y + 7);
        if (cl.nif) doc.text(`NIF: ${cl.nif}`, 20, y + 13);
        if (cl.direccion) doc.text(`${cl.direccion}, ${cl.cp} ${cl.poblacion}`, 20, y + 19);
        if (cl.telefono) doc.text(`Tel: ${cl.telefono}${cl.email ? ' | ' + cl.email : ''}`, 20, y + 25);
    } else {
        doc.text("Sin asignar", 20, y + 7);
    }

    // Tabla
    autoTable(doc, {
        startY: y + 34,
        head: [["DESCRIPCIÓN", "CANT.", "UD.", "PRECIO", "TOTAL"]],
        body: data.items.map(it => [
            (it.description || '').toUpperCase(),
            String(it.quantity),
            it.unit,
            `${Number(it.price).toFixed(2)} €`,
            `${(it.quantity * it.price).toFixed(2)} €`
        ]),
        theme: "striped",
        headStyles: { fillColor: [37, 99, 235], fontSize: 9, fontStyle: "bold" },
        styles: { fontSize: 8, cellPadding: 5 },
        columnStyles: { 0: { cellWidth: 80 }, 4: { halign: "right", fontStyle: "bold" } }
    });

    const fy = (doc as any).lastAutoTable.finalY + 12;
    const iva = data.total * 0.21;
    const totalConIva = data.total + iva;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Base Imponible: ${data.total.toFixed(2)} €`, pw - 20, fy, { align: "right" });
    doc.text(`IVA (21%): ${iva.toFixed(2)} €`, pw - 20, fy + 7, { align: "right" });
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL: ${totalConIva.toFixed(2)} €`, pw - 20, fy + 18, { align: "right" });

    // Firma
    if (data.firma) {
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text("FIRMA DE CONFORMIDAD DEL CLIENTE:", 20, fy + 30);
        try { doc.addImage(data.firma, "PNG", 20, fy + 35, 50, 25); } catch { }
    }

    // Condiciones
    const condY = data.firma ? fy + 65 : fy + 30;
    if (emp?.condiciones_presupuesto) {
        doc.setFontSize(7);
        doc.setTextColor(120, 120, 120);
        const lines = doc.splitTextToSize(emp.condiciones_presupuesto, pw - 40);
        doc.text(lines, 20, condY);
    }

    // Pie
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(`${emp?.nombre_comercial || 'Urbano Reformas'} — ${emp?.nif || ''} — ${emp?.telefono || ''}`, pw / 2, 289, { align: "center" });

    return doc;
}

export async function generarPDFRecibo(data: {
    empresa?: Empresa;
    cliente: string;
    concepto: string;
    importe: number;
    entrega: number;
    restante: number;
    firma?: string;
}) {
    const doc = new jsPDF();
    const pw = doc.internal.pageSize.getWidth();
    const emp = data.empresa;

    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, pw, 45, "F");
    let logoX = 20;
    if (emp?.logo_url && emp.logo_url.startsWith('data:image')) {
        try { doc.addImage(emp.logo_url, "PNG", 15, 7, 30, 30); logoX = 50; } catch { }
    }
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("RECIBO DE ENTREGA", logoX, 26);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    if (emp?.nombre_comercial) doc.text(`${emp.nombre_comercial} — NIF: ${emp.nif || ''}`, logoX, 36);

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.text(`He recibido de: ${data.cliente}`, 20, 60);
    doc.text(`En concepto de: ${data.concepto}`, 20, 70);

    doc.setDrawColor(200, 200, 200);
    doc.rect(20, 85, pw - 40, 45, "S");
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(`IMPORTE TOTAL: ${data.importe.toFixed(2)} €`, 30, 98);
    doc.text(`ENTREGA A CUENTA: ${data.entrega.toFixed(2)} €`, 30, 110);
    doc.setTextColor(37, 99, 235);
    doc.text(`PENDIENTE DE PAGO: ${data.restante.toFixed(2)} €`, 30, 122);

    if (data.firma) {
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(10);
        doc.text("FIRMA DEL CLIENTE / RECEPTOR:", 20, 145);
        try { doc.addImage(data.firma, "PNG", 20, 150, 60, 30); } catch { }
    }

    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(`${emp?.nombre_comercial || 'Urbano Reformas'} — Documento Justificante de Pago`, pw / 2, 285, { align: "center" });

    return doc;
}
