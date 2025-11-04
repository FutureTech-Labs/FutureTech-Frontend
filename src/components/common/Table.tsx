"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";

interface Column<T> {
    key: string;
    label: string;
    render?: (row: T) => React.ReactNode;
}

interface PaginationProps {
    page: number;
    totalPages: number;
    total?: number;
    onPageChange: (newPage: number) => void;
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    emptyMessage?: string;
    pagination?: PaginationProps;
    loading?: boolean;
}

const DataTable = <T,>({
    columns,
    data,
    emptyMessage = "No data found.",
    pagination,
    loading = false,
}: DataTableProps<T>) => {
    const [selectedRows, setSelectedRows] = useState<number[]>([]);

    const toggleRow = (index: number) => {
        setSelectedRows((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index]
        );
    };

    const allSelected = selectedRows.length === data.length && data.length > 0;
    const toggleAll = () => {
        setSelectedRows(allSelected ? [] : data.map((_, i) => i));
    };

    // Skeleton row generator
    const skeletonRows = Array.from({ length: 10 }, (_, i) => (
        <TableRow key={`skeleton-${i}`}>
            <TableCell className="text-center px-4 py-3">
                <Skeleton className="h-4 w-4 mx-auto rounded" />
            </TableCell>
            {columns.map((_, idx) => (
                <TableCell key={idx} className="px-4 py-3">
                    <Skeleton className="h-4 w-24" />
                </TableCell>
            ))}
        </TableRow>
    ));

    return (
        <div className="w-full overflow-x-auto rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-12 text-center px-4 py-3">
                            <Checkbox
                                checked={allSelected}
                                onCheckedChange={toggleAll}
                                aria-label="Select all rows"
                            />
                        </TableHead>

                        {columns.map((col) => (
                            <TableHead
                                key={String(col.key)}
                                className="whitespace-nowrap font-semibold px-4 py-3 text-sm"
                            >
                                {col.label}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {loading ? (
                        skeletonRows
                    ) : data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <TableRow key={rowIndex}>
                                <TableCell className="text-center px-4 py-3">
                                    <Checkbox
                                        checked={selectedRows.includes(rowIndex)}
                                        onCheckedChange={() => toggleRow(rowIndex)}
                                        aria-label={`Select row ${rowIndex + 1}`}
                                    />
                                </TableCell>

                                {columns.map((col) => (
                                    <TableCell
                                        key={String(col.key)}
                                        className="whitespace-nowrap px-4 py-3 text-sm"
                                    >
                                        {col.render
                                            ? col.render(row)
                                            : (row as any)[col.key] ?? "—"}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length + 1}
                                className="text-center py-8 text-sm text-muted-foreground"
                            >
                                {emptyMessage}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-end w-full py-4">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() =>
                                        pagination.page > 1 &&
                                        pagination.onPageChange(pagination.page - 1)
                                    }
                                    className={pagination.page === 1 ? "pointer-events-none opacity-50" : ""}
                                />
                            </PaginationItem>

                            {[...Array(pagination.totalPages)].map((_, i) => {
                                const pageNumber = i + 1;
                                if (
                                    pageNumber === 1 ||
                                    pageNumber === pagination.totalPages ||
                                    Math.abs(pageNumber - pagination.page) <= 1
                                ) {
                                    return (
                                        <PaginationItem key={pageNumber}>
                                            <PaginationLink
                                                isActive={pagination.page === pageNumber}
                                                onClick={() => pagination.onPageChange(pageNumber)}
                                            >
                                                {pageNumber}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                } else if (Math.abs(pageNumber - pagination.page) === 2) {
                                    return <PaginationEllipsis key={pageNumber} />;
                                }
                                return null;
                            })}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() =>
                                        pagination.page < pagination.totalPages &&
                                        pagination.onPageChange(pagination.page + 1)
                                    }
                                    className={
                                        pagination.page === pagination.totalPages
                                            ? "pointer-events-none opacity-50"
                                            : ""
                                    }
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
};

export default DataTable;
