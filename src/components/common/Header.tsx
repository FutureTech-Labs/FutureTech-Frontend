'use client';

import { useSidebar } from "@/context/SidebarContext";
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import SidebarContent from "./SidebarContent";
import { Menu } from "lucide-react";

interface HeaderProps {
    user: IUser;
}

export default function Header({ user }: HeaderProps) {
    const { toggleSidebar } = useSidebar();

    return (
        <header className="flex items-center w-full p-4 shadow-sm bg-background z-50 rounded-xl">
            <div className="flex items-center justify-between w-full">

                {/* MOBILE: Sheet from LEFT */}
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <button className="flex items-center gap-2 text-white bg-gray-700 p-2 rounded-md">
                                <Menu size={20} />
                                Menu
                            </button>
                        </SheetTrigger>

                        <SheetContent
                            side="left"
                            className="w-64 p-0 bg-gray-900 text-white border-0 h-full"
                        >
                            {/* REQUIRED: Accessible Title */}
                            <SheetHeader className="sr-only">
                                <SheetTitle>Mobile Navigation Menu</SheetTitle>
                            </SheetHeader>

                            {/* Full Sidebar Content */}
                            <div className="h-full overflow-y-auto">
                                <SidebarContent user={user} />
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>

                {/* DESKTOP: Toggle Sidebar */}
                <button
                    onClick={toggleSidebar}
                    className="hidden md:block text-white bg-gray-700 p-2 rounded-md"
                    aria-label="Toggle Sidebar"
                >
                    Toggle
                </button>

            </div>
        </header>
    );
}