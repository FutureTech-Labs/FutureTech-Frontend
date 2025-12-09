"use client";

import {
    useState,
    useEffect
} from "react";

import { useRouter } from "next/navigation";

import {
    getAreaChart,
    getTopSellingProducts,
    getDailyProfitExpense,
    getRecentExpenses,
    getInventoryOverview
} from "@/services/adminDashboardServices";

import {
    CATEGORY_ICON_MAP,
    CATEGORY_DEFAULT_ICON
} from "@/constants";

import { formatCurrencyLKR } from "@/lib/utils";

import {
    AlertTriangle,
    Boxes,
    CirclePlus
} from "lucide-react";

import { Button } from "@/components/ui/button";
import TopSellingChart from "@/components/charts/dashboard-charts/admin/TopSellingChart";
import AreaRevenueProfitExpenseChart from "@/components/charts/dashboard-charts/admin/AreaChart";
import ProfitExpenseRadial from "@/components/charts/dashboard-charts/admin/ProfitExpenseChart";

const AdminDashboard = () => {

    // CHART FILTER STATES
    const [months, setMonths] = useState(12);
    const [topMonths, setTopMonths] = useState(6);

    // 1. Area Chart
    const [areaChart, setAreaChart] = useState<IAreaChartPoint[] | null>(null);

    // 2. Top Selling Products
    const [topProducts, setTopProducts] = useState<ITopSellingProduct[] | null>(null);

    // 3. Profit vs Expense
    const [profitVsExpense, setProfitVsExpense] = useState<IDailyProfitExpensePoint[] | null>(null);

    // 4. Recent Expenses
    const [recentExpenses, setRecentExpenses] = useState<IRecentExpenseItem[] | null>(null);

    // 5. Inventory Overview
    const [inventoryOverview, setInventoryOverview] = useState<IInventoryOverviewResponse["data"] | null>(null);

    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const [
                    areaRes,
                    topProdRes,
                    dailyPE,
                    recentExpRes,
                    invOverview,
                ] = await Promise.all([
                    getAreaChart({ months }),
                    getTopSellingProducts({ months: topMonths }),
                    getDailyProfitExpense(),
                    getRecentExpenses(),
                    getInventoryOverview(),
                ]);

                if (areaRes.success) setAreaChart(areaRes.data);
                if (topProdRes.success) setTopProducts(topProdRes.data);
                if (dailyPE.success) setProfitVsExpense(dailyPE.data);
                if (recentExpRes.success) setRecentExpenses(recentExpRes.data);
                if (invOverview.success) setInventoryOverview(invOverview.data);

            } catch (error) {
                console.error("Dashboard load error:", error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, [months]);

    const handleAddExpense = () => {
        router.push("/dashboard/expenses");
    };

    if (loading) return <div>Loading dashboard…</div>;

    return (
        <div className="max-h-screen h-screen">
            <div
                className="grid gap-3 md:gap-6 h-full grid-cols-1 grid-rows-[repeat(5,1fr)] xl:grid-cols-[3fr_3fr_3fr_2fr_2fr] xl:grid-rows-2"
            >
                {/* 1. AREA CHART  */}
                <div className="xl:col-span-3 h-full">
                    <AreaRevenueProfitExpenseChart
                        data={areaChart}
                        monthsValue={months}
                        onMonthsChange={setMonths}
                    />
                </div>

                {/* 2. TOP SELLING PRODUCTS CHART*/}
                <div className="xl:col-span-3 xl:row-start-2 h-full">
                    <TopSellingChart
                        data={topProducts}
                        monthsValue={topMonths}
                        onMonthsChange={setTopMonths}
                    />
                </div>

                {/* 3. RIGHT COLUMN CONTAINER */}
                <div className="flex flex-col gap-3 md:gap-6 xl:col-span-2 xl:col-start-4 xl:row-span-2 h-full max-md:pb-3 max-xl:pb-6">

                    {/* Profit Vs Expense chart */}
                    <div>
                        <ProfitExpenseRadial />
                    </div>

                    {/* Inventory overview */}
                    <div className="flex-1 flex flex-col gap-3 justify-center dashboard-card-border-gradient table-bg-gradient table-bg-gradient shadow-lg shadow-primary-900/15 p-5">

                        <h1 className="text-lg font-semibold text-gradient">Inventory Overview</h1>

                        {/* Total Products in Stock */}
                        <div
                            className="flex items-center gap-4 rounded-lg p-3 border border-primary/15 flex-1"
                            style={{
                                background:
                                    "linear-gradient(79.74deg, rgba(166, 255, 0, 0.12) 0%, rgba(0, 0, 0, 0.12) 100%)",
                            }}
                        >
                            <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-lime-500/10 border border-white/10">
                                <Boxes className="w-6 h-6 text-lime-400" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-xs text-white/70">Total products in stock</p>
                                <p className="text-2xl font-bold text-white leading-none">
                                    {inventoryOverview?.totalProducts ?? 0}
                                    <span className="ml-1 text-sm font-normal text-gradient"> ITEMS </span>
                                </p>
                            </div>
                        </div>

                        {/* Low Stock Alert */}
                        <div
                            className="flex items-center gap-4 rounded-lg p-3 border border-primary/15 flex-1"
                            style={{
                                background: "linear-gradient(79.74deg, rgba(255, 0, 0, 0.12) 0%, rgba(0, 0, 0, 0.12) 100%)",
                            }}
                        >
                            <div className="h-12 w-12 flex items-center justify-center rounded-md bg-rose-500/10 border border-white/10">
                                <AlertTriangle className="w-6 h-6 text-rose-300" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-xs text-white/70">Low stock alert</p>
                                <p className="text-2xl font-bold text-white leading-none">
                                    {inventoryOverview?.lowStockCount ?? 0}
                                    <span className="ml-1 text-sm font-normal text-gradient"> PRODUCTS </span>
                                </p>
                            </div>
                        </div>
                    </div>


                    {/* Recent Expenses */}
                    <div className="flex-1 flex flex-col gap-2 dashboard-card-border-gradient table-bg-gradient shadow-lg shadow-primary-900/15 p-5 min-h-0">

                        {/* Header */}
                        <h1 className="text-lg font-semibold text-gradient shrink-0">Recent Expenses</h1>

                        <div className="flex-1 flex flex-col gap-4 overflow-y-auto h-full justify-between">
                            {recentExpenses?.map((item, i) => {
                                const { icon: Icon, color } = CATEGORY_ICON_MAP[item.category] ?? CATEGORY_DEFAULT_ICON;

                                return (
                                    <div key={i} className="flex items-center justify-between shrink-0">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-md bg-white/10 flex items-center justify-center">
                                                <Icon className={`w-4 h-4 ${color}`} />
                                            </div>
                                            <span className="text-white/80 text-sm">{item.category}</span>
                                        </div>
                                        <span className="text-white font-semibold text-sm">
                                            {formatCurrencyLKR(item.amount)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Footer Button */}
                        <div className="shrink-0 pt-2">
                            <Button className="flex items-center main-button-gradient w-full" onClick={handleAddExpense}>
                                Add Expense
                                <CirclePlus />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
