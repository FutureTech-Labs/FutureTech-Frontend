"use client"

import jsPDF from "jspdf"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import autoTable, { type RowInput } from "jspdf-autotable"

const getValue = (obj: any, path: string) => path.split(".").reduce((acc, key) => acc?.[key], obj)

type RGB = [number, number, number]

interface ExportPDFButtonProps<T extends Record<string, any>> {
    fileName?: string
    columns: {
        header: string
        key: keyof T | string
        format?: (value: any, row: T) => string
    }[]
    data: T[]
    title?: string
    subtitle?: string
    buttonLabel?: string
    className?: string
    shopName?: string
    palette?: Partial<{
        primary: RGB
        bg: RGB
        card: RGB
        cardAlt: RGB
        border: RGB
        text: RGB
        textMuted: RGB
    }>
}

const ExportPDFButton = <T extends Record<string, any>>({
    fileName = "export.pdf",
    columns,
    data,
    title = "Inventory Report",
    subtitle,
    buttonLabel = "Export",
    className,
    shopName = "FutureTech",
    palette,
}: ExportPDFButtonProps<T>) => {
    const handleExport = () => {
        const doc = new jsPDF("p", "pt")
        const pageWidth = doc.internal.pageSize.getWidth()
        const pageHeight = doc.internal.pageSize.getHeight()
        const currentDate = new Date().toLocaleString()

        // 🎨 Theme palette from your system
        const base = {
            primary: [48, 125, 237] as RGB,
            bg: [0, 10, 15] as RGB, // black-500
            card: [18, 26, 36] as RGB,
            cardAlt: [22, 32, 44] as RGB,
            border: [71, 85, 105] as RGB,
            text: [232, 233, 237] as RGB,
            textMuted: [161, 169, 184] as RGB,
        }
        const c = { ...base, ...(palette ?? {}) }

        // 🌑 Background
        doc.setFillColor(...c.bg)
        doc.rect(0, 0, pageWidth, pageHeight, "F")

        // 🏢 Professional Header Section
        doc.rect(0, 0, pageWidth, 90, "F")

        // Accent line
        doc.setFillColor(...c.primary)
        doc.rect(0, 0, pageWidth, 4, "F")

        // Shop Name & Logo Area
        doc.setFont("helvetica", "bold")
        doc.setTextColor(...c.text)
        doc.setFontSize(22)
        doc.text(shopName, 40, 35)

        // Report Title Section (Right aligned)
        doc.setFontSize(16)
        doc.setTextColor(255, 255, 255) // Pure white for emphasis
        doc.text(title, pageWidth - 40, 35, { align: "right" })

        // Contact info in smaller, muted text
        doc.setFont("helvetica", "normal")
        doc.setFontSize(9)
        doc.setTextColor(...c.textMuted)
        doc.text("No. 24, Tech Avenue, Colombo 07", 40, 52)
        doc.text("+94 71 234 5678 • info@futuretech.lk", 40, 64)

        // Date and document info
        doc.text(`Generated: ${currentDate}`, pageWidth - 40, 52, { align: "right" })
        if (subtitle) {
            doc.text(subtitle, pageWidth - 40, 64, { align: "right" })
        }

        // Separator line
        doc.setDrawColor(...c.border)
        doc.setLineWidth(0.5)
        doc.line(40, 80, pageWidth - 40, 80)

        // Table Content
        const head = [columns.map((c) => c.header)]
        const body: RowInput[] = data.map((row) =>
            columns.map((cdef) => {
                const raw = getValue(row, cdef.key as string)
                const val = cdef.format ? cdef.format(raw, row) : raw
                return String(val ?? "—")
            })
        )

        autoTable(doc, {
            startY: 110,
            head,
            body,
            theme: "grid",
            margin: { left: 40, right: 40 },
            styles: {
                font: "helvetica",
                fontSize: 10,
                textColor: c.textMuted,
                cellPadding: { top: 6, right: 8, bottom: 6, left: 8 },
                lineColor: c.border,
                lineWidth: 0.25,
                fillColor: c.cardAlt,
                valign: "middle",
            },
            headStyles: {
                fillColor: [25, 35, 50] as RGB,
                textColor: [200, 210, 220] as RGB,
                fontStyle: "bold",
                fontSize: 11,
                cellPadding: 10,
                lineColor: c.primary,
                lineWidth: 0.3,
            },
            bodyStyles: {
                fillColor: c.cardAlt,
            },
            alternateRowStyles: {
                fillColor: [20, 29, 41],
            },
            didDrawPage: (hookData) => {
                const footerY = pageHeight - 40
                doc.setDrawColor(...c.border)
                doc.setLineWidth(0.4)
                doc.line(40, footerY - 18, pageWidth - 40, footerY - 18)

                doc.setFontSize(9)
                doc.setTextColor(...c.textMuted)
                doc.text(
                    `© ${new Date().getFullYear()} ${shopName}. All rights reserved.`,
                    pageWidth / 2,
                    footerY - 4,
                    { align: "center" }
                )
                doc.text(`Page ${hookData.pageNumber}`, pageWidth - 40, footerY - 4, { align: "right" })
            },
        })

        doc.save(fileName)
    }

    return (
        <Button
            onClick={handleExport}
            variant="ghost"
            className={`w-full md:w-[150px] rounded-xl bg-black-500! border border-white! px-8! h-10! cursor-pointer ${className ?? ""}`}
        >
            <span className="text-sm font-medium mx-2">{buttonLabel}</span>
            <Download size={20} className="opacity-70" />
        </Button>
    )
}

export default ExportPDFButton