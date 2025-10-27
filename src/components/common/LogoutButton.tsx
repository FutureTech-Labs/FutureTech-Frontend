"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const LogoutButton = () => {
    const { logout } = useAuth();

    return (
        <Button
            onClick={logout}
            className="bg-red-600 py-2 rounded hover:bg-red-700 w-full"
        >
            Logout
        </Button>
    );
}

export default LogoutButton;
