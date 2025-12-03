declare global {

    // Auth
    interface ISignInFormData {
        email: string;
        password: string;
    }

    interface IForgotPasswordForm {
        email: string;
        otp: string;
        newPassword: string;
        confirmPassword: string;
    }

    interface IUser {
        _id: string;
        name: string;
        email: string;
        role: "admin" | "cashier";
        status: string;
    }

    interface IAuthContextType {
        user: IUser | null;
        loading: boolean;
        logout: () => Promise<void>;
        refreshUser: () => Promise<void>;
    }

    interface ISidebarProps {
        user: IUser;
    }

    interface ISidebarContentProps {
        user: IUser;
        isCollapsed?: boolean;
    }

    // Users / Cashier Interfaces
    interface ICashier {
        id: string;
        name: string;
        email: string;
        role: "cashier";
        status: "active" | "inactive";
        createdAt: string;
        updatedAt: string;
        lastLogin?: string | null;
        lastLogout?: string | null;
    }

    // LOGIN HISTORY ENTRY
    interface ICashierHistoryEntry {
        loginAt: string;
        logoutAt: string | null;
        ip: string;
        userAgent: string;
    }

    // LOGIN HISTORY RESPONSE
    interface ICashierHistoryResponse {
        success: boolean;
        user: {
            id: string;
            name: string;
            email: string;
            lastLogin: string | null;
            lastLogout: string | null;
            loginHistory: ICashierHistoryEntry[];
        };
    }

    // USER STATISTICS (FOR CARDS)
    interface IUserStats {
        total: number;
        active: number;
        inactive: number;
        online: number;
        todayLogins: number;
    }



    // Product Interfaces
    interface IProduct {
        _id: string;
        name: string;
        brand: Brand;
        description: Description;
        category: Category;
        sellingPrice: number;
        warrantyPeriod: string;
        images: string[];
        status: string;
        totalStock: number;
        minStock: number;
        createdAt: string;
        updatedAt: string;
    }

    interface Description {
        intro: string;
        specifications: string[];
    }

    interface Category {
        _id: string;
        name: string;
        count?: number;
    }

    interface Brand {
        _id: string;
        name: string;
        count?: number;
    }

    // Invoice Party (supplier / customer / shop)
    interface IInvoiceParty {
        id: string;
        name: string;
        email?: string;
        contact?: string;
    }

    // ----------------------------------------
    // PURCHASE INVOICE TYPES
    // ----------------------------------------

    // Purchase summary inside Supplier record
    interface IPurchaseInvoiceRef {
        _id: string;
        invoiceNumber?: string;
        totalAmount?: number;
        status?: "pending" | "paid";
        date?: string;
        paymentType?: "COD" | "Net 15" | "Net 30" | "Net 45";
        dueDate?: string;
        remainingAmount?: number;
        alreadyPaid?: number;
    }

    // Full Purchase Invoice — backend response (create)
    interface IPurchaseCreateResponse {
        success: boolean;
        message: string;
        invoice: IPurchaseInvoice;
        totalAmount: number;
        batches: {
            id: string;
            product: string;
            batchCode: string;
            quantityReceived: number;
            quantityAvailable: number;
            costPrice: number;
        }[];
    }

    interface IPurchaseInvoiceSupplier {
        id: string;
        name: string;
        email?: string;
        contact?: string;
    }

    interface IPurchaseInvoiceItem {
        id: string;
        product: {
            id: string;
            name: string;
        } | null;
        quantity: number;
        costPrice: number;
        lineTotal: number;
        warrantyReference?: string | null;
        batchCode?: string | null;
    }

    interface IPurchaseInvoice {
        _id: string;
        invoiceNumber: string;
        date: string;
        paymentType: "COD" | "Net 15" | "Net 30" | "Net 45";
        status: "pending" | "paid";
        totalAmount: number;
        supplier: IInvoiceParty;
    }

    interface IPurchaseInvoiceResponse {
        success: boolean;
        invoice: IPurchaseInvoice;
        items: IPurchaseInvoiceItem[];
    }

    // ----------------------------------------
    // SUPPLIER PAYMENT
    // ----------------------------------------

    interface ISupplierPayment {
        _id: string;
        amount: number;
        paymentMethod: "cash" | "online_transfer";
        datePaid: string;
        notes?: string;
        hadToPayBefore: number;
        balanceAfter: number;
        appliedInvoices: {
            invoice: {
                _id: string;
                invoiceNumber?: string;
                totalAmount?: number;
                status?: string;
            };
            amount: number;
        }[];
    }

    // ----------------------------------------
    // SUPPLIER
    // ----------------------------------------

    interface ISupplier {
        _id: string;
        name: string;
        contact: string;
        email: string;
        company: string;
        address: string;
        status: "pending" | "paid";
        paymentTerms: "COD" | "Net 15" | "Net 30" | "Net 45";
        bankDetails: BankDetails;
        outstandingBalance: number;
        purchaseHistory: IPurchaseInvoiceRef[];
        payments?: ISupplierPayment[];
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
    }

    interface BankDetails {
        bankName: string;
        accountNumber: string;
    }

    interface IPurchaseInvoiceItemRef {
        product: {
            _id: string;
            name: string;
        } | null;
        quantity: number;
        costPrice: number;
        lineTotal: number;
    }

    interface ISupplierPurchaseInvoice extends IPurchaseInvoiceRef {
        items?: IPurchaseInvoiceItemRef[];
    }


    // ----------------------------------------
    // STOCKS & BATCHES
    // ----------------------------------------

    interface IStockResponse {
        success: boolean;
        total: number;
        page: number;
        pages: number;
        count: number;
        batches: IStockBatch[];
    }

    interface IStockBatch {
        _id: string;
        product: IStockProduct | null;
        supplier: IStockSupplier | null;
        batchCode: string;
        costPrice: number;
        quantityReceived: number;
        quantityAvailable: number;
        dateReceived: string;
    }

    interface IStockProduct {
        id: string;
        name: string;
        sellingPrice: number;
        minStock: number;
    }

    interface IStockSupplier {
        id: string;
        name: string;
    }

    interface IProductStockResponse {
        success: boolean;
        product: {
            id: string;
            name: string;
            sellingPrice: number;
            totalStock: number;
        };
        batches: IProductStockBatch[];
    }

    interface IProductStockBatch {
        _id: string;
        batchCode: string;
        costPrice: number;
        quantityReceived: number;
        quantityAvailable: number;
        dateReceived: string;
        supplier: IStockSupplier | null;
    }

    // ----------------------------------------
    // SALES — FIFO BATCH USAGE
    // ----------------------------------------

    interface ISalesBatchUsage {
        batch: string;
        qty: number;
        costPrice: number;
        batchCode?: string;
    }

    // ----------------------------------------
    // SALES — INVOICE ITEM
    // ----------------------------------------

    interface ISalesInvoiceItem {
        product: { id: string; name: string } | null;
        productName: string;
        quantity: number;
        sellingPrice: number;
        discount: number;
        warrantyPeriod: string;
        batches: ISalesBatchUsage[];
        lineTotal?: number;
    }


    // ----------------------------------------
    // SALES — FULL INVOICE (UI / PDF)
    // ----------------------------------------

    interface ISalesInvoice {
        _id: string;
        invoiceNumber: string;

        createdAt: string;
        createdBy: {
            id: string;
            name: string;
            email: string;
            role?: "admin" | "cashier";
        };

        customer: {
            name: string;
            email?: string | null;
            contact?: string | null;
        };

        items: ISalesInvoiceItem[];

        subtotal: number;
        discountTotal: number;
        tax: number;
        total: number;

        paymentMethod: "cash" | "card";
        paymentStatus: "paid";
    }

    // ======================================================
    // SALES — SERVICE REQUEST / RESPONSE TYPES
    // ======================================================

    // ---------- Request Payloads ----------
    interface ICustomerPayload {
        name: string;
        email?: string;
        contact?: string;
    }

    interface ISaleItemPayload {
        product: string;       // product ID
        quantity: number;
        sellingPrice: number;
        discount?: number;
    }

    interface ICreateSaleRequest {
        customer: ICustomerPayload;
        items: ISaleItemPayload[];
        paymentMethod: "cash" | "card";
        tax?: number;
    }

    // ---------- Response Types (SHAPED TO MATCH UI EXACTLY) ----------
    interface IInvoiceItemResponse {
        _id?: string;
        product: { id: string; name: string };
        productName: string;
        quantity: number;
        sellingPrice: number;
        discount: number;
        warrantyPeriod: string;
        batches: {
            batch: string;
            qty: number;
            costPrice: number;
        }[];
        returnedQty?: number;
        returned?: boolean;
    }


    interface ISalesInvoiceResponse {
        _id: string;
        invoiceNumber: string;
        createdAt: string;
        createdBy: {
            id: string;
            name: string;
            email: string;
            role?: "admin" | "cashier";
        };
        customer: {
            name: string;
            email?: string;
            contact?: string;
        };
        items: IInvoiceItemResponse[];
        subtotal: number;
        discountTotal: number;
        tax: number;
        total: number;
        paymentMethod: "cash" | "card";
        paymentStatus: "paid";
    }

    interface ICreateSaleResponse {
        success: boolean;
        invoice: ISalesInvoiceResponse;
    }

    interface ISalesListResponse {
        success: boolean;
        data: ISalesInvoiceResponse[];
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    }

    interface IGetSaleByIdResponse {
        success: boolean;
        invoice: ISalesInvoiceResponse;
    }

    interface ISalesByCashierItem {
        cashierId: string;
        name: string;
        email: string;
        totalSales: number;
        invoicesCount: number;
    }

    interface ISalesByCashierResponse {
        success: boolean;
        data: ISalesByCashierItem[];
    }

    // ===== RETURN TYPES =====

    interface IReturnItem {
        saleItemId: string;

        product: {
            id: string;
            name: string;
        };

        productName: string;
        warrantyPeriod: string;

        quantity: number;

        reason:
        | "defective"
        | "dead on arrival"
        | "wrong item"
        | "physical damage"
        | "customer remorse"
        | "other";

        returnType: "replacement" | "refund";

        refundAmount: number;
        replacementIssued: boolean;

        replacementBatches?: {
            batch: {
                _id?: string;
                batchCode: string;
            };
            qty: number;
            costPrice: number;
        }[];
    }

    interface IReturn {
        _id: string;

        returnInvoiceNumber: string;

        saleInvoice: {
            _id: string;
            invoiceNumber: string;
            total?: number;
            customer?: {
                name: string;
                email?: string;
                contact?: string;
            };
        };

        returnedBy: {
            _id: string;
            name: string;
            email?: string;
        };

        customer: {
            name: string;
            email?: string;
            contact?: string;
        };

        items: IReturnItem[];

        refundTotal: number;

        status: "processed" | "sent-to-supplier" | "completed";

        createdAt: string;
        updatedAt: string;
    }

    interface IReturnListResponse {
        success: boolean;
        data: IReturn[];
        total: number;
        page: number;
        totalPages: number;
    }

    interface IReturnSingleResponse {
        success: boolean;
        data: IReturn;
    }

    // ===== CREATE RETURN =====
    interface ICreateReturnRequest {
        saleInvoiceId: string;
        itemId: string;
        quantity: number;

        returnType: "replacement" | "refund";

        reason:
        | "defective"
        | "dead on arrival"
        | "wrong item"
        | "physical damage"
        | "customer remorse"
        | "other";
    }

    interface ICreateReturnResponse {
        success: boolean;
        returnInvoice: IReturn;
    }

    // ==============================
    // EXPENSE MODULE INTERFACES
    // ==============================

    // -------- ENUM Categories --------
    type ExpenseCategory =
        | "Electricity"
        | "Water"
        | "Internet"
        | "Rent"
        | "Salary"
        | "Maintenance"
        | "Transport"
        | "Purchase"
        | "Misc";

    // -------- Expense Document --------
    interface IExpense {
        _id: string;
        category: ExpenseCategory;
        type: "manual" | "purchase" | "adjustment";
        amount: number;
        date: string;                     // ISO Date
        description?: string | null;
        linkedPurchase?: string | null;
        createdBy: {
            _id: string;
            name: string;
        };
        createdAt: string;
        updatedAt: string;
    }

    // -------- Create Expense Request --------
    interface ICreateExpenseRequest {
        category: Exclude<ExpenseCategory, "Purchase">;
        amount: number;
        date?: string;
        description?: string;
    }

    // -------- Create Expense Response --------
    interface ICreateExpenseResponse {
        success: boolean;
        expense: IExpense;
    }

    // -------- List Expenses --------
    interface IExpenseListResponse {
        success: boolean;
        data: IExpense[];
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    }

    // ==============================
    // ANALYTICS INTERFACES
    // ==============================

    // -------- Monthly Expenses --------
    interface IMonthlyExpenseItem {
        year: number;
        month: number;
        total: number;
    }

    interface IMonthlyExpenseResponse {
        success: boolean;
        data: IMonthlyExpenseItem[];
    }

    // -------- Profit vs Expense --------
    interface IProfitVsExpenseItem {
        year: number;
        month: number;
        expenseTotal: number;
        profitTotal: number;
    }

    interface IProfitVsExpenseResponse {
        success: boolean;
        data: IProfitVsExpenseItem[];
    }

    // -------- Daily Profit --------
    interface IDailyProfitItem {
        date: string;   // YYYY-MM-DD
        profit: number;
    }

    interface IDailyProfitResponse {
        success: boolean;
        data: IDailyProfitItem[];
    }

    // ----------------------------------------
    // REPORTS INTERFACES
    // ----------------------------------------

    // Sales Related Report interfaces

    // Sales Summary report
    interface ISalesSummaryPaymentBreakdown {
        _id: "cash" | "card";
        amount: number;
        count: number;
    }

    interface ISalesSummary {
        totalSales: number;
        invoiceCount: number;
        itemsSold: number;
        avgSale: number;
        totalProfit: number;
        paymentBreakdown: ISalesSummaryPaymentBreakdown[];
    }

    interface ISalesSummaryResponse {
        success: boolean;
        data: ISalesSummary;
    };

    // Sales trend report
    interface ISalesTrendPoint {
        _id: string;
        revenue: number;
        invoices: number;
    }

    interface ISalesTrendsResponse {
        success: boolean;
        data: ISalesTrendPoint[];
    };

    // Top Products report
    interface ITopProductItem {
        _id: string;
        productName: string;
        qtySold: number;
        revenue: number;
        sellingPrice?: number;
        totalStock?: number;
        category?: string;
    }

    interface ITopProductsResponse {
        success: boolean;
        data: ITopProductItem[];
    };

    // sales by cashier report
    interface ISalesByCashierReportItem {
        cashierId: string;
        cashierName: string;
        cashierEmail: string;
        userRole: string;
        totalSales: number;
        invoiceCount: number;
        totalProfit: number;
    }

    // Pagination meta data
    export interface IPaginationMeta {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }

    interface ISalesByCashierReportResponse {
        success: boolean;
        data: ISalesByCashierReportItem[];
        meta: IPaginationMeta;
    };

    // Payment breakdown report
    interface IPaymentBreakdownItem {
        _id: "cash" | "card";
        amount: number;
        count: number;
    }

    interface IPaymentBreakdownResponse {
        success: boolean;
        data: IPaymentBreakdownItem[];
    };

    // Invoice List reports
    interface ISalesInvoiceListResponse {
        success: boolean;
        data: ISalesInvoiceResponse[];
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    };


    // Inventory Related Reports Interfaces

    // Current stock reports
    interface ICategoryInfo {
        _id: string;
        name: string;
    }

    interface ICurrentStockItem {
        _id: string;
        name: string;
        category: ICategoryInfo | null;
        sellingPrice: number;
        totalStock: number;
        minStock: number;
        batchesCount: number;
        stockValue: number;
        availableFromBatches: number;
    }

    interface ICurrentStockResponse {
        success: boolean;
        data: ICurrentStockItem[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalProducts: number;
            totalStockValue: number;
            totalBatches: number;
            totalQuantityAvailable: number;
        };
    }



    // Low stock reports
    interface ILowStockProduct {
        _id: string;
        name: string;
        category: { _id: string; name: string } | null;
        totalStock: number;
        minStock: number;
    }

    interface ILowStockResponse {
        success: boolean;
        data: ILowStockProduct[];
        meta: {
            total: number;
            page: number;
            limit: number;
            effectiveThreshold: number;
        };
    };

    // Stock value reports
    interface IStockValueItem {
        productId: string;
        name: string;
        category: { _id: string; name: string } | null;
        value: number;
        qtyAvailable: number;
        batchesCount: number;
        totalStock: number;
    }

    interface IStockValueResponse {
        success: boolean;
        data: IStockValueItem[];
        meta: {
            total: number;
            page: number;
            limit: number;
            globalValue: number;
        }
    };

    // Stock movement reports
    interface IStockMovementItem {
        productId: string;
        name: string;
        category: string | null;
        openingStock: number;
        purchased: number;
        sold: number;
        returned: number;
        closingStock: number;
    }

    interface IStockMovementResponse {
        success: boolean;
        data: IStockMovementItem[];
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    };

    // Fast moving products reports
    interface IFastMovingItem {
        productId: string;
        productName: string;
        qtySold: number;
        revenue: number;
        sellingPrice?: number;
        totalStock?: number;
    }

    interface IFastMovingResponse {
        success: boolean;
        data: IFastMovingItem[];
    };

    // Slow moving products reorts
    interface ISlowMovingItem {
        productId: string;
        name: string;
        totalStock: number;
        soldQty: number;
    }

    interface ISlowMovingResponse {
        success: boolean;
        data: ISlowMovingItem[];
    };

    // Batch aging report
    interface IBatchAgingItem {
        _id: string;
        batchCode: string;
        product: {
            id: string;
            name: string;
        } | null;
        supplier: {
            id: string;
            name: string;
        } | null;
        costPrice: number;
        quantityReceived: number;
        quantityAvailable: number;
        dateReceived: string;
        ageDays: number;
    }

    interface IBatchAgingResponse {
        success: boolean;
        data: IBatchAgingItem[];
    };

    // Batch list reports
    interface IBatchListItem {
        _id: string;
        product: {
            id: string;
            name: string;
            sellingPrice: number;
        } | null;
        supplier: {
            id: string;
            name: string;
        } | null;
        batchCode: string;
        invoiceNumber: string;
        costPrice: number;
        quantityReceived: number;
        quantityAvailable: number;
        dateReceived: string;
    }

    interface IBatchListResponse {
        success: boolean;
        data: IBatchListItem[];
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    };


    // ----------------------------------------
    // UI FORM TYPES
    // ----------------------------------------

    type IFormInputProps = {
        name: string;
        label?: string;
        placeholder: string;
        type?: string;
        register: UseFormRegister<any>;
        error?: FieldError;
        validation?: RegisterOptions;
        disabled?: boolean;
        value?: string;
        autoComplete?: string;
        height?: string;
        readonly?: boolean;
    };

    type IFormTextareaProps = {
        name: string;
        label?: string;
        placeholder: string;
        register: UseFormRegister<any>;
        error?: FieldError;
        validation?: RegisterOptions;
        disabled?: boolean;
        value?: string;
        rows?: number;
        maxWords?: number;
    };

    type ISelectFieldProps = {
        name?: string;
        label?: string;
        placeholder?: string;
        options: Option[];
        control?: any;
        error?: any;
        required?: boolean;
        value?: string;
        className?: string;
        iconColor?: string;
        width?: string;
        disabled?: boolean;
        onChange?: (value: string) => void;
    };

    type Option = {
        value: string;
        label: string;
    };
}

export { };
