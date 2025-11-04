import { ReactNode } from "react";
import Header from "@/components/common/Header";
import Sidebar from "@/components/common/Sidebar";
import { getLoggedInUser } from "@/services/LoggedUser";
import { SidebarProvider } from "@/context/SidebarContext";

interface DashboardLayoutProps {
    children: ReactNode;
}

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
    const user = await getLoggedInUser();

    return (
        <SidebarProvider>
            <main className="flex h-dvh overflow-clip">
                {/* Sidebar */}
                <Sidebar user={user} />

                {/* Main Content Wrapper */}
                <div className="flex flex-1 flex-col rounded-xl">
                    {/* Header */}
                    <Header user={user} />

                    {/* Main Content */}
                    <section className="flex-1 h-full rounded-xl overflow-auto p-3 md:p-6">
                        {children}
                    </section>
                </div>
            </main>
        </SidebarProvider>
    );
}

export default DashboardLayout;
