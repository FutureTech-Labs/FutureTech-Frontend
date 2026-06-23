"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/context/SidebarContext";
import DialogBox from "@/components/common/DialogBox";

const LogoutButton = () => {
    const { logout } = useAuth();
    const { isCollapsed } = useSidebar();

    const handleLogout = () => {
        logout();
    };

    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

    return (
        <>
            <Button
                variant="ghost"
                onClick={() => setLogoutDialogOpen(true)}
                className={cn(
                    "flex items-center justify-start gap-3 p-2 my-1 rounded-md transition-colors w-full text-primary-100 hover:bg-white/10 hover:text-primary-200 cursor-pointer",
                    isCollapsed && "justify-center"
                )}
            >
                <LogOut size={18} />
                {!isCollapsed && <span>Logout Account</span>}
            </Button>

            <DialogBox
                open={logoutDialogOpen}
                onOpenChange={setLogoutDialogOpen}
                title="Logout Account"
                centerTitle
                showFooter
                confirmText="Logout"
                cancelText="Cancel"
                variant="danger"
                onConfirm={handleLogout}
                onCancel={() => setLogoutDialogOpen(false)}
                widthClass="max-w-md!"
            >
                <div className="text-center text-sm text-gray-400 mt-2 whitespace-pre-line">
                    Are you sure you want to logout from your account?
                </div>
            </DialogBox>
        </>
    );
};

export default LogoutButton;