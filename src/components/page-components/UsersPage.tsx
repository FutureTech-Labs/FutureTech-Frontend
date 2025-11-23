"use client";

import {
    useEffect,
    useState
} from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

import UserForm from "../forms/UserForm";
import SelectField from "../forms/SelectField";
import SearchField from "../forms/SearchField";

import DataTable from "../common/Table";
import DialogBox from "../common/DialogBox";
import IconButton from "../common/IconButton";
import { StatusBadge } from "../common/StatusBadge";
import ViewUserDrawer from "../common/ViewUserDrawer";
import ExportPDFButton from "../common/ExportPdfButton";
import { TooltipWrapper } from "../common/TooltipWrapper";

import StatCard from "../cards/StatCard";
import PaginationSlider from "../sliders/PaginationSlider";

import {
    AlertCircle,
    CircleCheckBig,
    CircleDot,
    LogIn,
    UserRoundPlus
} from "lucide-react";

import { formatDateTime, toSentenceCase } from "@/lib/utils";
import { getCashierHistory, getUserStats, listCashiers, setCashierStatus } from "@/services/userServices";

const UsersPage = () => {
    // All users shown in the table
    const [users, setUsers] = useState<ICashier[]>([]);

    // Search + status filter
    const [searchUsers, setSearchUsers] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");

    // Loading state
    const [loading, setLoading] = useState(true);

    // User currently selected for edit or view
    const [selectedUser, setSelectedUser] = useState<ICashier | null>(null);

    // View user drawer open/close + history list
    const [viewOpen, setViewOpen] = useState(false);
    const [userHistory, setUserHistory] = useState<ICashierHistoryEntry[]>([]);


    // Pagination controls
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    // Add/Edit user dialog open/close
    const [addDialogOpen, setAddDialogOpen] = useState(false);

    // Top summary cards (total, active, online, etc.)
    const [stats, setStats] = useState<IUserStats>({
        total: 0,
        active: 0,
        inactive: 0,
        online: 0,
        todayLogins: 0,
    });

    // Load users from backend with search & filters applied
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await listCashiers(page);
            if (response.success) {
                let filtered = [...response.data];

                // Search filter
                if (searchUsers.trim().length > 0) {
                    const q = searchUsers.toLowerCase();
                    filtered = filtered.filter(u =>
                        u.name.toLowerCase().includes(q) ||
                        u.email.toLowerCase().includes(q)
                    );
                }

                // Status filter
                if (selectedStatus !== "all") {
                    filtered = filtered.filter(u => u.status === selectedStatus);
                }

                setUsers(filtered);
                setTotal(response.total);

                // totalPages = total / limit
                setTotalPages(Math.ceil(response.total / 10));
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoading(false);
        }
    };

    // Re-fetch when filters or page changes
    useEffect(() => {
        fetchUsers();
        fetchStats();
    }, [page, searchUsers, selectedStatus]);

    // Load summary statistics for dashboard cards
    const fetchStats = async () => {
        try {
            const res = await getUserStats();
            if (res.success) {
                setStats(res.stats);
            }
        } catch (err) {
            console.error("Failed to load user stats:", err);
        }
    };

    // Enable/Disable user and refresh table + stats
    const handleStatusToggle = async (user: ICashier) => {
        try {
            const newStatus = user.status === "active" ? "inactive" : "active";

            const res = await setCashierStatus(user.id, newStatus);

            toast.success(res.message);

            await Promise.all([fetchUsers(), fetchStats()]);

        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update user status");
        }
    };

    // Open user drawer + fetch login history
    const handleViewUser = async (user: ICashier) => {
        setSelectedUser(user);

        try {
            const res = await getCashierHistory(user.id);
            if (res.success) {
                setUserHistory(res.user.loginHistory);
            }
        } catch {
            toast.error("Failed to load history");
        }

        setViewOpen(true);
    };

    // Controls add/edit dialog + resets selected user
    const handleDialogToggle = (open: boolean) => {
        setAddDialogOpen(open);
        if (!open) {
            setSelectedUser(null);
        }
    };

    // Start add-user flow
    const handleAddUser = () => {
        setSelectedUser(null);
        setAddDialogOpen(true);
    };

    // Start edit-user flow
    const handleEditUser = (user: ICashier) => {
        setSelectedUser(user);
        setAddDialogOpen(true);
    };

    // Table Columns
    const UserColumns = [
        {
            key: "name",
            label: "Name",
            render: (c: ICashier) => (
                <div className="max-w-60 truncate">{c.name || "—"}</div>
            ),
        },
        {
            key: "email",
            label: "Email",
            render: (c: ICashier) => (
                <div className="max-w-60 truncate">{c.email}</div>
            ),
        },
        {
            key: "role",
            label: "Role",
            render: (c: ICashier) => toSentenceCase(c.role),
        },
        {
            key: "status",
            label: "Status",
            render: (c: ICashier) => (
                <StatusBadge
                    text={c.status === "active" ? "Active" : "Inactive"}
                    color={c.status === "active" ? "teal" : "red"}
                    icon={
                        c.status === "active" ? (
                            <CircleCheckBig className="w-3 h-3" />
                        ) : (
                            <AlertCircle className="w-3 h-3" />
                        )
                    }
                />
            ),
        },
        {
            key: "activity",
            label: "Recent Activity",
            render: (c: ICashier) => (
                <div className="text-xs leading-4">
                    <div className="text-gray-300">
                        Login:{" "}
                        <span className="font-medium text-white">
                            {formatDateTime(c.lastLogin)}
                        </span>
                    </div>
                    <div className="text-gray-300">
                        Logout:{" "}
                        <span className="font-medium text-white">
                            {formatDateTime(c.lastLogout)}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            render: (c: ICashier) => (
                <div className="flex gap-2">
                    <TooltipWrapper content="View User">
                        <IconButton
                            iconSrc="/icons/Eye.svg"
                            ariaLabel="View"
                            onClick={() => handleViewUser(c)}
                        />
                    </TooltipWrapper>

                    <TooltipWrapper content="Edit User">
                        <IconButton
                            iconSrc="/icons/Edit.svg"
                            ariaLabel="Edit"
                            onClick={() => handleEditUser(c)}
                        />
                    </TooltipWrapper>

                    <TooltipWrapper
                        content={c.status === "active" ? "Deactivate User" : "Activate User"}
                    >
                        <IconButton
                            iconSrc={c.status === "active" ? "/icons/Minus.svg" : "/icons/UserCheck.svg"}
                            ariaLabel={c.status === "active" ? "Deactivate" : "Activate"}
                            onClick={() => handleStatusToggle(c)}
                        />
                    </TooltipWrapper>

                </div>
            ),
        }
    ];

    // Stat Cards
    const userStatCards = [
        <StatCard
            key="total-users"
            title="Total Cashiers"
            value={stats.total}
            icon={<UserRoundPlus className="w-5 h-5 text-blue-400" />}
            iconBg="bg-blue-500/10"
            gradient="linear-gradient(79.74deg, rgba(0, 128, 255, 0.15) 0%, rgba(0, 0, 0, 0.12) 100%)"
        />,
        <StatCard
            key="active-users"
            title="Active Users"
            value={stats.active}
            icon={<CircleCheckBig className="w-5 h-5 text-green-400" />}
            iconBg="bg-green-500/10"
            gradient="linear-gradient(79.74deg, rgba(0, 255, 132, 0.15) 0%, rgba(0, 0, 0, 0.12) 100%)"
        />,
        <StatCard
            key="inactive-users"
            title="Inactive Users"
            value={stats.inactive}
            icon={<AlertCircle className="w-5 h-5 text-red-400" />}
            iconBg="bg-red-500/10"
            gradient="linear-gradient(79.74deg, rgba(255, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.12) 100%)"
        />,
        <StatCard
            key="loggedin-users"
            title="Logged In Now"
            value={stats.online}
            icon={<CircleDot className="w-5 h-5 text-lime-400" />}
            iconBg="bg-lime-500/10"
            gradient="linear-gradient(79.74deg, rgba(180, 255, 0, 0.15) 0%, rgba(0, 0, 0, 0.12) 100%)"
        />,
        <StatCard
            key="today-logins"
            title="Logins Today"
            value={stats.todayLogins}
            icon={<LogIn className="w-5 h-5 text-orange-400" />}
            iconBg="bg-orange-500/10"
            gradient="linear-gradient(79.74deg, rgba(255, 165, 0, 0.15) 0%, rgba(0, 0, 0, 0.12) 100%)"
        />,
    ];


    return (
        <div className="relative flex flex-col gap-6">

            <div className="hidden lg:grid grid-cols-1 lg:grid-cols-5 gap-6 w-full">
                {userStatCards}
            </div>

            {/* Mobile Slider */}
            <PaginationSlider>{userStatCards}</PaginationSlider>


            {/* Table */}
            <div className="flex flex-col gap-6 p-5 rounded-xl border-2 border-gradient border-primary-900/40 table-bg-gradient shadow-lg 
            shadow-primary-900/15">
                <div className="flex md:flex-row flex-col gap-5 items-center justify-between w-full">

                    {/* Search filter */}
                    <SearchField
                        placeholder="Search by name or email..."
                        value={searchUsers}
                        onChange={setSearchUsers}
                        onClear={() => setSearchUsers("")}
                        className="md:max-w-md"
                    />

                    <div className="flex md:flex-row flex-col gap-5 w-full justify-end">
                        <SelectField
                            placeholder="Search by status"
                            value={selectedStatus}
                            onChange={setSelectedStatus}
                            options={[
                                { value: "all", label: "All Users" },
                                { value: "active", label: "Active" },
                                { value: "inactive", label: "Inactive" },
                            ]}
                            width="md:w-[150px]"
                            className="bg-black-500! border border-white/50 focus:ring-1! focus:ring-primary-800! text-xs md:text-sm"
                        />

                        {/* Export button */}
                        <ExportPDFButton
                            title="Users Report"
                            fileName="users.pdf"
                            columns={[
                                { key: "id", header: "ID" },
                                { key: "name", header: "Name" },
                                { key: "email", header: "Email" },
                                { key: "role", header: "Role" },
                                { key: "status", header: "Status" },
                            ]}
                            data={users}
                            className="hidden md:flex"
                        />

                        <Button
                            onClick={handleAddUser}
                            className="main-button-gradient border-none!"
                        >
                            Add New User
                            <UserRoundPlus />
                        </Button>

                    </div>
                </div>

                {/* Users Table */}
                <DataTable
                    columns={UserColumns}
                    data={users}
                    loading={loading}
                    pagination={{
                        page,
                        totalPages,
                        total,
                        onPageChange: (newPage) => setPage(newPage),
                    }}
                />
            </div>

            {/* User Form */}
            <DialogBox
                open={addDialogOpen}
                onOpenChange={handleDialogToggle}
                title={selectedUser ? "Edit User" : "Add New User"}
                description={
                    selectedUser
                        ? "Update the user's details below."
                        : "Add a new cashier to your system."
                }
                widthClass="max-w-xl!"
            >
                <UserForm
                    user={selectedUser}
                    onSuccess={() => {
                        handleDialogToggle(false);
                        fetchUsers();
                    }}
                    onCancel={() => handleDialogToggle(false)}
                />
            </DialogBox>

            {/* View User History */}
            <ViewUserDrawer
                open={viewOpen}
                onOpenChange={setViewOpen}
                user={selectedUser}
                history={userHistory}
            />
        </div>
    );
};

export default UsersPage;
