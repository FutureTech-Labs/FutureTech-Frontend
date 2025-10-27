'use client';

import Image from "next/image";
import LogoutButton from "./LogoutButton";
import SidebarContent from "./SidebarContent";
import { useSidebar } from "@/context/SidebarContext";

interface SidebarProps {
    user: IUser;
}

const Sidebar = ({ user }: SidebarProps) => {
    const { isCollapsed } = useSidebar();

    return (
        <aside className={`hidden md:flex h-dvh shadow-2xl shadow-white/5 transition-all duration-300 
        ${isCollapsed ? "md:w-20 items-center py-1.5 border-r" : "md:w-64 px-6 py-3"}`}>

            <div className="flex flex-col items-center w-full h-full">

                {/* Header / Logo */}
                <div className="flex items-center justify-center py-2 border-b-2 w-full">

                    {isCollapsed ? (
                        <div className="w-12 h-12">
                            <Image
                                src={"/images/FutureTechLogo.png"}
                                alt="Logo"
                                width={100}
                                height={100}
                                priority
                                className="object-cover w-full h-full"
                            />
                        </div>
                    ) :
                        <div className="w-50">
                            <Image
                                src={"/images/LogoFull.png"}
                                alt="Logo"
                                width={100}
                                height={100}
                                priority
                                className="object-cover w-full h-full"
                            />
                        </div>
                    }
                </div>

                {/* Scrollable center content */}
                <div className="flex-1 w-full overflow-y-auto scrollbar-hide py-4">
                    <SidebarContent user={user} isCollapsed={isCollapsed} />
                </div>

                {/* Footer */}
                <div className="w-full">
                    <LogoutButton />
                </div>

            </div>
        </aside>
    );
}

export default Sidebar;