"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    LabelList,
    Cell
} from "recharts";

import SelectField from "@/components/forms/SelectField";
import DashboardCard from "@/components/cards/DashboardCard";

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
    ChartConfig
} from "@/components/ui/chart";

export default function TopSellingChart({
    data,
    monthsValue,
    onMonthsChange
}: {
    data: ITopSellingProduct[] | null;
    monthsValue: number;
    onMonthsChange: (v: number) => void;
}) {

    const dummyData: ITopSellingProduct[] = [
        { productId: "1", name: "Kingston Data Traveller", qtySold: 120, revenue: 450000, profit: 90000 },
        { productId: "2", name: "Samsung A52", qtySold: 90, revenue: 320000, profit: 65000 },
        { productId: "3", name: "AirPods Pro", qtySold: 70, revenue: 140000, profit: 40000 },
        { productId: "4", name: "Oppo F19", qtySold: 60, revenue: 180000, profit: 30000 },
        { productId: "5", name: "MI Power Bank", qtySold: 55, revenue: 40000, profit: 8000 },
    ];

    // Dummy data filter based on selected months
    const dummyFiltered = (() => {
        if (monthsValue === 1) return dummyData.slice(0, 1);
        if (monthsValue === 3) return dummyData.slice(0, 3);
        if (monthsValue === 6) return dummyData;
        return dummyData;
    })();

    // Use backend or dummy
    const source = (data && data.length >= 3 ? data : dummyFiltered);

    const top5 = [...source]
        .sort((a, b) => b.qtySold - a.qtySold)
        .slice(0, 5)
        .map((item, index) => ({
            name: item.name,
            qty: Number(item.qtySold),
            gradientId: `grad-${index}`,
        }));

    const chartConfig: ChartConfig = {
        qty: { label: "Quantity Sold", color: "var(--chart-violet-1)" },
    };

    return (
        <DashboardCard
            title="Top Selling Products"
            centeredHeader={false}
            headerRight={
                <SelectField
                    value={String(monthsValue)}
                    onChange={(v) => onMonthsChange(Number(v))}
                    options={[
                        { value: "1", label: "This Month" },
                        { value: "3", label: "Last 3 Months" },
                        { value: "6", label: "Last 6 Months" }
                    ]}
                    className="w-[150px]"
                />
            }
        >
            <ChartContainer
                config={chartConfig}
                className="h-full w-full max-h-[350px]"
            >
                <BarChart
                    data={top5}
                    layout="vertical"
                    key={JSON.stringify(top5)}
                    barSize={22}
                    margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="grad-0" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="100%" stopColor="rgba(0, 200, 140, 0.45)" />
                        </linearGradient>

                        <linearGradient id="grad-1" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="100%" stopColor="rgba(130, 100, 255, 0.45)" />
                        </linearGradient>

                        <linearGradient id="grad-2" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="100%" stopColor="rgba(255, 180, 90, 0.45)" />
                        </linearGradient>

                        <linearGradient id="grad-3" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="100%" stopColor="rgba(90, 160, 255, 0.45)" />
                        </linearGradient>

                        <linearGradient id="grad-4" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="100%" stopColor="rgba(0, 180, 255, 0.45)" />
                        </linearGradient>
                    </defs>

                    <CartesianGrid horizontal />

                    <XAxis
                        type="number"
                        tick={{ fill: "var(--chart-violet-1)", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                    />

                    <YAxis dataKey="name" type="category" hide />

                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

                    <Bar dataKey="qty" radius={[16, 16, 16, 16]}>
                        <LabelList
                            dataKey="name"
                            position="insideLeft"
                            offset={10}
                            className="fill-white"
                            fontSize={12}
                        />

                        {top5.map((bar, index) => (
                            <Cell key={index} fill={`url(#${bar.gradientId})`} />
                        ))}
                    </Bar>

                    <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                </BarChart>
            </ChartContainer>
        </DashboardCard>
    );
}
