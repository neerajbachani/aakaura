"use client";

import { useState, useRef } from "react";
import {
  PhotoIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

interface SingleImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export default function SingleImageUpload({
  value,
  onChange,
  label,
  placeholder = "Image URL",
  className = "",
}: SingleImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      if (data.data?.imageUrl) {
        onChange(data.data.imageUrl);
        toast.success("Image uploaded successfully");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
      // Reset input so same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-xs text-gray-500 mb-1">{label}</label>
      )}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {isUploading ? (
              <div className="animate-spin h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full" />
            ) : value ? (
              <img
                src={value}
                alt="Thumbnail"
                className="h-6 w-6 object-cover rounded border border-gray-200"
              />
            ) : (
              <PhotoIcon className="h-4 w-4 text-gray-400" />
            )}
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            placeholder={placeholder}
            disabled={isUploading}
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-red-500"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Upload Image"
        >
          <ArrowUpTrayIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
