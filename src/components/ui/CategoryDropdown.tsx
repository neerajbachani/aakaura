"use client";
import React, { useState, useEffect } from "react";
import { FiPlus, FiChevronDown } from "react-icons/fi";
import { Category } from "@/types/Product";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

interface CategoryDropdownProps {
  value: string;
  onChange: (categoryId: string) => void;
  className?: string;
}

export default function CategoryDropdown({
  value,
  onChange,
  className = "",
}: CategoryDropdownProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const result = await response.json();

      if (response.ok) {
        setCategories(result.data);
      } else {
        console.error("Error fetching categories:", result.message);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("admin_token")}`,
        },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });

      const result = await response.json();

      if (response.ok) {
        const newCategory = result.data;
        setCategories((prev) => [...prev, newCategory]);
        onChange(newCategory.id);
        setNewCategoryName("");
        setIsOpen(false);
        toast.success("Category created successfully!");
      } else {
        toast.error(result.message || "Failed to create category");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error("Failed to create category");
    } finally {
      setIsCreating(false);
    }
  };

  const selectedCategory = categories.find((cat) => cat.id === value);

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-primaryBrown mb-2">
        Category *
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 border border-primaryBrown/20 rounded-lg focus:ring-2 focus:ring-primaryRed focus:border-transparent bg-white text-left flex items-center justify-between"
        >
          <span
            className={
              selectedCategory ? "text-primaryBrown" : "text-primaryBrown/50"
            }
          >
            {selectedCategory ? selectedCategory.name : "Select a category"}
          </span>
          <FiChevronDown
            className={`text-primaryBrown/50 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-primaryBrown/20 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {/* Create New Category */}
            <div className="p-3 border-b border-primaryBrown/10">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Create new category..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && createCategory()}
                  className="flex-1 px-3 py-2 border border-primaryBrown/20 rounded-md focus:ring-2 focus:ring-primaryRed focus:border-transparent text-sm"
                />
                <button
                  type="button"
                  onClick={createCategory}
                  disabled={isCreating || !newCategoryName.trim()}
                  className="p-2 bg-primaryRed text-white rounded-md hover:bg-primaryRed/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Existing Categories */}
            {loading ? (
              <div className="p-3 text-center text-primaryBrown/50">
                Loading categories...
              </div>
            ) : categories.length === 0 ? (
              <div className="p-3 text-center text-primaryBrown/50">
                No categories found. Create one above.
              </div>
            ) : (
              <div>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => {
                      onChange(category.id);
                      setIsOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-primaryBeige/50 transition-colors ${
                      value === category.id
                        ? "bg-primaryRed/10 text-primaryRed"
                        : "text-primaryBrown"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
