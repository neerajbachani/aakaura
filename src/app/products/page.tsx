"use client";
import React, { useCallback, useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Product, Category } from "@/types/Product";
import ProductCard from "@/components/ui/ProductCard";
import Container from "@/components/ui/Container";
import fonts from "@/config/fonts";
import {
  FiSearch,
  FiFilter,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number | null;
  previousPage: number | null;
}

const ProductsPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    categoryId: searchParams.get("categoryId") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    featured: searchParams.get("featured") === "true",
  });

  // Fetch products with filters and pagination
  const fetchProducts = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.search) params.append("search", filters.search);
        if (filters.categoryId) params.append("categoryId", filters.categoryId);
        if (filters.minPrice) params.append("minPrice", filters.minPrice);
        if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
        if (filters.featured) params.append("featured", "true");
        params.append("page", page.toString());
        params.append("limit", "12");

        const response = await fetch(`/api/products?${params.toString()}`);
        if (response.ok) {
          const { data } = await response.json();
          setProducts(data.products);
          setPagination(data.pagination);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const { data } = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Update URL with filters and pagination
  const updateURL = (newFilters: typeof filters, page = 1) => {
    const params = new URLSearchParams();
    if (newFilters.search) params.append("search", newFilters.search);
    if (newFilters.categoryId)
      params.append("categoryId", newFilters.categoryId);
    if (newFilters.minPrice) params.append("minPrice", newFilters.minPrice);
    if (newFilters.maxPrice) params.append("maxPrice", newFilters.maxPrice);
    if (newFilters.featured) params.append("featured", "true");
    if (page > 1) params.append("page", page.toString());

    const newURL = params.toString()
      ? `/products?${params.toString()}`
      : "/products";
    router.push(newURL);
  };

  // Handle filter changes
  const handleFilterChange = (
    key: keyof typeof filters,
    value: string | boolean
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateURL(newFilters, 1); // Reset to page 1 when filters change
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    updateURL(filters, page);
  };

  // Clear all filters
  const clearFilters = () => {
    const newFilters = {
      search: "",
      categoryId: "",
      minPrice: "",
      maxPrice: "",
      featured: false,
    };
    setFilters(newFilters);
    updateURL(newFilters, 1);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts(page);
  }, [filters, page, fetchProducts, searchParams]);

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== "" && value !== false
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondaryBeige/20 to-white">
      <Container>
        <div className="py-8 md:py-12">
          {/* Header */}
          <div className="mb-8">
            <h1
              className={`${fonts.merriweather} text-3xl md:text-4xl font-bold text-primaryBrown mb-2`}
            >
              All Products
            </h1>
            <p className={`${fonts.mulish} text-neutral-600`}>
              Discover our collection of amazing products
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2
                className={`${fonts.mulish} text-lg font-semibold text-primaryBrown flex items-center gap-2`}
              >
                <FiFilter className="w-5 h-5" />
                Filters
              </h2>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-neutral-500 hover:text-primaryRed flex items-center gap-1 transition-colors"
                >
                  <FiX className="w-4 h-4" />
                  Clear all
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primaryRed focus:border-transparent text-sm"
                />
              </div>

              {/* Category */}
              <select
                value={filters.categoryId}
                onChange={(e) =>
                  handleFilterChange("categoryId", e.target.value)
                }
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primaryRed focus:border-transparent text-sm"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {/* Min Price */}
              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primaryRed focus:border-transparent text-sm"
                min="0"
              />

              {/* Max Price */}
              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
                className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primaryRed focus:border-transparent text-sm"
                min="0"
              />
            </div>

            {/* Featured Toggle */}
            <div className="mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.featured}
                  onChange={(e) =>
                    handleFilterChange("featured", e.target.checked)
                  }
                  className="w-4 h-4 text-primaryRed focus:ring-primaryRed rounded"
                />
                <span className={`${fonts.mulish} text-sm text-primaryBrown`}>
                  Featured products only
                </span>
              </label>
            </div>
          </div>

          {/* Results */}
          <div className="mb-6">
            <p className={`${fonts.mulish} text-neutral-600`}>
              {loading
                ? "Loading..."
                : pagination
                ? `Showing ${products.length} of ${pagination.total} product${
                    pagination.total !== 1 ? "s" : ""
                  }`
                : "No products found"}
            </p>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="h-[650px] bg-neutral-100 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    size="large"
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center">
                  <nav className="flex items-center gap-2">
                    {/* Previous Page */}
                    <button
                      onClick={() => handlePageChange(pagination.previousPage!)}
                      disabled={!pagination.hasPreviousPage}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-600 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <FiChevronLeft className="w-4 h-4" />
                      Previous
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from(
                        { length: pagination.totalPages },
                        (_, i) => i + 1
                      )
                        .filter((pageNum) => {
                          // Show first page, last page, current page, and pages around current
                          const current = pagination.page;
                          const total = pagination.totalPages;
                          return (
                            pageNum === 1 ||
                            pageNum === total ||
                            (pageNum >= current - 1 && pageNum <= current + 1)
                          );
                        })
                        .map((pageNum, index, array) => {
                          // Add ellipsis if there's a gap
                          const prevPage = array[index - 1];
                          const showEllipsis =
                            prevPage && pageNum - prevPage > 1;

                          return (
                            <React.Fragment key={pageNum}>
                              {showEllipsis && (
                                <span className="px-2 py-2 text-neutral-400">
                                  ...
                                </span>
                              )}
                              <button
                                onClick={() => handlePageChange(pageNum)}
                                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                  pageNum === pagination.page
                                    ? "bg-primaryRed text-white"
                                    : "text-neutral-600 bg-white border border-neutral-200 hover:bg-neutral-50"
                                }`}
                              >
                                {pageNum}
                              </button>
                            </React.Fragment>
                          );
                        })}
                    </div>

                    {/* Next Page */}
                    <button
                      onClick={() => handlePageChange(pagination.nextPage!)}
                      disabled={!pagination.hasNextPage}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-600 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                      <FiChevronRight className="w-4 h-4" />
                    </button>
                  </nav>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-neutral-400 text-6xl mb-4">📦</div>
              <h3
                className={`${fonts.merriweather} text-xl font-semibold text-primaryBrown mb-2`}
              >
                No products found
              </h3>
              <p className={`${fonts.mulish} text-neutral-600`}>
                Try adjusting your filters or search terms
              </p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

// Loading component for Suspense fallback
const ProductsPageLoading = () => (
  <div className="min-h-screen bg-gradient-to-br from-secondaryBeige/20 to-white">
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <div className="h-8 bg-neutral-200 rounded animate-pulse mb-2"></div>
        <div className="h-4 bg-neutral-200 rounded animate-pulse w-2/3"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-[650px] bg-neutral-100 rounded-xl animate-pulse"
          />
        ))}
      </div>
    </div>
  </div>
);

const ProductsPage = () => {
  return (
    <Suspense fallback={<ProductsPageLoading />}>
      <ProductsPageContent />
    </Suspense>
  );
};

export default ProductsPage;
