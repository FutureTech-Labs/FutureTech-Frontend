"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { usePathname } from "next/navigation";
import { adminLinks, cashierLinks } from "@/constants";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ISidebarContentProps {
    user: IUser;
    isCollapsed?: boolean;
}

const SidebarContent = ({ user, isCollapsed = false }: ISidebarContentProps) => {
    const pathname = usePathname();
    const roleLinks = user.role === "admin" ? adminLinks : cashierLinks;

    return (
        <div className={cn("flex flex-col h-full transition-all duration-300", isCollapsed ? "w-20 items-center px-2" : "w-full")}>

            <nav className="flex-1 w-full space-y-4">
                {roleLinks.map((section, index) => (
                    <div key={section.title} className="w-full">
                        {!isCollapsed && (
                            <h2 className="mb-2 text-xs uppercase text-primary-300">
                                {section.title}
                            </h2>
                        )}

                        {section.links.map((link) => {
                            const isActive = pathname === link.href;

                            const Links = (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "flex items-center gap-4 p-2 my-1 rounded-md transition-colors text-md text-primary-100",
                                        isCollapsed ? "justify-center" : "",
                                        isActive
                                            ? "button-gradient border border-t-2 border-white/20 shadow-xl shadow-primary-900/30"
                                            : "hover:bg-white/10 hover:text-primary-300"
                                    )}
                                >
                                    <div className="w-5 h-5 relative">
                                        <Image
                                            src={link.icon}
                                            alt={link.label}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    {!isCollapsed && <span>{link.label}</span>}
                                </Link>
                            );

                            return isCollapsed ? (
                                <Tooltip key={link.href}>
                                    <TooltipTrigger asChild>{Links}</TooltipTrigger>
                                    <TooltipContent
                                        side="right"
                                        className="text-sm font-medium text-foreground button-gradient border border-white/10">
                                        {link.label}
                                    </TooltipContent>
                                </Tooltip>
                            ) : (
                                Links
                            );
                        })}

                        {index < roleLinks.length - 1 && (
                            <Separator className="my-3 bg-primary-900" />
                        )}
                    </div>
                ))}
            </nav>
        </div>
    );
};

export default SidebarContent;
