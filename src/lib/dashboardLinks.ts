export const dashboardLinks = [
    {
        title: "Main",
        links: [
            {
                label: "Overview",
                href: "/dashboard",
                icon: "/icons/Dashboard.svg",
                roles: ["admin", "cashier"]
            },
        ],
    },
    {
        title: "Inventory",
        links: [
            {
                label: "Products",
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
            {
                label: "Suppliers",
                href: "/dashboard/suppliers",
                icon: "/icons/DeliveryTruck.svg",
                roles: ["admin"]
            },
        ],
    },
    {
        title: "Finance & Sales",
        links: [
            {
                label: "Sales Records",
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
                roles: ["admin", "cashier"]
            },
            {
                label: "Financial Reports",
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
        title: "Administration",
        links: [
            {
                label: "User Management",
                href: "/dashboard/users",
                icon: "/icons/Users.svg",
                roles: ["admin"]
            },
            {
                label: "System Settings",
                href: "/dashboard/settings",
                icon: "/icons/Settings.svg",
                roles: ["admin"]
            },
        ],
    },
];
