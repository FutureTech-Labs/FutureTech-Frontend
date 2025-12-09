import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrencyLKR } from "@/lib/utils";

interface PDFParams {
    invoice: IReturn;
}

export function generateReturnPDF({ invoice }: PDFParams) {
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;

    const primaryColor = [40, 40, 40] as [number, number, number];
    const secondaryColor = [100, 100, 100] as [number, number, number];

    const hasRefund = invoice.items?.some((i) => i.returnType === "refund");

    // TITLE
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(...primaryColor);
    doc.text("RETURN INVOICE", pageWidth - margin, 20, { align: "right" });

    // META DETAILS
    const metaStartY = 32;
    const lh = 6;

    const meta = [
        ["Return No:", invoice.returnInvoiceNumber || "—"],
        ["Return Date:", new Date(invoice.createdAt).toLocaleString()],
        ["Linked Invoice:", invoice.saleInvoice?.invoiceNumber || "—"],
        ["Status:", invoice.status?.replace(/-/g, " ") || "—"],
    ];

    meta.forEach(([label, val], i) => {
        doc.setFontSize(10);
        doc.setTextColor(...secondaryColor);
        doc.text(label, pageWidth - margin - 40, metaStartY + i * lh, { align: "right" });

        doc.setTextColor(0, 0, 0);
        doc.text(String(val), pageWidth - margin, metaStartY + i * lh, { align: "right" });
    });

    // CUSTOMER + PROCESSED BY
    const sectionY = metaStartY + lh * 5;

    doc.setDrawColor(220, 220, 220);
    doc.line(margin, sectionY - 5, pageWidth - margin, sectionY - 5);

    const renderBlock = (title: string, data: any, x: number) => {
        doc.setFontSize(10);
        doc.setTextColor(...secondaryColor);
        doc.text(title.toUpperCase(), x, sectionY);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.text(data.name || "—", x, sectionY + 6);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(...primaryColor);

        doc.text(`Email: ${data.email || "-"}`, x, sectionY + 12);
        doc.text(`Contact: ${data.contact || "-"}`, x, sectionY + 17);
    };

    renderBlock(
        "Customer",
        invoice.customer || {},
        margin
    );

    renderBlock(
        "Processed By",
        { name: invoice.returnedBy?.name, email: invoice.returnedBy?.email },
        margin + 90
    );

    // TABLE
    const tableHead = hasRefund
        ? ["Product", "Warranty", "Qty", "Reason", "Type", "Refund"]
        : ["Product", "Warranty", "Qty", "Reason", "Type"];

    const tableBody = invoice.items.map((it) => {
        const row = [
            it.productName,
            it.warrantyPeriod,
            it.quantity,
            it.reason,
            it.returnType,
        ];

        if (hasRefund) row.push(it.returnType === "refund" ? formatCurrencyLKR(it.refundAmount || 0) : "—");

        return row;
    });

    autoTable(doc, {
        startY: sectionY + 25,
        head: [tableHead],
        body: tableBody,
        theme: "grid",
        styles: { fontSize: 9, cellPadding: 3 },
        headStyles: {
            fillColor: [50, 50, 50],
            textColor: [255, 255, 255],
            fontStyle: "bold",
        },
    });

    let finalY = (doc as any).lastAutoTable.finalY + 12;

    // TOTAL REFUND
    if (hasRefund) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);

        doc.text("Total Refund:", pageWidth - margin - 40, finalY, { align: "right" });

        doc.setTextColor(0, 0, 0);
        doc.text(formatCurrencyLKR(invoice.refundTotal || 0), pageWidth - margin, finalY, { align: "right" });
        finalY += 10;
    }

    // FOOTER
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text("Return processed successfully.", margin, 285);

    doc.save(`${invoice.returnInvoiceNumber || "return_invoice"}.pdf`);
}
