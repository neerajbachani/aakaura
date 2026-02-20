"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  PhotoIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Combo, ComboProduct } from "@/types/Combo";
import { Product } from "@/types/Product";
import { toast } from "react-hot-toast";
import SingleImageUpload from "./SingleImageUpload";

interface ComboFormProps {
  mode: "add" | "edit";
  initialData?: Combo;
  allProducts: Product[];
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

const TIER_OPTIONS = ["ENTRY", "CORE", "PREMIUM"];
const CHAKRA_OPTIONS = [
  "grounding", // Root
  "flow", // Sacral
  "power", // Solar Plexus
  "love", // Heart
  "expression", // Throat
  "insight", // Third Eye
  "expansion", // Crown
];

export default function ComboForm({
  mode,
  initialData,
  allProducts,
  onSubmit,
  isSubmitting,
}: ComboFormProps) {
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    tier: "ENTRY",
    tagline: "",
    description: "",
    chakras: [] as string[],
    images: [] as string[],
    externalLinks: [] as { label: string; url: string }[],
  });

  const [items, setItems] = useState<
    {
      productId: string;
      variationId: string | null;
      quantity: number;
      detail: string;
      tempId: string; // for key
    }[]
  >([]);

  // Initialize Data
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        slug: initialData.slug || "",
        tier: initialData.tier || "ENTRY",
        tagline: initialData.tagline || "",
        description: initialData.description || "",
        chakras: initialData.chakras || [],
        images: initialData.images || [],
        externalLinks: initialData.externalLinks || [],
      });

      if (initialData.products) {
        setItems(
          initialData.products
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((p) => ({
              productId: p.productId,
              variationId: p.variationId || null,
              quantity: p.quantity,
              detail: p.detail || "",
              tempId: Math.random().toString(36),
            })),
        );
      }
    }
  }, [initialData]);

  // Image Management Modal State
  const [showImageModal, setShowImageModal] = useState(false);
  const [activeImageTab, setActiveImageTab] = useState<
    "upload" | "select" | "included"
  >("upload");
  const [selectedProductForImages, setSelectedProductForImages] =
    useState<string>("");
  const [newImageUrl, setNewImageUrl] = useState("");

  // Lock body + html scroll when modal is open
  useEffect(() => {
    if (showImageModal) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [showImageModal]);

  // Handlers
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleChakraToggle = (chakra: string) => {
    setFormData((prev) => {
      const exists = prev.chakras.includes(chakra);
      if (exists) {
        return { ...prev, chakras: prev.chakras.filter((c) => c !== chakra) };
      } else {
        return { ...prev, chakras: [...prev.chakras, chakra] };
      }
    });
  };

  // Image Handlers
  const handleAddImage = (url: string) => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, url] }));
    setShowImageModal(false);
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Draggable Images
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(
    null,
  );

  const moveImage = (dragIndex: number, hoverIndex: number) => {
    const newImages = [...formData.images];
    const draggedImage = newImages[dragIndex];
    newImages.splice(dragIndex, 1);
    newImages.splice(hoverIndex, 0, draggedImage);
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  // Item Handlers
  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        productId: "",
        variationId: null,
        quantity: 1,
        detail: "",
        tempId: Math.random().toString(36),
      },
    ]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    setItems((prev) => {
      const newItems = [...prev];
      newItems[index] = { ...newItems[index], [field]: value };

      // Reset variation if product changes
      if (field === "productId") {
        newItems[index].variationId = null;
      }
      return newItems;
    });
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Draggable Items
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  const moveItem = (dragIndex: number, hoverIndex: number) => {
    const newItems = [...items];
    const draggedItem = newItems[dragIndex];
    newItems.splice(dragIndex, 1);
    newItems.splice(hoverIndex, 0, draggedItem);
    setItems(newItems);
  };

  // Links Handlers
  const addLink = () => {
    setFormData((prev) => ({
      ...prev,
      externalLinks: [...prev.externalLinks, { label: "", url: "" }],
    }));
  };

  const updateLink = (index: number, field: "label" | "url", value: string) => {
    const newLinks = [...formData.externalLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setFormData((prev) => ({ ...prev, externalLinks: newLinks }));
  };

  const removeLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      externalLinks: prev.externalLinks.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Please add at least one product to the combo");
      return;
    }

    // Assign order based on current list position
    const productsWithOrder = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    await onSubmit({
      ...formData,
      products: productsWithOrder,
    });
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/combos"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {mode === "add" ? "Create New Combo" : "Edit Combo"}
          </h1>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200"
      >
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Combo Name*
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => {
                const val = e.target.value;
                handleChange("name", val);
                // Auto-generate slug if adding
                if (mode === "add") {
                  handleChange(
                    "slug",
                    val
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/^-|-$/g, ""),
                  );
                }
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug (URL ID)*
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) => handleChange("slug", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tier*
            </label>
            <select
              value={formData.tier}
              onChange={(e) => handleChange("tier", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              {TIER_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tagline (Theme)*
          </label>
          <input
            type="text"
            required
            value={formData.tagline}
            onChange={(e) => handleChange("tagline", e.target.value)}
            placeholder="e.g. Safety → Creativity"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description*
          </label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Chakras */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Associated Chakras
          </label>
          <div className="flex flex-wrap gap-2">
            {CHAKRA_OPTIONS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => handleChakraToggle(c)}
                className={`px-4 py-2 rounded-full border transition-all ${
                  formData.chakras.includes(c)
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="capitalize">{c.replace("-", " ")}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Images Section */}
        <div className="border-t pt-8">
          <div className="flex justify-between items-center mb-6">
            <label className="block text-lg font-medium text-gray-900">
              Combo Images
            </label>
            <button
              type="button"
              onClick={() => setShowImageModal(true)}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              <PlusIcon className="w-5 h-5" />
              Add Image
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {formData.images.map((img, index) => (
              <div
                key={index}
                className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50"
                draggable
                onDragStart={() => setDraggedImageIndex(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggedImageIndex !== null)
                    moveImage(draggedImageIndex, index);
                  setDraggedImageIndex(null);
                }}
              >
                <Image
                  src={img}
                  alt={`Image ${index}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
                <div className="absolute bottom-0 inset-x-0 bg-black/40 text-white text-xs p-1 text-center opacity-0 group-hover:opacity-100">
                  Drag to reorder
                </div>
              </div>
            ))}
            {formData.images.length === 0 && (
              <div
                onClick={() => setShowImageModal(true)}
                className="col-span-2 border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
              >
                <PhotoIcon className="w-12 h-12 mb-2" />
                <span>Click to add images</span>
              </div>
            )}
          </div>
        </div>

        {/* Items Section */}
        <div className="border-t pt-8">
          <div className="flex justify-between items-center mb-6">
            <label className="block text-lg font-medium text-gray-900">
              Included Items
            </label>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              <PlusIcon className="w-5 h-5" />
              Add Item
            </button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={item.tempId}
                className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 items-start md:items-center relative"
                draggable
                onDragStart={() => setDraggedItemIndex(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggedItemIndex !== null)
                    moveItem(draggedItemIndex, index);
                  setDraggedItemIndex(null);
                }}
              >
                <div className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab text-gray-400 p-2 hidden md:block">
                  <Bars3Icon className="w-5 h-5" />
                </div>

                <div className="w-full md:w-auto md:ml-8 flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Product Select */}
                  <div className="md:col-span-4">
                    <select
                      value={item.productId}
                      onChange={(e) =>
                        updateItem(index, "productId", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="">Select Product...</option>
                      {allProducts.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Variation Select */}
                  {/* <div className="md:col-span-3">
                    <select
                      value={item.variationId || ""}
                      onChange={(e) =>
                        updateItem(index, "variationId", e.target.value || null)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      disabled={!item.productId}
                    >
                      <option value="">Any / Default</option>
                      {allProducts
                        .find((p) => p.id === item.productId)
                        ?.variations?.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.name} {v.inStock ? "" : "(Out of Stock)"}
                          </option>
                        ))}
                    </select>
                  </div> */}

                  {/* Quantity */}
                  <div className="md:col-span-1">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(index, "quantity", parseInt(e.target.value))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>

                  {/* Detail Text */}
                  <div className="md:col-span-4">
                    <input
                      type="text"
                      value={item.detail}
                      onChange={(e) =>
                        updateItem(index, "detail", e.target.value)
                      }
                      placeholder="Custom label (e.g. 'Root')"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div className="flex md:block w-full md:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            {items.length === 0 && (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed">
                No items added yet.
              </div>
            )}
          </div>
        </div>

        {/* External Links */}
        <div className="border-t pt-8">
          <div className="flex justify-between items-center mb-6">
            <label className="block text-lg font-medium text-gray-900">
              External Links
            </label>
            <button
              type="button"
              onClick={addLink}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
            >
              <PlusIcon className="w-5 h-5" />
              Add Link
            </button>
          </div>
          <div className="space-y-3">
            {formData.externalLinks.map((link, index) => (
              <div key={index} className="flex gap-4">
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => updateLink(index, "label", e.target.value)}
                  placeholder="Label (e.g. Wiki)"
                  className="flex-1 px-3 py-2 border rounded-lg text-sm"
                />
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => updateLink(index, "url", e.target.value)}
                  placeholder="URL"
                  className="flex-[2] px-3 py-2 border rounded-lg text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeLink(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="border-t pt-8 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-medium text-lg shadow-sm"
          >
            {isSubmitting ? "Saving..." : "Save Combo"}
          </button>
        </div>
      </form>

      {/* Image Selection Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onWheel={(e) => e.stopPropagation()}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowImageModal(false);
          }}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
            onWheel={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">Add Image</h3>
              <button
                onClick={() => setShowImageModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="flex border-b">
              <button
                type="button"
                onClick={() => setActiveImageTab("upload")}
                className={`flex-1 py-3 font-medium ${activeImageTab === "upload" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500"}`}
              >
                Upload New
              </button>
              <button
                type="button"
                onClick={() => setActiveImageTab("included")}
                className={`flex-1 py-3 font-medium ${activeImageTab === "included" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500"}`}
              >
                From Included Items
              </button>
              <button
                type="button"
                onClick={() => setActiveImageTab("select")}
                className={`flex-1 py-3 font-medium ${activeImageTab === "select" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500"}`}
              >
                All Products
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {activeImageTab === "upload" ? (
                // ... (upload content) ...
                <div className="flex flex-col items-center gap-4">
                  <div className="w-full">
                    <SingleImageUpload
                      value={newImageUrl}
                      onChange={setNewImageUrl}
                      label="Image URL or Upload"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (newImageUrl) {
                        handleAddImage(newImageUrl);
                        setNewImageUrl("");
                      }
                    }}
                    disabled={!newImageUrl}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 hover:bg-indigo-700"
                  >
                    Add to Gallery
                  </button>
                </div>
              ) : activeImageTab === "included" ? (
                <div className="space-y-6">
                  <p className="text-sm text-gray-500">
                    Select images from products currently added to this combo.
                  </p>
                  {items.length === 0 ? (
                    <p className="text-center text-gray-400 py-8">
                      No products added to the combo yet.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 gap-6">
                      {items.map((item, idx) => {
                        const product = allProducts.find(
                          (p) => p.id === item.productId,
                        );
                        if (!product) return null;
                        return (
                          <div key={idx} className="border rounded-lg p-4">
                            <h4 className="font-medium mb-3">{product.name}</h4>
                            <div className="text-xs text-gray-500 mb-2">
                              {(() => {
                                // Debug logging
                                if (product.images?.length > 0) {
                                  console.log(
                                    `Product: ${product.name}`,
                                    product.images,
                                  );
                                }
                                return `Found ${product.images?.length || 0} images`;
                              })()}
                              {product.variations?.length
                                ? ` + ${product.variations.length} variations`
                                : ""}
                            </div>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                              {/* Main Product Images */}
                              {product.images?.map((img, i) => (
                                <button
                                  key={`main-${i}`}
                                  type="button"
                                  onClick={() => handleAddImage(img)}
                                  className="relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-indigo-500 group"
                                  title="Main Image"
                                >
                                  <Image
                                    src={img}
                                    alt=""
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                </button>
                              ))}
                              {/* Variation Images */}
                              {product.variations?.map((v: any, i) => {
                                // Variations might not have images in type, but check runtime
                                const vImg = v.image || v.images?.[0];
                                if (!vImg) return null;
                                return (
                                  <button
                                    key={`var-${i}`}
                                    type="button"
                                    onClick={() => handleAddImage(vImg)}
                                    className="relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-indigo-500 group"
                                    title={`Variation: ${v.name}`}
                                  >
                                    <Image
                                      src={vImg}
                                      alt={v.name}
                                      fill
                                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                      className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                    <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[10px] p-0.5 truncate px-1">
                                      {v.name}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <select
                    value={selectedProductForImages}
                    onChange={(e) =>
                      setSelectedProductForImages(e.target.value)
                    }
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="">Select a product to view images...</option>
                    {allProducts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>

                  {selectedProductForImages && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                      {allProducts
                        .find((p) => p.id === selectedProductForImages)
                        ?.images?.map((img, i) => (
                          <button
                            key={i}
                            onClick={() => handleAddImage(img)}
                            className="relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-indigo-500 group"
                          >
                            <Image
                              src={img}
                              alt=""
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
