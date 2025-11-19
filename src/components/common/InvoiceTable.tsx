"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";

export function SimpleInvoiceTable<T extends object>({
    columns,
    data
}: {
    columns: ColumnDef<T>[];
    data: T[];
}) {

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="w-full">
            {/* Desktop Table */}
            <div className="hidden md:block border border-white/50 rounded-lg overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/50">
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <TableHead key={header.id} className="text-gray-400 text-sm font-semibold px-4 py-3 border-b border-white/50">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows.map(row => (
                            <TableRow key={row.id} className="border-t border-white/50">
                                {row.getVisibleCells().map(cell => (
                                    <TableCell
                                        key={cell.id}
                                        className="px-4 py-3 text-sm text-primary-100"
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Mobile view (card layout) */}
            <div className="md:hidden flex flex-col gap-3">
                {table.getRowModel().rows.map(row => (
                    <div key={row.id} className="rounded-lg p-3 bg-black/20 border border-gray-700">
                        {row.getVisibleCells().map(cell => (
                            <div key={cell.id} className="flex justify-between py-1">
                                <span className="text-gray-400 text-xs">
                                    {cell.column.columnDef.header as string}
                                </span>
                                <span className="font-semibold text-sm">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
