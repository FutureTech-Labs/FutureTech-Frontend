"use client";

import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/context/SidebarContext";

const LogoutButton = () => {
    const { logout } = useAuth();
    const { isCollapsed } = useSidebar();

    const handleLogout = () => {
        logout();
    };

    return (
        <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn(
                "flex items-center justify-start gap-3 p-2 my-1 rounded-md transition-colors w-full text-primary-100 hover:bg-white/10 hover:text-primary-200 cursor-pointer",
                isCollapsed && "justify-center"
            )}
        >
            <LogOut size={18} />
            {!isCollapsed && <span>Logout Account</span>}
        </Button>
    );
};

export default LogoutButton;