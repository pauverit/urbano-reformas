import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export async function generarPDFPresupuesto(data: {
    cliente: string;
    items: any[];
    total: number;
    firma?: string;
}) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Encabezado Premium
    doc.setFillColor(15, 23, 42); // slate-950
    doc.rect(0, 0, pageWidth, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("URBANO REFORMAS", 20, 25);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("GESTIÓN DE PRESUPUESTOS V2.0", 20, 32);

    // Datos Cliente
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("CLIENTE:", 20, 55);
    doc.setFont("helvetica", "normal");
    doc.text(data.cliente, 45, 55);

    doc.setFont("helvetica", "bold");
    doc.text("FECHA:", pageWidth - 60, 55);
    doc.setFont("helvetica", "normal");
    doc.text(new Date().toLocaleDateString("es-ES"), pageWidth - 40, 55);

    // Tabla
    autoTable(doc, {
        startY: 65,
        head: [["DESCRIPCIÓN", "CANT.", "UD.", "PRECIO", "TOTAL"]],
        body: data.items.map((it) => [
            it.description.toUpperCase(),
            it.quantity,
            it.unit,
            `${it.price.toFixed(2)} €`,
            `${(it.quantity * it.price).toFixed(2)} €`
        ]),
        theme: "striped",
        headStyles: { fillColor: [37, 99, 235], fontSize: 9, fontStyle: "bold" },
        styles: { fontSize: 8, cellPadding: 5 },
        columnStyles: {
            0: { cellWidth: 80 },
            4: { halign: "right", fontStyle: "bold" }
        }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 15;

    // Total
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL PRESUPUESTO (BASE IMPONIBLE): ${data.total.toLocaleString("es-ES")} €`, pageWidth - 20, finalY, { align: "right" });

    // Firma
    if (data.firma) {
        doc.setFontSize(9);
        doc.text("FIRMA DE CONFORMIDAD DEL CLIENTE:", 20, finalY + 20);
        doc.addImage(data.firma, "PNG", 20, finalY + 25, 50, 25);
    }

    // Pie de página
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Este documento es un presupuesto informativo. Sujeto a revisión tras visita técnica.", pageWidth / 2, 285, { align: "center" });

    return doc;
}

export async function generarPDFRecibo(data: {
    cliente: string;
    concepto: string;
    importe: number;
    entrega: number;
    restante: number;
    firma?: string;
}) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFillColor(37, 99, 235); // blue-600
    doc.rect(0, 0, pageWidth, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("RECIBO DE ENTREGA", 20, 26);

    // Content
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.text(`He recibido de: ${data.cliente}`, 20, 60);
    doc.text(`En concepto de: ${data.concepto}`, 20, 70);

    doc.rect(20, 85, pageWidth - 40, 40);
    doc.setFontSize(14);
    doc.text(`IMPORTE TOTAL: ${data.importe} €`, 30, 95);
    doc.text(`ENTREGA A CUENTA: ${data.entrega} €`, 30, 105);
    doc.setTextColor(37, 99, 235);
    doc.text(`PENDIENTE DE PAGO: ${data.restante} €`, 30, 115);

    if (data.firma) {
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(10);
        doc.text("FIRMA DEL CLIENTE / RECEPTOR:", 20, 140);
        doc.addImage(data.firma, "PNG", 20, 145, 60, 30);
    }

    doc.setFontSize(8);
    doc.text("Urbano Reformas - Documento Justificante de Pago", pageWidth / 2, 280, { align: "center" });

    return doc;
}
