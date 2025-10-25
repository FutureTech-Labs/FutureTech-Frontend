"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
    const { logout } = useAuth();

    return (
        <Button
            onClick={logout}
            className="mt-4 bg-red-600 py-2 rounded hover:bg-red-700 w-[200px]"
        >
            Logout
        </Button>
    );
}
