"use client";

import { useState, useEffect } from "react";
import { XMarkIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

interface Variant {
  color: string;
  name: string;
  image: string;
}

interface ProductFormModalProps {
  mode: 'add' | 'edit';
  journey: any;
  clientType: 'soul-luxury' | 'energy-curious';
  product: any | null;
  onSubmit: (formData: any) => void;
  onClose: () => void;
  isLoading: boolean;
}

export default function ProductFormModal({
  mode,
  journey,
  clientType,
  product,
  onSubmit,
  onClose,
  isLoading,
}: ProductFormModalProps) {
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
    variants: Variant[];
    step: number;
  }>({
    id: '',
    name: '',
    sanskritName: '',
    description: '',
    specificDescription: '',
    price: '',
    ethos: '',
    whatItsFor: '',
    features: [''],
    images: [''],
    variants: [],
    step: 1,
  });

  // Initialize form with product data in edit mode
  useEffect(() => {
    if (mode === 'edit' && product) {
      setFormData({
        id: product.id || '',
        name: product.name || '',
        sanskritName: product.sanskritName || '',
        description: product.description || '',
        specificDescription: product.specificDescription || '',
        price: product.price || '',
        ethos: product.ethos || '',
        whatItsFor: product.whatItsFor || '',
        features: product.features && product.features.length > 0 ? product.features : [''],
        images: product.images && product.images.length > 0 ? product.images : [''],
        variants: product.variants || [],
        step: product.step || 1,
      });
    } else if (mode === 'add') {
      // Generate ID for new product
      const existingProducts = journey.content?.[clientType] || [];
      const maxStep = existingProducts.reduce((max: number, p: any) => Math.max(max, p.step || 0), 0);
      const prefix = clientType === 'soul-luxury' ? 'sl' : 'ec';
      const newId = `${journey.slug}-${prefix}-${existingProducts.length + 1}`;
      
      setFormData(prev => ({
        ...prev,
        id: newId,
        step: maxStep + 1,
      }));
    }
  }, [mode, product, journey, clientType]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: 'features' | 'images', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field: 'features' | 'images') => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (field: 'features' | 'images', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [field]: newArray.length > 0 ? newArray : [''] }));
  };

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { color: '#000000', name: '', image: '' }],
    }));
  };

  const removeVariant = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleVariantChange = (index: number, field: keyof Variant, value: string) => {
    const newVariants = [...formData.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData(prev => ({ ...prev, variants: newVariants }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clean up empty strings from arrays
    const cleanedData = {
      ...formData,
      features: formData.features.filter(f => f.trim() !== ''),
      images: formData.images.filter(img => img.trim() !== ''),
    };

    onSubmit(cleanedData);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {mode === 'add' ? 'Add New Product' : 'Edit Product'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {journey.name} • {clientType === 'soul-luxury' ? 'Soul Luxury' : 'Energy Curious'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product ID*
                </label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => handleChange('id', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                  disabled={mode === 'edit'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Step Number*
                </label>
                <input
                  type="number"
                  value={formData.step}
                  onChange={(e) => handleChange('step', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                  min="1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name*
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sanskrit Name
                </label>
                <input
                  type="text"
                  value={formData.sanskritName}
                  onChange={(e) => handleChange('sanskritName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price*
              </label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                placeholder="₹4,500"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Description*
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detailed Description*
              </label>
              <textarea
                value={formData.specificDescription}
                onChange={(e) => handleChange('specificDescription', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ethos*
              </label>
              <textarea
                value={formData.ethos}
                onChange={(e) => handleChange('ethos', e.target.value)}
                rows={2}
                placeholder={clientType === 'soul-luxury' ? 'Production ethos' : 'Energetic ethos'}
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
                onChange={(e) => handleChange('whatItsFor', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>

            {/* Features Array */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Features*
                </label>
                <button
                  type="button"
                  onClick={() => addArrayItem('features')}
                  className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  <PlusIcon className="w-4 h-4" />
                  Add Feature
                </button>
              </div>
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleArrayChange('features', index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Feature description"
                    />
                    {formData.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('features', index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Images Array */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Image URLs*
                </label>
                <button
                  type="button"
                  onClick={() => addArrayItem('images')}
                  className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  <PlusIcon className="w-4 h-4" />
                  Add Image
                </button>
              </div>
              <div className="space-y-2">
                {formData.images.map((image, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => handleArrayChange('images', index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="/images/product.jpg"
                    />
                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('images', index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Variants (Optional) */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Variants (Optional)
                </label>
                <button
                  type="button"
                  onClick={addVariant}
                  className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  <PlusIcon className="w-4 h-4" />
                  Add Variant
                </button>
              </div>
              <div className="space-y-3">
                {formData.variants.map((variant, index) => (
                  <div key={index} className="grid grid-cols-4 gap-2 p-3 border rounded-lg">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Color</label>
                      <input
                        type="color"
                        value={variant.color}
                        onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                        className="w-full h-10 rounded cursor-pointer"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs text-gray-600 mb-1">Name</label>
                      <input
                        type="text"
                        value={variant.name}
                        onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="Saddle Brown"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="w-full p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <TrashIcon className="w-5 h-5 mx-auto" />
                      </button>
                    </div>
                    <div className="col-span-4">
                      <label className="block text-xs text-gray-600 mb-1">Image URL</label>
                      <input
                        type="text"
                        value={variant.image}
                        onChange={(e) => handleVariantChange(index, 'image', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        placeholder="/images/variant.jpg"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {mode === 'add' ? 'Adding...' : 'Updating...'}
                </>
              ) : (
                mode === 'add' ? 'Add Product' : 'Update Product'
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
