"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Separator } from "../ui/separator";

interface ISidebarContentProps {
    user: IUser;
    isCollapsed?: boolean;
}

const adminLinks = [
    {
        title: "Navigation",
        links: [
            { label: "Overview", icon: "/icons/Dashboard.svg", href: "/admin/dashboard" },
            { label: "Inventory", icon: "/icons/Inventory.svg", href: "/admin/inventory" },
            { label: "Stocks", icon: "/icons/Stocks.svg", href: "/admin/stocks" },
        ],
    },
    {
        title: "Finance",
        links: [
            { label: "Sales", icon: "/icons/Sales.svg", href: "/admin/sales" },
            { label: "Invoices", icon: "/icons/Invoices.svg", href: "/admin/invoices" },
            { label: "Returns", icon: "/icons/Returns.svg", href: "/admin/returns" },
            { label: "Reports", icon: "/icons/Reports.svg", href: "/admin/reports" },
            { label: "Expenses", icon: "/icons/Expenses.svg", href: "/admin/expenses" },
        ],
    },
    {
        title: "Support",
        links: [
            { label: "Users", icon: "/icons/Users.svg", href: "/admin/users" },
            { label: "Settings", icon: "/icons/Settings.svg", href: "/admin/settings" },
        ],
    },
];

const cashierLinks = [
    {
        title: "Navigation",
        links: [
            { label: "Overview", icon: "/icons/Dashboard.svg", href: "/cashier/dashboard" },
            { label: "Stocks", icon: "/icons/Stocks.svg", href: "/cashier/stocks" },
        ],
    },
    {
        title: "Finance",
        links: [
            { label: "Sales", icon: "/icons/Sales.svg", href: "/cashier/sales" },
            { label: "Invoices", icon: "/icons/Invoices.svg", href: "/cashier/invoices" },
            { label: "Returns", icon: "/icons/Returns.svg", href: "/cashier/returns" },
        ],
    },
];

const SidebarContent = ({ user, isCollapsed = false }: ISidebarContentProps) => {
    const pathname = usePathname();
    const roleLinks = user.role === "admin" ? adminLinks : cashierLinks;

    return (
        <div
            className={cn(
                "flex flex-col h-full transition-all duration-300",
                isCollapsed ? "w-20 items-center px-2" : "w-full"
            )}
        >
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

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "flex items-center gap-4 p-2 my-1 rounded-md transition-colors text-md text-primary-100",
                                        isCollapsed ? "justify-center" : "",
                                        isActive
                                            ? "bg-white/20"
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
                        })}

                        {index < roleLinks.length - 1 && (
                            <Separator className="my-3 bg-primary-900 border" />
                        )}
                    </div>
                ))}
            </nav>
        </div>
    );
};

export default SidebarContent;
