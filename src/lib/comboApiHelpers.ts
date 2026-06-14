import { ApiError } from "@/middleware/errorHandler";
import { parsePriceInput } from "@/lib/comboPricing";

export function parseComboPriceFields(body: {
  price?: string | number | null;
  offerPrice?: string | number | null;
}): { price: number | null; offerPrice: number | null } {
  const price =
    body.price === null || body.price === undefined || body.price === ""
      ? null
      : typeof body.price === "number"
        ? body.price
        : parsePriceInput(String(body.price));

  const offerPrice =
    body.offerPrice === null ||
    body.offerPrice === undefined ||
    body.offerPrice === ""
      ? null
      : typeof body.offerPrice === "number"
        ? body.offerPrice
        : parsePriceInput(String(body.offerPrice));

  if (price != null && (Number.isNaN(price) || price < 0)) {
    throw new ApiError("Invalid combo price", 400);
  }
  if (offerPrice != null && (Number.isNaN(offerPrice) || offerPrice < 0)) {
    throw new ApiError("Invalid combo offer price", 400);
  }
  if (price != null && offerPrice != null && offerPrice >= price) {
    throw new ApiError("Offer price must be less than price", 400);
  }

  return { price, offerPrice };
}
