import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product, ProductVariation } from "@/types/Product";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import fonts from "@/config/fonts";

interface ProductCardProps {
  product: Product;
  size?: "small" | "large";
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  size = "small",
}) => {
  const imageUrl = product.images[0] || "/images/placeholder.png";

  // Helper function to get the best price for a variation
  const getBestPrice = (variation: ProductVariation, product: Product) => {
    const variationPrice = variation.price || product.price;
    const variationOffer = variation.offerPrice;

    // If variation has its own offer price
    if (variationOffer && variationOffer < variationPrice) {
      return {
        currentPrice: variationOffer,
        originalPrice: variationPrice,
        hasOffer: true,
      };
    }

    // No offers, use variation price
    return {
      currentPrice: variationPrice,
      originalPrice: null,
      hasOffer: false,
    };
  };

  // Get the best pricing for display
  const getDisplayPricing = () => {
    if (product.variations.length === 0) {
      // No variations, use product pricing
      const hasOffer =
        !!product.offerPrice && product.offerPrice < product.price;
      return {
        currentPrice: hasOffer ? product.offerPrice! : product.price,
        originalPrice: hasOffer ? product.price : null,
        hasOffer,
      };
    }

    // Get the lowest price from all variations (ignore product-level pricing)
    let lowestPrice = Infinity;
    let lowestOfferPrice = Infinity;
    let hasAnyOffer = false;

    product.variations.forEach((variation) => {
      const pricing = getBestPrice(variation, product);
      if (pricing.hasOffer) {
        hasAnyOffer = true;
        if (pricing.currentPrice < lowestOfferPrice) {
          lowestOfferPrice = pricing.currentPrice;
          lowestPrice = pricing.originalPrice!;
        }
      } else {
        if (pricing.currentPrice < lowestPrice) {
          lowestPrice = pricing.currentPrice;
        }
      }
    });

    if (hasAnyOffer) {
      return {
        currentPrice: lowestOfferPrice,
        originalPrice: lowestPrice,
        hasOffer: true,
      };
    }

    return {
      currentPrice: lowestPrice,
      originalPrice: null,
      hasOffer: false,
    };
  };

  const pricing = getDisplayPricing();

  // Size-specific styles
  const cardStyles = {
    small: {
      container:
        "flex flex-col bg-white border border-neutral-200 rounded-xl shadow-sm p-4 transition-all hover:shadow-md hover:border-primaryBrown focus-within:shadow-md focus-within:border-primaryBrown outline-none h-[480px] md:h-[536px] lg:[550px]",
      image:
        "w-full aspect-[4/3] rounded-lg overflow-hidden border border-neutral-100 shadow-sm mb-4 flex items-center justify-center bg-neutral-50 flex-shrink-0",
      title: `${fonts.merriweather} text-lg font-bold text-primaryBrown line-clamp-2 mb-0`,
      description: `${fonts.mulish} text-neutral-500 text-sm line-clamp-2 mb-0`,
      price: "text-lg font-bold",
      originalPrice: "text-sm line-through text-neutral-400",
      button:
        "w-full inline-flex items-center justify-center gap-2 bg-primaryBrown text-white px-6 py-2 rounded-full font-semibold shadow-sm hover:bg-neutral-800 focus-visible:bg-neutral-800 transition-colors duration-200 text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-primaryBrown",
      icon: "w-4 h-4 transition-transform duration-200",
    },
    large: {
      container:
        "flex flex-col bg-white border border-neutral-200 rounded-xl shadow-sm p-6 transition-all hover:shadow-md hover:border-primaryBrown focus-within:shadow-md focus-within:border-primaryBrown outline-none h-[510px] md:h-[600px]",
      image:
        "w-full aspect-[4/3] rounded-lg overflow-hidden border border-neutral-100 shadow-sm mb-6 flex items-center justify-center bg-neutral-50 flex-shrink-0",
      title: `${fonts.merriweather} text-xl font-bold text-primaryBrown line-clamp-2 mb-0`,
      description: `${fonts.mulish} text-neutral-500 text-base leading-relaxed line-clamp-3 mb-0`,
      price: "text-xl font-bold",
      originalPrice: "text-base line-through text-neutral-400",
      button:
        "w-full inline-flex items-center justify-center gap-2 bg-primaryBrown text-white px-6 py-3 rounded-full font-semibold shadow-sm hover:bg-neutral-800 focus-visible:bg-neutral-800 transition-colors duration-200 text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primaryBrown",
      icon: "w-5 h-5 transition-transform duration-200",
    },
  };

  const styles = cardStyles[size];

  return (
    <div
      className={styles.container}
      tabIndex={0}
      aria-label={`Product card for ${product.name}`}
    >
      {/* Product Image - Fixed height */}
      <div className={styles.image}>
        <Image
          src={imageUrl}
          alt={product.name}
          width={size === "large" ? 400 : 320}
          height={size === "large" ? 300 : 240}
          className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105"
        />
      </div>

      {/* Card Content - Flexible height with consistent spacing */}
      <div className="flex flex-col flex-1 w-full space-y-4">
        {/* Top Content Section */}
        <div className="flex flex-col gap-y-2">
          {/* Category Chip */}
          {product.category?.name && (
            <span
              className={`self-start px-2 py-0.5 rounded-full bg-neutral-100 text-primaryBrown text-xs font-semibold tracking-wide uppercase ${fonts.mulish}`}
            >
              {product.category.name}
            </span>
          )}
          {/* Product Name */}
          <h3 className={styles.title}>{product.name}</h3>
          {/* Description */}
          <p className={styles.description}>{product.description}</p>

          {/* Variations - Fixed height section */}
          <div className="h-8 flex items-start mt-1">
            {product.variations.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {product.variations.slice(0, 2).map((v) => (
                  <span
                    key={v.id}
                    className={`px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-primaryBrown border border-neutral-200 ${fonts.mulish}`}
                  >
                    {v.name}
                  </span>
                ))}
                {product.variations.length > 2 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-200 text-primaryBrown border border-neutral-300 ${fonts.mulish}`}
                  >
                    +{product.variations.length - 2} more
                  </span>
                )}
              </div>
            ) : (
              // Empty space to maintain consistent height
              <div></div>
            )}
          </div>
        </div>

        {/* Bottom Section - Price and Button */}
        <div className="flex flex-col gap-y-3 mt-2">
          {/* Price & Offer */}
          <div className="flex items-end gap-2">
            {pricing.hasOffer ? (
              <>
                <span
                  className={`text-primaryRed ${styles.price} ${fonts.merriweather}`}
                >
                  ₹{pricing.currentPrice}
                </span>
                <span className={`${styles.originalPrice} ${fonts.mulish}`}>
                  ₹{pricing.originalPrice}
                </span>
              </>
            ) : (
              <span
                className={`text-primaryBrown ${styles.price} ${fonts.merriweather}`}
              >
                ₹{pricing.currentPrice}
              </span>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            {/* Quick Add to Cart - only show if no variations or single variation */}
            {product.variations.length <= 1 && (
              <AddToCartButton
                productId={product.id}
                variationId={product.variations[0]?.id}
                quantity={1}
                className="flex-1"
                variant="outline"
                size={size === "large" ? "md" : "sm"}
                disabled={product.variations[0] ? !product.variations[0].inStock : false}
              >
                {product.variations[0] && !product.variations[0].inStock ? 'Out of Stock' : 'Add to Cart'}
              </AddToCartButton>
            )}
            
            {/* View Details Button */}
            <Link
              href={`/products/${product.id}`}
              tabIndex={0}
              aria-label={`View details for ${product.name}`}
              className={`${product.variations.length <= 1 ? 'flex-1' : 'w-full'} inline-flex items-center justify-center gap-2 bg-primaryBrown text-white px-4 py-2 rounded-lg font-semibold hover:bg-primaryBrown/90 transition-colors duration-200 text-center ${size === 'large' ? 'text-base py-3' : 'text-sm'} ${fonts.merriweather}`}
            >
              {product.variations.length > 1 ? 'Choose Options' : 'View Details'}
              <svg
                className={size === 'large' ? 'w-5 h-5' : 'w-4 h-4'}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
