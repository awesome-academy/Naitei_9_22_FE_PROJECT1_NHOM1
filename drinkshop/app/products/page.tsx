"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import BreadcrumbComponent from "@/components/breadcrumb/BreadcrumbComponent"
import { products } from "@/lib/products"
import styles from "./products.module.css"
import CustomPagination from "@/components/pagination/CustomPagination"
import ProductSidebar from "@/components/products/ProductSidebar"
import ProductToolbar from "@/components/products/ProductToolbar"
import ProductGrid from "@/components/products/ProductGrid"

export default function ProductsPage() {
  const searchParams = useSearchParams()
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("default")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const itemsPerPage = 6

  // Set category from URL params when component mounts
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category')
    if (categoryFromUrl) {
      setSelectedCategory(decodeURIComponent(categoryFromUrl))
    }
  }, [searchParams])

  const categories = [
    { name: "Tất cả", value: "all", count: products.length },
    {
      name: "Rượu Vang Đỏ",
      value: "Rượu Vang Đỏ",
      count: products.filter((p) => p.category === "Rượu Vang Đỏ").length,
    },
    {
      name: "Rượu Vang Trắng",
      value: "Rượu Vang Trắng",
      count: products.filter((p) => p.category === "Rượu Vang Trắng").length,
    },
    { name: "Champagne", value: "Champagne", count: products.filter((p) => p.category === "Champagne").length },
    {
      name: "Rượu Vang Rosé",
      value: "Rượu Vang Rosé",
      count: products.filter((p) => p.category === "Rượu Vang Rosé").length,
    },
    {
      name: "Rượu Vang Ngọt",
      value: "Rượu Vang Ngọt",
      count: products.filter((p) => p.category === "Rượu Vang Ngọt").length,
    },
  ]

  const tags = ["Rượu Ngoại", "Tết", "Phụ kiện", "Cao cấp", "Giá tốt", "Ấn tượng", "Thơm ngon", "Tết mới", "Đặc biệt"]

  // Filter and sort products
  let filteredProducts =
    selectedCategory === "all" ? products : products.filter((product) => product.category === selectedCategory)

  // Sort products
  if (sortBy === "price-low") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => Number.parseInt(a.price.replace(/\./g, "")) - Number.parseInt(b.price.replace(/\./g, "")),
    )
  } else if (sortBy === "price-high") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => Number.parseInt(b.price.replace(/\./g, "")) - Number.parseInt(a.price.replace(/\./g, "")),
    )
  } else if (sortBy === "name") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name))
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem)

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Prepare breadcrumb items
  const breadcrumbItems: Array<{ label: string, href?: string }> = [
    { label: "Trang chủ", href: "/" }
  ];

  if (selectedCategory !== "all") {
    // Khi có category được chọn, "Sản phẩm" là link và category là trang hiện tại
    breadcrumbItems.push({ label: "Sản phẩm", href: "/products" });
    breadcrumbItems.push({ label: selectedCategory });
  } else {
    // Khi không có category (all), "Sản phẩm" là trang hiện tại
    breadcrumbItems.push({ label: "Sản phẩm" });
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <BreadcrumbComponent items={breadcrumbItems} />
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative overflow-hidden">
        <Image
          src="/Image_Rudu/slide-3.jpg"
          alt="Banner rượu vang cao cấp"
          width={800}
          height={400}
          className={styles.heroBanner}
        />
      </div>

      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar */}
          <ProductSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            tags={tags}
          />

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Toolbar */}
            <ProductToolbar
              totalProducts={filteredProducts.length}
              indexOfFirstItem={indexOfFirstItem}
              indexOfLastItem={indexOfLastItem}
              sortBy={sortBy}
              setSortBy={setSortBy}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />

            {/* Products Grid */}
            <ProductGrid products={currentProducts} viewMode={viewMode} />

            {/* Pagination */}
            <CustomPagination />
          </div>
        </div>
      </div>
    </div>
  )
}

