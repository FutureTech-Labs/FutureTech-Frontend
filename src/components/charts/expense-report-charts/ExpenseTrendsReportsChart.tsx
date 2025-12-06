"use client";

import { useEffect, useState } from "react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    XAxis
} from "recharts";

import ChartCard from "@/components/cards/ChartCard";

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
    ChartConfig
} from "@/components/ui/chart";

import SelectField from "@/components/forms/SelectField";

// ----------------------
// Helpers
// ----------------------
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatPeriod(period: string) {
    // Monthly: "2025-11"
    if (period.length === 7) {
        const [year, month] = period.split("-");
        return `${monthNames[Number(month) - 1]} ${year}`;
    }

    // Daily: "2025-11-27"
    if (period.length === 10) {
        const [y, m, d] = period.split("-");
        return `${monthNames[Number(m) - 1]} ${d}`;
    }

    return period;
}

// Dummy fallback
const dummyData = [
    { date: "Jan 2025", value: 120000 },
    { date: "Feb 2025", value: 95000 },
    { date: "Mar 2025", value: 150000 },
    { date: "Apr 2025", value: 170000 },
];

export default function ExpenseTrendsChart({
    trends,
    interval,
    onIntervalChange,
}: {
    trends: IExpenseTrendItem[] | IExpenseTrendItemWithBreakdown[] | null;
    interval: "day" | "month";
    onIntervalChange: (v: "day" | "month") => void;
}) {
    const [chartData, setChartData] = useState<{ date: string; value: number }[]>([]);

    useEffect(() => {
        if (!trends || trends.length < 10) {
            setChartData(dummyData);
            return;
        }

        const formatted = trends.map((item) => ({
            date: formatPeriod(item.period),
            value: item.totalAmount,
        }));

        setChartData(formatted);
    }, [trends]);

    const chartConfig: ChartConfig = {
        value: {
            label: "Total Expenses",
            color: "var(--chart-rose-2)",
        },
    };

    return (
        <ChartCard
            title="Expense Trends"
            description="Total expenses over time"
            centeredHeader={false}
            headerRight={
                <SelectField
                    value={interval}
                    onChange={(v) => onIntervalChange(v as "day" | "month")}
                    options={[
                        { value: "day", label: "Daily" },
                        { value: "month", label: "Monthly" },
                    ]}
                    className="w-[130px]"
                />
            }
        >
            <ChartContainer
                config={chartConfig}
                className="h-full w-full"
            >
                <AreaChart data={chartData} key={JSON.stringify(chartData)}>
                    <defs>
                        <linearGradient id="fillExpense" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--chart-rose-5)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="var(--chart-rose-5)" stopOpacity={0.1} />
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
                        dataKey="value"
                        type="natural"
                        fill="url(#fillExpense)"
                        stroke="var(--chart-rose-2)"
                        strokeWidth={2}
                        isAnimationActive={true}
                        animationDuration={1200}
                        animationBegin={100}
                    />

                    <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
            </ChartContainer>
        </ChartCard>
    );
}
