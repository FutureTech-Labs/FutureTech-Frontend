import { renderToStaticMarkup } from "react-dom/server";
import InvoiceEngine from "./InvoiceEngine";

interface PrintParams {
    type: "purchase" | "sales";
    invoice: IPurchaseInvoice | ISalesInvoice;
    items: (IPurchaseInvoiceItem | ISalesInvoiceItem)[];
}

export function printInvoice({ type, invoice, items }: PrintParams) {
    const html = renderToStaticMarkup(
        <InvoiceEngine type={type} invoice={invoice} items={items} />
    );

    // Create hidden iframe
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow!.document;

    doc.open();
    doc.write(`
        <html>
        <head>
            <title>Invoice</title>
            <style>
                body { font-family: Arial; padding: 16px; }
                h1 { text-align: center; margin-bottom: 20px; }

                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #000; padding: 6px; font-size: 12px; }

                .top-info {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 20px;
                    font-size: 12px;
                }

                .totals { margin-top: 20px; text-align: right; font-size: 14px; }
            </style>
        </head>
        <body>${html}</body>
        </html>
    `);
    doc.close();

    // Wait for iframe content to load → then print
    iframe.onload = () => {
        iframe.contentWindow!.focus();
        iframe.contentWindow!.print();

        // Remove iframe after printing
        setTimeout(() => {
            document.body.removeChild(iframe);
        }, 100);
    };
}
