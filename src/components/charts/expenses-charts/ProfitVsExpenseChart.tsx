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

import { getProfitVsExpense } from "@/services/expenseServices";
import SelectField from "@/components/forms/SelectField";

const monthName = (m: number) =>
    ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
        "Aug", "Sep", "Oct", "Nov", "Dec"][m - 1];

export default function ProfitVsExpenseChart({
    months = 12,
    refresh = 0
}: {
    months?: number;
    refresh?: number;
}) {

    const [selectedMonths, setSelectedMonths] = useState(String(months));

    const [data, setData] = useState<
        { date: string; expense: number; profit: number }[]
    >([]);

    const load = async () => {
        try {
            const res = await getProfitVsExpense(Number(selectedMonths));

            let expenseSum = 0;
            let profitSum = 0;

            const formatted = res.data.map((item) => {
                expenseSum += item.expenseTotal;
                profitSum += item.profitTotal;

                return {
                    date: `${monthName(item.month)} ${String(item.year).slice(-2)}`,
                    expense: item.expenseTotal,
                    profit: item.profitTotal,
                };
            });

            setData(formatted);
        } catch (err) {
            console.error("Error loading area chart:", err);
        }
    };

    useEffect(() => {
        load();
    }, [selectedMonths, refresh]);

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
                        minTickGap={30}
                        tick={{ fill: "#9AA6B2" }}
                    />

                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                    />

                    <Area
                        dataKey="expense"
                        type="basis"
                        fill="url(#fillExpense)"
                        stroke="var(--chart-orange-1)"
                        strokeWidth={2}
                        isAnimationActive={true}
                        animationDuration={1200}
                        animationBegin={100}
                    />

                    <Area
                        dataKey="profit"
                        type="basis"
                        fill="url(#fillProfit)"
                        stroke="var(--chart-green-2)"
                        strokeWidth={2}
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
