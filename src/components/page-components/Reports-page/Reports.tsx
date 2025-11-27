'use client';

import {
    useState,
    ReactNode
} from "react";

import dynamic from "next/dynamic";
import { Tab } from "../../common/Tab";

type ReportType = "sales" | "inventory" | "supplier" | "expense";

const SalesReports = dynamic(() => import("./SalesReports"), { ssr: false });
const InventoryReports = dynamic(() => import("./InventoryReports"), { ssr: false });
const SupplierReports = dynamic(() => import("./SupplierReports"), { ssr: false });
const ExpenseReports = dynamic(() => import("./ExpenseReports"), { ssr: false });

const Reports = () => {
    const [selectedReport, setSelectedReport] = useState<ReportType>("sales");

    const reportTabs = [
        { label: "Sales", value: "sales" },
        { label: "Inventory", value: "inventory" },
        { label: "Supplier", value: "supplier" },
        { label: "Expense", value: "expense" },
    ];

    const reportComponents: Record<ReportType, () => ReactNode> = {
        sales: () => <SalesReports />,
        inventory: () => <InventoryReports />,
        supplier: () => <SupplierReports />,
        expense: () => <ExpenseReports />,
    };

    return (
        <div className="relative flex flex-col gap-6">
            <Tab
                activeTab={selectedReport}
                onChange={(value) => setSelectedReport(value as ReportType)}
                tabs={reportTabs}
            />

            {reportComponents[selectedReport]()}
        </div>
    )
}

export default Reports;