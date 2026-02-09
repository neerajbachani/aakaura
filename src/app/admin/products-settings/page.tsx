"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUpdateProductSettings } from "@/hooks/admin/useAdminWaitlist";
import { useAddJourneyProduct, useUpdateJourneyProduct, useDeleteJourneyProduct } from "@/hooks/admin/useAdminJourney";
import AdminTabs from "@/components/ui/AdminTabs";
import { motion } from "framer-motion";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

import toast from "react-hot-toast";
import ProductFormModal from "@/components/admin/ProductFormModal";

// Fetch all journeys
async function fetchJourneys() {
  const response = await fetch("/api/admin/journeys", {
    credentials: "include"
  });
  if (!response.ok) throw new Error("Failed to fetch journeys");
  return response.json();
}

export default function AdminProductSettingsPage() {
  const { data: journeysData, isLoading, error } = useQuery({
    queryKey: ['admin', 'journeys', 'all'],
    queryFn: fetchJourneys,
  });

  const updateProductSettings = useUpdateProductSettings();
  const addProduct = useAddJourneyProduct();
  const updateProduct = useUpdateJourneyProduct();
  const deleteProduct = useDeleteJourneyProduct();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedJourney, setSelectedJourney] = useState<any>(null);
  const [selectedClientType, setSelectedClientType] = useState<'soul-luxury' | 'energy-curious'>('soul-luxury');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const handleAddProduct = (journey: any, clientType: 'soul-luxury' | 'energy-curious') => {
    setModalMode('add');
    setSelectedJourney(journey);
    setSelectedClientType(clientType);
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleEditProduct = (journey: any, clientType: 'soul-luxury' | 'energy-curious', product: any) => {
    setModalMode('edit');
    setSelectedJourney(journey);
    setSelectedClientType(clientType);
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (journey: any, clientType: 'soul-luxury' | 'energy-curious', productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await deleteProduct.mutateAsync({
        slug: journey.slug,
        clientType,
        productId,
      });
      toast.success('Product deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete product');
    }
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      if (modalMode === 'add') {
        await addProduct.mutateAsync({
          slug: selectedJourney.slug,
          clientType: selectedClientType,
          product: formData,
        });
        toast.success('Product added successfully');
      } else {
        await updateProduct.mutateAsync({
          slug: selectedJourney.slug,
          clientType: selectedClientType,
          productId: selectedProduct.id,
          product: formData,
        });
        toast.success('Product updated successfully');
      }
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error.message || `Failed to ${modalMode === 'add' ? 'add' : 'update'} product`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <AdminTabs activeTab="products-settings" />
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              <p className="mt-4 text-gray-600">Loading journeys...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <AdminTabs activeTab="products-settings" />
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600">Error loading journeys</p>
              <p className="text-sm text-gray-500 mt-2">{(error as Error).message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { journeys = [] } = journeysData || {};

  const handleToggleWaitlist = (slug: string, productId: string, currentStatus: boolean) => {
    updateProductSettings.mutate({
      slug,
      productId,
      isWaitlist: !currentStatus,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <AdminTabs activeTab="products-settings" />
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Product Settings</h1>
          <p className="text-gray-600">
            Manage products and their availability: Create, edit, delete, and toggle waitlist status
          </p>
        </div>

        {/* Journeys */}
        <div className="space-y-8">
          {journeys.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <p className="text-gray-500">No journeys found</p>
            </div>
          ) : (
            journeys.map((journey: any, index: number) => {
              const productSettings = (journey.productSettings || {}) as Record<string, any>;
              
              // Get all products from both soul-luxury and energy-curious
              const soulLuxuryProducts = journey.content?.["soul-luxury"] || [];
              const energyCuriousProducts = journey.content?.["energy-curious"] || [];

              return (
                <motion.div
                  key={journey.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm overflow-hidden"
                >
                  {/* Journey Header */}
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
                    <h2 className="text-2xl font-bold">{journey.name}</h2>
                    <p className="text-sm opacity-90 mt-1">{journey.sanskritName} • {journey.tone}</p>
                  </div>

                  {/* Products */}
                  <div className="p-6">
                    {/* Soul Luxury Products */}
                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          Soul Luxury Collection
                        </h3>
                        <button
                          onClick={() => handleAddProduct(journey, 'soul-luxury')}
                          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          <PlusIcon className="w-4 h-4" />
                          Add Product
                        </button>
                      </div>
                      {soulLuxuryProducts.length === 0 ? (
                        <p className="text-gray-500 text-sm italic">No products yet</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {soulLuxuryProducts.map((product: any) => {
                            const isWaitlist = productSettings[product.id]?.isWaitlist ?? true;
                            
                            return (
                              <div
                                key={product.id}
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                              >
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 mb-1">
                                      {product.name}
                                    </h4>
                                    <p className="text-sm text-gray-500 line-clamp-2">
                                      {product.description}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                  <span className="text-sm font-medium text-gray-700">
                                    {product.price}
                                  </span>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleEditProduct(journey, 'soul-luxury', product)}
                                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                      title="Edit product"
                                    >
                                      <PencilIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteProduct(journey, 'soul-luxury', product.id)}
                                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                      title="Delete product"
                                    >
                                      <TrashIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleToggleWaitlist(journey.slug, product.id, isWaitlist)}
                                      disabled={updateProductSettings.isPending}
                                      className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                                        isWaitlist
                                          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                          : "bg-green-100 text-green-800 hover:bg-green-200"
                                      } disabled:opacity-50`}
                                    >
                                      {isWaitlist ? "📋 Waitlist" : "🛒 Buy Now"}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Energy Curious Products */}
                    <div>
                      <div className="flex justify-between items-center mb-4 border-b pb-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          Energy Curious Collection
                        </h3>
                        <button
                          onClick={() => handleAddProduct(journey, 'energy-curious')}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          <PlusIcon className="w-4 h-4" />
                          Add Product
                        </button>
                      </div>
                      {energyCuriousProducts.length === 0 ? (
                        <p className="text-gray-500 text-sm italic">No products yet</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {energyCuriousProducts.map((product: any) => {
                            const isWaitlist = productSettings[product.id]?.isWaitlist ?? true;
                            
                            return (
                              <div
                                key={product.id}
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                              >
                                <div className="flex justify-between items-start mb-3">
                                  <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 mb-1">
                                      {product.name}
                                    </h4>
                                    <p className="text-sm text-gray-500 line-clamp-2">
                                      {product.description}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                  <span className="text-sm font-medium text-gray-700">
                                    {product.price}
                                  </span>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleEditProduct(journey, 'energy-curious', product)}
                                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                      title="Edit product"
                                    >
                                      <PencilIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteProduct(journey, 'energy-curious', product.id)}
                                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                      title="Delete product"
                                    >
                                      <TrashIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleToggleWaitlist(journey.slug, product.id, isWaitlist)}
                                      disabled={updateProductSettings.isPending}
                                      className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                                        isWaitlist
                                          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                          : "bg-green-100 text-green-800 hover:bg-green-200"
                                      } disabled:opacity-50`}
                                    >
                                      {isWaitlist ? "📋 Waitlist" : "🛒 Buy Now"}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Product Form Modal */}
      {isModalOpen && (
        <ProductFormModal
          mode={modalMode}
          journey={selectedJourney}
          clientType={selectedClientType}
          product={selectedProduct}
          onSubmit={handleFormSubmit}
          onClose={() => setIsModalOpen(false)}
          isLoading={addProduct.isPending || updateProduct.isPending}
        />
      )}
    </div>
  );
}
