import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrencyLKR } from "@/lib/utils";

type InvoiceItem = IPurchaseInvoiceItem | ISalesInvoiceItem;

interface PDFParams {
    type: "purchase" | "sales";
    invoice: IPurchaseInvoice | ISalesInvoice;
    items: InvoiceItem[];
}

export function generateInvoicePDF({ type, invoice, items }: PDFParams) {
    const doc = new jsPDF();
    const isPurchase = type === "purchase";

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const primaryColor = [40, 40, 40] as [number, number, number];
    const secondaryColor = [100, 100, 100] as [number, number, number];

    // Cast items
    const purchaseItems = items as IPurchaseInvoiceItem[];
    const salesItems = items as ISalesInvoiceItem[];

    // =======================
    // HEADER SECTION
    // =======================

    // 1. Document Title (Top Right)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(...primaryColor);
    doc.text(isPurchase ? "PURCHASE INVOICE" : "SALES INVOICE", pageWidth - margin, 20, { align: "right" });

    // 2. Invoice Meta Data (Top Right, under Title)
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    const metaStartY = 30;
    const lineHeight = 5;

    // Helper to render Label: Value pairs aligned right
    const renderMetaRight = (label: string, value: string, y: number) => {
        doc.setTextColor(...secondaryColor);
        doc.text(label, pageWidth - margin - 35, y, { align: "right" }); // Label
        doc.setTextColor(0, 0, 0);
        doc.text(value, pageWidth - margin, y, { align: "right" }); // Value
    };

    renderMetaRight("Invoice No:", invoice.invoiceNumber, metaStartY);
    renderMetaRight("Date:", new Date(invoice.date).toLocaleDateString(), metaStartY + lineHeight);
    renderMetaRight("Status:", invoice.status, metaStartY + (lineHeight * 2));
    renderMetaRight("Type:", invoice.paymentType, metaStartY + (lineHeight * 3));

    // =======================
    // ADDRESS SECTION
    // =======================

    // Define Parties based on your logic
    const fromParty = isPurchase
        ? (invoice as IPurchaseInvoice).supplier
        : {
            id: "",
            name: "FutureTech Pvt Ltd.",
            contact: "+94 76 853 8824",
            email: "contact@futuretech.com",
        };

    const toParty = isPurchase
        ? {
            id: "",
            name: "FutureTech Pvt Ltd.",
            contact: "+94 76 853 8824",
            email: "contact@futuretech.com",
        }
        : (invoice as ISalesInvoice).customer;

    const addressY = 60;

    // Divider Line
    doc.setDrawColor(220, 220, 220);
    doc.line(margin, addressY - 5, pageWidth - margin, addressY - 5);

    // Helper to render address block
    const renderAddressBlock = (title: string, party: any, x: number, y: number) => {
        doc.setFontSize(9);
        doc.setTextColor(...secondaryColor);
        doc.text(title.toUpperCase(), x, y);

        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "bold");
        doc.text(party.name, x, y + 6);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...primaryColor);
        doc.text(`Tel: ${party.contact ?? "-"}`, x, y + 12);
        doc.text(`Email: ${party.email ?? "-"}`, x, y + 17);
    };

    // Render From (Left) and To (Right-ish)
    renderAddressBlock("From", fromParty, margin, addressY);
    renderAddressBlock("Bill To", toParty, margin + 90, addressY); // Shifted right

    // =======================
    // TABLE SECTION
    // =======================
    const tableBody = isPurchase
        ? purchaseItems.map((item) => [
            item.product?.name ?? "-",
            item.quantity,
            formatCurrencyLKR(item.costPrice),
            formatCurrencyLKR(item.lineTotal),
        ])
        : salesItems.map((item) => [
            item.product?.name ?? "-",
            item.quantity,
            formatCurrencyLKR(item.sellingPrice),
            formatCurrencyLKR(item.lineTotal),
        ]);

    autoTable(doc, {
        startY: addressY + 25,
        head: [
            isPurchase
                ? ["Product Description", "Qty", "Cost Price", "Amount"]
                : ["Product Description", "Qty", "Unit Price", "Amount"],
        ],
        body: tableBody,
        theme: 'grid', // Clean lines
        styles: {
            fontSize: 9,
            textColor: [40, 40, 40],
            cellPadding: 3,
        },
        headStyles: {
            fillColor: [50, 50, 50], // Dark Gray professional header
            textColor: [255, 255, 255],
            fontSize: 9,
            fontStyle: 'bold',
            halign: 'left'
        },
        columnStyles: {
            0: { cellWidth: 'auto' }, // Product Name
            1: { halign: 'center', cellWidth: 20 }, // Qty
            2: { halign: 'right', cellWidth: 35 }, // Price
            3: { halign: 'right', cellWidth: 35 }, // Total
        },
    });

    // =======================
    // TOTALS SECTION
    // =======================
    let finalY = (doc as any).lastAutoTable.finalY + 10;

    // If page break happened, ensure we have space
    if (finalY > 250) {
        doc.addPage();
        finalY = 20;
    }

    const rightMarginPosition = pageWidth - margin;
    const valueX = rightMarginPosition;
    const labelX = rightMarginPosition - 40; // 40 units to the left of value

    doc.setFontSize(10);

    // Helper for totals row
    const renderTotalRow = (label: string, value: string, isBold: boolean = false) => {
        doc.setFont("helvetica", isBold ? "bold" : "normal");
        doc.setTextColor(isBold ? 0 : 100); // Black if bold, gray if normal
        doc.text(label, labelX, finalY, { align: "right" });

        doc.setTextColor(0, 0, 0); // Values always black
        doc.text(value, valueX, finalY, { align: "right" });
        finalY += 6;
    };

    if (!isPurchase) {
        const sales = invoice as ISalesInvoice;

        renderTotalRow("Subtotal:", formatCurrencyLKR(sales.subtotal));

        if (sales.discount > 0) {
            const discountAmount = (sales.subtotal * sales.discount) / 100;
            // Red color for discount to indicate subtraction
            doc.setTextColor(200, 0, 0);
            doc.setFont("helvetica", "normal");
            doc.text(`Discount (${sales.discount}%):`, labelX, finalY, { align: "right" });
            doc.text(`- ${formatCurrencyLKR(discountAmount)}`, valueX, finalY, { align: "right" });
            finalY += 6;
            doc.setTextColor(0, 0, 0); // Reset text color
        }
    }

    // Grand Total (Visual Emphasis)
    finalY += 2;
    doc.setDrawColor(200, 200, 200);
    doc.line(labelX - 20, finalY - 5, valueX, finalY - 5); // Line above total

    doc.setFontSize(12);
    renderTotalRow("Total:", formatCurrencyLKR(invoice.totalAmount), true);

    // Double underline for accounting style (Optional, keeping it simple as requested)
    // doc.line(labelX - 20, finalY + 1, valueX, finalY + 1);

    // =======================
    // FOOTER / NOTES
    // =======================
    const footerY = 280;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Thank you for your business.", margin, footerY);
    doc.text(`Generated on ${new Date().toLocaleString()}`, pageWidth - margin, footerY, { align: "right" });

    // Save
    doc.save(`${invoice.invoiceNumber}.pdf`);
}