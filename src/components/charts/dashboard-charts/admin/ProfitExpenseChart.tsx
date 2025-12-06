"use client";

import { PieChart, Pie, Cell, Label } from "recharts";

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartConfig,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";

type Props = {
    data?: IDailyProfitExpensePoint[] | null;
};

export default function ProfitExpensePie({ data }: Props) {
    const dummy = { profit: 32000, expense: 18000 };

    const last = data?.[data.length - 1] ?? dummy;

    const profit = last.profit;
    const expense = last.expense;

    const total = profit + expense;
    const pct = total ? Math.round((profit / total) * 100) : 0;

    const isProfit = profit >= expense;

    const chartData = [
        { name: "profit", value: profit, color: "var(--chart-cyan-1)" },
        { name: "expense", value: expense, color: "var(--chart-rose-4)" },
    ];

    const chartConfig: ChartConfig = {
        profit: { label: "Profit", color: "var(--chart-cyan-1)" },
        expense: { label: "Expense", color: "var(--chart-rose-4)" },
    };

    return (
        <div className="flex flex-col w-full rounded-xl border-2 border-gradient border-primary-900/40 table-bg-gradient shadow-lg shadow-primary-900/15 p-5">

            <div className="flex justify-between items-center w-full">
                <h1 className="text-lg text-gradient">Daily Profit/Loss</h1>

                <span
                    className={`text-sm font-semibold ${isProfit ? "text-cyan-300" : "text-rose-300"}`}
                >
                    {pct}% Profit
                </span>
            </div>

            <ChartContainer
                config={chartConfig}
                className="mx-auto w-full h-full aspect-square max-h-[200px]"
            >
                <PieChart>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

                    <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={80}
                        innerRadius={60}
                        stroke="none"
                    >
                        {chartData.map((item, index) => (
                            <Cell key={index} fill={item.color} />
                        ))}

                        {/* Center ICON (image) */}
                        <Label
                            position="center"
                            content={({ viewBox }) => {
                                const vb = viewBox as any;
                                if (!vb || typeof vb.cx !== "number") return null;

                                const iconSrc = isProfit
                                    ? "/icons/happy.png"
                                    : "/icons/sadFace.png";

                                return (
                                    <foreignObject
                                        x={vb.cx - 20}
                                        y={vb.cy - 20}
                                        width={40}
                                        height={40}
                                    >
                                        <img
                                            src={iconSrc}
                                            alt="status"
                                            className="w-full h-full object-contain"
                                        />
                                    </foreignObject>
                                );
                            }}
                        />
                    </Pie>

                    <ChartLegend
                        content={
                            <ChartLegendContent
                                nameKey="name"
                                className="hidden sm:flex flex-wrap gap-3 justify-center max-w-full mx-auto"
                            />
                        }
                    />
                </PieChart>
            </ChartContainer>
        </div>
    );
}
