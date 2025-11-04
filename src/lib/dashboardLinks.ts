export const dashboardLinks = [
    {
        title: "Navigation",
        links: [
            {
                label: "Overview",
                href: "/dashboard",
                icon: "/icons/Dashboard.svg",
                roles: ["admin", "cashier"]
            },
            {
                label: "Inventory",
                href: "/dashboard/inventory",
                icon: "/icons/Inventory.svg",
                roles: ["admin", "cashier"]
            },
            {
                label: "Stocks",
                href: "/dashboard/stocks",
                icon: "/icons/Stocks.svg",
                roles: ["admin", "cashier"]
            },
        ],
    },
    {
        title: "Finance",
        links: [
            {
                label: "Sales",
                href: "/dashboard/sales",
                icon: "/icons/Sales.svg",
                roles: ["admin", "cashier"]
            },
            {
                label: "Invoices",
                href: "/dashboard/invoices",
                icon: "/icons/Invoices.svg",
                roles: ["admin", "cashier"]
            },
            {
                label: "Returns",
                href: "/dashboard/returns",
                icon: "/icons/Returns.svg",
                roles: ["cashier", "admin"]
            },
            {
                label: "Reports",
                href: "/dashboard/reports",
                icon: "/icons/Reports.svg",
                roles: ["admin"]
            },
            {
                label: "Expenses",
                href: "/dashboard/expenses",
                icon: "/icons/Expenses.svg",
                roles: ["admin"]
            },
        ],
    },
    {
        title: "Support",
        links: [
            {
                label: "Users",
                href: "/dashboard/users",
                icon: "/icons/Users.svg",
                roles: ["admin"]
            },
            {
                label: "Settings",
                href: "/dashboard/settings",
                icon: "/icons/Settings.svg",
                roles: ["admin"]
            },
        ],
    },
];
