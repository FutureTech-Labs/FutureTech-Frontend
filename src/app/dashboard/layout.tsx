import { ReactNode } from "react";
import Sidebar from "@/components/common/Sidebar";
import { getLoggedInUser } from "@/services/LoggedUser";
import { SidebarProvider } from "@/context/SidebarContext";
import ClientHeader from "@/components/common/ClientHeader";
import SocketMount from "@/components/common/SocketMount";

interface DashboardLayoutProps {
    children: ReactNode;
}

const DashboardLayout = async ({ children }: DashboardLayoutProps) => {
    const user = await getLoggedInUser();

    return (
        <SidebarProvider>

            <SocketMount userId={user._id} />

            <main className="flex h-dvh w-full overflow-hidden">
                {/* Sidebar */}
                <Sidebar user={user} />

                {/* Main Content Wrapper */}
                <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
                    {/* Header */}
                    <ClientHeader user={user} />

                    {/* Main Content */}
                    <section className="relative flex-1 overflow-auto rounded-xl p-3 md:p-6">
                        <div className="absolute top-1/2 left-1/2 lg:translate-x-20 -translate-y-1/2 w-30 h-30 gradient-01 pointer-events-none z-0" />
                        {children}
                    </section>
                </div>
            </main>
        </SidebarProvider>
    );
};

export default DashboardLayout;
