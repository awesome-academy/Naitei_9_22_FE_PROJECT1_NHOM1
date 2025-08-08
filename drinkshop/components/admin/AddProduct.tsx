'use client';

import React, { useState } from 'react';
import { toast, Toaster } from 'sonner';
import { useProducts, useCategories } from '../../hooks/useProduct';
import { Product } from '../../types/product.types';
import axios from 'axios';

import ProductForm from './products/ProductForm';
import ProductTable from './products/ProductTable';

const DEFAULT_FORM_DATA: Partial<Product> = {
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    category: '',
    stock: 0,
    rating: 0,
    reviews: 0,
    image: '/Product/1.jpg',
    features: [],
};

export default function AddProduct() {
    const {
        products,
        loading: productsLoading,
        error: productsError,
        addProduct,
        updateProduct,
        deleteProduct,
        refreshProducts,
    } = useProducts();

    const {
        categories,
        loading: categoriesLoading,
        error: categoriesError,
    } = useCategories();

    const loading = productsLoading || categoriesLoading;
    const error = productsError?.message || categoriesError?.message;

    const [formData, setFormData] = useState<Partial<Product>>(DEFAULT_FORM_DATA);
    const [editingProductId, setEditingProductId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
                    <h2 className="text-xl font-bold text-red-600 mb-4">Lỗi tải dữ liệu</h2>
                    {productsError && (
                        <p className="text-red-600 mb-2">Products: {productsError.message}</p>
                    )}
                    {categoriesError && (
                        <p className="text-red-600 mb-2">Categories: {categoriesError.message}</p>
                    )}
                    <button
                        onClick={refreshProducts}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải dữ liệu...</p>
                    <p className="text-sm text-gray-500 mt-2">
                        Products: {productsLoading ? 'Loading...' : `✓ (${products.length})`} |
                        Categories: {categoriesLoading ? 'Loading...' : `✓ (${categories.length})`}
                    </p>
                </div>
            </div>
        );
    }

    const resetForm = () => {
        setFormData({ ...DEFAULT_FORM_DATA });
        setEditingProductId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isSubmitting) return;

        try {
            if (!formData.name || !formData.category) {
                toast.error('Vui lòng điền đầy đủ thông tin sản phẩm');
                return;
            }

            setIsSubmitting(true);

            const loadingToast = toast.loading(
                editingProductId ? 'Đang cập nhật sản phẩm...' : 'Đang thêm sản phẩm...',
                { description: 'Vui lòng đợi trong giây lát' }
            );

            if (editingProductId) {
                await updateProduct(editingProductId, formData);
                toast.dismiss(loadingToast);
                toast.success('Cập nhật sản phẩm thành công!', {
                    description: `Sản phẩm ${formData.name} đã được cập nhật.`,
                    duration: 3000,
                });
            } else {
                await addProduct(formData);
                toast.dismiss(loadingToast);
                toast.success('Thêm sản phẩm thành công!', {
                    description: `Sản phẩm ${formData.name} đã được thêm.`,
                    duration: 3000,
                });
            }

            resetForm();
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Có lỗi xảy ra!', {
                description: axios.isAxiosError(error)
                    ? error.response?.data?.message || 'Lỗi khi xử lý yêu cầu'
                    : 'Lỗi không xác định',
                duration: 5000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value,
        }));
    };

    const handleSelectChange = (name: string) => (value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (name: string) => (checked: boolean) => {
        setFormData((prev) => ({
            ...prev,
            [name]: checked,
        }));
    };

    const handleEdit = (product: Product) => {
        setFormData({ ...product });
        setEditingProductId(product.id.toString());
    };

    const handleDelete = async (productId: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
            return;
        }

        try {
            const loadingToast = toast.loading('Đang xóa sản phẩm...', {
                description: 'Vui lòng đợi trong giây lát',
            });

            await deleteProduct(productId);

            toast.dismiss(loadingToast);
            toast.success('Xóa sản phẩm thành công!', {
                duration: 3000,
            });
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error('Có lỗi xảy ra!', {
                description: axios.isAxiosError(error)
                    ? error.response?.data?.message || 'Lỗi khi xóa sản phẩm'
                    : 'Lỗi không xác định',
                duration: 5000,
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Toaster position="top-right" richColors />
            <div className="max-w-7xl mx-auto space-y-8">
                <ProductForm
                    formData={formData}
                    categories={categories}
                    editingProductId={editingProductId}
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmit}
                    onChange={handleChange}
                    onSelectChange={handleSelectChange}
                    onCheckboxChange={handleCheckboxChange}
                    onCancelEdit={resetForm}
                />
                <ProductTable
                    products={products}
                    categories={categories}
                    loading={loading}
                    isSubmitting={isSubmitting}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onRefresh={refreshProducts}
                />
            </div>
        </div>
    );
}