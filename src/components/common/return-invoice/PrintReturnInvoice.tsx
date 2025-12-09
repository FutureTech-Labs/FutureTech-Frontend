import { renderToStaticMarkup } from "react-dom/server";
import ReturnInvoiceEngine from "./ReturnInvoiceEngine";

interface PrintParams {
    invoice: IReturn;
}

export function printReturnInvoice({ invoice }: PrintParams) {
    const html = renderToStaticMarkup(<ReturnInvoiceEngine invoice={invoice} />);

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow!.document;

    doc.open();
    doc.write(`
        <html>
        <head>
            <title>Return Invoice</title>
            <style>
                body { font-family: Arial; padding: 16px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #000; padding: 6px; font-size: 12px; }
                .totals { text-align: right; margin-top: 20px; font-size: 14px; }
            </style>
        </head>
        <body>${html}</body>
        </html>
    `);
    doc.close();

    iframe.onload = () => {
        iframe.contentWindow!.focus();
        iframe.contentWindow!.print();
        setTimeout(() => iframe.remove(), 200);
    };
}
