import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export default async function AdminDashboardPage() {
    const session = await getSession();

    // If not logged in → redirect to login
    if (!session) redirect("/login");

    // Only allow cashier (or admin) to access
    if (session.role !== "admin") {
        redirect("/unauthorized");
    }

    return <div>Welcome {session.role}</div>;
}
