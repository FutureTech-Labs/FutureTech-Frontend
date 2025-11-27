"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie } from "recharts";

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
    ChartConfig,
} from "@/components/ui/chart";

import ChartCard from "@/components/cards/ChartCard";
import { getExpenses } from "@/services/expenseServices";
import { formatCurrencyLKR } from "@/lib/utils";

const COLOR_MAP = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
];

export default function CategoryExpensePieChart({
    refresh = 0,
}: {
    refresh?: number;
}) {
    const [chartData, setChartData] = useState<
        { category: string; total: number; fill: string }[]
    >([]);
    const [totalAmount, setTotalAmount] = useState(0);

    const load = async () => {
        try {
            const res = await getExpenses({ limit: 9999 });

            const categoryMap: Record<string, number> = {};

            let accumulated = 0;

            res.data.forEach((exp) => {
                if (!categoryMap[exp.category]) categoryMap[exp.category] = 0;
                categoryMap[exp.category] += exp.amount;
                accumulated += exp.amount;
            });

            const formatted = Object.entries(categoryMap).map(
                ([category, total], i) => ({
                    category,
                    total,
                    fill: COLOR_MAP[i % COLOR_MAP.length],
                })
            );

            setChartData(formatted);
            setTotalAmount(accumulated);
        } catch (err) {
            console.error("Error loading category expenses:", err);
        }
    };

    useEffect(() => {
        load();
    }, [refresh]);

    const chartConfig: ChartConfig = {
        total: { label: "Expenses" },
    };

    chartData.forEach((d) => {
        chartConfig[d.category] = {
            label: d.category,
            color: d.fill,
        };
    });

    return (
        <ChartCard
            title="Expenses by Category"
            description="Breakdown of all expense types"
            footer={
                <div className="flex flex-col items-center gap-1">
                    {/* Option A */}
                    <div className="text-sm font-medium text-gray-300">
                        Total categories: {chartData.length}
                    </div>

                    {/* Option B */}
                    <div className="text-xs text-muted-foreground">
                        Total amount:{" "}
                        <span className="font-semibold text-primary-400">
                            LKR {totalAmount.toLocaleString()}
                        </span>
                    </div>
                </div>
            }
        >
            <ChartContainer
                config={chartConfig}
                className="mx-auto h-full w-full min-h-[200px]"
            >
                <PieChart>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />

                    <Pie
                        data={chartData}
                        dataKey="total"
                        nameKey="category"
                        innerRadius={60}
                        labelLine={false}
                        isAnimationActive={true}
                        animationDuration={1000}
                    />

                    <ChartLegend content={<ChartLegendContent nameKey="category" />} />
                </PieChart>
            </ChartContainer>
        </ChartCard>
    );
}
