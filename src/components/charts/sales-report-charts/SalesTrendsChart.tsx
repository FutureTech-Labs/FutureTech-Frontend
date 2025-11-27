"use client";

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

export default function SalesTrendsChart({ data }: { data: ISalesTrendPoint[] }) {

    // ----------------------------
    // Dummy Data
    // ----------------------------
    const dummyData: ISalesTrendPoint[] = [
        { _id: "Jan", revenue: 120000, invoices: 40 },
        { _id: "Feb", revenue: 95000, invoices: 32 },
        { _id: "Mar", revenue: 150000, invoices: 55 },
        { _id: "Apr", revenue: 170000, invoices: 62 },
        { _id: "May", revenue: 140000, invoices: 50 },
        { _id: "Jun", revenue: 180000, invoices: 68 },
    ];

    const formatted = (data && data.length > 3 ? data : dummyData).map((item) => ({
        date: item._id,
        revenue: item.revenue,
    }));

    const chartConfig: ChartConfig = {
        revenue: { label: "Revenue", color: "var(--chart-green-2)" },
    };

    return (
        <ChartCard
            title="Sales Trends"
            description="Revenue performance over time"
            centeredHeader={false}
        >
            <ChartContainer
                config={chartConfig}
                className="h-full w-full min-h-[250px] max-h-[250px]"
            >
                <AreaChart data={formatted} key={JSON.stringify(formatted)}>

                    <defs>
                        <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--chart-green-5)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="var(--chart-green-5)" stopOpacity={0.1} />
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
                        dataKey="revenue"
                        type="linear"
                        fill="url(#fillRevenue)"
                        stroke="var(--chart-green-2)"
                        strokeWidth={2}
                        isAnimationActive={true}
                        animationDuration={1200}
                        animationBegin={50}
                    />

                    <ChartLegend content={<ChartLegendContent />} />
                </AreaChart>
            </ChartContainer>
        </ChartCard>
    );
}
