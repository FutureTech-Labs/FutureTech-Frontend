import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export default async function CashierDashboardPage() {
    const session = await getSession();

    // If not logged in → redirect to login
    if (!session) redirect("/login");

    // Only allow cashier (or admin) to access
    if (session.role !== "cashier") {
        redirect("/unauthorized"); // optional unauthorized page
    }

    return <div>Welcome Cashier Dashboard</div>;
}
