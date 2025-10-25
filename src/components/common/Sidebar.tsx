import LogoutButton from "./LogoutButton";

interface SidebarProps {
    user: {
        id: string;
        name: string;
        email: string;
        role: "admin" | "cashier";
    };
}

export default function Sidebar({ user }: SidebarProps) {
    return (
        <aside className="w-64 bg-gray-900 text-white p-4 flex flex-col justify-between">
            <div>
                <h2 className="text-xl font-bold mb-6">FutureTech</h2>
                <p className="text-sm mb-2">Logged in as: {user.role}</p>
                <p className="text-sm mb-2">{user.name}</p>
                <p className="text-sm mb-2">{user.email}</p>

                {/* Admin-only element */}
                {user.role === "admin" && (
                    <button className="mt-2 w-full bg-blue-600 py-2 rounded hover:bg-blue-700">
                        Admin Panel
                    </button>
                )}

                {/* Cashier-only element */}
                {user.role === "cashier" && (
                    <button className="mt-2 w-full bg-green-600 py-2 rounded hover:bg-green-700">
                        Cashier Dashboard
                    </button>
                )}
            </div>

            <LogoutButton />
        </aside>
    );
}

