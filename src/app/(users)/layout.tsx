import { ReactNode } from "react";
import { redirect } from "next/navigation";
import Sidebar from "@/components/common/Sidebar";
import { getLoggedInUser } from "@/services/LoggedUser";
import { SidebarProvider } from "@/context/SidebarContext";
import Header from "@/components/common/Header";

interface UsersLayoutProps {
    children: ReactNode;
}

export default async function UsersLayout({ children }: UsersLayoutProps) {
    const user = await getLoggedInUser();

    if (!user) redirect("/login");
    if (user.role !== "admin" && user.role !== "cashier") redirect("/unauthorized");

    return (
        <SidebarProvider>
            <main className="flex h-dvh overflow-clip">
                {/* Sidebar */}
                <Sidebar user={user} />

                {/* Main Content Wrapper */}
                <div className="flex flex-1 flex-col gap-2 bg-black rounded-xl">
                    {/* Header */}
                    <Header user={user} />

                    {/* Main Content */}
                    <section className="flex-1 h-full rounded-xl overflow-auto">
                        {children}
                    </section>
                </div>
            </main>
        </SidebarProvider>
    );
}
