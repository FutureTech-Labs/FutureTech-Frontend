"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { usePathname } from "next/navigation";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { dashboardLinks } from "@/lib/dashboardLinks";

interface ISidebarContentProps {
    user: IUser;
    isCollapsed?: boolean;
}

const SidebarContent = ({ user, isCollapsed = false }: ISidebarContentProps) => {
    const pathname = usePathname();

    // Filter out sections that have at least one visible link for this user
    const visibleSections = dashboardLinks.filter((section) =>
        section.links.some((link) => link.roles.includes(user.role))
    );

    return (
        <div
            className={cn(
                "flex flex-col h-full transition-all duration-500 ease-in-out",
                isCollapsed ? "w-20 items-center px-2" : "w-full"
            )}
        >
            <nav className="flex-1 w-full space-y-4">
                {visibleSections.map((section, sectionIndex) => {
                    const visibleLinks = section.links.filter((link) =>
                        link.roles.includes(user.role)
                    );

                    return (
                        <div key={section.title} className="w-full">
                            {/* Section Title */}
                            {!isCollapsed && (
                                <h2 className="mb-2 text-xs uppercase text-primary-300 tracking-wider">
                                    {section.title}
                                </h2>
                            )}

                            {/* Render visible links */}
                            {visibleLinks.map((link) => {
                                const isActive = pathname === link.href;

                                const linkElement = (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={cn(
                                            "flex items-center gap-4 p-2 my-1 rounded-md transition-colors text-sm font-medium",
                                            isCollapsed && "justify-center",
                                            isActive
                                                ? "button-gradient border border-white/20 shadow-md shadow-primary-900/30"
                                                : "text-primary-100 hover:bg-white/10 hover:text-primary-300"
                                        )}
                                    >
                                        <div className="relative w-5 h-5 shrink-0">
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
                                    <Tooltip key={link.href} delayDuration={100}>
                                        <TooltipTrigger asChild>{linkElement}</TooltipTrigger>
                                        <TooltipContent
                                            side="right"
                                            className="text-sm font-medium text-foreground button-gradient border border-white/10"
                                        >
                                            {link.label}
                                        </TooltipContent>
                                    </Tooltip>
                                ) : (
                                    linkElement
                                );
                            })}

                            {sectionIndex < visibleSections.length - 1 && (
                                <Separator className="my-3 bg-primary-900" />
                            )}
                        </div>
                    );
                })}
            </nav>
        </div>
    );
};

export default SidebarContent;
