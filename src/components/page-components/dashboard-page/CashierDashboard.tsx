"use client";

import { useEffect, useState } from "react";
import { DollarSign, BarChart3, Receipt, Gauge } from "lucide-react";

import {
    getCashierSalesSummary,
    getCashierSalesChart,
    getCashierRecentInvoices
} from "@/services/cashierDashboardServices";


import { formatCurrencyLKR, formatDateTime } from "@/lib/utils";

import StatCard from "@/components/cards/StatCard";
import CashierRevenueAreaChart from "@/components/charts/dashboard-charts/cashier/RevenueChart";
import DataTable from "@/components/common/Table";
import PaginationSlider from "@/components/sliders/PaginationSlider";

const CashierDashboard = () => {
    const [loading, setLoading] = useState(true);

    const [todayRevenue, setTodayRevenue] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalInvoices, setTotalInvoices] = useState(0);
    const [avgRevenue, setAvgRevenue] = useState(0);

    // Chart state
    const [monthsValue, setMonthsValue] = useState(6);
    const [chartData, setChartData] = useState<ICashierSalesChartPoint[]>([]);
    const [chartLoading, setChartLoading] = useState(true);

    // Recent invoices
    const [recentInvoices, setRecentInvoices] = useState<ICashierRecentInvoice[]>([]);
    const [recentLoading, setRecentLoading] = useState(true);

    // ---------------------------
    // LOAD SUMMARY + TODAY
    // ---------------------------
    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);

                const summaryRes = await getCashierSalesSummary();
                const summary = summaryRes.data;

                setTotalRevenue(summary.totalRevenue || 0);
                setTotalInvoices(summary.invoices || 0);

                const todayRes = await getCashierSalesChart({ days: 1 });
                const todayData = todayRes.data;

                const amount =
                    todayData.length > 0 ? todayData[0].revenue : 0;

                setTodayRevenue(amount);

                if (summary.invoices > 0) {
                    setAvgRevenue(summary.totalRevenue / summary.invoices);
                }

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    // ---------------------------
    // LOAD CHART DATA
    // ---------------------------
    useEffect(() => {
        const loadChart = async () => {
            try {
                setChartLoading(true);

                let days = monthsValue === 3 ? 90 : monthsValue === 6 ? 180 : 30;

                const res = await getCashierSalesChart({ days });
                setChartData(res.data || []);

            } catch (err) {
                console.error(err);
            } finally {
                setChartLoading(false);
            }
        };

        loadChart();
    }, [monthsValue]);

    // ---------------------------
    // LOAD RECENT INVOICES
    // ---------------------------
    useEffect(() => {
        const loadRecent = async () => {
            try {
                setRecentLoading(true);

                const res = await getCashierRecentInvoices();
                setRecentInvoices(res.data || []);

            } catch (err) {
                console.error("Failed fetching recent invoices", err);
            } finally {
                setRecentLoading(false);
            }
        };

        loadRecent();
    }, []);

    // ---------------------------
    // Recent invoices columns (FULLY TYPED)
    // ---------------------------
    const recentColumns = [
        {
            key: "invoiceNumber",
            label: "Invoice Number",
            render: (row: ICashierRecentInvoice) => row.invoiceNumber,
        },
        {
            key: "customer",
            label: "Customer Name",
            render: (row: ICashierRecentInvoice) => row.customer?.name ?? "—",
        },
        {
            key: "total",
            label: "Total Amount",
            render: (row: ICashierRecentInvoice) => formatCurrencyLKR(row.total),
        },
        {
            key: "paymentMethod",
            label: "Payment Method",
            render: (row: ICashierRecentInvoice) => row.paymentMethod ?? "—",
        },
        {
            key: "createdAt",
            label: "Date",
            render: (row: ICashierRecentInvoice) => formatDateTime(row.createdAt),
        },
    ];

    // ---------------------------
    // KPI CARDS
    // ---------------------------
    const statCards = [
        <StatCard
            key="today-revenue"
            title="Today's Revenue"
            value={formatCurrencyLKR(todayRevenue)}
            icon={<DollarSign className="w-5 h-5 text-blue-400" />}
            iconBg="bg-blue-500/10"
            gradient="linear-gradient(79.74deg, rgba(0,128,255,0.15) 0%, rgba(0,0,0,0.12) 100%)"
        />,

        <StatCard
            key="total-revenue"
            title="Total Revenue"
            value={formatCurrencyLKR(totalRevenue)}
            icon={<BarChart3 className="w-5 h-5 text-green-400" />}
            iconBg="bg-green-500/10"
            gradient="linear-gradient(79.74deg, rgba(0,255,132,0.15) 0%, rgba(0,0,0,0.12) 100%)"
        />,

        <StatCard
            key="total-invoices"
            title="Total Invoices"
            value={totalInvoices}
            icon={<Receipt className="w-5 h-5 text-yellow-400" />}
            iconBg="bg-yellow-500/10"
            gradient="linear-gradient(79.74deg, rgba(255,200,0,0.15) 0%, rgba(0,0,0,0.12) 100%)"
        />,

        <StatCard
            key="avg-revenue"
            title="Avg Revenue / Invoice"
            value={formatCurrencyLKR(avgRevenue)}
            icon={<Gauge className="w-5 h-5 text-purple-400" />}
            iconBg="bg-purple-500/10"
            gradient="linear-gradient(79.74deg, rgba(180,0,255,0.15) 0%, rgba(0,0,0,0.12) 100%)"
        />,
    ];

    return (
        <div className="flex flex-col gap-3 md:gap-6">

            {/* KPI */}
            <div className="hidden lg:grid grid-cols-1 lg:grid-cols-4 gap-6 w-full">
                {statCards}
            </div>

            {/* Mobile Slider */}
            <PaginationSlider>{statCards}</PaginationSlider>

            {/* CHART */}
            <div className="w-full rounded-2xl bg-black-500 border border-white/10">
                <CashierRevenueAreaChart
                    data={chartData}
                    monthsValue={monthsValue}
                    onMonthsChange={setMonthsValue}
                    loading={chartLoading}
                />
            </div>

            {/* RECENT INVOICES TABLE */}
            <div className="p-5 rounded-xl border-2 border-gradient border-primary-900/40 
                table-bg-gradient shadow-lg shadow-primary-900/15"
            >
                <h2 className="text-lg font-semibold mb-4">Recent Sales</h2>

                <DataTable
                    columns={recentColumns}
                    data={recentInvoices}
                    loading={recentLoading}
                />
            </div>

        </div>
    );
};

export default CashierDashboard;
