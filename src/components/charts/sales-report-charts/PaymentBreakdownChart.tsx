"use client";

import { Pie, PieChart, Cell } from "recharts";

import ChartCard from "@/components/cards/ChartCard";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartConfig,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";

export interface IPaymentBreakdownItem {
    _id: "cash" | "card";
    amount: number;
    count: number;
}

export default function PaymentBreakdownChart({
    data,
}: {
    data?: IPaymentBreakdownItem[] | null;
}) {

    const dummy: IPaymentBreakdownItem[] = [
        { _id: "cash", amount: 120000, count: 80 },
        { _id: "card", amount: 90000, count: 60 },
    ];

    const source = data && data.length > 3 ? data : dummy;

    const chartData = source.map((d) => ({
        id: d._id,
        name: d._id === "cash" ? "Cash" : "Card",
        value: d.amount,
    }));

    const chartConfig: ChartConfig = {
        Cash: {
            label: "Cash Payments",
        },
        Card: {
            label: "Card Payments",
        },
    };

    const COLORS: Record<string, string> = {
        cash: "var(--chart-cyan-1)",
        card: "var(--chart-2)",
    };

    return (
        <ChartCard title="Payment Breakdown" description="Share by payment method" centeredHeader={false}>
            <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square min-h-[250px] max-h-[250px]"
            >
                <PieChart>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />

                    <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={56}
                        labelLine={false}
                        isAnimationActive={true}
                        animationDuration={900}
                        animationEasing="ease-out"
                    >
                        {chartData.map((entry) => (
                            <Cell key={entry.id} fill={COLORS[entry.id]} />
                        ))}
                    </Pie>

                    <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
            </ChartContainer>
        </ChartCard>
    );
}
