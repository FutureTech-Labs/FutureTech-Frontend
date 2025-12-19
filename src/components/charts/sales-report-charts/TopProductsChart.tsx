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

import ChartCard from "@/components/cards/ChartCard";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
    ChartConfig
} from "@/components/ui/chart";

export default function TopProductsChart({ data }: { data: ITopProductItem[] }) {

    const dummyData: ITopProductItem[] = [
        { _id: "1", productName: "Kingston Data Traveller", qtySold: 120, revenue: 450000 },
        { _id: "2", productName: "Samsung A52", qtySold: 90, revenue: 220000 },
        { _id: "3", productName: "AirPods Pro", qtySold: 70, revenue: 140000 },
        { _id: "4", productName: "Oppo F19", qtySold: 60, revenue: 180000 },
        { _id: "5", productName: "MI Power Bank", qtySold: 55, revenue: 40000 },
    ];

    const source = (data && data.length > 10 ? data : dummyData);

    const top5 = [...source]
        .sort((a, b) => b.qtySold - a.qtySold)
        .slice(0, 5)
        .map((item, index) => ({
            name: item.productName,
            qty: item.qtySold,
            // Assign gradient colors per rank
            fill:
                index === 0 ? "var(--chart-1)" :
                    index === 1 ? "var(--chart-2)" :
                        index === 2 ? "var(--chart-3)" :
                            index === 3 ? "var(--chart-4)" :
                                "var(--chart-3)",
        }));

    const chartConfig: ChartConfig = {
        qty: { label: "Quantity Sold", color: "var(--chart-violet-1)" },
    };

    return (
        <ChartCard
            title="Top Selling Products"
            description="Products ranked by quantity sold"
            centeredHeader={false}
        >
            <ChartContainer config={chartConfig} className="h-full w-full min-h-[250px] max-h-[250px]">

                <BarChart
                    data={top5}
                    layout="vertical"
                    key={JSON.stringify(top5)}
                >
                    <CartesianGrid horizontal={false} />

                    <XAxis type="number" tick={{ fill: "var(--chart-violet-1)" }} />

                    <YAxis dataKey="name" type="category" hide />

                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

                    <Bar
                        dataKey="qty"
                        radius={[6, 6, 6, 6]}
                        isAnimationActive={true}
                        animationDuration={1200}
                        animationBegin={100}
                        animationEasing="ease-in"
                    >
                        {/* product labels inside the bar */}
                        <LabelList
                            dataKey="name"
                            position="insideLeft"
                            offset={10}
                            className="fill-white"
                            fontSize={12}
                        />

                        {
                            top5.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))
                        }
                    </Bar>

                    <ChartLegend content={<ChartLegendContent />} />

                </BarChart>
            </ChartContainer>
        </ChartCard>
    );
}
