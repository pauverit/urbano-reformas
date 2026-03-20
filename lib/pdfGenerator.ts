interface PresupuestoData {
    cliente: string;
    items: any[];
    total: number;
    firma?: string;
}

export const generarPDFPresupuesto = async (data: PresupuestoData) => {
    const { jsPDF } = await import("jspdf");
    await import("jspdf-autotable");
    const doc = new jsPDF() as any;

    // Header
    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42); // Slate-900
    doc.text("URBANO REFORMAS", 20, 25);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Presupuesto de Obra / Reforma", 20, 32);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 150, 25);

    // Cliente
    doc.setFontSize(12);
    doc.setTextColor(50);
    doc.text(`Cliente: ${data.cliente || "Cliente Final"}`, 20, 50);

    // Tabla
    const tableData = data.items.map(it => [
        it.item,
        it.quantity.toString(),
        it.unit,
        `${it.price.toFixed(2)} €`,
        `${(it.quantity * it.price).toFixed(2)} €`
    ]);

    doc.autoTable({
        startY: 60,
        head: [["Descripción", "Cant.", "Unidad", "Precio", "Base"]],
        body: tableData,
        theme: "striped",
        headStyles: { fillColor: [59, 130, 246] }, // Blue-500
        styles: { font: "helvetica", fontSize: 10 },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;

    // Total
    doc.setFontSize(14);
    doc.text(`Total Presupuesto: ${data.total.toFixed(2)} €`, 140, finalY + 10);

    // Firma
    if (data.firma) {
        doc.text("Firma del Cliente:", 20, finalY + 30);
        doc.addImage(data.firma, "PNG", 20, finalY + 35, 50, 25);
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Gracias por su confianza. Este documento es una estimación generada por Urbano Reformas AI.", 20, 280);

    return doc;
};

export const generarPDFRecibo = async (data: { cliente: string; cantidad: number; concepto: string; firma: string }) => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF() as any;

    doc.setFontSize(22);
    doc.text("RECIBO DE ENTREGA", 20, 25);

    doc.setFontSize(12);
    doc.text(`Recibimos de: ${data.cliente}`, 20, 50);
    doc.text(`La cantidad de: ${data.cantidad.toFixed(2)} €`, 20, 60);
    doc.text(`En concepto de: ${data.concepto}`, 20, 70);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 80);

    doc.text("Firma del Cliente:", 20, 110);
    doc.addImage(data.firma, "PNG", 20, 115, 60, 30);

    doc.setFontSize(8);
    doc.text("URBANO REFORMAS - Documento justificante de pago a cuenta.", 20, 280);

    return doc;
};
