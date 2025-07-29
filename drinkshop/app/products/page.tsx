'use client';

import { useState, useEffect } from 'react';
import BreadcrumbComponent from "@/components/breadcrumb/BreadcrumbComponent";
import FilterSidebar from "@/components/FilterSidebar";
import ProductGrid from "@/components/ProductGrid";

interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    price: number;
    originalPrice: number;
    image: string;
    images: string[];
    categoryId: number;
    stock: number;
    isNew: boolean;
    isHot: boolean;
    isSale: boolean;
    discount: number;
    rating: number;
    reviewCount: number;
    status: string;
}

const ProductsPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('name');
    const [filterBy, setFilterBy] = useState('all');
    const productsPerPage = 12;

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [products, filterBy, sortBy]);

    const fetchProducts = async () => {
        try {
            const response = await fetch('/database/db.json');
            const data = await response.json();
            setProducts(data.products);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };

    const filterProducts = () => {
        let filtered = [...products];

        // Filter by type
        switch (filterBy) {
            case 'hot':
                filtered = filtered.filter(product => product.isHot);
                break;
            case 'new':
                filtered = filtered.filter(product => product.isNew);
                break;
            case 'sale':
                filtered = filtered.filter(product => product.isSale);
                break;
            default:
                break;
        }

        // Sort products
        switch (sortBy) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case 'name':
            default:
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }

        setFilteredProducts(filtered);
        setCurrentPage(1);
    };

    // Pagination
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <BreadcrumbComponent
                items={[
                    { label: "Trang chủ", href: "/" },
                    { label: "Sản phẩm" },
                ]}
            />

            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filter Sidebar */}
                    <div className="lg:w-1/4">
                        <FilterSidebar
                            filterBy={filterBy}
                            setFilterBy={setFilterBy}
                            sortBy={sortBy}
                            setSortBy={setSortBy}
                        />
                    </div>

                    {/* Products Grid */}
                    <div className="lg:w-3/4">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold text-gray-800">
                                Sản phẩm {filterBy === 'hot' ? 'Hot Trend' : filterBy === 'new' ? 'Mới' : filterBy === 'sale' ? 'Khuyến mãi' : ''}
                            </h1>
                            <div className="text-gray-600">
                                Hiển thị {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} của {filteredProducts.length} sản phẩm
                            </div>
                        </div>

                        <ProductGrid
                            products={currentProducts}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;
