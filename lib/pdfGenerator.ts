/**
 * Utilidad de PDF optimizada para Next.js
 * Evita errores de fflate/node.cjs al cargar las librerías solo en el navegador.
 */

export const generarPDFPresupuesto = async (data: any) => {
    if (typeof window === "undefined") return;

    // Importación dinámica total para evitar que el bundle de SSR intente resolver dependencias de Node
    const { jsPDF } = await import("jspdf");
    await import("jspdf-autotable");

    const doc = new jsPDF() as any;

    doc.setFontSize(22);
    doc.setTextColor(15, 23, 42);
    doc.text("URBANO REFORMAS", 20, 25);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Presupuesto de Obra / Reforma", 20, 32);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 150, 25);

    doc.setFontSize(12);
    doc.setTextColor(50);
    doc.text(`Cliente: ${data.cliente || "Cliente Final"}`, 20, 50);

    const tableData = data.items.map((it: any) => [
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
        headStyles: { fillColor: [59, 130, 246] },
        styles: { font: "helvetica", fontSize: 10 },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text(`Total Presupuesto: ${data.total.toFixed(2)} €`, 140, finalY + 10);

    if (data.firma) {
        doc.text("Firma del Cliente:", 20, finalY + 30);
        doc.addImage(data.firma, "PNG", 20, finalY + 35, 50, 25);
    }

    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Gracias por su confianza. Este documento es una estimación generada por Urbano Reformas AI.", 20, 280);

    return doc;
};

export const generarPDFRecibo = async (data: any) => {
    if (typeof window === "undefined") return;

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
