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

interface IStockValueItem {
    productId: string;
    name: string;
    value: number;
    qtyAvailable: number;
}

export default function StockValueChart({
    data,
}: {
    data: IStockValueItem[] | null;
}) {
    // ------------------------
    // Dummy data fallback
    // ------------------------
    const dummyData: IStockValueItem[] = [
        { productId: "1", name: "Samsung A52", value: 450000, qtyAvailable: 20 },
        { productId: "2", name: "AirPods Pro", value: 320000, qtyAvailable: 15 },
        { productId: "3", name: "Redmi Note 10", value: 280000, qtyAvailable: 12 },
        { productId: "4", name: "MI Power Bank", value: 200000, qtyAvailable: 40 },
        { productId: "5", name: "Anker Charger", value: 150000, qtyAvailable: 18 },
        { productId: "6", name: "iPhone 14 Case", value: 120000, qtyAvailable: 60 },
    ];

    const source = data && data.length > 10 ? data : dummyData;

    // ------------------------
    // Top 10 by stock value
    // ------------------------
    const top10 = [...source]
        .sort((a, b) => b.value - a.value)
        .slice(0, 10)
        .map((item, index) => ({
            name: item.name,
            value: item.value,
            fill:
                index === 0 ? "var(--chart-1)" :
                    index === 1 ? "var(--chart-2)" :
                        index === 2 ? "var(--chart-3)" :
                            index === 3 ? "var(--chart-4)" :
                                "var(--chart-3)",
        }));

    const chartConfig: ChartConfig = {
        value: { label: "Stock Value", color: "var(--chart-violet-1)" },
    };

    return (
        <ChartCard
            title="Top Products by Stock Value"
            description="Highest inventory value by product"
            centeredHeader={false}
        >
            <ChartContainer
                config={chartConfig}
                className="h-full w-full min-h-[300px] max-h-[300px]"
            >
                <BarChart
                    data={top10}
                    layout="vertical"
                    key={JSON.stringify(top10)}
                >
                    <CartesianGrid horizontal={false} />

                    <XAxis
                        type="number"
                        tick={{ fill: "var(--chart-violet-1)" }}
                    />

                    <YAxis dataKey="name" type="category" hide />

                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent />}
                    />

                    <Bar
                        dataKey="value"
                        radius={[6, 6, 6, 6]}
                        isAnimationActive={true}
                        animationDuration={1200}
                        animationBegin={100}
                        animationEasing="ease-in"
                    >
                        <LabelList
                            dataKey="name"
                            position="insideLeft"
                            offset={10}
                            className="fill-white"
                            fontSize={12}
                        />

                        {top10.map((entry, index) => (
                            <Cell
                                key={`stock-value-cell-${index}`}
                                fill={entry.fill}
                            />
                        ))}

                    </Bar>

                    <ChartLegend content={<ChartLegendContent />} />
                </BarChart>
            </ChartContainer>
        </ChartCard>
    );
}
