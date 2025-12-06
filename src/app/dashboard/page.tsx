import { JSX } from "react";

import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

import AdminDashboard from "@/components/page-components/dashboard-page/AdminDashboard";
import CashierDashboard from "@/components/page-components/dashboard-page/CashierDashboard";

export default async function DashboardPage() {
    const session = await getSession();
    if (!session) redirect("/login");

    const dashboards: Record<string, JSX.Element> = {
        admin: <AdminDashboard />,
        cashier: <CashierDashboard />,
    };

    const DashboardComponent = dashboards[session.role];

    if (!DashboardComponent) {
        console.error(`Unknown role "${session.role}"`);
        redirect("/login");
    }

    return <>{DashboardComponent}</>;
}
