"use client";
import React, { useCallback, useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Product, Category } from "@/types/Product";
import ProductCard from "@/components/ui/ProductCard";
import Container from "@/components/ui/Container";
import fonts from "@/config/fonts";
import { FiSearch, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import FilterDropdown, { FilterOption } from "@/components/ui/FilterDropdown";
import PriceRangeFilter from "@/components/ui/PriceRangeFilter";
import Image from "next/image";

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
    // featured: searchParams.get("featured") === "true",
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
        // if (filters.featured) params.append("featured", "true");
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
    [filters],
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
    // if (newFilters.featured) params.append("featured", "true");
    if (page > 1) params.append("page", page.toString());

    const newURL = params.toString()
      ? `/products?${params.toString()}`
      : "/products";
    router.push(newURL);
  };

  // Handle filter changes
  const handleFilterChange = (
    key: keyof typeof filters,
    value: string | boolean,
  ) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateURL(newFilters, 1); // Reset to page 1 when filters change
  };

  const handlePriceApply = (min: string, max: string) => {
    const newFilters = { ...filters, minPrice: min, maxPrice: max };
    setFilters(newFilters);
    updateURL(newFilters, 1);
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    updateURL(filters, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Clear all filters
  const clearFilters = () => {
    const newFilters = {
      search: "",
      categoryId: "",
      minPrice: "",
      maxPrice: "",
      // featured: false,
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
    (value) => value !== "" && value !== "false",
  );

  const categoryOptions: FilterOption[] = [
    { label: "All Categories", value: "" },
    ...categories.map((cat) => ({ label: cat.name, value: cat.id })),
  ];

  return (
    <div className="min-h-screen bg-[#fcfbf9]">
      {/* Enhanced Hero Section */}
      <div className="relative py-20 md:py-28 overflow-hidden">
        {/* Background Mandala/Texture Effect */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          <Image
            src="/images/logo.png"
            alt=""
            width={800}
            height={800}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] object-contain animate-spin-slow"
          />
        </div>

        <Container className="relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`${fonts.cormorant} text-5xl md:text-7xl font-light text-[#27190b] mb-6 leading-tight`}
          >
            Curated Collections
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className={`${fonts.mulish} text-lg md:text-xl text-[#27190b]/60 max-w-2xl mx-auto font-light leading-relaxed`}
          >
            Discover consciously crafted pieces designed to elevate your
            journey.
          </motion.p>
        </Container>
      </div>

      <Container className="mb-24">
        {/* Filter Bar */}
        <div className="sticky top-20 z-30 bg-[#fcfbf9]/95 backdrop-blur-sm py-4 mb-12 border-b border-[#27190b]/10 supports-[backdrop-filter]:bg-[#fcfbf9]/80">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full lg:w-96">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#27190b]/40 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className={`w-full pl-12 pr-4 py-3 bg-white border border-[#27190b]/20 rounded-lg focus:ring-1 focus:ring-[#27190b]/30 focus:border-[#27190b]/40 text-[#27190b] placeholder-[#27190b]/40 transition-all ${fonts.mulish}`}
              />
            </div>

            {/* Filter Group */}
            <div className="flex flex-wrap items-center gap-3">
              <FilterDropdown
                label="Category"
                options={categoryOptions}
                value={filters.categoryId}
                onChange={(val) => handleFilterChange("categoryId", val)}
                className="w-full sm:w-60"
              />

              <PriceRangeFilter
                minPrice={filters.minPrice}
                maxPrice={filters.maxPrice}
                onApply={handlePriceApply}
                className="w-full sm:w-auto min-w-[200px]"
              />

              {/* <button
                onClick={() =>
                  handleFilterChange("featured", !filters.featured)
                }
                className={`flex items-center gap-2 px-4 py-3 border rounded-lg transition-all ${
                  filters.featured
                    ? "bg-[#27190b] border-[#27190b] text-white"
                    : "bg-white border-[#27190b]/20 text-[#27190b] hover:border-[#27190b]/40"
                } ${fonts.mulish} text-sm whitespace-nowrap`}
              >
                <span>✨ Featured</span>
              </button> */}

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-[#27190b]/60 hover:text-[#cd3d32] transition-colors whitespace-nowrap"
                >
                  <FiX className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col gap-4 animate-pulse">
                  <div className="w-full aspect-[3/4] bg-[#27190b]/5 rounded-xl" />
                  <div className="h-6 w-3/4 bg-[#27190b]/5 rounded" />
                  <div className="h-4 w-1/2 bg-[#27190b]/5 rounded" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
              >
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <ProductCard product={product} size="large" />
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-24 flex items-center justify-center">
                  <nav className="flex items-center gap-4">
                    <button
                      onClick={() => handlePageChange(pagination.previousPage!)}
                      disabled={!pagination.hasPreviousPage}
                      className="p-3 rounded-full hover:bg-[#27190b]/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-[#27190b]"
                    >
                      <FiChevronLeft className="w-6 h-6" />
                    </button>

                    <div className="flex items-center gap-2">
                      <span
                        className={`${fonts.cormorant} text-lg text-[#27190b]`}
                      >
                        Page {pagination.page} of {pagination.totalPages}
                      </span>
                    </div>

                    <button
                      onClick={() => handlePageChange(pagination.nextPage!)}
                      disabled={!pagination.hasNextPage}
                      className="p-3 rounded-full hover:bg-[#27190b]/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-[#27190b]"
                    >
                      <FiChevronRight className="w-6 h-6" />
                    </button>
                  </nav>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <span className="text-6xl mb-6 opacity-20">🌿</span>
              <h3 className={`${fonts.cormorant} text-2xl text-[#27190b] mb-3`}>
                No products found
              </h3>
              <p className={`${fonts.mulish} text-[#27190b]/60`}>
                Try adjusting your filters to find what you're looking for.
              </p>
              <button
                onClick={clearFilters}
                className="mt-6 px-8 py-3 bg-[#27190b] text-white rounded-full hover:bg-[#27190b]/90 transition-colors uppercase tracking-widest text-xs font-semibold"
              >
                View All Products
              </button>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

// Loading component for Suspense fallback
const ProductsPageLoading = () => (
  <div className="min-h-screen bg-[#fcfbf9] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#27190b]"></div>
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
