'use client';

import Image from "next/image";
import LogoutButton from "./LogoutButton";
import SidebarContent from "./SidebarContent";
import { useSidebar } from "@/context/SidebarContext";

const Sidebar = ({ user }: ISidebarProps) => {
    const { isCollapsed } = useSidebar();

    return (
        <aside className={`relative hidden xl:flex h-dvh shadow-xl shadow-white/5 transition-all duration-300 
        ${isCollapsed ? "xl:w-20 items-center py-1.5" : "xl:w-64 px-6 py-3"}`}>

            {/* Gradients */}
            <div className="absolute top-0 left-0 w-50 h-30 gradient-01 pointer-events-none z-0" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-30 h-20 gradient-01 pointer-events-none z-0" />
            <div className="absolute bottom-0 right-0 w-44 h-40 gradient-01 pointer-events-none z-0" />

            {/* Contents */}
            <div className="flex flex-col items-center w-full h-full">

                {/* Header */}
                <div className={`flex items-center justify-center w-full ${isCollapsed ? "py-3" : "py-[9px]"} border-b-2 border-primary-900 z-10`}>

                    {isCollapsed ? (
                        <div className="w-10 h-10">
                            <Image
                                src={"/images/FutureTechLogo.png"}
                                alt="Logo"
                                width={100}
                                height={100}
                                priority
                                className="object-cover w-full h-full z-10"
                            />
                        </div>
                    ) :
                        <div className="w-48">
                            <Image
                                src={"/images/LogoFull.png"}
                                alt="Logo"
                                width={500}
                                height={500}
                                quality={75}
                                priority
                                className="object-cover w-full h-full select-none z-10"
                            />
                        </div>
                    }
                </div>

                {/* center content */}
                <div className="flex-1 w-full overflow-y-auto scrollbar-hide py-4 z-10">
                    <SidebarContent user={user} isCollapsed={isCollapsed} />
                </div>

                {/* Footer */}
                <div className={`w-full z-10 border-t border-primary-900 ${isCollapsed ? "px-2" : ""}`}>
                    <LogoutButton />
                </div>

            </div>
        </aside>
    );
}

export default Sidebar;