"use client";

import { useEffect, useState } from "react";
import { getMonthlyExpenses } from "@/services/expenseServices";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";

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

const monthName = (m: number) =>
    ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec"][m - 1];

export default function MonthlyExpensesChart({
    months = 12,
    refresh = 0
}: {
    months?: number;
    refresh?: number;
}) {
    const [data, setData] = useState<{ label: string; expense: number }[]>([]);

    const load = async () => {
        try {
            const res = await getMonthlyExpenses(months);

            const mapped = res.data.map((item) => ({
                label: `${monthName(item.month)} ${String(item.year).slice(-2)}`,
                expense: item.total,
            }));

            setData(mapped);
        } catch (err) {
            console.error("Error loading monthly expenses:", err);
        }
    };

    useEffect(() => {
        load();
    }, [months, refresh]);

    const config = {
        expense: {
            label: "Expenses",
            color: "#3B82F6",
        },
    };

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-lg font-medium">
                    Monthly Expenses
                </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 min-h-0">
                <ChartContainer config={config} className="h-full w-full">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                        <CartesianGrid
                            stroke="rgba(255,255,255,0.04)"
                            vertical={false}
                        />

                        <XAxis
                            dataKey="label"
                            tick={{ fill: "#9AA6B2" }}
                            axisLine={{ stroke: "rgba(255,255,255,0.15)" }}
                        />

                        <YAxis
                            tick={{ fill: "#9AA6B2" }}
                            axisLine={{ stroke: "rgba(255,255,255,0.15)" }}
                        />

                        <ChartTooltip content={<ChartTooltipContent />} />

                        <Bar
                            dataKey="expense"
                            fill="var(--color-expense)"
                            radius={[10, 10, 10, 10]}
                            barSize={35}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
