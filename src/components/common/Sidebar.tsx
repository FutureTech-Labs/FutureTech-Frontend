'use client';

import { useSidebar } from "@/context/SidebarContext";
import SidebarContent from "./SidebarContent";

interface SidebarProps {
    user: IUser;
}

export default function Sidebar({ user }: SidebarProps) {
    const { isCollapsed } = useSidebar();

    return (
        <aside className={`hidden md:flex h-screen bg-gray-900 text-white ${isCollapsed ? "md:w-20" : "md:w-64"} transition-all duration-300
    `}>
            <SidebarContent user={user} isCollapsed={isCollapsed} />
        </aside>
    );
}