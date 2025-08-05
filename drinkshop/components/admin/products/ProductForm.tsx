'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Product } from '../../../types/product.types';
import { Category } from '../../../types/category.types';

interface ProductFormProps {
    formData: Partial<Product>;
    categories: Category[];
    editingProductId: string | null;
    isSubmitting: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSelectChange: (name: string) => (value: string) => void;
    onCheckboxChange: (name: string) => (checked: boolean) => void;
    onCancelEdit: () => void;
}

export default function ProductForm({
    formData,
    categories,
    editingProductId,
    isSubmitting,
    onSubmit,
    onChange,
    onSelectChange,
    onCheckboxChange,
    onCancelEdit,
}: ProductFormProps) {
    return (
        <Card className="shadow-lg py-0">
            <CardHeader className="bg-teal-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl font-bold text-center py-2">
                    {editingProductId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <form onSubmit={onSubmit} className="space-y-6">
                    {/* Product Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                            Product Name
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={onChange}
                            required
                            className="border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={onChange}
                            rows={4}
                            className="border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>

                    {/* Price fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                                Price
                            </Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={onChange}
                                required
                                min="0"
                                className="border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="originalPrice" className="text-sm font-medium text-gray-700">
                                Original Price
                            </Label>
                            <Input
                                id="originalPrice"
                                name="originalPrice"
                                type="number"
                                value={formData.originalPrice}
                                onChange={onChange}
                                required
                                min="0"
                                className="border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                            />
                        </div>
                    </div>

                    {/* Category and Stock */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                                Category
                            </Label>
                            <Select
                                name="category"
                                value={formData.category || ''}
                                onValueChange={onSelectChange('category')}
                            >
                                <SelectTrigger className="border-gray-300 focus:ring-teal-500 focus:border-teal-500">
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.name}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="inStock" className="text-sm font-medium text-gray-700">
                                Stock
                            </Label>
                            <Input
                                id="inStock"
                                name="inStock"
                                type="number"
                                value={formData.stock}
                                onChange={onChange}
                                required
                                min="0"
                                className="border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                            />
                        </div>
                    </div>

                    {/* Checkboxes */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                            <Label htmlFor="isNew" className="text-sm font-medium text-gray-700">
                                New Product
                            </Label>
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-4">
                        {editingProductId && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancelEdit}
                                className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                disabled={isSubmitting}
                            >
                                Hủy
                            </Button>
                        )}
                        <Button
                            type="submit"
                            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-6"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Đang xử lý...' : editingProductId ? 'Cập nhật' : 'Thêm sản phẩm'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
