"use client";
import React, { useCallback, useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Product, Category } from "@/types/Product";
import ProductCard from "@/components/ui/ProductCard";
import CategoryCard from "@/components/ui/CategoryCard";
import Container from "@/components/ui/Container";
import fonts from "@/config/fonts";
import {
  FiSearch,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiGrid,
  FiArrowLeft,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import FilterDropdown, { FilterOption } from "@/components/ui/FilterDropdown";
import PriceRangeFilter from "@/components/ui/PriceRangeFilter";
import Image from "next/image";
// import Galaxy from "@/components/ui/Galaxy";

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

  // Initialize filters from URL
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    categoryId: searchParams.get("categoryId") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
  });

  // Determines which view to show: 'categories' or 'products'
  // Show products view if any filter is active (including search or category selection)
  const isProductView =
    filters.categoryId !== "" ||
    filters.search !== "" ||
    filters.minPrice !== "" ||
    filters.maxPrice !== "" ||
    products.length > 0; // Keep showing products if they were loaded and no explicit "clear" action reverted to categories

  // However, we want the default state (no query params) to be category view.
  // And if we explicitly clear all filters, we go back to category view.
  // Let's refine the view logic based on URL params mostly to ensure consistency.
  const showCategoryGrid =
    !searchParams.get("categoryId") &&
    !searchParams.get("search") &&
    !searchParams.get("minPrice") &&
    !searchParams.get("maxPrice");

  // Fetch products with filters and pagination
  const fetchProducts = useCallback(
    async (page = 1) => {
      // Don't fetch products if we are in category grid mode and no filters are applied
      if (showCategoryGrid) {
        setProducts([]);
        return;
      }

      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.search) params.append("search", filters.search);
        if (filters.categoryId) params.append("categoryId", filters.categoryId);
        if (filters.minPrice) params.append("minPrice", filters.minPrice);
        if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
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
    [filters, showCategoryGrid],
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
    if (page > 1) params.append("page", page.toString());

    const newURL = params.toString()
      ? `/products?${params.toString()}`
      : "/products";
    router.push(newURL);
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateURL(newFilters, 1);
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

  // Clear all filters - Return to Category View
  const clearFilters = () => {
    const newFilters = {
      search: "",
      categoryId: "",
      minPrice: "",
      maxPrice: "",
    };
    setFilters(newFilters);
    updateURL(newFilters, 1);
  };

  // Handle Category Card Click
  const handleCategoryClick = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (category) {
      const slug = category.name.toLowerCase().replace(/\s+/g, "-");
      router.push(`/shop/category/${slug}`);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts(page);
  }, [filters, page, fetchProducts, searchParams, showCategoryGrid]);

  const categoryOptions: FilterOption[] = [
    { label: "All Categories", value: "" },
    ...categories.map((cat) => ({ label: cat.name, value: cat.id })),
  ];

  return (
    <div className="min-h-screen bg-[#27190b] text-[#ffe5b6]">
      {/* Galaxy Background - Subtle Texture */}

      {/* Enhanced Hero Section */}
      <div className="relative py-20 md:py-28 overflow-hidden z-10">
        {/* Decorative Mandala/Logo */}
        {/* <div className="absolute inset-0 pointer-events-none opacity-[0.05]">
          <Image
            src="/images/logo.png"
            alt=""
            width={800}
            height={800}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] object-contain animate-spin-slow invert"
          />
        </div> */}

        <Container className="relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`${fonts.cormorant} text-5xl md:text-7xl font-light text-[#ffe5b6] mb-6 leading-tight drop-shadow-md`}
          >
            {filters.categoryId
              ? categories.find((c) => c.id === filters.categoryId)?.name ||
                "Collection"
              : "Curated Collections"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className={`${fonts.mulish} text-lg md:text-xl text-[#ffe5b6]/60 max-w-2xl mx-auto font-light leading-relaxed`}
          >
            {filters.categoryId
              ? "Explore our consciously crafted pieces in this collection."
              : "Discover consciously crafted pieces designed to elevate your journey."}
          </motion.p>
        </Container>
      </div>

      <Container className="mb-24 relative z-10">
        {/* Filter Bar */}
        {/*  */}

        {/* Content Area */}
        <div className="min-h-[400px]">
          {/* View: Category Grid */}
          {showCategoryGrid ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {categories.map((category, index) => (
                <CategoryCard
                  key={category.id}
                  id={category.id}
                  name={category.name}
                  images={
                    // Extract images from the product samples attached to category.
                    // Flatten the array of product images.
                    (category as any).products?.flatMap((p: any) => p.images) ||
                    []
                  }
                  onClick={() => handleCategoryClick(category.id)}
                />
              ))}
              {categories.length === 0 && !loading && (
                <div className="col-span-full text-center py-20 text-[#ffe5b6]/40">
                  Loading Collections...
                </div>
              )}
            </motion.div>
          ) : (
            /* View: Product Grid */
            <>
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex flex-col gap-4 animate-pulse">
                      <div className="w-full aspect-[3/4] bg-[#ffe5b6]/5 rounded-xl border border-[#BD9958]/10" />
                      <div className="h-6 w-3/4 bg-[#ffe5b6]/5 rounded" />
                      <div className="h-4 w-1/2 bg-[#ffe5b6]/5 rounded" />
                    </div>
                  ))}
                </div>
              ) : products.length > 0 ? (
                <>
                  <div className="flex items-center gap-2 mb-8 text-[#ffe5b6]/60">
                    <button
                      onClick={clearFilters}
                      className="hover:text-[#BD9958] flex items-center gap-1 transition-colors"
                    >
                      <FiArrowLeft /> Back to Categories
                    </button>
                    <span>|</span>
                    <span>Showing {products.length} results</span>
                  </div>

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
                          onClick={() =>
                            handlePageChange(pagination.previousPage!)
                          }
                          disabled={!pagination.hasPreviousPage}
                          className="p-3 rounded-full hover:bg-[#ffe5b6]/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-[#ffe5b6] border border-[#BD9958]/20"
                        >
                          <FiChevronLeft className="w-6 h-6" />
                        </button>

                        <div className="flex items-center gap-2">
                          <span
                            className={`${fonts.cormorant} text-lg text-[#ffe5b6]`}
                          >
                            Page {pagination.page} of {pagination.totalPages}
                          </span>
                        </div>

                        <button
                          onClick={() => handlePageChange(pagination.nextPage!)}
                          disabled={!pagination.hasNextPage}
                          className="p-3 rounded-full hover:bg-[#ffe5b6]/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-[#ffe5b6] border border-[#BD9958]/20"
                        >
                          <FiChevronRight className="w-6 h-6" />
                        </button>
                      </nav>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <span className="text-6xl mb-6 opacity-20 filter grayscale">
                    🌿
                  </span>
                  <h3
                    className={`${fonts.cormorant} text-2xl text-[#ffe5b6] mb-3`}
                  >
                    No products found
                  </h3>
                  <p className={`${fonts.mulish} text-[#ffe5b6]/60`}>
                    Try adjusting your filters to find what you're looking for.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="mt-6 px-8 py-3 bg-[#BD9958] text-[#27190b] rounded-full hover:bg-[#BD9958]/90 transition-colors uppercase tracking-widest text-xs font-semibold"
                  >
                    View All Categories
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </Container>
    </div>
  );
};

// Loading component for Suspense fallback
const ProductsPageLoading = () => (
  <div className="min-h-screen bg-[#27190b] flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BD9958]"></div>
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
