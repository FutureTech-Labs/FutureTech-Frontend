"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";

import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent
} from "@/components/ui/accordion";

import { formatDateTime, parseUserAgent } from "@/lib/utils";

import {
    CircleCheckBig,
    AlertCircle,
    LogIn,
    LogOut,
    Monitor,
    Smartphone
} from "lucide-react";


// Duration Helper
const getDuration = (loginAt: string, logoutAt: string | null) => {
    if (!logoutAt) return "Active session";

    const start = new Date(loginAt).getTime();
    const end = new Date(logoutAt).getTime();
    let diff = Math.floor((end - start) / 1000);

    const hours = Math.floor(diff / 3600);
    diff %= 3600;
    const minutes = Math.floor(diff / 60);

    if (hours <= 0 && minutes <= 0) return "<1 min";
    if (hours <= 0) return `${minutes} min`;
    return `${hours}h ${minutes}m`;
};


// Device → Icon Helper
const getDeviceIcon = (ua: string) => {
    ua = ua.toLowerCase();

    if (ua.includes("iphone") || ua.includes("android") || ua.includes("mobile"))
        return <Smartphone size={14} className="text-primary-200" />;

    return <Monitor size={14} className="text-primary-200" />;
};

// Group history by DATE ONLY
const groupByDate = (history: ICashierHistoryEntry[]) => {
    const groups: Record<string, ICashierHistoryEntry[]> = {};

    history.forEach((entry) => {
        // group using SL date-only format
        const date = formatDateTime(entry.loginAt, { hideTime: true });

        if (!groups[date]) groups[date] = [];
        groups[date].push(entry);
    });

    return groups;
};

// Extract time only (HH:MM AM/PM)
const formatTimeOnly = (date?: string | null) => {
    if (!date) return "—";
    return new Date(date).toLocaleTimeString("en-US", {
        timeZone: "Asia/Colombo",
        hour: "2-digit",
        minute: "2-digit",
    });
};


// MAIN COMPONENT
const ViewUserDrawer = ({
    open,
    onOpenChange,
    user,
    history
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: ICashier | null;
    history: ICashierHistoryEntry[];
}) => {

    if (!user) return null;

    const groupedHistory = groupByDate(history);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                className="w-full sm:w-[500px] border-l border-gray-800 p-6 shadow-xl"
            >
                <SheetHeader className="p-0">
                    <SheetTitle className="text-xl font-semibold tracking-wide">
                        {user.name}
                    </SheetTitle>
                    <SheetDescription className="text-primary-100">
                        Full profile & login activity overview.
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-6 overflow-y-auto pr-3 space-y-8 max-h-[90vh]">

                    {/* BASIC INFO */}
                    <div className="bg-black-500 sales-card-border-gradient rounded-xl p-4 space-y-3">
                        <h3 className="text-sm text-primary-100 font-medium uppercase tracking-widest">
                            Basic Information
                        </h3>

                        <div className="space-y-2 text-sm">
                            <InfoRow label="Email" value={user.email} />
                            <InfoRow label="Role" value={user.role} />
                            <InfoRow
                                label="Status"
                                value={
                                    <span
                                        className={`flex items-center gap-1 ${user.status === "active"
                                            ? "text-green-400"
                                            : "text-red-400"
                                            }`}
                                    >
                                        {user.status === "active"
                                            ? <CircleCheckBig size={14} />
                                            : <AlertCircle size={14} />}
                                        {user.status === "active" ? "Active" : "Inactive"}
                                    </span>
                                }
                            />
                        </div>
                    </div>

                    {/* RECENT ACTIVITY */}
                    <div className="bg-black-500 rounded-xl p-4 space-y-3 sales-card-border-gradient">
                        <h3 className="text-sm text-primary-100 font-medium uppercase tracking-widest">
                            Recent Activity
                        </h3>

                        <div className="space-y-2 text-sm">
                            <InfoRow label="Last Login" value={formatDateTime(user.lastLogin)} />
                            <InfoRow label="Last Logout" value={formatDateTime(user.lastLogout)} />
                        </div>
                    </div>

                    {/* LOGIN HISTORY (Grouped by Date) */}
                    <div className="bg-black-500 rounded-xl p-4 space-y-3 sales-card-border-gradient">
                        <h3 className="text-sm text-primary-100 font-medium uppercase tracking-widest">
                            Login History
                        </h3>

                        <div className="max-h-80 overflow-y-auto pr-1">

                            {history.length === 0 ? (
                                <p className="text-xs text-gray-400">No login activity found.</p>
                            ) : (
                                <Accordion type="multiple" className="w-full space-y-4">

                                    {Object.entries(groupedHistory).map(([date, entries]) => (
                                        <AccordionItem
                                            key={date}
                                            value={date}
                                            className="border border-gray-800 bg-black-700/30 rounded-xl px-4"
                                        >
                                            <AccordionTrigger className="text-primary-200 text-xs tracking-wide">
                                                {date} ({entries.length} {entries.length === 1 ? "session" : "sessions"})
                                            </AccordionTrigger>

                                            <AccordionContent>
                                                <div className="space-y-4 mt-3">

                                                    {entries.map((entry, i) => (
                                                        <div
                                                            key={i}
                                                            className="bg-black-700/40 border border-gray-800 p-3 rounded-lg text-sm space-y-2"
                                                        >
                                                            {/* LOGIN */}
                                                            <div className="flex items-center gap-2 text-primary-100">
                                                                <LogIn size={15} />
                                                                <span>{formatTimeOnly(entry.loginAt)}</span>
                                                            </div>

                                                            {/* LOGOUT */}
                                                            <div className="flex items-center gap-2 text-red-300">
                                                                <LogOut size={15} />
                                                                <span>{formatTimeOnly(entry.logoutAt)}</span>
                                                            </div>

                                                            {/* SESSION DURATION */}
                                                            <div className="text-xs text-gray-300">
                                                                Duration:{" "}
                                                                <span className="text-white">
                                                                    {getDuration(entry.loginAt, entry.logoutAt)}
                                                                </span>
                                                            </div>

                                                            {/* DEVICE */}
                                                            <div className="flex items-center gap-2 text-gray-200 text-sm">
                                                                {getDeviceIcon(entry.userAgent)}
                                                                <span>{parseUserAgent(entry.userAgent)}</span>
                                                            </div>

                                                            {/* IP */}
                                                            <div className="text-xs text-gray-300">
                                                                IP: {entry.ip}
                                                            </div>
                                                        </div>
                                                    ))}

                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}

                                </Accordion>
                            )}
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default ViewUserDrawer;


// INFO ROW COMPONENT
const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div className="flex justify-between items-start">
        <span className="text-primary-300 text-xs uppercase tracking-wider">{label}</span>
        <span className="text-white text-sm text-right ml-3">{value}</span>
    </div>
);
