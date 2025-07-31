"use client";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload, FiX, FiImage } from "react-icons/fi";

interface ImageUploadProps {
  images: File[];
  existingImages: string[];
  onImagesChange: (images: File[]) => void;
  onExistingImagesChange: (images: string[]) => void;
  maxFiles?: number;
  className?: string;
}

export default function ImageUpload({
  images,
  existingImages,
  onImagesChange,
  onExistingImagesChange,
  maxFiles = 10,
  className = "",
}: ImageUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newImages = [...images, ...acceptedFiles];
      if (newImages.length <= maxFiles) {
        onImagesChange(newImages);
      }
    },
    [images, maxFiles, onImagesChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxFiles: maxFiles - images.length,
  });

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const removeExistingImage = (index: number) => {
    const newExistingImages = existingImages.filter((_, i) => i !== index);
    onExistingImagesChange(newExistingImages);
  };

  const totalImages = images.length + existingImages.length;

  return (
    <div className={`space-y-6 ${className}`}>
      <h2 className="text-xl font-semibold text-primaryBrown mb-4">
        Product Images
      </h2>

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-primaryBrown mb-2">
            Current Images ({existingImages.length})
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {existingImages.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border border-primaryBrown/20"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FiX className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dropzone */}
      <div>
        <label className="block text-sm font-medium text-primaryBrown mb-2">
          Add New Images ({images.length}/{maxFiles - existingImages.length})
        </label>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200 ${
            isDragActive
              ? "border-primaryRed bg-primaryRed/5"
              : "border-primaryBrown/30 hover:border-primaryBrown/50 hover:bg-primaryBeige/30"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-primaryRed/10 rounded-full">
              <FiUpload className="w-8 h-8 text-primaryRed" />
            </div>
            <div>
              <p className="text-lg font-medium text-primaryBrown mb-2">
                {isDragActive ? "Drop images here" : "Drag & drop images here"}
              </p>
              <p className="text-sm text-primaryBrown/60">
                or click to select files
              </p>
              <p className="text-xs text-primaryBrown/40 mt-2">
                Supports: JPG, PNG, GIF, WebP (max {maxFiles - existingImages.length} files)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Preview New Images */}
      {images.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-primaryBrown mb-2">
            New Images Preview ({images.length})
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`New ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border border-primaryBrown/20"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FiX className="w-3 h-3" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 rounded-b-lg">
                  {image.name.length > 20 ? `${image.name.substring(0, 20)}...` : image.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Count Warning */}
      {totalImages === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <FiImage className="text-yellow-600" />
            <p className="text-yellow-800 text-sm">
              At least one image is required for the product.
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 