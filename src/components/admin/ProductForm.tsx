"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import SingleImageUpload from "./SingleImageUpload";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Variant {
  color: string;
  name: string;
  image: string;
}

interface ProductFormProps {
  mode: "add" | "edit";
  journey: any;
  clientType: "soul-luxury" | "energy-curious";
  initialData?: any;
  onSubmit: (formData: any) => Promise<void>;
  isSubmitting: boolean;
  existingCategories?: string[];
}

export default function ProductForm({
  mode,
  journey,
  clientType,
  initialData,
  onSubmit,
  isSubmitting,
  existingCategories = [],
}: ProductFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<{
    id: string;
    name: string;
    sanskritName: string;
    description: string;
    specificDescription: string;
    price: string;
    ethos: string;
    whatItsFor: string;
    features: string[];
    images: string[];
    mobileImages: string[];
    variants: Variant[];
    step: number;
    category: string;
    symbolism: string;
    languageEngraving: string;
    designBreakdown: string;
    careInstructions: string;
    idealFor: string;
    specifications: { key: string; value: string }[];
    additionalSectionTitle: string;
    additionalSectionContent: string;
  }>({
    id: "",
    name: "",
    sanskritName: "",
    description: "",
    specificDescription: "",
    price: "",
    ethos: "",
    whatItsFor: "",
    features: [""],
    images: [""],
    mobileImages: [""],
    variants: [],
    step: 1,
    category: "",
    symbolism: "",
    languageEngraving: "",
    designBreakdown: "",
    careInstructions: "",
    idealFor: "",
    specifications: [{ key: "", value: "" }],
    additionalSectionTitle: "",
    additionalSectionContent: "",
  });

  // Initialize form with product data
  useEffect(() => {
    if (mode === "edit" && initialData) {
      // Convert specifications object to key-value array for editing
      const specsArray = initialData.specifications
        ? Object.entries(initialData.specifications)
            .filter(([_, v]) => v)
            .map(([key, value]) => ({ key, value: String(value) }))
        : [{ key: "", value: "" }];

      setFormData({
        id: initialData.id || "",
        name: initialData.name || "",
        sanskritName: initialData.sanskritName || "",
        description: initialData.description || "",
        specificDescription: initialData.specificDescription || "",
        price: initialData.price || "",
        ethos: initialData.ethos || "",
        whatItsFor: initialData.whatItsFor || "",
        features:
          initialData.features && initialData.features.length > 0
            ? initialData.features
            : [""],
        images:
          initialData.images && initialData.images.length > 0
            ? initialData.images
            : [""],
        mobileImages:
          initialData.mobileImages && initialData.mobileImages.length > 0
            ? initialData.mobileImages
            : initialData.images && initialData.images.length > 0
              ? new Array(initialData.images.length).fill("")
              : [""],
        variants: initialData.variants || [],
        step: initialData.step || 1,
        category: initialData.category || "",
        symbolism: initialData.symbolism || "",
        languageEngraving: initialData.languageEngraving || "",
        designBreakdown:
          typeof initialData.designBreakdown === "string"
            ? initialData.designBreakdown
            : Array.isArray(initialData.designBreakdown)
              ? initialData.designBreakdown
                  .map((item: any) => `${item.title}\n${item.description}`)
                  .join("\n\n")
              : "",
        careInstructions: initialData.careInstructions || "",
        idealFor: initialData.idealFor || "",
        specifications:
          specsArray.length > 0 ? specsArray : [{ key: "", value: "" }],
        additionalSectionTitle: initialData.additionalSection?.title || "",
        additionalSectionContent: initialData.additionalSection?.content || "",
      });
    } else if (mode === "add" && journey) {
      // Generate ID for new product
      const existingProducts = journey.content?.[clientType] || [];
      const maxStep = existingProducts.reduce(
        (max: number, p: any) => Math.max(max, p.step || 0),
        0,
      );
      const prefix = clientType === "soul-luxury" ? "sl" : "ec";
      const newId = `${journey.slug}-${prefix}-${existingProducts.length + 1}`;

      setFormData((prev) => ({
        ...prev,
        id: newId,
        step: maxStep + 1,
        category: "",
      }));
    }
  }, [mode, initialData, journey, clientType]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (
    field: "features" | "images",
    index: number,
    value: string,
  ) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  const handleMobileImageChange = (index: number, value: string) => {
    const newMobileImages = [...formData.mobileImages];
    // Ensure array is long enough
    while (newMobileImages.length <= index) {
      newMobileImages.push("");
    }
    newMobileImages[index] = value;
    setFormData((prev) => ({ ...prev, mobileImages: newMobileImages }));
  };

  const addArrayItem = (field: "features" | "images") => {
    if (field === "images") {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ""],
        mobileImages: [...prev.mobileImages, ""],
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
    }
  };

  const removeArrayItem = (field: "features" | "images", index: number) => {
    if (field === "images") {
      const newImages = formData.images.filter((_, i) => i !== index);
      const newMobileImages = formData.mobileImages.filter(
        (_, i) => i !== index,
      );
      setFormData((prev) => ({
        ...prev,
        images: newImages.length > 0 ? newImages : [""],
        mobileImages: newMobileImages.length > 0 ? newMobileImages : [""],
      }));
    } else {
      const newArray = formData[field].filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        [field]: newArray.length > 0 ? newArray : [""],
      }));
    }
  };

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, { color: "#000000", name: "", image: "" }],
    }));
  };

  const removeVariant = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleVariantChange = (
    index: number,
    field: keyof Variant,
    value: string,
  ) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData((prev) => ({ ...prev, variants: newVariants }));
  };

  const handleSpecChange = (
    index: number,
    field: "key" | "value",
    value: string,
  ) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    setFormData((prev) => ({ ...prev, specifications: newSpecs }));
  };

  const addSpecRow = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { key: "", value: "" }],
    }));
  };

  const removeSpecRow = (index: number) => {
    const newSpecs = formData.specifications.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      specifications: newSpecs.length > 0 ? newSpecs : [{ key: "", value: "" }],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert specifications array back to object
    const specsObj: Record<string, string> = {};
    formData.specifications.forEach(({ key, value }) => {
      if (key.trim() && value.trim()) {
        specsObj[key.trim()] = value.trim();
      }
    });

    // Clean up empty strings from arrays
    const cleanedData = {
      ...formData,
      features: formData.features.filter((f) => f.trim() !== ""),
      images: formData.images.filter((img) => img.trim() !== ""),
      mobileImages: formData.mobileImages ? formData.mobileImages : undefined,
      specifications: Object.keys(specsObj).length > 0 ? specsObj : undefined,
      category: formData.category.trim() || undefined,
      symbolism: formData.symbolism.trim() || undefined,
      languageEngraving: formData.languageEngraving.trim() || undefined,
      designBreakdown: formData.designBreakdown.trim() || undefined,
      careInstructions: formData.careInstructions.trim() || undefined,
      idealFor: formData.idealFor.trim() || undefined,
      additionalSection:
        formData.additionalSectionTitle.trim() &&
        formData.additionalSectionContent.trim()
          ? {
              title: formData.additionalSectionTitle.trim(),
              content: formData.additionalSectionContent.trim(),
            }
          : undefined,
    };

    await onSubmit(cleanedData);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/products-settings"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {mode === "add" ? "Add New Product" : "Edit Product"}
          </h1>
          <p className="text-gray-600 mt-1">
            {journey?.name} •{" "}
            <span className="capitalize">{clientType?.replace("-", " ")}</span>
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-200"
      >
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product ID*
            </label>
            <input
              type="text"
              value={formData.id}
              onChange={(e) => handleChange("id", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
              required
              disabled={mode === "edit"}
            />
            {mode === "edit" && (
              <p className="text-xs text-gray-500 mt-1">ID cannot be changed</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Order Sequence (Step Number)*
            </label>
            <input
              type="number"
              value={formData.step}
              onChange={(e) => handleChange("step", parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
              min="1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Current order position in the journey list
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name*
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg font-medium"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                list="categories-list"
                placeholder="e.g. Wall Arts"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <datalist id="categories-list">
                {existingCategories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
              {/* Suggested Categories Chips */}
              {existingCategories.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs text-gray-500 my-auto">
                    Suggestions:
                  </span>
                  {existingCategories.slice(0, 5).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleChange("category", cat)}
                      className="text-xs bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 px-2 py-1 rounded-full border border-gray-200 transition-colors"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price*
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                placeholder="₹4,500"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sanskrit Name
            </label>
            <input
              type="text"
              value={formData.sanskritName}
              onChange={(e) => handleChange("sanskritName", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-serif"
              placeholder="Devanagari or Transliterated"
            />
          </div>
        </div>

        <div className="border-t pt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Short Description*
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
            placeholder="Brief overview shown on cards"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Detailed Description*
          </label>
          <textarea
            value={formData.specificDescription}
            onChange={(e) =>
              handleChange("specificDescription", e.target.value)
            }
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
            placeholder="Complete product story and details"
          />
        </div>

        {/* Premium Detailing Fields */}
        <div className="bg-gray-50 p-6 rounded-lg space-y-6 border border-gray-100">
          <h3 className="font-semibold text-gray-900 border-b pb-2">
            Premium Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Symbolism
              </label>
              <textarea
                value={formData.symbolism}
                onChange={(e) => handleChange("symbolism", e.target.value)}
                rows={3}
                placeholder="Represents grounding, stability, and connection to Earth energy"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language Engraving
              </label>
              <textarea
                value={formData.languageEngraving}
                onChange={(e) =>
                  handleChange("languageEngraving", e.target.value)
                }
                rows={3}
                placeholder='Sanskrit — "Muladhara"'
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Design Breakdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Design Breakdown & Symbolism
            </label>
            <p className="text-xs text-gray-500 mb-2 bg-white inline-block px-2 py-1 rounded border">
              Supports Markdown: **bold**, - bullet lists
            </p>
            <textarea
              value={formData.designBreakdown}
              onChange={(e) => handleChange("designBreakdown", e.target.value)}
              rows={8}
              placeholder="**Chakra-aligned design language**\nEvery piece corresponds to a specific chakra frequency...\n\n**Intentional materials & form**\n- Hand-wrapped yarn spirals represent energy movement"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
            />
          </div>
        </div>

        {/* Care & Ideal For */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Care Instructions
            </label>
            <textarea
              value={formData.careInstructions}
              onChange={(e) => handleChange("careInstructions", e.target.value)}
              rows={3}
              placeholder="Clean gently with a soft, dry cloth. Avoid water and chemicals."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ideal For
            </label>
            <textarea
              value={formData.idealFor}
              onChange={(e) => handleChange("idealFor", e.target.value)}
              rows={3}
              placeholder="Meditation spaces, workspaces, living areas"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Specifications Key-Value Editor */}
        <div className="border p-6 rounded-lg bg-gray-50/50">
          <div className="flex justify-between items-center mb-4">
            <label className="block font-medium text-gray-900">
              Specifications
            </label>
            <button
              type="button"
              onClick={addSpecRow}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              Add Specification
            </button>
          </div>
          <div className="space-y-3">
            {formData.specifications.map((spec, index) => (
              <div key={index} className="flex gap-3 items-start">
                <div className="w-1/3">
                  <input
                    type="text"
                    value={spec.key}
                    onChange={(e) =>
                      handleSpecChange(index, "key", e.target.value)
                    }
                    placeholder="Key (e.g. Material)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) =>
                      handleSpecChange(index, "value", e.target.value)
                    }
                    placeholder="Value (e.g. Premium wool)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />
                </div>
                {formData.specifications.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSpecRow(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                    title="Remove specification"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ethos*
            </label>
            <textarea
              value={formData.ethos}
              onChange={(e) => handleChange("ethos", e.target.value)}
              rows={3}
              placeholder={
                clientType === "soul-luxury"
                  ? "Production ethos"
                  : "Energetic ethos"
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What It's For*
            </label>
            <textarea
              value={formData.whatItsFor}
              onChange={(e) => handleChange("whatItsFor", e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Additional Custom Section */}
        <div className="border border-dashed border-gray-300 p-6 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Extra Section (Optional)
          </label>
          <p className="text-xs text-gray-500 mb-4">
            Adds a new accordion after Design Breakdown. Both title and content
            are required to show.
          </p>
          <div className="space-y-4">
            <input
              type="text"
              value={formData.additionalSectionTitle}
              onChange={(e) =>
                handleChange("additionalSectionTitle", e.target.value)
              }
              placeholder="Section Title (e.g. When to Work with Root Chakra)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <textarea
              value={formData.additionalSectionContent}
              onChange={(e) =>
                handleChange("additionalSectionContent", e.target.value)
              }
              rows={4}
              placeholder="**Markdown Content**"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
            />
          </div>
        </div>

        {/* Features Array */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Features*
            </label>
            <button
              type="button"
              onClick={() => addArrayItem("features")}
              className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <PlusIcon className="w-4 h-4" />
              Add Feature
            </button>
          </div>
          <div className="space-y-3">
            {formData.features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) =>
                    handleArrayChange("features", index, e.target.value)
                  }
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Feature description"
                />
                {formData.features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem("features", index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Images Array with Mobile Support */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Product Images
            </label>
            <button
              type="button"
              onClick={() => addArrayItem("images")}
              className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <PlusIcon className="w-4 h-4" />
              Add Image
            </button>
          </div>
          <div className="space-y-4">
            {formData.images.map((image, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg bg-gray-50 flex flex-col gap-3"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Image {index + 1}
                  </span>
                  {formData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem("images", index)}
                      className="text-red-600 hover:text-red-700 text-xs flex items-center gap-1 font-medium"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Desktop Image Input */}
                  <div>
                    <SingleImageUpload
                      label="Desktop / Main URL*"
                      value={formData.images[index]}
                      onChange={(url) =>
                        handleArrayChange("images", index, url)
                      }
                      placeholder="Upload or enter URL"
                    />
                  </div>

                  {/* Mobile Image Input */}
                  <div>
                    <SingleImageUpload
                      label="Mobile URL (Optional)"
                      value={formData.mobileImages[index] || ""}
                      onChange={(url) => handleMobileImageChange(index, url)}
                      placeholder="Same as desktop if empty"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Variants (Optional) */}
        <div className="border border-gray-200 p-6 rounded-xl">
          <div className="flex justify-between items-center mb-4">
            <div>
              <label className="block font-medium text-gray-900">
                Variants (Optional)
              </label>
              <p className="text-sm text-gray-500">
                Different colors or styles of the same product
              </p>
            </div>
            <button
              type="button"
              onClick={addVariant}
              className="text-sm font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100"
            >
              <PlusIcon className="w-4 h-4" />
              Add Variant
            </button>
          </div>
          <div className="space-y-4">
            {formData.variants.map((variant, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50"
              >
                <div className="md:col-span-1">
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
                    Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={variant.color}
                      onChange={(e) =>
                        handleVariantChange(index, "color", e.target.value)
                      }
                      className="w-10 h-10 rounded-lg cursor-pointer border-2 border-white shadow-sm"
                    />
                  </div>
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
                    Variant Name
                  </label>
                  <input
                    type="text"
                    value={variant.name}
                    onChange={(e) =>
                      handleVariantChange(index, "name", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="e.g. Saddle Brown"
                  />
                </div>
                <div className="md:col-span-7">
                  <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={variant.image}
                    onChange={(e) =>
                      handleVariantChange(index, "image", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    placeholder="/images/variant.jpg"
                  />
                </div>
                <div className="md:col-span-1 flex items-end justify-end">
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="p-2 text-red-600 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                    title="Remove variant"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            {formData.variants.length === 0 && (
              <p className="text-center text-gray-500 italic py-4">
                No variants added yet.
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between gap-4 pt-8 border-t border-gray-100">
          <Link
            href="/admin/products-settings"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2 font-semibold shadow-sm hover:shadow-md"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : mode === "add" ? (
              "Create Product"
            ) : (
              "Update Product"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
