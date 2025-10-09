"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Product, ProductVariation } from "@/types/Product";
import fonts from "@/config/fonts";
import Image from "next/image";
import ProductsSwiper from "@/components/ProductsSwiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Thumbs, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import BackButton from "@/components/ui/BackButton";
import Container from "@/components/ui/Container";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { BsLightning } from "react-icons/bs";
import { Swiper as SwiperType } from "swiper";

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [selectedVariation, setSelectedVariation] =
    useState<ProductVariation | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Fetch product and recommendations
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      fetch(`/api/products/${id}`).then((r) => (r.ok ? r.json() : null)),
      fetch(`/api/products/${id}/recommendations`).then((r) =>
        r.ok ? r.json() : []
      ),
    ]).then(([prod, recs]) => {
      setProduct(prod.data);
      setRecommendations(recs);
      setLoading(false);
    });
  }, [id]);

  // Set default variation when product loads
  useEffect(() => {
    if (product && product.variations.length > 0) {
      setSelectedVariation(product.variations[0]);
    }
  }, [product]);

  if (loading || !product) {
    // Improved branded skeleton
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondaryBeige/30 to-white">
        <div className="px-6 md:px-8 py-6">
          <div className="animate-pulse">
            <div className="h-10 w-24 bg-primaryBrown/20 rounded-lg"></div>
          </div>
        </div>

        <Container>
          <main className="py-8 md:py-12">
            <div className="animate-pulse">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
                {/* Image Gallery Skeleton */}
                <div className="space-y-4">
                  <div className="w-full aspect-[4/3] bg-secondaryBeige rounded-2xl border border-primaryBrown/20 overflow-hidden">
                    <div className="w-full h-full bg-primaryBrown/10"></div>
                  </div>
                  <div className="flex gap-3">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="w-20 h-20 bg-secondaryBeige rounded-xl border border-primaryBrown/20"
                      >
                        <div className="w-full h-full bg-primaryBrown/10 rounded-xl"></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Product Info Skeleton */}
                <div className="space-y-6">
                  {/* Category */}
                  <div className="h-6 w-28 bg-primaryBrown/20 rounded-full"></div>

                  {/* Title */}
                  <div className="space-y-3">
                    <div className="h-10 w-4/5 bg-primaryBrown/40 rounded-lg"></div>
                    <div className="h-10 w-3/5 bg-primaryBrown/30 rounded-lg"></div>
                  </div>

                  {/* Price */}
                  <div className="flex items-end gap-4">
                    <div className="h-12 w-32 bg-primaryBrown/30 rounded-lg"></div>
                    <div className="h-8 w-24 bg-primaryBrown/20 rounded-lg"></div>
                  </div>

                  {/* Description */}
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-primaryBrown/20 rounded-md"></div>
                    <div className="h-4 w-5/6 bg-primaryBrown/20 rounded-md"></div>
                    <div className="h-4 w-4/5 bg-primaryBrown/20 rounded-md"></div>
                    <div className="h-4 w-3/4 bg-primaryBrown/20 rounded-md"></div>
                  </div>

                  {/* Variations */}
                  <div className="space-y-3">
                    <div className="h-5 w-36 bg-primaryBrown/30 rounded-md"></div>
                    <div className="flex gap-3">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="h-10 w-24 bg-primaryBrown/20 rounded-full"
                        ></div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <div className="h-14 flex-1 bg-primaryBrown/30 rounded-full"></div>
                    <div className="h-14 flex-1 bg-primaryBrown/20 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Recommendations Skeleton */}
              <div className="mt-24 space-y-8">
                <div className="h-10 w-48 bg-primaryBrown/30 rounded-lg"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="bg-secondaryBeige rounded-xl border border-primaryBrown/20 overflow-hidden"
                    >
                      <div className="aspect-[4/3] bg-primaryBrown/10"></div>
                      <div className="p-6 space-y-4">
                        <div className="h-5 w-20 bg-primaryBrown/20 rounded-full"></div>
                        <div className="h-6 w-3/4 bg-primaryBrown/30 rounded-md"></div>
                        <div className="space-y-2">
                          <div className="h-4 w-full bg-primaryBrown/20 rounded-md"></div>
                          <div className="h-4 w-5/6 bg-primaryBrown/20 rounded-md"></div>
                        </div>
                        <div className="h-12 w-full bg-primaryBrown/20 rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </Container>
      </div>
    );
  }

  // Gallery images
  const images =
    product.images.length > 0 ? product.images : ["/images/placeholder.png"];

  // Get current pricing based on selected variation

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondaryBeige/20 to-white">
      {/* Header */}
      <div className="px-6 md:px-8 py-6">
        <BackButton />
      </div>

      <Container>
        <main className="py-8 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            {/* Enhanced Image Gallery */}
            <div className="space-y-4">
              {/* Main Image Swiper */}
              <div className="relative group">
                <Swiper
                  spaceBetween={10}
                  navigation={false}
                  thumbs={{ swiper: thumbsSwiper }}
                  modules={[Autoplay, Pagination, Thumbs]}
                  autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                  }}
                  pagination={{
                    clickable: true,
                    dynamicBullets: true,
                  }}
                  className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-primaryBrown/20 shadow-lg bg-white"
                >
                  {images.map((img, index) => (
                    <SwiperSlide key={img}>
                      <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                        <Image
                          src={img}
                          alt={`${product.name} - Image ${index + 1}`}
                          width={640}
                          height={480}
                          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                          priority={index === 0}
                        />
                        {/* Gradient overlay for better contrast */}
                        <div className="absolute inset-0 bg-gradient-to-t from-primaryBrown/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Featured Badge */}
                {product.isFeatured && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm text-primaryBrown text-sm font-bold px-4 py-2 rounded-full shadow-sm border border-primaryBrown/20">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Featured
                    </span>
                  </div>
                )}
              </div>

              {/* Enhanced Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="px-2">
                  <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={12}
                    slidesPerView="auto"
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Thumbs]}
                    className="thumbnail-swiper"
                  >
                    {images.map((img, index) => (
                      <SwiperSlide key={img} className="!w-20 !h-20">
                        <div className="w-20 h-20 rounded-xl border-2 border-transparent overflow-hidden cursor-pointer hover:border-primaryBrown transition-all duration-200 hover:shadow-md bg-white">
                          <Image
                            src={img}
                            alt={`${product.name} thumbnail ${index + 1}`}
                            width={80}
                            height={80}
                            className="object-cover w-full h-full transition-transform duration-200 hover:scale-110"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              )}
            </div>

            <div className="space-y-8">
              {/* Category & Name */}
              <div className="space-y-4">
                {product.category?.name && (
                  <span
                    className={`inline-block px-3 py-1 rounded-full bg-primaryBeige text-primaryBrown text-xs font-medium uppercase ${fonts.mulish}`}
                  >
                    {product.category.name}
                  </span>
                )}
                <h1
                  className={`${fonts.merriweather} text-2xl md:text-3xl font-bold text-primaryBrown leading-tight`}
                >
                  {product.name}
                </h1>
              </div>

              {/* Price */}
              <div className="pb-6 border-b border-neutral-200">
                {/* If there are variations, use selected variation pricing */}
                {product.variations.length > 0 && selectedVariation ? (
                  // Check if selected variation has offer price
                  selectedVariation.offerPrice ? (
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-3xl font-bold text-primaryRed ${fonts.merriweather}`}
                      >
                        ₹{selectedVariation.offerPrice}
                      </span>
                      <span
                        className={`text-xl line-through text-neutral-400 ${fonts.mulish}`}
                      >
                        ₹{selectedVariation.price}
                      </span>
                    </div>
                  ) : (
                    <span
                      className={`text-3xl font-bold text-primaryBrown ${fonts.merriweather}`}
                    >
                      ₹{selectedVariation.price}
                    </span>
                  )
                ) : // No variations, use product pricing
                product.offerPrice ? (
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-3xl font-bold text-primaryRed ${fonts.merriweather}`}
                    >
                      ₹{product.offerPrice}
                    </span>
                    <span
                      className={`text-xl line-through text-neutral-400 ${fonts.mulish}`}
                    >
                      ₹{product.price}
                    </span>
                  </div>
                ) : (
                  <span
                    className={`text-3xl font-bold text-primaryBrown ${fonts.merriweather}`}
                  >
                    ₹{product.price}
                  </span>
                )}
              </div>

              {/* Description - Simple */}
              <p className={`${fonts.mulish} text-neutral-600 leading-relaxed`}>
                {product.description}
              </p>

              {/* Variations */}
              {product.variations.length > 0 && (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    {product.variations.map((variation) => {
                      return (
                        <button
                          key={variation.id}
                          onClick={() => setSelectedVariation(variation)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                            selectedVariation?.id === variation.id
                              ? "border-primaryBrown bg-primaryBrown text-white"
                              : "border-neutral-200 bg-white text-primaryBrown hover:border-primaryBrown/50"
                          } ${fonts.mulish}`}
                        >
                          {variation.name}

                          <span className="ml-2 text-xs opacity-75">
                            ₹{variation.offerPrice ?? variation.price}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className={`${fonts.mulish} font-medium text-primaryBrown`}>
                  Quantity:
                </span>
                <div className="flex items-center border border-neutral-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(99, quantity + 1))}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                    disabled={quantity >= 99}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <AddToCartButton
                  productId={product.id}
                  variationId={selectedVariation?.id}
                  quantity={quantity}
                  className={`flex-1 ${fonts.merriweather}`}
                  variant="primary"
                  size="lg"
                  disabled={selectedVariation ? !selectedVariation.inStock : false}
                >
                  {selectedVariation && !selectedVariation.inStock ? 'Out of Stock' : 'Add to Cart'}
                </AddToCartButton>

                <button
                  onClick={() => {
                    // For now, just redirect to checkout - you could implement buy now functionality
                    router.push('/checkout');
                  }}
                  disabled={selectedVariation ? !selectedVariation.inStock : false}
                  className={`flex-1 inline-flex items-center justify-center gap-2 bg-primaryRed text-white px-6 py-3 rounded-lg font-semibold hover:bg-primaryRed/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${fonts.merriweather}`}
                >
                  <BsLightning className="w-4 h-4" />
                  Buy Now
                </button>
              </div>

              {/* Simple trust line */}
              <div className="flex items-center justify-center gap-4 text-xs text-neutral-500 pt-2">
                <span>✓ Free Shipping</span>
                <span>✓ Secure Payment</span>
                <span>✓ Quality Assured</span>
              </div>
            </div>
          </div>

          {/* Enhanced Recommendations */}
          <div className="mt-24 pt-12 border-t border-primaryBrown/10">
            <ProductsSwiper
              products={recommendations}
              title="You may also like"
            />
          </div>
        </main>
      </Container>
    </div>
  );
};

export default ProductPage;
