"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiPlus, FiX, FiEdit2, FiTrash2, FiSave } from "react-icons/fi";
import { Product, ProductVariation } from "@/types/Product";
import CategoryDropdown from "./CategoryDropdown";
import ImageUpload from "./ImageUpload";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

interface ProductFormProps {
  product?: Product;
  mode: "create" | "edit";
}

export default function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    offerPrice: product?.offerPrice || "",
    categoryId: product?.categoryId || "",
    isFeatured: product?.isFeatured || false,
  });

  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(
    product?.images || []
  );
  const [variations, setVariations] = useState<ProductVariation[]>(
    product?.variations || []
  );

  const [newVariation, setNewVariation] = useState({
    name: "",
    price: "",
    offerPrice: "",
    inStock: true,
  });

  const [editingVariation, setEditingVariation] = useState<number | null>(null);
  const [editingPrice, setEditingPrice] = useState("");
  const [editingOfferPrice, setEditingOfferPrice] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const addVariation = () => {
    if (!newVariation.name.trim()) {
      toast.error("Variation name is required");
      return;
    }

    const variationPrice = newVariation.price
      ? parseFloat(newVariation.price)
      : parseFloat(formData.price.toString());

    const variationOfferPrice =
      newVariation.offerPrice && newVariation.offerPrice.trim() !== ""
        ? parseFloat(newVariation.offerPrice)
        : null;

    const variation: ProductVariation = {
      id: Date.now().toString(),
      name: newVariation.name,
      price: variationPrice,
      offerPrice: variationOfferPrice,
      inStock: newVariation.inStock,
    };

    setVariations((prev) => [...prev, variation]);
    setNewVariation({ name: "", price: "", offerPrice: "", inStock: true });
  };

  const removeVariation = (index: number) => {
    setVariations((prev) => prev.filter((_, i) => i !== index));
  };

  const startEditingVariation = (index: number) => {
    setEditingVariation(index);
    const currentPrice =
      variations[index].price || parseFloat(formData.price.toString());
    const currentOfferPrice = variations[index].offerPrice;
    setEditingPrice(currentPrice.toString());
    setEditingOfferPrice(currentOfferPrice?.toString() || "");
  };

  const saveVariationPrice = (index: number) => {
    const newPrice =
      editingPrice && editingPrice.trim() !== ""
        ? parseFloat(editingPrice)
        : parseFloat(formData.price.toString());

    const newOfferPrice =
      editingOfferPrice && editingOfferPrice.trim() !== ""
        ? parseFloat(editingOfferPrice)
        : null;

    setVariations((prev) =>
      prev.map((variation, i) =>
        i === index
          ? { ...variation, price: newPrice, offerPrice: newOfferPrice }
          : variation
      )
    );

    setEditingVariation(null);
    setEditingPrice("");
    setEditingOfferPrice("");
  };

  const cancelEditingVariation = () => {
    setEditingVariation(null);
    setEditingPrice("");
    setEditingOfferPrice("");
  };

  const handleDelete = async () => {
    if (!product?.id) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${Cookies.get("admin_token")}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete product");
      }

      toast.success("Product deleted successfully!");
      router.push("/admin/products");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete product"
      );
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const processedVariations = variations.map((variation) => ({
        ...variation,
        price: variation.price || parseFloat(formData.price.toString()),
        offerPrice: variation.offerPrice || null,
      }));

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price.toString());
      if (formData.offerPrice) {
        formDataToSend.append("offerPrice", formData.offerPrice.toString());
      }
      formDataToSend.append("categoryId", formData.categoryId);
      formDataToSend.append("isFeatured", formData.isFeatured.toString());
      formDataToSend.append("variations", JSON.stringify(processedVariations));
      formDataToSend.append("existingImages", JSON.stringify(existingImages));

      images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      const url =
        mode === "create"
          ? "/api/admin/products"
          : `/api/admin/products/${product?.id}`;

      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        body: formDataToSend,
        headers: {
          Authorization: `Bearer ${Cookies.get("admin_token")}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
      }

      toast.success(
        mode === "create"
          ? "Product created successfully!"
          : "Product updated successfully!"
      );
      router.push("/admin/products");
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondaryBeige to-secondaryBeige/50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-primaryBrown">
            {mode === "create" ? "Create New Product" : "Edit Product"}
          </h1>
          <p className="text-primaryBrown/60 mt-1">
            {mode === "create"
              ? "Add a new product to your store"
              : "Update product information"}
          </p>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold text-primaryBrown mb-4">
                Delete Product
              </h3>
              <p className="text-primaryBrown/70 mb-6">
                Are you sure you want to delete &quot;{product?.name}&quot;?
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-primaryBrown/20 rounded-lg text-primaryBrown hover:bg-primaryBeige/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Card */}
          <div className="bg-white rounded-xl shadow-sm border border-primaryBrown/10 p-6">
            <h2 className="text-lg font-semibold text-primaryBrown mb-4">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primaryBrown mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-primaryBrown/20 rounded-lg focus:ring-2 focus:ring-primaryRed focus:border-transparent"
                  placeholder="Enter product name"
                  required
                />
              </div>

              <CategoryDropdown
                value={formData.categoryId}
                onChange={(categoryId) =>
                  setFormData((prev) => ({ ...prev, categoryId }))
                }
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-primaryBrown mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-primaryBrown/20 rounded-lg focus:ring-2 focus:ring-primaryRed focus:border-transparent"
                placeholder="Describe your product..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-primaryBrown mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-primaryBrown/20 rounded-lg focus:ring-2 focus:ring-primaryRed focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primaryBrown mb-2">
                  Offer Price (₹)
                </label>
                <input
                  type="number"
                  name="offerPrice"
                  value={formData.offerPrice}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-primaryBrown/20 rounded-lg focus:ring-2 focus:ring-primaryRed focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primaryRed focus:ring-primaryRed rounded"
                />
                <span className="text-sm font-medium text-primaryBrown">
                  Featured Product (Show on home page)
                </span>
              </label>
            </div>
          </div>

          {/* Images Card */}
          <div className="bg-white rounded-xl shadow-sm border border-primaryBrown/10 p-6">
            <ImageUpload
              images={images}
              existingImages={existingImages}
              onImagesChange={setImages}
              onExistingImagesChange={setExistingImages}
            />
          </div>

          {/* Variations Card */}
          <div className="bg-white rounded-xl shadow-sm border border-primaryBrown/10 p-6">
            <h2 className="text-lg font-semibold text-primaryBrown mb-4">
              Product Variations
            </h2>

            {/* Add New Variation */}
            <div className="bg-primaryBeige/30 p-4 rounded-lg mb-4">
              <h3 className="text-sm font-medium text-primaryBrown mb-3">
                Add New Variation
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input
                  type="text"
                  placeholder="Variation name (e.g., Red, Large)"
                  value={newVariation.name}
                  onChange={(e) =>
                    setNewVariation((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="px-3 py-2 border border-primaryBrown/20 rounded-lg focus:ring-2 focus:ring-primaryRed focus:border-transparent text-sm"
                />
                <input
                  type="number"
                  placeholder={`Price (default: ₹${formData.price || 0})`}
                  value={newVariation.price}
                  onChange={(e) =>
                    setNewVariation((prev) => ({
                      ...prev,
                      price: e.target.value,
                    }))
                  }
                  className="px-3 py-2 border border-primaryBrown/20 rounded-lg focus:ring-2 focus:ring-primaryRed focus:border-transparent text-sm"
                  min="0"
                  step="0.01"
                />
                <input
                  type="number"
                  placeholder="Offer Price (optional)"
                  value={newVariation.offerPrice}
                  onChange={(e) =>
                    setNewVariation((prev) => ({
                      ...prev,
                      offerPrice: e.target.value,
                    }))
                  }
                  className="px-3 py-2 border border-primaryBrown/20 rounded-lg focus:ring-2 focus:ring-primaryRed focus:border-transparent text-sm"
                  min="0"
                  step="0.01"
                />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newVariation.inStock}
                    onChange={(e) =>
                      setNewVariation((prev) => ({
                        ...prev,
                        inStock: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 text-primaryRed focus:ring-primaryRed rounded"
                  />
                  <span className="text-sm text-primaryBrown">In Stock</span>
                </label>
              </div>
              <button
                type="button"
                onClick={addVariation}
                className="mt-3 inline-flex items-center gap-2 bg-primaryRed text-white px-3 py-2 rounded-lg hover:bg-primaryRed/90 transition-colors text-sm"
              >
                <FiPlus className="w-3 h-3" />
                Add Variation
              </button>
            </div>

            {/* Existing Variations */}
            {variations.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-primaryBrown mb-3">
                  Current Variations ({variations.length})
                </h3>
                <div className="space-y-2">
                  {variations.map((variation, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-primaryBeige/20 border border-primaryBrown/10 rounded-lg p-3"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span className="font-medium text-primaryBrown text-sm min-w-[80px]">
                          {variation.name}
                        </span>

                        {editingVariation === index ? (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-primaryBrown/70">
                                ₹
                              </span>
                              <input
                                type="number"
                                value={editingPrice}
                                onChange={(e) =>
                                  setEditingPrice(e.target.value)
                                }
                                className="w-16 px-2 py-1 border border-primaryBrown/20 rounded-md focus:ring-2 focus:ring-primaryRed focus:border-transparent text-xs"
                                min="0"
                                step="0.01"
                                placeholder="Price"
                                autoFocus
                              />
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-primaryBrown/70">
                                ₹
                              </span>
                              <input
                                type="number"
                                value={editingOfferPrice}
                                onChange={(e) =>
                                  setEditingOfferPrice(e.target.value)
                                }
                                className="w-16 px-2 py-1 border border-primaryBrown/20 rounded-md focus:ring-2 focus:ring-primaryRed focus:border-transparent text-xs"
                                min="0"
                                step="0.01"
                                placeholder="Offer"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => saveVariationPrice(index)}
                              className="text-green-600 hover:text-green-700 text-xs"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={cancelEditingVariation}
                              className="text-gray-500 hover:text-gray-700 text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-primaryBrown/70 text-sm">
                              ₹{variation.price || formData.price}
                            </span>
                            {variation.offerPrice && (
                              <span className="text-primaryRed text-sm">
                                ₹{variation.offerPrice}
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => startEditingVariation(index)}
                              className="text-primaryBrown/50 hover:text-primaryRed p-1"
                            >
                              <FiEdit2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}

                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            variation.inStock
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {variation.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeVariation(index)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4">
            {mode === "edit" && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiTrash2 className="w-4 h-4" />
                Delete Product
              </button>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-primaryRed text-white px-6 py-2 rounded-lg hover:bg-primaryRed/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
            >
              {loading ? (
                "Saving..."
              ) : (
                <>
                  <FiSave className="w-4 h-4" />
                  {mode === "create" ? "Create Product" : "Update Product"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
