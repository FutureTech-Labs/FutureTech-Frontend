"use client";

import { useEffect, useState } from "react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    XAxis,
} from "recharts";

import ChartCard from "@/components/cards/ChartCard";

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
    ChartConfig,
} from "@/components/ui/chart";

import SelectField from "@/components/forms/SelectField";

const monthName = (m: number) =>
    ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
        "Aug", "Sep", "Oct", "Nov", "Dec"][m - 1];

interface IProfitVsExpenseItem {
    year: number;
    month: number;
    expenseTotal: number;
    profitTotal: number;
}

export default function ProfitVsExpenseChart({
    months = 12,
    data = [],
}: {
    months?: number;
    data: IProfitVsExpenseItem[];
}) {
    const [selectedMonths, setSelectedMonths] = useState(String(months));

    const [chartData, setChartData] = useState<
        { date: string; expense: number; profit: number }[]
    >([]);

    // -------------------------------
    // Dummy Fallback Data (KEPT)
    // -------------------------------
    const dummyData = [
        { date: "Jan 24", expense: 82000, profit: 120000 },
        { date: "Feb 24", expense: 75000, profit: 110000 },
        { date: "Mar 24", expense: 90000, profit: 140000 },
        { date: "Apr 24", expense: 85000, profit: 150000 },
        { date: "May 24", expense: 78000, profit: 135000 },
        { date: "Jun 24", expense: 92000, profit: 160000 },
        { date: "Jul 24", expense: 88000, profit: 155000 },
        { date: "Aug 24", expense: 83000, profit: 148000 },
        { date: "Sep 24", expense: 95000, profit: 170000 },
        { date: "Oct 24", expense: 91000, profit: 158000 },
        { date: "Nov 24", expense: 87000, profit: 152000 },
        { date: "Dec 24", expense: 99000, profit: 180000 },
    ];

    useEffect(() => {
        const limit = Number(selectedMonths);

        if (!Array.isArray(data) || data.length === 0) {
            setChartData(dummyData.slice(-limit));
            return;
        }

        const formatted = data
            .slice(-limit)
            .map(item => ({
                date: `${monthName(item.month)} ${String(item.year).slice(-2)}`,
                expense: item.expenseTotal,
                profit: item.profitTotal,
            }));

        setChartData(formatted);
    }, [data, selectedMonths]);


    const chartConfig: ChartConfig = {
        expense: { label: "Expense", color: "var(--chart-orange-2)" },
        profit: { label: "Profit", color: "var(--chart-green-2)" },
    };

    return (
        <ChartCard
            title="Profit vs Expense Overview"
            description="Monthly comparison of total expenses and profit trends"
            centeredHeader={false}
            headerRight={
                <SelectField
                    value={selectedMonths}
                    onChange={setSelectedMonths}
                    options={[
                        { value: "3", label: "Last 3 Months" },
                        { value: "6", label: "Last 6 Months" },
                        { value: "12", label: "Last 12 Months" },
                    ]}
                    className="w-[140px]"
                />
            }
        >
            <ChartContainer config={chartConfig} className="h-full w-full">
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="fillExpense" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--chart-orange-3)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="var(--chart-orange-4)" stopOpacity={0.1} />
                        </linearGradient>

                        <linearGradient id="fillProfit" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--chart-green-2)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="var(--chart-green-2)" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid vertical={false} />

                    <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        minTickGap={50}
                        tick={{ fill: "#9AA6B2" }}
                    />

                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                    />

                    <Area
                        dataKey="expense"
                        type="natural"
                        fill="url(#fillExpense)"
                        stroke="var(--chart-orange-1)"
                        strokeWidth={1}
                    />

                    <Area
                        dataKey="profit"
                        type="natural"
                        fill="url(#fillProfit)"
                        stroke="var(--chart-green-2)"
                        strokeWidth={1}
                    />

                    <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
            </ChartContainer>
        </ChartCard>
    );
}
