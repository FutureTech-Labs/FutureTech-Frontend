"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductFiltersProps {
    onFilter: (filters: {
        search?: string;
        brand?: string;
        category?: string;
        status?: string;
    }) => void;
    loading?: boolean;
}

const ProductFilters = ({ onFilter, loading }: ProductFiltersProps) => {
    const [filters, setFilters] = useState({
        search: "",
        brand: "",
        category: "",
        status: "",
    });

    const handleChange = (key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleSearch = () => {
        onFilter(filters);
    };

    return (
        <div className="flex flex-wrap gap-3 items-center mb-4">
            <Input
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => handleChange("search", e.target.value)}
                className="w-48"
            />

            <Select onValueChange={(v) => handleChange("brand", v)}>
                <SelectTrigger className="w-40">
                    <SelectValue placeholder="Brand" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="logitech">Logitech</SelectItem>
                    <SelectItem value="razer">Razer</SelectItem>
                    <SelectItem value="asus">Asus</SelectItem>
                </SelectContent>
            </Select>

            <Select onValueChange={(v) => handleChange("category", v)}>
                <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="mouse">Mouse</SelectItem>
                    <SelectItem value="keyboard">Keyboard</SelectItem>
                    <SelectItem value="monitor">Monitor</SelectItem>
                </SelectContent>
            </Select>

            <Select onValueChange={(v) => handleChange("status", v)}>
                <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
            </Select>

            <Button onClick={handleSearch} disabled={loading}>
                {loading ? "Filtering..." : "Apply Filters"}
            </Button>
        </div>
    );
};

export default ProductFilters;
