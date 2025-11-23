"use client";

import { useEffect, useState } from "react";
import { getDailyProfit } from "@/services/expenseServices";

import { LineChart, Line, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent
} from "@/components/ui/card";

const shortDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getDate()}/${d.getMonth() + 1}`;
};

export default function DailyProfitChart({
    days = 30,
    refresh = 0
}: {
    days?: number;
    refresh?: number;
}) {
    const [data, setData] = useState<{ date: string; profit: number }[]>([]);

    const load = async () => {
        try {
            const res = await getDailyProfit(days);
            setData(res.data.map((d) => ({
                date: shortDate(d.date),
                profit: d.profit
            })));
        } catch (err) {
            console.error("Error loading daily profit:", err);
        }
    };

    useEffect(() => {
        load();
    }, [days, refresh]);

    const config = {
        profit: { label: "Profit", color: "#22C55E" }
    };

    return (
        <Card className="h-full p-2">
            <CardHeader className="pb-2">
                <CardTitle className="text-[13px]">Daily Profit (30 Days)</CardTitle>
            </CardHeader>

            <CardContent className="h-full px-1 pb-2">
                <ChartContainer config={config} className="h-full w-full">
                    <LineChart data={data}>
                        <XAxis dataKey="date" stroke="#9AA6B2" hide />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                            dataKey="profit"
                            stroke="var(--color-profit)"
                            strokeWidth={2.5}
                            dot={false}
                            type="monotone"
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
