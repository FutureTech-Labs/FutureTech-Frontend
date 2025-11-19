import TestInvoice from "@/components/common/TestInvoice";

const InvoicePreviewPage = () => {
    const mockInvoice: IPurchaseInvoice = {
        _id: "TEST",
        invoiceNumber: "FT-INV-0000",
        date: new Date().toISOString(),
        paymentType: "COD",
        status: "paid",
        totalAmount: 9000,
        supplier: {
            id: "1",
            name: "Test Supplier",
            contact: "+94 75 323 3241",
            email: "supplier@test.com"
        }
    };

    const mockItems: IPurchaseInvoiceItem[] = [
        {
            id: "ITEM1",
            product: { id: "P1", name: "Samsung A14" },
            quantity: 3,
            costPrice: 3000,
            lineTotal: 9000,
            batchCode: "B123"
        },
        {
            id: "ITEM2",
            product: { id: "P2", name: "Mother Board" },
            quantity: 5,
            costPrice: 30000,
            lineTotal: 900000,
            batchCode: "B121"
        },
    ];

    return (
        <div className="max-w-3xl">
            <TestInvoice type="purchase" invoice={mockInvoice} items={mockItems} />
        </div>
    );
}

export default InvoicePreviewPage;
