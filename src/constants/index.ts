import type { ComponentType, SVGProps } from "react";

import {
    Zap,
    Droplet,
    Wifi,
    Building2,
    UserCheck,
    Wrench,
    ShoppingCart,
    Truck,
    Package,
    Tags,
} from "lucide-react";

export type IconType = ComponentType<SVGProps<SVGSVGElement>>;


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

// Dummy Notification
export const dummyNotifications = [
    {
        id: 1,
        message: "New sale recorded!",
        time: "2 min ago"
    },
    {
        id: 2,
        message: "Low Stock",
        time: "10 min ago"
    },
    {
        id: 3,
        message: "Cashier John logged in.",
        time: "30 min ago"
    },
];

export const WARRANTY_PERIODS = [
    "no warranty",
    "6 months",
    "12 months",
    "24 months",
];

export const PRODUCT_STATUSES = ["active", "inactive"];


// Expense category related constants
export const EXPENSE_CATEGORIES = [
    { value: "all", label: "All Categories" },
    { value: "Electricity", label: "Electricity" },
    { value: "Water", label: "Water" },
    { value: "Internet", label: "Internet" },
    { value: "Rent", label: "Rent" },
    { value: "Salary", label: "Salary" },
    { value: "Maintenance", label: "Maintenance" },
    { value: "Purchase", label: "Purchase" },
    { value: "Transport", label: "Transport" },
    { value: "Misc", label: "Misc" },
];

export const CATEGORY_ICON_MAP: Record<
    string,
    { icon: IconType; color: string }
> = {
    Electricity: { icon: Zap, color: "text-yellow-300" },
    Marketing: { icon: Tags, color: "text-green-300" },
    Water: { icon: Droplet, color: "text-blue-300" },
    Internet: { icon: Wifi, color: "text-cyan-300" },
    Rent: { icon: Building2, color: "text-purple-300" },
    Salary: { icon: UserCheck, color: "text-green-300" },
    Maintenance: { icon: Wrench, color: "text-orange-300" },
    Purchase: { icon: ShoppingCart, color: "text-emerald-300" },
    Transport: { icon: Truck, color: "text-indigo-300" },
    Misc: { icon: Package, color: "text-gray-300" },
};

// Fallback icon
export const CATEGORY_DEFAULT_ICON = { icon: Tags, color: "text-gray-300" };