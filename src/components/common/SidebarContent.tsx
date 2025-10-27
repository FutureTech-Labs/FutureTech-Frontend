'use client';

import LogoutButton from "./LogoutButton";

interface SidebarContentProps {
    user: IUser;
    isCollapsed?: boolean;
}

export default function SidebarContent({ user, isCollapsed = false }: SidebarContentProps) {
    return (
        <div className={`flex flex-col justify-between h-full p-4 transition-all duration-300 ${isCollapsed ? "w-20 items-center" : "w-64"}`}>
            <div className={isCollapsed ? "text-center" : ""}>
                <h2 className="text-xl font-bold mb-6">FutureTech</h2>

                {!isCollapsed && (
                    <>
                        <p className="text-sm mb-2">Logged in as: {user.role}</p>
                        <p className="text-sm mb-2">{user.name}</p>
                        <p className="text-sm mb-2">{user.email}</p>
                    </>
                )}

                {/* Role-based buttons */}
                {user.role === "admin" && (
                    <button className="mt-2 w-full bg-blue-600 py-2 rounded hover:bg-blue-700 text-white">
                        Admin Panel
                    </button>
                )}
                {user.role === "cashier" && (
                    <button className="mt-2 w-full bg-green-600 py-2 rounded hover:bg-green-700 text-white">
                        Cashier Dashboard
                    </button>
                )}
            </div>

            <LogoutButton />
        </div>
    );
}