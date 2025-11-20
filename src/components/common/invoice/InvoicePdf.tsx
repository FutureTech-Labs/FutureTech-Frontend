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

    // Type guard
    const isSalesItem = (it: InvoiceItem): it is ISalesInvoiceItem =>
        (it as ISalesInvoiceItem).sellingPrice !== undefined;

    const sales = invoice as ISalesInvoice;

    // =========================
    // TOP TITLE
    // =========================
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(...primaryColor);
    doc.text(isPurchase ? "PURCHASE INVOICE" : "SALES INVOICE", pageWidth - margin, 20, {
        align: "right",
    });

    // =========================
    // META DATA
    // =========================
    // =========================
    // META DATA
    // =========================
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    const metaStartY = 30;
    const lineHeight = 5;

    const renderMetaRight = (label: string, value: string, y: number) => {
        doc.setTextColor(...secondaryColor);
        doc.text(label, pageWidth - margin - 35, y, { align: "right" });
        doc.setTextColor(0, 0, 0);
        doc.text(value, pageWidth - margin, y, { align: "right" });
    };

    // FIXED DATE + STATUS + PAYMENT METHOD
    const displayDate = isPurchase
        ? new Date((invoice as IPurchaseInvoice).date).toLocaleDateString()
        : new Date(sales.createdAt).toLocaleDateString();

    const displayStatus = isPurchase
        ? (invoice as IPurchaseInvoice).status
        : sales.paymentStatus;

    // 1. Invoice No
    renderMetaRight("Invoice No:", invoice.invoiceNumber, metaStartY);

    // 2. Date
    renderMetaRight("Date:", displayDate, metaStartY + lineHeight);

    // 3. Status
    renderMetaRight("Status:", displayStatus, metaStartY + lineHeight * 2);

    // SALES ONLY → Add Issued By & Payment Method
    if (!isPurchase) {
        // 4. Issued By
        renderMetaRight(
            "Issued By:",
            sales.createdBy.name,
            metaStartY + lineHeight * 3
        );

        // 5. Payment Method
        renderMetaRight(
            "Payment:",
            sales.paymentMethod.toUpperCase(),
            metaStartY + lineHeight * 4
        );
    } else {
        // PURCHASE — keep old line positioning
        renderMetaRight(
            "Payment:",
            (invoice as IPurchaseInvoice).paymentType.toUpperCase(),
            metaStartY + lineHeight * 3
        );
    }

    // =========================
    // ADDRESS SECTION
    // =========================

    const fromParty = isPurchase
        ? {
            name: (invoice as IPurchaseInvoice).supplier.name,
            email: (invoice as IPurchaseInvoice).supplier.email,
            contact: (invoice as IPurchaseInvoice).supplier.contact,
            // NO address for supplier
        }
        : {
            name: "FutureTech Pvt Ltd.",
            email: "contact@futuretech.com",
            contact: "+94 76 853 8824",
            address: "123 Tech Avenue, Colombo 03, Sri Lanka", // shop address
        };

    const toParty = isPurchase
        ? {
            name: "FutureTech Pvt Ltd.",
            email: "contact@futuretech.com",
            contact: "+94 76 853 8824",
            address: "123 Tech Avenue, Colombo 03, Sri Lanka", // shop address
        }
        : {
            name: (invoice as ISalesInvoice).customer.name,
            email: (invoice as ISalesInvoice).customer.email || "-",
            contact: (invoice as ISalesInvoice).customer.contact || "-",
            // NO address for customer
        };

    const addressY = 60;

    doc.setDrawColor(220, 220, 220);
    doc.line(margin, addressY - 5, pageWidth - margin, addressY - 5);

    const renderAddressBlock = (title: string, party: any, x: number, y: number) => {
        doc.setFontSize(9);
        doc.setTextColor(...secondaryColor);
        doc.text(title.toUpperCase(), x, y);

        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "bold");
        doc.text(party.name || "-", x, y + 6);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...primaryColor);

        // address only if exists (FutureTech only)
        if (party.address) {
            doc.text(`${party.address}`, x, y + 12);
            doc.text(`Tel: ${party.contact ?? "-"}`, x, y + 17);
            doc.text(`Email: ${party.email ?? "-"}`, x, y + 22);
        } else {
            doc.text(`Tel: ${party.contact ?? "-"}`, x, y + 12);
            doc.text(`Email: ${party.email ?? "-"}`, x, y + 17);
        }
    };

    renderAddressBlock("From", fromParty, margin, addressY);
    renderAddressBlock("Bill To", toParty, margin + 90, addressY);


    // =========================
    // TABLE
    // =========================
    // =========================
    // TABLE (UPDATED WITH DISCOUNT COLUMN FOR SALES)
    // =========================

    const tableHead = isPurchase
        ? ["Product Name", "Qty", "Cost Price", "Amount"]
        : ["Product Name", "Qty", "Unit Price", "Discount", "Amount"];

    const tableBody = items.map((item) => {
        const name = item.product?.name ?? "-";
        const qty = item.quantity;

        const price = isSalesItem(item)
            ? item.sellingPrice
            : (item as IPurchaseInvoiceItem).costPrice;

        const discount = isSalesItem(item) ? item.discount || 0 : 0;

        const lineTotal = isSalesItem(item)
            ? item.sellingPrice * item.quantity - discount
            : (item as IPurchaseInvoiceItem).lineTotal;

        return isPurchase
            ? [
                name,
                qty,
                formatCurrencyLKR(price),
                formatCurrencyLKR(lineTotal),
            ]
            : [
                name,
                qty,
                formatCurrencyLKR(price),
                discount > 0 ? `${formatCurrencyLKR(discount)}` : "—",
                formatCurrencyLKR(lineTotal),
            ];
    });

    autoTable(doc, {
        startY: addressY + 25,
        head: [tableHead],
        body: tableBody,
        theme: "grid",
        styles: {
            fontSize: 9,
            textColor: [40, 40, 40],
            cellPadding: 3,
        },
        headStyles: {
            fillColor: [50, 50, 50],
            textColor: [255, 255, 255],
            fontSize: 9,
            fontStyle: "bold",
            halign: "left",
        },
        columnStyles: isPurchase
            ? {
                0: { cellWidth: "auto" },
                1: { halign: "left", cellWidth: 20 },
                2: { halign: "left", cellWidth: 35 },
                3: { halign: "left", cellWidth: 35 },
            }
            : {
                0: { cellWidth: "auto" },
                1: { halign: "left", cellWidth: 20 },
                2: { halign: "left", cellWidth: 35 },
                3: { halign: "left", cellWidth: 35 }, // discount
                4: { halign: "left", cellWidth: 35 }, // amount
            },
    });


    // =========================
    // TOTALS SECTION
    // =========================
    let finalY = (doc as any).lastAutoTable.finalY + 10;

    if (finalY > 250) {
        doc.addPage();
        finalY = 20;
    }

    const valueX = pageWidth - margin;
    const labelX = valueX - 40;

    doc.setFontSize(10);

    const renderTotalRow = (label: string, value: string, bold = false) => {
        doc.setFont("helvetica", bold ? "bold" : "normal");
        doc.setTextColor(bold ? 0 : 100);
        doc.text(label, labelX, finalY, { align: "right" });

        doc.setTextColor(0, 0, 0);
        doc.text(value, valueX, finalY, { align: "right" });

        finalY += 6;
    };

    if (!isPurchase) {
        renderTotalRow("Subtotal:", formatCurrencyLKR(sales.subtotal));

        if (sales.discountTotal > 0) {
            doc.setTextColor(200, 0, 0);
            doc.text("Discount:", labelX, finalY, { align: "right" });
            doc.text(`- ${formatCurrencyLKR(sales.discountTotal)}`, valueX, finalY, {
                align: "right",
            });
            doc.setTextColor(0, 0, 0);
            finalY += 6;
        }
    }

    // Divider above grand total
    finalY += 2;
    doc.setDrawColor(200, 200, 200);
    doc.line(labelX - 20, finalY - 5, valueX, finalY - 5);

    // Grand Total
    const displayTotal = isPurchase
        ? (invoice as IPurchaseInvoice).totalAmount
        : sales.total;

    doc.setFontSize(12);
    renderTotalRow("Total:", formatCurrencyLKR(displayTotal), true);

    // =========================
    // FOOTER
    // =========================
    const footerY = 280;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Thank you for your business.", margin, footerY);
    doc.text(`Generated on ${new Date().toLocaleString()}`, pageWidth - margin, footerY, {
        align: "right",
    });

    doc.save(`${invoice.invoiceNumber}.pdf`);
}
