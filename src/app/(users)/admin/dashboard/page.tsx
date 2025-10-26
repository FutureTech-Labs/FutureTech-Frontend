import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
    title: "Admin",
};

export default async function AdminDashboardPage() {

    const session = await getSession();

    // If not logged in → redirect to login
    if (!session) redirect("/login");

    // Only allow admin to access
    if (session.role !== "admin") {
        redirect("/unauthorized");
    }

    return <div>Welcome {session.role}</div>;
}
