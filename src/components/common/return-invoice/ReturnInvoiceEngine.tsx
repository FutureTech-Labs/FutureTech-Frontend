import { formatCurrencyLKR } from "@/lib/utils";

interface Props {
    invoice: IReturn;
}

export default function ReturnInvoiceEngine({ invoice }: Props) {
    const hasRefund = invoice.items.some((i) => i.returnType === "refund");

    return (
        <div style={{ width: "210mm", minHeight: "290mm", margin: "0 auto", padding: "15mm" }}>

            {/* HEADER */}
            <h1 style={{ fontSize: "24pt", marginBottom: "20px", textAlign: "center" }}>
                RETURN INVOICE
            </h1>

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
                <div>
                    <strong>Return Invoice No:</strong> {invoice.returnInvoiceNumber} <br />
                    <strong>Return Date:</strong> {new Date(invoice.createdAt).toLocaleString()} <br />
                    <strong>Status:</strong> {invoice.status?.replace(/-/g, " ")}
                </div>

                <div>
                    <strong>Linked Invoice:</strong> {invoice.saleInvoice?.invoiceNumber || "—"}<br />
                </div>
            </div>

            {/* CUSTOMER / STAFF */}
            <div style={{ marginBottom: "25px" }}>
                <h3>CUSTOMER</h3>
                <div>{invoice.customer?.name}</div>
                <div>{invoice.customer?.email}</div>
                <div>{invoice.customer?.contact}</div>

                <h3 style={{ marginTop: "15px" }}>PROCESSED BY</h3>
                <div>{invoice.returnedBy?.name}</div>
                <div>{invoice.returnedBy?.email}</div>
            </div>

            {/* TABLE */}
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Warranty</th>
                        <th>Qty</th>
                        <th>Reason</th>
                        <th>Type</th>
                        {hasRefund && <th>Refund</th>}
                    </tr>
                </thead>

                <tbody>
                    {invoice.items.map((item) => (
                        <tr key={item.productName + Math.random()}>
                            <td>{item.productName}</td>
                            <td>{item.warrantyPeriod}</td>
                            <td>{item.quantity}</td>
                            <td>{item.reason}</td>
                            <td>{item.returnType}</td>
                            {hasRefund && (
                                <td>
                                    {item.returnType === "refund"
                                        ? formatCurrencyLKR(item.refundAmount || 0)
                                        : "—"}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* TOTAL REFUND */}
            {hasRefund && (
                <div className="totals">
                    <strong>Total Refund: </strong>
                    {formatCurrencyLKR(invoice.refundTotal || 0)}
                </div>
            )}

            <div style={{ marginTop: "30px", textAlign: "center", color: "#777" }}>
                Return processed successfully.
            </div>
        </div>
    );
}
