import { ReactNode } from "react";
import { redirect } from "next/navigation";
import Sidebar from "@/components/common/Sidebar";
import { getLoggedInUser } from "@/services/LoggedUser";

interface UsersLayoutProps {
    children: ReactNode;
}

export default async function UsersLayout({ children }: UsersLayoutProps) {
    const user = await getLoggedInUser();

    if (!user) redirect("/login");
    if (user.role !== "admin" && user.role !== "cashier") redirect("/unauthorized");

    return (
        <div className="flex min-h-screen">
            <Sidebar user={user} />
            <main className="flex-1 p-6">{children}</main>
        </div>
    );
}
