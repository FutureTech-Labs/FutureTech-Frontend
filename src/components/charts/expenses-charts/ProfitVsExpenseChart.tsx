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

export default function ProfitVsExpenseChart({
    months = 12,
    refresh = 0,
    expenses = []
}: {
    months?: number;
    refresh?: number;
    expenses: IExpense[];
}) {

    const [selectedMonths, setSelectedMonths] = useState(String(months));

    const [data, setData] = useState<
        { date: string; expense: number; profit: number }[]
    >([]);

    // -------------------------------
    // Dummy Fallback Data
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

    const load = async () => {
        try {
            const limit = Number(selectedMonths);

            // If no expenses → dummy fallback (only last X months)
            if (!expenses || expenses.length === 0) {
                setData(dummyData.slice(-limit));
                return;
            }

            // ---- 1. Build last X months list ----
            const now = new Date();
            const monthsList: { year: number; month: number }[] = [];

            for (let i = limit - 1; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                monthsList.push({
                    year: d.getFullYear(),
                    month: d.getMonth() + 1,
                });
            }

            // ---- 2. Group expenses by month ----
            const map = new Map<
                string,
                { date: string; expense: number; profit: number }
            >();

            expenses.forEach(exp => {
                const d = new Date(exp.date);
                const year = d.getFullYear();
                const month = d.getMonth() + 1;
                const key = `${year}-${month}`;

                if (!map.has(key)) {
                    map.set(key, {
                        date: `${monthName(month)} ${String(year).slice(-2)}`,
                        expense: 0,
                        profit: 0
                    });
                }

                const entry = map.get(key)!;
                entry.expense += exp.amount;
            });

            // ---- 3. Fill missing months with 0 ----
            const finalData = monthsList.map(({ year, month }) => {
                const key = `${year}-${month}`;
                return (
                    map.get(key) ?? {
                        date: `${monthName(month)} ${String(year).slice(-2)}`,
                        expense: 0,
                        profit: 0
                    }
                );
            });

            setData(finalData);

        } catch (error) {
            console.error(error);
            setData(dummyData.slice(-Number(selectedMonths)));
        }
    };



    useEffect(() => {
        load();
    }, [selectedMonths, refresh, expenses]);

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
                    onChange={(v) => setSelectedMonths(v)}
                    options={[
                        { value: "3", label: "Last 3 Months" },
                        { value: "6", label: "Last 6 Months" },
                        { value: "12", label: "Last 12 Months" },
                    ]}
                    className="w-[140px]"
                />
            }
        >
            <ChartContainer
                config={chartConfig}
                className="h-full w-full"
            >
                <AreaChart
                    data={data}
                    key={JSON.stringify(data)}
                >
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
                        isAnimationActive={true}
                        animationDuration={1200}
                        animationBegin={100}
                    />

                    <Area
                        dataKey="profit"
                        type="natural"
                        fill="url(#fillProfit)"
                        stroke="var(--chart-green-2)"
                        strokeWidth={1}
                        isAnimationActive={true}
                        animationDuration={1200}
                        animationBegin={150}
                    />

                    <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
            </ChartContainer>

        </ChartCard>
    );
}
