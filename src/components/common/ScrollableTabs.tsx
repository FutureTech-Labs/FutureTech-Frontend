"use client";

import {
    useState,
    useEffect,
    useRef,
    useCallback,
} from "react";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Tab {
    value: string;
    label: string;
}

interface ScrollableTabsProps {
    tabs: Tab[];
    defaultValue?: string;
    className?: string;
    activeTab?: string;
    onTabChange?: (value: string) => void;
}

export function ScrollableTabs({
    tabs,
    defaultValue,
    className,
    activeTab,
    onTabChange,
}: ScrollableTabsProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [isScrollable, setIsScrollable] = useState(false);
    const [internalValue, setInternalValue] = useState(defaultValue || tabs[0]?.value);
    const currentValue = activeTab ?? internalValue;

    const EPS = 4;

    const updateScrollButtons = useCallback(() => {
        const el = scrollRef.current;
        const list = listRef.current;
        if (!el || !list) return;

        const scrollLeft = Math.round(el.scrollLeft);
        const clientWidth = Math.round(el.clientWidth);
        const scrollWidth = Math.round(list.scrollWidth);

        const scrollable = scrollWidth > clientWidth + 1;
        setIsScrollable(scrollable);

        if (scrollable) {
            const maxScrollLeft = Math.max(0, scrollWidth - clientWidth);
            setCanScrollLeft(scrollLeft > EPS);
            setCanScrollRight(scrollLeft < maxScrollLeft - EPS);
        } else {
            setCanScrollLeft(false);
            setCanScrollRight(false);
        }
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        const list = listRef.current;
        if (!el || !list) return;

        const id = requestAnimationFrame(updateScrollButtons);

        const handleScroll = () => updateScrollButtons();
        const handleResize = () => updateScrollButtons();

        el.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleResize);

        const resizeObserver = new ResizeObserver(() => updateScrollButtons());
        resizeObserver.observe(list);

        return () => {
            cancelAnimationFrame(id);
            el.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
            resizeObserver.disconnect();
        };
    }, [updateScrollButtons, tabs]);

    const smoothScrollTo = (left: number) => {
        const el = scrollRef.current;
        if (!el) return;

        el.scrollTo({ left, behavior: "smooth" });

        let last = -1;
        let sameCount = 0;
        const tick = () => {
            const cur = el.scrollLeft;
            updateScrollButtons();

            if (Math.abs(cur - last) < 0.5) sameCount += 1;
            else sameCount = 0;
            last = cur;

            if (sameCount < 5 && Math.abs(cur - left) > 0.5) {
                requestAnimationFrame(tick);
            } else {
                updateScrollButtons();
            }
        };
        requestAnimationFrame(tick);
    };

    const handleScroll = (direction: "left" | "right") => {
        const el = scrollRef.current;
        const list = listRef.current;
        if (!el || !list) return;

        const scrollAmount = el.clientWidth * 0.6;
        const maxScrollLeft = Math.max(0, list.scrollWidth - el.clientWidth);
        const target = Math.max(
            0,
            Math.min(
                el.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount),
                maxScrollLeft
            )
        );

        smoothScrollTo(target);
    };

    const handleTabClick = (index: number, value: string) => {
        const el = scrollRef.current;
        const list = listRef.current;
        if (!el || !list) return;

        const tabEl = list.children[index] as HTMLElement;
        if (!tabEl) return;

        const tabLeft = tabEl.offsetLeft;
        const tabRight = tabLeft + tabEl.offsetWidth;
        const viewLeft = el.scrollLeft;
        const viewRight = viewLeft + el.clientWidth;

        const maxScrollLeft = list.scrollWidth - el.clientWidth;
        let targetScroll = el.scrollLeft;

        if (tabLeft < viewLeft) {
            targetScroll = tabLeft - 20;
        } else if (tabRight > viewRight) {
            targetScroll = tabRight - el.clientWidth + 20;
        }

        targetScroll = Math.max(0, Math.min(targetScroll, maxScrollLeft));
        smoothScrollTo(targetScroll);

        setInternalValue(value);
        onTabChange?.(value);
    };

    return (
        <Tabs
            defaultValue={defaultValue || tabs[0]?.value}
            value={currentValue}
            onValueChange={(val) => {
                setInternalValue(val);
                onTabChange?.(val);
            }}
            className={cn("w-full flex gap-2", className)}
        >
            <div className="flex items-center gap-2">
                {isScrollable && canScrollLeft && (
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleScroll("left")}
                        className={cn(
                            "button-gradient shrink-0 h-10 w-8 border-primary-500/30 hover:bg-primary-900/10 cursor-pointer"
                        )}
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                )}

                {/* Tabs container */}
                <div
                    ref={scrollRef}
                    className={cn(
                        "flex-1 scroll-smooth scrollbar-hide snap-x snap-mandatory rounded-lg",
                        isScrollable ? "overflow-x-auto" : "overflow-hidden"
                    )}
                >
                    <TabsList
                        ref={listRef}
                        className={cn(
                            "flex md:py-2 py-1 transition-all duration-200 md:h-12 h-10 bg-primary-900/10 border border-primary-500/30",
                            isScrollable ? "w-max" : "w-full justify-between"
                        )}
                    >
                        {tabs.map((tab, index) => (
                            <div key={tab.value} className="flex items-center h-full">
                                <TabsTrigger
                                    value={tab.value}
                                    onClick={() => handleTabClick(index, tab.value)}
                                    className={cn(
                                        "px-5 md:px-20 md:mx-2 mx-1 text-center border! border-transparent! snap-center transition-all cursor-pointer",
                                        "data-[state=active]:bg-primary-900/25! data-[state=active]:border-primary-500/30! data-[state=active]:button-gradient! hover:bg-primary-900/30",
                                        isScrollable ? "flex-none" : "flex-1"
                                    )}
                                >
                                    {tab.label}
                                </TabsTrigger>

                                {index < tabs.length - 1 && (
                                    <Separator
                                        orientation="vertical"
                                        className=" bg-primary-900 mx-1 border-[0.2px] max-h-6"
                                    />
                                )}

                            </div>
                        ))}
                    </TabsList>
                </div>

                {isScrollable && canScrollRight && (
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleScroll("right")}
                        className={cn(
                            "button-gradient shrink-0 h-10 w-8 border-primary-500/30 hover:bg-primary-900/10 cursor-pointer"
                        )}
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </Tabs>
    );
};