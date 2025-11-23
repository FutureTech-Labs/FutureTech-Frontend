"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend } from "recharts";
import { getProfitVsExpense } from "@/services/expenseServices";

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";

const COLORS = {
    expense: "#F87171",
    profit: "#4ADE80",
};

export default function ProfitVsExpenseChart({
    months = 12,
    refresh = 0,
}: {
    months?: number;
    refresh?: number;
}) {
    const [chartData, setChartData] = useState<
        { name: string; key: "expense" | "profit"; value: number }[]
    >([]);

    const load = async () => {
        try {
            const res = await getProfitVsExpense(months);

            let sumExpense = 0;
            let sumProfit = 0;

            res.data.forEach((item) => {
                sumExpense += item.expenseTotal;
                sumProfit += item.profitTotal;
            });

            setChartData([
                { name: "Expense", key: "expense", value: sumExpense },
                { name: "Profit", key: "profit", value: sumProfit },
            ]);
        } catch (err) {
            console.error("Error loading profit vs expense:", err);
        }
    };

    useEffect(() => {
        load();
    }, [months, refresh]);

    const config = {
        expense: { label: "Expense", color: COLORS.expense },
        profit: { label: "Profit", color: COLORS.profit },
    };

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-lg font-medium">
                    Profit vs Expense
                </CardTitle>
            </CardHeader>

            <CardContent className="h-full p-0">
                <ChartContainer config={config} className="h-full w-full">
                    <PieChart>
                        {/* Pie */}
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="45%"
                            outerRadius="75%"
                            innerRadius="55%"
                            paddingAngle={4}
                        >
                            {chartData.map((entry) => (
                                <Cell
                                    key={entry.key}
                                    fill={COLORS[entry.key]}
                                />
                            ))}
                        </Pie>

                        {/* Tooltip */}
                        <ChartTooltip content={<ChartTooltipContent hideIndicator />} />

                        <Legend
                            verticalAlign="bottom"
                            align="center"
                            iconType="circle"
                            formatter={(value) => (
                                <span className="text-gray-300 text-xs">{value}</span>
                            )}
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
