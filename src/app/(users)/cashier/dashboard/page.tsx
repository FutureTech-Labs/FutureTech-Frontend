import { Metadata } from "next";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
    title: "Cashier",
};

export default async function CashierDashboardPage() {
    const session = await getSession();

    return <div>Welcome {session?.role}</div>
}
