import Invoice from "@/components/common/Invoice";

const InvoicePreviewPage = () => {
    const mockInvoice: IPurchaseInvoice = {
        _id: "TEST",
        invoiceNumber: "FT-INV-0000",
        date: new Date().toISOString(),
        paymentType: "COD",
        status: "paid",
        totalAmount: 12345,
        supplier: {
            id: "1",
            name: "Test Supplier",
            contact: "0712345678",
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
        }
    ];

    return (
        <div className="max-w-3xl">
            <Invoice type="purchase" invoice={mockInvoice} items={mockItems} />
        </div>
    );
}

export default InvoicePreviewPage;
