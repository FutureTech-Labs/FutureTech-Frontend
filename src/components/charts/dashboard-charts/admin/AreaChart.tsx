"use client";

import { useEffect, useState } from "react";
import {
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    DotProps,
} from "recharts";

import SelectField from "@/components/forms/SelectField";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartConfig,
} from "@/components/ui/chart";
import DashboardCard from "@/components/cards/DashboardCard";

// Month names
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Fallback dummy data
const fullDummyData = [
    { month: 1, date: "Jan", revenue: 190000, expense: 140000, profit: 60000 },
    { month: 2, date: "Feb", revenue: 160000, expense: 120000, profit: 50000 },
    { month: 3, date: "Mar", revenue: 180000, expense: 130000, profit: 55000 },
    { month: 4, date: "Apr", revenue: 220000, expense: 150000, profit: 70000 },
    { month: 5, date: "May", revenue: 205000, expense: 145000, profit: 65000 },
    { month: 6, date: "Jun", revenue: 230000, expense: 170000, profit: 75000 },
    { month: 7, date: "Jul", revenue: 200000, expense: 160000, profit: 60000 },
    { month: 8, date: "Aug", revenue: 185000, expense: 150000, profit: 50000 },
    { month: 9, date: "Sep", revenue: 215000, expense: 165000, profit: 68000 },
    { month: 10, date: "Oct", revenue: 195000, expense: 155000, profit: 52000 },
    { month: 11, date: "Nov", revenue: 175000, expense: 140000, profit: 45000 },
    { month: 12, date: "Dec", revenue: 210000, expense: 160000, profit: 62000 },
];


export default function AreaRevenueProfitExpenseChart({
    data,
    monthsValue,
    onMonthsChange,
}: {
    data: IAreaChartPoint[] | null;
    monthsValue: number;
    onMonthsChange: (v: number) => void;
}) {

    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        if (!data || data.length < 30) {
            setChartData(fullDummyData.slice(-monthsValue));
            return;
        }

        const formatted = data
            .map(item => ({
                date: months[item.month - 1],
                revenue: item.revenue,
                profit: item.profit,
                expense: item.expense,
                month: item.month,
            }))
            .slice(-monthsValue);

        setChartData(formatted);
    }, [data, monthsValue]);


    const chartConfig: ChartConfig = {
        revenue: { label: "Revenue", color: "var(--chart-violet-3)" },
        expense: { label: "Expenses", color: "var(--chart-orange-2)" },
        profit: { label: "Profit", color: "var(--chart-green-2)" },
    };

    const Dot = (props: DotProps) => {
        const { cx, cy, stroke } = props;
        return (
            <circle
                cx={cx}
                cy={cy}
                r={3}
                stroke={stroke}
                strokeWidth={1}
            />
        );
    };

    return (
        <DashboardCard
            title="Sales Overview"
            centeredHeader={false}
            headerRight={
                <div className="flex gap-4 items-center">
                    <HeaderLegend config={chartConfig} />

                    <SelectField
                        value={String(monthsValue)}
                        onChange={(v) => onMonthsChange(Number(v))}
                        options={[
                            { value: "12", label: "This Year" },
                            { value: "6", label: "Last 6 Months" },
                            { value: "3", label: "Last 3 Months" },
                        ]}
                        className="w-[150px]"
                    />
                </div>
            }
        >

            {/* Chart Container (Legend internally binds here) */}
            <ChartContainer config={chartConfig} className="w-full h-full">

                <AreaChart data={chartData} key={JSON.stringify(chartData)}>

                    <defs>
                        <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--chart-violet-3)" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="var(--chart-violet-3)" stopOpacity={0.05} />
                        </linearGradient>

                        <linearGradient id="expFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--chart-orange-2)" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="var(--chart-orange-2)" stopOpacity={0.05} />
                        </linearGradient>

                        <linearGradient id="proFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--chart-green-2)" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="var(--chart-green-2)" stopOpacity={0.05} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid />

                    <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={10}
                        interval={0}
                        tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 12 }}
                    />

                    <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />

                    <Area
                        type="natural"
                        dataKey="revenue"
                        stroke="var(--chart-violet-2)"
                        strokeWidth={1}
                        fill="url(#revFill)"
                        dot={<Dot />}
                    />

                    <Area
                        type="natural"
                        dataKey="expense"
                        stroke="var(--chart-orange-2)"
                        strokeWidth={1}
                        fill="url(#expFill)"
                        dot={<Dot />}
                    />

                    <Area
                        type="natural"
                        dataKey="profit"
                        stroke="var(--chart-green-2)"
                        strokeWidth={1}
                        fill="url(#proFill)"
                        dot={<Dot />}
                    />

                </AreaChart>
            </ChartContainer>
        </DashboardCard>
    );
}

const HeaderLegend = ({ config }: { config: ChartConfig }) => {
    return (
        <div className="flex items-center gap-4">
            {Object.entries(config).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                    <span
                        className="inline-block w-2 h-2 rounded-full"
                        style={{ backgroundColor: value.color }}
                    />
                    <span className="text-xs text-white/70">{value.label}</span>
                </div>
            ))}
        </div>
    );
};
