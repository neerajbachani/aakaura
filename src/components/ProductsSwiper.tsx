"use client";
import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ui/ProductCard";
import Heading from "@/components/ui/Heading";
import { Product } from "@/types/Product";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Link from "next/link";
import { BsArrowRight } from "react-icons/bs";
import fonts from "@/config/fonts";

interface ProductsSwiperProps {
  products: Product[];
  title: string;
}

const ProductsSwiper: React.FC<ProductsSwiperProps> = ({ products, title }) => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  return (
    <section className="py-16">
      {/* Section Title */}
      <div className="text-center mb-6 md:mb-8">
        <Heading title={title} tag="h2" />
      </div>

      <div className="flex justify-center mb-8">
        <Link
          className={`flex items-center justify-center gap-1 text-primaryRed hover:text-red-600 transition ${fonts.mulish} font-semibold text-base md:text-lg`}
          href="/products"
        >
          <span>See More</span>
          <BsArrowRight className="w-5 h-5 mt-1 " />
        </Link>
      </div>
      {/* Swiper Product Grid */}
      {isClient ? (
        <Swiper
          spaceBetween={20}
          slidesPerView={1.1}
          breakpoints={{
            768: {
              slidesPerView: 2.3,
              spaceBetween: 30,
              loop: true,
            },
            1024: {
              slidesPerView: 3.1,
              spaceBetween: 40,
              loop: true,
            },
          }}
        >
          {products.length > 0 ? (
            products.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <div className="col-span-full text-center text-primaryBrown/60 text-lg">
                No products to show.
              </div>
            </SwiperSlide>
          )}
        </Swiper>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-[90%] mx-auto">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-[420px] bg-secondaryBeige/60 rounded-xl animate-pulse"
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductsSwiper;
