"use client";

import { useState, useEffect, JSX } from "react";

import {
    getAreaChart,
    getTopSellingProducts,
    getDailyProfitExpense,
    getRecentExpenses,
    getInventoryOverview
} from "@/services/adminDashboardServices";

import { AlertTriangle, Boxes, LucideBubbles, Tags, Zap } from "lucide-react";
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

    if (loading) return <div className="p-6">Loading dashboard…</div>;

    return (
        <div className="max-h-screen h-dvh">
            <div
                className="grid gap-6 h-screen grid-cols-1 grid-rows-[repeat(5,1fr)] xl:grid-cols-[3fr_3fr_3fr_2fr_2fr] xl:grid-rows-2">
                {/* AREA CHART */}
                <div className="xl:col-span-3">
                    <AreaRevenueProfitExpenseChart
                        data={areaChart}
                        monthsValue={months}
                        onMonthsChange={setMonths}
                    />
                </div>

                {/* TOP SELLING PRODUCTS CHART */}
                <div className="xl:col-span-3 xl:row-start-2">
                    <TopSellingChart
                        data={topProducts}
                        monthsValue={topMonths}
                        onMonthsChange={setTopMonths}
                    />
                </div>

                <div className="flex flex-col gap-6 xl:col-span-2 xl:col-start-4 h-full">

                    {/* Profit Vs Expense chart */}
                    <ProfitExpenseRadial />

                    {/* Inventory overview */}
                    <div className="h-full flex flex-col gap-4 justify-between rounded-xl border-2 border-gradient border-primary-900/40 table-bg-gradient shadow-lg shadow-primary-900/15 p-5">

                        <h1 className="text-lg text-gradient">Inventory Overview</h1>


                        {/* Total Products in Stock */}
                        <div
                            className="flex items-center gap-4 rounded-xl p-3 border border-white/20 h-full"
                            style={{
                                background:
                                    "linear-gradient(79.74deg, rgba(166, 255, 0, 0.12) 0%, rgba(0, 0, 0, 0.12) 100%)",
                            }}
                        >
                            {/* Icon */}
                            <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-lime-500/10 border border-white/10">
                                <Boxes className="w-6 h-6 text-lime-400" />
                            </div>

                            {/* Text */}
                            <div className="flex flex-col gap-1">
                                <p className="text-xs text-white/60">Total Products in Stock</p>
                                <p className="text-2xl font-bold text-white leading-none">
                                    {inventoryOverview?.totalProducts ?? 0}
                                    <span className="ml-1 text-sm font-normal text-white/50">
                                        ITEMS
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Low Stock Alert */}
                        <div
                            className="flex items-center gap-4 rounded-xl p-3 border border-white/20 h-full"
                            style={{
                                background:
                                    "linear-gradient(79.74deg, rgba(255, 0, 0, 0.12) 0%, rgba(0, 0, 0, 0.12) 100%)",
                            }}
                        >
                            {/* Icon */}
                            <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-rose-500/10 border border-white/10">
                                <AlertTriangle className="w-6 h-6 text-rose-300" />
                            </div>

                            {/* Text */}
                            <div className="flex flex-col gap-1">
                                <p className="text-xs text-white/60">Low Stock Alert</p>
                                <p className="text-2xl font-bold text-white leading-none">
                                    {inventoryOverview?.lowStockCount ?? 0}
                                    <span className="ml-1 text-sm font-normal text-white/50">
                                        PRODUCTS
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>


                    {/* Recent Expenses */}
                    <div className="flex flex-col h-full rounded-xl border-2 border-gradient border-primary-900/40 table-bg-gradient shadow-lg shadow-primary-900/15 p-5">

                        <h1 className="text-lg text-gradient mb-2">Recent Expenses</h1>

                        <div className="flex flex-col gap-4">

                            {recentExpenses?.map((item, i) => {
                                // Icon per category
                                const iconMap: Record<string, JSX.Element> = {
                                    Electricity: <Zap className="w-4 h-4 text-yellow-300" />,
                                    Marketing: <Tags className="w-4 h-4 text-green-300" />,
                                    Water: <LucideBubbles className="w-4 h-4 text-blue-300" />,
                                };

                                const icon = iconMap[item.category] ?? (
                                    <Tags className="w-4 h-4 text-gray-300" />
                                );

                                return (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            {/* Icon bubble */}
                                            <div className="h-8 w-8 rounded-md bg-white/10 flex items-center justify-center">
                                                {icon}
                                            </div>

                                            <span className="text-white/80 text-sm">{item.category}</span>
                                        </div>

                                        {/* Amount */}
                                        <span className="text-white font-semibold text-sm">
                                            Rs. {item.amount.toFixed(2)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
