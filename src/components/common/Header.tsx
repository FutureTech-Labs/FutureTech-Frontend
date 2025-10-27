'use client';

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetClose,
    SheetDescription
} from "@/components/ui/sheet";
import { Separator } from "../ui/separator";
import SidebarContent from "./SidebarContent";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/context/SidebarContext";

interface HeaderProps {
    user: IUser;
}

const Header = ({ user }: HeaderProps) => {
    const { toggleSidebar, isCollapsed } = useSidebar();
    const [isMobile, setIsMobile] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (!mobile) setOpen(false);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleMenuClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!isMobile) {
            e.preventDefault();
            toggleSidebar();
        }
    };

    return (
        <header className="relative flex items-center w-full py-4 z-50">

            <div className={`absolute -bottom-1 max-w-dvw w-full ${isCollapsed ? "px-0" : "px-3"}`}>
                <Separator className="border" />
            </div>

            <div className="flex items-center justify-between w-full px-3">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button
                            size="icon"
                            variant="outline"
                            className="text-white"
                            onClick={handleMenuClick}
                        >
                            <Menu size={20} />
                        </Button>
                    </SheetTrigger>

                    <SheetContent
                        side="left"
                        className="w-64 text-white border-0 h-full md:hidden [&>button]:hidden gap-0"
                    >
                        <SheetHeader className="shadow-sm shadow-white/5">

                            <SheetClose asChild>
                                <Button
                                    size="icon-sm"
                                    variant="outline"
                                    className="absolute right-3 top-4.5 bg-gray-700 text-white hover:bg-white/10 "
                                    aria-label="Close Menu"
                                >
                                    <X />
                                </Button>
                            </SheetClose>

                            <SheetTitle asChild>
                                <Image
                                    src="/images/LogoFull.png"
                                    alt="Logo"
                                    width={170}
                                    height={50}
                                    priority

                                />
                            </SheetTitle>
                            <SheetDescription className="sr-only"></SheetDescription>
                        </SheetHeader>

                        <div className="h-full overflow-y-auto">
                            <SidebarContent user={user} />
                        </div>

                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}

export default Header;