"use client"

import { Button } from "@/components/ui/button"
import { Grid, List } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProductToolbarProps {
    totalProducts: number;
    indexOfFirstItem: number;
    indexOfLastItem: number;
    sortBy: string;
    setSortBy: (value: string) => void;
    viewMode: "grid" | "list";
    setViewMode: (mode: "grid" | "list") => void;
}

export default function ProductToolbar({
    totalProducts,
    indexOfFirstItem,
    indexOfLastItem,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode
}: ProductToolbarProps) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">
                    Hiển thị {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalProducts)} của {totalProducts} kết quả
                </span>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Sắp xếp theo" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="default">Mặc định</SelectItem>
                        <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
                        <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
                        <SelectItem value="name">Tên A-Z</SelectItem>
                    </SelectContent>
                </Select>
                <div className="flex border rounded">
                    <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                    >
                        <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                    >
                        <List className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
