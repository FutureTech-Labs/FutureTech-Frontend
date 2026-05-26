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
    interface ProductImage {
        url: string;
        public_id: string;
    }
    interface IProduct {
        _id: string;
        name: string;
        brand: Brand;
        description: Description;
        category: Category;
        sellingPrice: number;
        warrantyPeriod: string;
        images: ProductImage[];
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

    // ==============================
    // PURCHASE STATS
    // ==============================
    interface IPurchaseStats {
        totalPurchasesAmount: number;      // Sum of all purchase totals
        totalPurchaseInvoices: number;     // Count of all purchase invoices
        pendingInvoices: number;           // Invoices with status = "pending" or "partial"
        outstandingSupplierBalance: number; // Sum of all suppliers' outstandingBalance
        upcomingDuePayments: number;       // Count of invoices due within next 7 days
    }
    interface IPurchaseStatsResponse {
        success: boolean;
        stats: IPurchaseStats;
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

    // Stock Stats
    export interface IStockStatsResponse {
        success: boolean;
        stats: IStockStats;
    }
    export interface IStockStats {
        totalStockValue: number;               // Sum of all quantityAvailable * costPrice
        totalBatches: number;                  // Count of all batches
        globalThreshold: number;               // Global min stock threshold
        totalPurchaseCostThisMonth: number;    // Sum of purchases for current month
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

    // ---------- SALES STATISTICS (Admin + Cashier) ----------
    interface ISalesStats {
        totalSales: number;        // Sum of all invoice totals
        totalInvoices: number;     // Count of invoices
        avgInvoice: number;        // Average invoice amount
        returnedInvoices: number;  // Count of invoices with returned items
    }

    interface ISalesStatsResponse {
        success: boolean;
        stats: ISalesStats;
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
        firstSaleDate: string;
        lastSaleDate: string;
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
    interface IStockValueBatch {
        batchId: string;
        batchCode: string;
        qtyAvailable: number;
        costPrice: number;       // ← ADDED
        batchValue: number;
    }

    interface IStockValueItem {
        productId: string;
        name: string;
        category: { _id: string; name: string } | null;

        value: number;
        qtyAvailable: number;
        batchesCount: number;
        totalStock: number;

        batches: IStockValueBatch[];
    }

    interface IStockValueResponse {
        success: boolean;
        data: IStockValueItem[];

        meta: {
            total: number;
            page: number;
            limit: number;
            globalValue: number;
        };
    }

    // Stock movement reports
    interface IStockMovementSoldBatch {
        batchId: string;
        batchCode: string;
        qty: number;
        costPrice: number;
        sellingPrice: number;
    }

    interface IStockMovementItem {
        productId: string;
        name: string;
        category: {
            _id: string;
            name: string;
        } | null;
        purchased: number;
        sold: number;
        soldBatches: IStockMovementSoldBatch[];
        returned: number;
    }

    interface IStockMovementResponse {
        success: boolean;
        data: IStockMovementItem[];
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    }

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
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    }


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

    // Supplier Related Report interfaces

    // Supplier summary reports
    interface ISupplierSummaryItem {
        supplierId: string;
        name: string;
        company: string | null;
        contact: string | null;
        email: string | null;

        totalPurchased: number;
        totalPaid: number;
        outstandingBalance: number;

        invoiceCount: number;
        paidInvoices: number;
        pendingInvoices: number;

        lastPurchaseDate: string | null;
        lastPaymentDate: string | null;

        status: string;
        isActive: boolean;
    }
    interface ISupplierSummaryResponse {
        success: boolean;
        data: ISupplierSummaryItem[];
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    };


    // Outstanding Suppliers Reports
    interface IOutstandingSupplierItem {
        supplierId: string;
        name: string;
        contact: string;
        email: string;

        outstandingBalance: number;

        pendingInvoiceCount: number;
        pendingInvoiceTotal: number;

        oldestPendingInvoiceDate: string | null;
        newestPendingInvoiceDate: string | null;

        status: string;
    }
    interface IOutstandingSuppliersResponse {
        success: boolean;
        data: IOutstandingSupplierItem[];
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    };

    // Supplier Purchase Trends Reports
    interface ISupplierTrendItem {
        period: string;       // "2025-11" or "2025-12" etc
        totalQty: number;
        totalValue: number;
        invoicesCount: number;
    }
    interface ISupplierPurchaseTrendsResponse {
        success: boolean;
        data: ISupplierTrendItem[];
        meta: {
            interval: "day" | "month";
            supplierId: string | null;
            filtered: boolean;
            from: string | null;
            to: string | null;

            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    };

    // Supplier Items Reports
    interface ISupplierItemReportRow {
        supplierId: string;
        supplierName: string;

        productId: string;
        productName: string;

        totalQty: number;
        totalValue: number;

        lastBatchDate: string | null;
        latestCostPrice: number;

        latestBatchCode?: string | null;
    }
    interface ISupplierItemsReportResponse {
        success: boolean;
        data: ISupplierItemReportRow[];
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    };


    // Expense Related Reports Interfaces

    // Expense summary reports
    interface IExpenseSummaryTopCategory {
        category: string;
        total: number;
        count: number;
    }

    interface IHighestExpenseRecord {
        amount: number;
        category: string;
        date: string; // ISO string
        description: string | null;
        type: string;
        linkedPurchase: string | null;
    }

    interface IExpenseSummaryData {
        totalExpense: number;
        totalCount: number;
        avgPerDay: number;
        topCategories: IExpenseSummaryTopCategory[];
        highestExpense: IHighestExpenseRecord | null;
    }

    interface IExpenseSummaryResponse {
        success: boolean;
        data: IExpenseSummaryData;
        meta: {
            filtered: boolean;
            from: string | null;
            to: string | null;
            category: string | null;
        };
    };

    // Expense by category Report
    interface IExpenseCategoryBreakdownItem {
        category: string;
        totalAmount: number;
        count: number;
        percentOfTotal: number;
    }

    interface IExpensesByCategoryResponse {
        success: boolean;
        data: IExpenseCategoryBreakdownItem[];
        meta: {
            total: number;
        };
    };

    // Expense trends report
    interface IExpenseTrendItem {
        period: string; // "2025-12" or "2025-12-05"
        totalAmount: number;
        count: number;
    }

    interface IExpenseTrendBreakdown {
        [category: string]: number; // dynamic key
    }

    interface IExpenseTrendItemWithBreakdown {
        period: string;
        totalAmount: number;
        count: number;
        breakdown: IExpenseTrendBreakdown;
    }

    interface IExpenseTrendsResponse {
        success: boolean;
        data: (IExpenseTrendItem | IExpenseTrendItemWithBreakdown)[];
        meta: {
            interval: "day" | "month";
            from: string | null;
            to: string | null;
            breakdown: boolean;
        };
    };


    // Expense List reports
    interface IExpenseReportLinkedPurchase {
        id: string;
        invoiceNumber?: string;
        totalAmount?: number;
        supplier?: {
            id: string;
            name: string;
        } | null;
    }
    interface IExpenseReportItem {
        id: string;
        category: string;
        type: string;
        amount: number;
        date: string; // ISO string
        description: string | null;
        linkedPurchase: IExpenseReportLinkedPurchase | null;
    }
    interface IExpenseReportListResponse {
        success: boolean;
        data: IExpenseReportItem[];
        meta: {
            total: number;
            page: number;
            limit: number;
        };
    };

    // ----------------------------------------
    // DASHBOARD INTERFACES
    // ----------------------------------------

    // Admin Dashboard interfaces

    // Area Chart
    export interface IAreaChartPoint {
        year: number;
        month: number;
        revenue: number;
        profit: number;
        expense: number;
    }
    interface IAreaChartResponse {
        success: boolean;
        data: IAreaChartPoint[];
    };

    // Top selling products
    interface ITopSellingProduct {
        productId: string;
        name: string;
        qtySold: number;
        revenue: number;
        profit: number;
    }
    interface ITopSellingProductsResponse {
        success: boolean;
        data: ITopSellingProduct[];
    };

    // Profit vs expense
    interface IDailyProfitExpensePoint {
        date: string;   // YYYY-MM-DD
        profit: number;
        expense: number;
        net: number;
    }
    interface IDailyProfitExpenseResponse {
        success: boolean;
        data: IDailyProfitExpensePoint[];
    };

    // Recent Expenses
    interface IRecentExpenseItem {
        category: ExpenseCategory;
        amount: number;
        date: string;
        description?: string | null;
    }
    interface IRecentExpensesResponse {
        success: boolean;
        data: IRecentExpenseItem[];
    };

    // Iventory Overview
    interface IInventoryOverviewItem {
        name: string;
        totalStock: number;
        minStock: number;
    }
    interface IInventoryOverviewResponse {
        success: boolean;
        data: {
            totalProducts: number;
            lowStockCount: number;
        };
    };


    // Cashier Dashboard interfaces

    // Cashier sales chart
    interface ICashierSalesChartPoint {
        date: string;
        revenue: number;
    }
    interface ICashierSalesChartResponse {
        success: boolean;
        data: ICashierSalesChartPoint[];
    };

    // Cashier sales summary
    interface ICashierSalesSummary {
        totalRevenue: number;
        invoices: number;
    }
    interface ICashierSalesSummaryResponse {
        success: boolean;
        data: ICashierSalesSummary;
    };

    // Cashier recent invoices
    interface ICashierRecentInvoice {
        invoiceNumber: string;
        customer: { name: string };
        createdAt: string;
        total: number;
        paymentMethod: "cash" | "card";
    }
    interface ICashierRecentInvoicesResponse {
        success: boolean;
        data: ICashierRecentInvoice[];
    }



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
