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

const COLOR_MAP = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
];

export default function CategoryExpenseChart({
    refresh = 0,
    expenses = [],
}: {
    refresh?: number;
    expenses: IExpense[];
}) {
    const [chartData, setChartData] = useState<
        { category: string; total: number; fill: string }[]
    >([]);
    const [totalAmount, setTotalAmount] = useState(0);

    // -------------------------------
    // Dummy Fallback Data
    // -------------------------------
    const dummyData = [
        { category: "Electricity", total: 82000, fill: COLOR_MAP[0] },
        { category: "Internet", total: 45000, fill: COLOR_MAP[1] },
        { category: "Water", total: 30000, fill: COLOR_MAP[2] },
        { category: "Maintenance", total: 60000, fill: COLOR_MAP[3] },
        { category: "Misc", total: 25000, fill: COLOR_MAP[4] },
    ];

    const load = () => {
        try {
            // If no expenses → Dummy data
            if (!expenses || expenses.length === 0) {
                setChartData(dummyData);
                setTotalAmount(dummyData.reduce((sum, d) => sum + d.total, 0));
                return;
            }

            const categoryMap: Record<string, number> = {};

            let accumulated = 0;

            expenses.forEach((exp) => {
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
            console.error("Error:", err);

            // fallback
            setChartData(dummyData);
            setTotalAmount(dummyData.reduce((sum, d) => sum + d.total, 0));
        }
    };

    useEffect(() => {
        load();
    }, [refresh, expenses]);

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
                <div className="text-xs text-muted-foreground">
                    Total amount:{" "}
                    <span className="font-semibold text-primary-400">
                        LKR {totalAmount.toLocaleString()}
                    </span>
                </div>
            }
        >
            <ChartContainer
                config={chartConfig}
                className="mx-auto h-full w-full min-h-[200px]"
            >
                <PieChart>
                    <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                    />

                    <Pie
                        data={chartData}
                        dataKey="total"
                        nameKey="category"
                        innerRadius={60}
                        labelLine={false}
                        isAnimationActive={true}
                        animationDuration={1000}
                    />

                    <ChartLegend
                        content={
                            <ChartLegendContent
                                nameKey="category"
                                className="flex flex-wrap gap-3 justify-center"
                            />
                        }
                    />
                </PieChart>
            </ChartContainer>
        </ChartCard>
    );
}
