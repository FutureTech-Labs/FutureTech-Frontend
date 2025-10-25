import { ReactNode } from "react";
import Sidebar from "@/components/common/Sidebar";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { getMe } from "@/services/authService";

interface UsersLayoutProps {
    children: ReactNode;
}

export default async function UsersLayout({ children }: UsersLayoutProps) {
    const session = await getSession();

    if (!session) redirect("/login");
    if (session.role !== "admin" && session.role !== "cashier") redirect("/unauthorized");

    // Fetch full user data from /auth/me
    const res = await getMe();

    if (!res.success) redirect("/login"); // fallback
    const user = res.user;

    return (
        <div className="flex min-h-screen">
            <Sidebar user={user} />
            <main className="flex-1 p-6">{children}</main>
        </div>
    );
}
