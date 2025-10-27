import { Metadata } from "next";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
    title: "Admin",
};

export default async function AdminDashboardPage() {

    const session = await getSession();

    return <div>Welcome {session?.role}</div>;
}
