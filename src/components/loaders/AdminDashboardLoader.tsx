import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardSkeleton() {
    return (
        <div className="h-full">
            <div
                className="grid gap-3 md:gap-6 h-full grid-cols-1 grid-rows-[repeat(5,1fr)] xl:grid-cols-[3fr_3fr_3fr_2fr_2fr] xl:grid-rows-2"
            >
                {/* 1. AREA CHART */}
                <div className="xl:col-span-3 h-full dashboard-card-border-gradient table-bg-gradient p-5 flex flex-col">
                    <Skeleton className="h-6 w-40 mb-4 shrink-0" />
                    <Skeleton className="flex-1 rounded-lg" />
                </div>

                {/* 2. TOP SELLING PRODUCTS */}
                <div className="xl:col-span-3 xl:row-start-2 h-full dashboard-card-border-gradient table-bg-gradient p-5 flex flex-col">
                    <Skeleton className="h-6 w-48 mb-4 shrink-0" />
                    <Skeleton className="flex-1 rounded-lg" />
                </div>


                {/* RIGHT COLUMN */}
                <div className="flex flex-col gap-3 md:gap-6 xl:col-span-2 xl:col-start-4 xl:row-span-2 h-full">

                    {/* Profit vs Expense (Radial) */}
                    <div className="dashboard-card-border-gradient table-bg-gradient p-5 h-[200px]">
                        <Skeleton className="h-full w-full rounded-lg" />
                    </div>

                    {/* Inventory Overview */}
                    <div className="flex-1 dashboard-card-border-gradient table-bg-gradient p-5 flex flex-col gap-4">
                        <Skeleton className="h-5 w-44" />

                        {/* Total Products */}
                        <div className="flex items-center gap-4 p-3 rounded-lg border border-primary/15">
                            <Skeleton className="h-12 w-12 rounded-lg" />
                            <div className="flex flex-col gap-2">
                                <Skeleton className="h-3 w-28" />
                                <Skeleton className="h-6 w-20" />
                            </div>
                        </div>

                        {/* Low Stock */}
                        <div className="flex items-center gap-4 p-3 rounded-lg border border-primary/15">
                            <Skeleton className="h-12 w-12 rounded-lg" />
                            <div className="flex flex-col gap-2">
                                <Skeleton className="h-3 w-28" />
                                <Skeleton className="h-6 w-24" />
                            </div>
                        </div>
                    </div>

                    {/* Recent Expenses */}
                    <div className="flex-1 dashboard-card-border-gradient table-bg-gradient p-5 flex flex-col gap-4 min-h-0">
                        <Skeleton className="h-5 w-36" />

                        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                            {[1, 2].map((i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-8 w-8 rounded-md" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                    <Skeleton className="h-4 w-16" />
                                </div>
                            ))}
                        </div>

                        <Skeleton className="h-10 w-full rounded-lg mt-auto" />
                    </div>
                </div>
            </div>
        </div>
    );
}
