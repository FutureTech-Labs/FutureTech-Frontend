import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
    title: "Cashier",
};

export default async function CashierDashboardPage() {
    const session = await getSession();

    // If not logged in → redirect to login
    if (!session) redirect("/login");

    // Only allow cashier to access
    if (session.role !== "cashier") {
        redirect("/unauthorized");
    }

    return <div>Welcome {session.role}</div>
}
