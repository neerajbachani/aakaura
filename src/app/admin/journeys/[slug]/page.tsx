"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray, Control, RegisterOptions } from "react-hook-form";
import { useAdminJourney, useUpdateJourney } from "@/hooks/admin/useAdminJourney";
import LoadingSpinner from "@/components/admin/Shared/LoadingSpinner";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { FaArrowLeft, FaSave, FaTrash, FaPlus, FaChevronDown, FaChevronUp } from "react-icons/fa";
import Link from "next/link";
import { ChakraData, JourneyProduct } from "@/data/chakras";

interface EditJourneyPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function EditJourneyPage({ params }: EditJourneyPageProps) {
  const router = useRouter();
  const [slug, setSlug] = useState<string>("");
  
  // Unwrap params
  useEffect(() => {
    params.then(p => setSlug(p.slug));
  }, [params]);

  const { data: journey, isLoading, error } = useAdminJourney(slug);
  const updateJourneyMutation = useUpdateJourney();

  const { register, control, handleSubmit, reset, watch, formState: { isDirty } } = useForm<ChakraData>();

  // Reset form when data is loaded
  useEffect(() => {
    if (journey) {
      reset(journey);
    }
  }, [journey, reset]);

  const onSubmit = (data: ChakraData) => {
    if (!slug) return;
    updateJourneyMutation.mutate(
      { slug: slug, data },
      {
        onSuccess: () => {
          toast.success("Journey updated successfully");
          router.push("/admin/journeys");
        },
        onError: () => {
          toast.error("Failed to update journey");
        },
      }
    );
  };

  if (!slug || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !journey) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 text-center text-red-600">
        Failed to load journey
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin/journeys"
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <FaArrowLeft />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit {journey.name}</h1>
              <p className="text-gray-500 text-sm">Update content for {journey.slug}</p>
            </div>
          </div>
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={updateJourneyMutation.isPending || !isDirty}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            <FaSave />
            {updateJourneyMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* General Info */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">General Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  {...register("name")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Sanskrit Name</label>
                <input
                  {...register("sanskritName")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  {...register("description")}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
              </div>
            </div>
          </div>

          {/* Separate Content Sections for Client Types */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Soul Luxury Content */}
            <ContentSection 
              title="Soul Luxury Products"
              clientType="soul-luxury"
              control={control}
              register={register}
            />

            {/* Energy Curious Content */}
            <ContentSection 
              title="Energy Curious Products"
              clientType="energy-curious"
              control={control}
              register={register}
            />
          </div>

          {/* Bottom Save Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={updateJourneyMutation.isPending || !isDirty}
              className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm text-lg font-medium"
            >
              <FaSave />
              {updateJourneyMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Sub-component for product list
function ContentSection({ title, clientType, control, register }: { title: string; clientType: 'soul-luxury' | 'energy-curious'; control: Control<ChakraData>; register: any }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `content.${clientType}` as const,
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-lg font-semibold text-indigo-700">{title}</h2>
        <button
            type="button"
            onClick={() => append({ 
              id: `${clientType}-${Date.now()}`,
              name: "New Product",
              sanskritName: "",
              description: "",
              specificDescription: "",
              price: "",
              ethos: "",
              whatItsFor: "",
              features: [],
              images: [],
              step: fields.length + 1
            })}
            className="text-sm flex items-center gap-1 text-white bg-indigo-600 px-3 py-1 rounded hover:bg-indigo-700"
          >
            <FaPlus /> Add Product
        </button>
      </div>
      
      <div className="space-y-6">
        {fields.map((field, index) => (
          <ProductItem 
            key={field.id} 
            control={control} 
            register={register} 
            index={index} 
            clientType={clientType}
            remove={() => remove(index)}
          />
        ))}
        {fields.length === 0 && (
          <div className="text-gray-500 text-center py-4 italic">No products added yet.</div>
        )}
      </div>
    </div>
  );
}

function ProductItem({ control, register, index, clientType, remove }: { control: Control<ChakraData>; register: any; index: number; clientType: 'soul-luxury' | 'energy-curious'; remove: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Nested access for field arrays
  const { fields: featureFields, append: appendFeature, remove: removeFeature } = useFieldArray({
    control,
    name: `content.${clientType}.${index}.features` as any,
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
     control,
     name: `content.${clientType}.${index}.images` as any,
  });

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center gap-2">
           <span className="font-semibold text-gray-700">Product {index + 1}</span>
           {isOpen ? <FaChevronUp className="text-gray-400" /> : <FaChevronDown className="text-gray-400" />}
        </div>
        <button type="button" onClick={(e) => { e.stopPropagation(); remove(); }} className="text-red-500 hover:text-red-700 p-1">
          <FaTrash />
        </button>
      </div>
      
      {isOpen && (
        <div className="p-4 bg-white space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name</label>
              <input
                {...register(`content.${clientType}.${index}.name`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                placeholder="Unique Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Sanskrit Name</label>
              <input
                {...register(`content.${clientType}.${index}.sanskritName`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                placeholder="Optional"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Short Description</label>
              <textarea
                {...register(`content.${clientType}.${index}.description`)}
                rows={2}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700">Price Display</label>
              <input
                {...register(`content.${clientType}.${index}.price`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Specific Description (Detailed)</label>
            <textarea
              {...register(`content.${clientType}.${index}.specificDescription`)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700">Ethos</label>
             <textarea
               {...register(`content.${clientType}.${index}.ethos`)}
               rows={2}
               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
             />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700">"What It's For"</label>
             <textarea
               {...register(`content.${clientType}.${index}.whatItsFor`)}
               rows={2}
               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
             />
          </div>

          {/* Features Input Array */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
            {featureFields.map((field, fIndex) => (
              <div key={field.id} className="flex gap-2 mb-2">
                <input
                   {...register(`content.${clientType}.${index}.features.${fIndex}` as any)} 
                   className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
                <button
                  type="button"
                  onClick={() => removeFeature(fIndex)}
                  className="text-red-500 hover:text-red-700 px-2"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendFeature("")}
              className="text-sm text-indigo-600 hover:text-indigo-800 mt-1"
            >
              + Add Feature
            </button>
          </div>

           {/* Images Input Array */}
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Images (URLs)</label>
            {imageFields.map((field, iIndex) => (
              <div key={field.id} className="flex gap-2 mb-2">
                <input
                   {...register(`content.${clientType}.${index}.images.${iIndex}` as any)} 
                   className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(iIndex)}
                  className="text-red-500 hover:text-red-700 px-2"
                >
                   <FaTrash />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendImage("")}
              className="text-sm text-indigo-600 hover:text-indigo-800 mt-1"
            >
              + Add Image URL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
