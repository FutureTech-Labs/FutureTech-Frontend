"use client";

import {
    useEffect,
    useState
} from "react";

import {
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    DotProps,
} from "recharts";

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartConfig,
} from "@/components/ui/chart";

import { formatDateTime } from "@/lib/utils";

import SelectField from "@/components/forms/SelectField";
import DashboardCard from "@/components/cards/DashboardCard";


// Dummy fallback data for cashier revenue chart
const fullDummyData = [
    { month: 1, date: "Jan", revenue: 12000 },
    { month: 2, date: "Feb", revenue: 15000 },
    { month: 3, date: "Mar", revenue: 17000 },
    { month: 4, date: "Apr", revenue: 21000 },
    { month: 5, date: "May", revenue: 25000 },
    { month: 6, date: "Jun", revenue: 23000 },
    { month: 7, date: "Jul", revenue: 26000 },
    { month: 8, date: "Aug", revenue: 24000 },
    { month: 9, date: "Sep", revenue: 28000 },
    { month: 10, date: "Oct", revenue: 30000 },
    { month: 11, date: "Nov", revenue: 27000 },
    { month: 12, date: "Dec", revenue: 32000 },
];

export default function CashierRevenueAreaChart({
    data,
    monthsValue,
    onMonthsChange,
    loading,
}: {
    data: { date: string; revenue: number }[] | null | undefined;
    monthsValue: number;
    onMonthsChange: (v: number) => void;
    loading?: boolean;
}) {

    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        if (!data || data.length < 3) {
            setChartData(
                fullDummyData
                    .slice(-monthsValue)
                    .map(item => ({
                        date: item.date,
                        revenue: item.revenue,
                    }))
            );
            return;
        }

        const formatted = data
            .map(item => ({
                date: formatDateTime(item.date),
                revenue: item.revenue,
            }))
            .slice(-monthsValue);

        setChartData(formatted);
    }, [data, monthsValue]);



    const chartConfig: ChartConfig = {
        revenue: { label: "Revenue", color: "var(--chart-cyan-3)" },
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
            title="Revenue Overview"
            centeredHeader={false}
            headerRight={
                <div className="flex gap-4 items-center">

                    <HeaderLegend config={chartConfig} />

                    <SelectField
                        value={String(monthsValue)}
                        onChange={(v) => onMonthsChange(Number(v))}
                        options={[
                            { value: "1", label: "This Month" },
                            { value: "3", label: "Last 3 Months" },
                            { value: "6", label: "Last 6 Months" },
                        ]}
                        className="hidden sm:flex w-[150px]"
                    />
                </div>
            }
        >

            {/* Chart Container */}
            <ChartContainer
                config={chartConfig}
                className="w-full h-full max-h-[350px]"
            >

                {loading ? (
                    <div className="text-gray-400 flex items-center justify-center h-full">
                        Loading chart...
                    </div>
                ) : (
                    <AreaChart data={chartData} key={JSON.stringify(chartData)}>

                        {/* GRADIENT FILL */}
                        <defs>
                            <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--chart-cyan-3)" stopOpacity={0.25} />
                                <stop offset="95%" stopColor="var(--chart-cyan-3)" stopOpacity={0.05} />
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
                            stroke="var(--chart-cyan-2)"
                            strokeWidth={1}
                            fill="url(#revFill)"
                            dot={<Dot />}
                        />

                    </AreaChart>
                )}

            </ChartContainer>
        </DashboardCard>
    );
}


// LEGEND COMPONENT (UNCHANGED FROM YOUR PATTERN)
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
