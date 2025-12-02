"use client";

interface ReportSectionProps {
    title: string;
    children: React.ReactNode;
    right?: React.ReactNode;
}

export default function ReportSection({ title, children, right }: ReportSectionProps) {
    return (
        <div className="
            flex flex-col gap-6 p-5 rounded-xl border-2 
            border-primary-900/40 table-bg-gradient 
            shadow-lg shadow-primary-900/15 mt-4
        ">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">{title}</h2>
                {right}
            </div>

            {children}
        </div>
    );
}
