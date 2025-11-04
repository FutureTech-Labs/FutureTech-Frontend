import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session = await getSession();

    if (!session) redirect("/login");

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Welcome, {session.role === "admin" ? "Admin" : "Cashier"}!</h1>

            {session.role === "admin" && (
                <div>
                    <h2 className="text-xl font-semibold">Admin Overview</h2>
                </div>
            )}

            {session.role === "cashier" && (
                <div>
                    <h2 className="text-xl font-semibold">Cashier Overview</h2>
                </div>
            )}
        </div>
    );
}
