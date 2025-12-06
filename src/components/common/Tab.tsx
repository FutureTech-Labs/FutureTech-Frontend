"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TabOption {
    label: string;
    value: string;
}

interface ReusableTabsProps {
    tabs: TabOption[];
    activeTab: string;
    onChange: (value: string) => void;
    className?: string;
}

export function Tab({
    tabs,
    activeTab,
    onChange,
    className
}: ReusableTabsProps) {
    return (
        <Tabs
            value={activeTab}
            onValueChange={onChange}
            className={className}
        >
            <TabsList className="flex w-full border border-primary-500/30 rounded-lg bg-primary-900/10 h-10 overflow-x-auto no-scrollbar">
                {tabs.map((t, index) => (
                    <div key={t.value} className="flex items-center w-full">
                        <TabsTrigger
                            value={t.value}
                            className="data-[state=active]:bg-primary-900/25! data-[state=active]:text-primary-300 data-[state=active]:border-primary-500/30! transition-colors px-4 min-w-max cursor-pointer"
                        >
                            {t.label}
                        </TabsTrigger>

                        {/* Separator (Not shown after last tab) */}
                        {index < tabs.length - 1 && (
                            <div className="h-6 w-px bg-primary-900 mx-2"></div>
                        )}
                    </div>
                ))}
            </TabsList>
        </Tabs>
    );
}
