'use client';

import { Home, Users, Settings, FileText } from "lucide-react";

interface SidebarContentProps {
    user: IUser;
    isCollapsed?: boolean;
}

const links = [
    { label: "Dashboard", icon: Home, href: "/dashboard" },
    { label: "Users", icon: Users, href: "/users" },
    { label: "Settings", icon: Settings, href: "/settings" },
    { label: "Reports", icon: FileText, href: "/reports" },
];

const SidebarContent = ({ user, isCollapsed = false }: SidebarContentProps) => {
    return (
        <div className={`flex flex-col h-full transition-all duration-300 ${isCollapsed ? "w-20 items-center" : "w-64"}`}>

            {/* Links */}
            <nav className="flex-1">
                {links.map((link) => {
                    const Icon = link.icon;
                    return (
                        <a
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 p-2 my-1 rounded-md hover:bg-white/10 transition-colors ${isCollapsed ? "justify-center" : ""
                                }`}
                        >
                            <Icon size={20} />
                            {!isCollapsed && <span>{link.label}</span>}
                        </a>
                    );
                })}
            </nav>

            {/* User Info */}
            {!isCollapsed && (
                <div className="text-sm text-gray-400">
                    <p>Logged in as: {user.role}</p>
                    <p>{user.name}</p>
                    <p>{user.email}</p>
                </div>
            )}
        </div>
    );
}

export default SidebarContent;