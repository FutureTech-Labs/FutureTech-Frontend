// lib/warranty.ts
type InvoiceItem = ISalesInvoiceItem | IPurchaseInvoiceItem;

/** Extract warranty safely */
export function extractWarranty(item: InvoiceItem): string | null {
    return (item as any).warrantyPeriod ?? null;
}

/** 
 * Unified warranty message generator 
 * Used by: UI invoice, PDF invoice, Print invoice
 */
export function getWarrantyMessage(items: InvoiceItem[]) {
    const processed = items.map((item) => ({
        name: item.product?.name || "Product",
        warranty: extractWarranty(item)
    }));

    // Case 1 — Only one product
    if (processed.length === 1) {
        const w = processed[0].warranty;

        if (!w || w === "no warranty") {
            return [
                "This product is sold without warranty. Physical or operational defects after purchase are not covered."
            ];
        }

        return [
            `This product includes a ${w} manufacturer warranty from the purchase date. Warranty covers manufacturing defects only and excludes physical damage.`
        ];
    }

    // Multiple products
    return processed.map((p) => {
        if (!p.warranty || p.warranty === "no warranty") {
            return `• ${p.name}: No warranty`;
        }
        return `• ${p.name}: ${p.warranty}`;
    });
}

