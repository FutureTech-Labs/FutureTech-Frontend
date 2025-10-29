'use client';

import { useEffect, useState } from "react";
import { ChevronDown, LogOut, Menu, Settings, X } from "lucide-react";
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
import {
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/services/authService";
import NotificationMenu from "./NotificationMenu";
import { dummyNotifications } from "@/constants";
import { usePathname } from "next/navigation";

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

    const pathname = usePathname();
    const currentSegment = pathname.split("/").filter(Boolean).pop();

    return (
        <header className="relative flex items-center w-full py-4 z-50 max-h-17">

            <div className={`absolute -bottom-1 max-w-dvw w-full ${isCollapsed ? "px-0" : "px-3 md:px-6"}`}>
                <Separator className="border" />
            </div>

            <div className="flex items-center justify-between w-full h-full px-3 md:px-6">
                <Sheet open={open} onOpenChange={setOpen}>
                    <div className="flex gap-4">
                        <SheetTrigger asChild>
                            <Button
                                size="icon"
                                variant="outline"
                                className="text-white mt-1"
                                onClick={handleMenuClick}
                            >
                                <Menu />
                            </Button>
                        </SheetTrigger>

                        {/* current pathname */}
                        <div className="hidden md:flex items-center mt-1">
                            <Separator orientation="vertical" className="border-secondary-100" />
                            <span className="text-white text-sm uppercase font-medium ml-4">
                                {currentSegment || "Dashboard"}
                            </span>
                        </div>
                    </div>

                    <SheetContent
                        side="left"
                        className="w-64 text-white border-0 h-full md:hidden [&>button]:hidden gap-0"
                    >
                        <SheetHeader className="shadow-sm shadow-white/10 mb-2 pb-4.5">

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

                        <div className="h-full overflow-y-auto px-3 pt-2">
                            <SidebarContent user={user} />
                        </div>

                    </SheetContent>
                </Sheet>

                <div className="flex items-center gap-6">
                    {/* Notifications */}
                    <NotificationMenu notifications={dummyNotifications} />

                    <div className="flex items-center gap-2 h-full">
                        {/* Avatar */}
                        <Avatar className="md:h-11 md:w-11 w-8 h-8">
                            {user.role === "admin" ? (
                                <AvatarImage
                                    src="/images/Avatar.jpg"
                                    alt={user.name}
                                />
                            ) : (
                                <AvatarFallback>
                                    {user.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .toUpperCase()}
                                </AvatarFallback>
                            )}
                        </Avatar>

                        {/* User info */}
                        <div className="flex flex-col">
                            <h1 className="text-xs uppercase text-gray-500 font-semibold">
                                {user.role === "admin" ? "Super" : ""} {user.role}
                            </h1>
                            <h1 className="max-md:text-xs font-normal">{user.name}</h1>
                        </div>

                        {/* Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="disable-rings text-white hover:bg-white/10 cursor-pointer"
                                >
                                    <ChevronDown className="h-5 w-5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-44 mt-2 border-2 border-white/5 rounded-xl"
                            >
                                <DropdownMenuLabel>
                                    My Account
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {user.role === "admin" && (
                                    <DropdownMenuItem onClick={() => { }}>
                                        <Settings className="mr-2 h-4 w-4" /> Settings
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={logout}>
                                    <LogOut className="mr-2 h-4 w-4" /> Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;