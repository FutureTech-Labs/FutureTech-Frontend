
// Password Reset form details
export const ForgotpasswordStepContent = [
    {
        title: "Reset Password",
        description: "Enter your registered email address to receive an OTP.",
    },
    {
        title: "Verify OTP",
        description: "Enter the 6-digit OTP sent to your email.",
    },
    {
        title: "Set New Password",
        description: "Create your new password for your account.",
    },
    {
        title: "Success",
        description: "Your password has been reset successfully!"
    },
];


// Navigation links
export const adminLinks = [
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

export const cashierLinks = [
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
