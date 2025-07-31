"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Blog } from "@/types/Blog";
import { ApiResponse } from "@/types/Api";
import toast from "react-hot-toast";
import { FiTrash2, FiSave, FiPlus } from "react-icons/fi";
import { BiImage } from "react-icons/bi";
import Cookies from "js-cookie";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export const updateBlog = async (id: string, formData: FormData) => {
  try {
    const res = await fetch(`/api/admin/blog/${id}`, {
      method: "PATCH",
      body: formData,
      headers: {
        Authorization: `Bearer ${Cookies.get("admin_token")}`,
      },
    });
    const result: ApiResponse<Blog> = await res.json();

    if (!res.ok) throw new Error(result.message);
    return result.data;
  } catch (error) {
    console.error("Error updating blog:", error);
    return null;
  }
};

export const deleteBlog = async (id: string) => {
  try {
    const res = await fetch(`/api/admin/blog/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${Cookies.get("admin_token")}`,
      },
    });
    if (!res.ok) throw new Error("Failed to delete blog");
    return true;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

export const createBlog = async (formData: FormData) => {
  try {
    const response = await fetch(`/api/admin/blog`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${Cookies.get("admin_token")}`,
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to create blog");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};

interface BlogFormProps {
  blogData?: Blog;
  isEditing?: boolean;
}

interface Series {
  id: string;
  title: string;
}

export default function BlogForm({
  blogData,
  isEditing = false,
}: BlogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    title: blogData?.title || "",
    content: blogData?.content || "",
    isFeatured: blogData?.isFeatured || false,
    seriesId: blogData?.seriesId || "",
  });

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [existingCoverImage] = useState<string>(blogData?.coverImage || "");
  const [series, setSeries] = useState<Series[]>([]);
  const [newSeriesTitle, setNewSeriesTitle] = useState("");
  const [showNewSeriesInput, setShowNewSeriesInput] = useState(false);

  useEffect(() => {
    fetchSeries();
  }, []);

  const fetchSeries = async () => {
    try {
      const res = await fetch("/api/series");
      const result: ApiResponse<Series[]> = await res.json();

      if (res.ok) {
        setSeries(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching series:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
    }
  };

  const handleDelete = async () => {
    if (!blogData?.id) return;

    setLoading(true);
    try {
      await deleteBlog(blogData.id);
      toast.success("Blog deleted successfully!");
      router.push("/admin");
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete blog"
      );
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleCreateNewSeries = async () => {
    if (!newSeriesTitle.trim()) {
      toast.error("Series title is required");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/admin/series", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("admin_token")}`,
        },
        body: JSON.stringify({ title: newSeriesTitle.trim() }),
      });

      const result = await response.json();

      if (response.ok) {
        const newSeries = result.data;
        setSeries((prev) => [...prev, newSeries]);
        setFormData((prev) => ({ ...prev, seriesId: newSeries.id }));
        setNewSeriesTitle("");
        setShowNewSeriesInput(false);
        toast.success("Series created successfully!");
      } else {
        toast.error(result.message || "Failed to create series");
      }
    } catch (error) {
      console.error("Error creating series:", error);
      toast.error("Failed to create series");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("isFeatured", formData.isFeatured.toString());
      if (formData.seriesId) {
        formDataToSend.append("seriesId", formData.seriesId);
      }

      if (coverImage) {
        formDataToSend.append("coverImage", coverImage);
      }

      if (isEditing && blogData?.id) {
        await updateBlog(blogData.id, formDataToSend);
        toast.success("Blog updated successfully!");
      } else {
        await createBlog(formDataToSend);
        toast.success("Blog created successfully!");
      }

      router.push("/admin");
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
            {isEditing ? "Edit Blog Post" : "Create New Blog Post"}
          </h1>
          <p className="text-primaryBrown/60 mt-1">
            {isEditing
              ? "Update your blog post content"
              : "Write and publish a new blog post"}
          </p>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold text-primaryBrown mb-4">
                Delete Blog Post
              </h3>
              <p className="text-primaryBrown/70 mb-6">
                Are you sure you want to delete &quot;{blogData?.title}&quot;?
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

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primaryBrown mb-2">
                  Blog Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-primaryBrown/20 rounded-lg focus:ring-2 focus:ring-primaryRed focus:border-transparent"
                  placeholder="Enter blog title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primaryBrown mb-2">
                  Series (Optional)
                </label>
                <div className="flex gap-2">
                  <select
                    name="seriesId"
                    value={formData.seriesId}
                    onChange={handleInputChange}
                    className="flex-1 px-3 py-2 border border-primaryBrown/20 rounded-lg focus:ring-2 focus:ring-primaryRed focus:border-transparent"
                  >
                    <option value="">No Series</option>
                    {series.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowNewSeriesInput(!showNewSeriesInput)}
                    className="px-3 py-2 bg-primaryRed text-white rounded-lg hover:bg-primaryRed/90 transition-colors text-sm"
                  >
                    <FiPlus className="w-4 h-4" />
                  </button>
                </div>

                {showNewSeriesInput && (
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      placeholder="New series title"
                      value={newSeriesTitle}
                      onChange={(e) => setNewSeriesTitle(e.target.value)}
                      className="flex-1 px-3 py-2 border border-primaryBrown/20 rounded-lg focus:ring-2 focus:ring-primaryRed focus:border-transparent text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleCreateNewSeries}
                      disabled={loading || !newSeriesTitle.trim()}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                    >
                      Create
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primaryRed focus:ring-primaryRed rounded"
                  />
                  <span className="text-sm font-medium text-primaryBrown">
                    Featured Post (Show on home page)
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Cover Image Card */}
          <div className="bg-white rounded-xl shadow-sm border border-primaryBrown/10 p-6">
            <h2 className="text-lg font-semibold text-primaryBrown mb-4">
              Cover Image
            </h2>

            <div className="space-y-4">
              {/* Existing Image */}
              {existingCoverImage && (
                <div>
                  <label className="block text-sm font-medium text-primaryBrown mb-2">
                    Current Cover Image
                  </label>
                  <div className="relative w-48 h-32 rounded-lg overflow-hidden border border-primaryBrown/20">
                    <Image
                      src={existingCoverImage}
                      alt="Cover"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              {/* New Image Upload */}
              <div>
                <label className="block text-sm font-medium text-primaryBrown mb-2">
                  {existingCoverImage
                    ? "Upload New Image"
                    : "Upload Cover Image"}
                </label>
                <div className="border-2 border-dashed border-primaryBrown/30 rounded-lg p-6 text-center hover:border-primaryBrown/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="cover-image"
                  />
                  <label htmlFor="cover-image" className="cursor-pointer">
                    <BiImage className="w-8 h-8 text-primaryBrown/50 mx-auto mb-2" />
                    <p className="text-sm text-primaryBrown/70">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-primaryBrown/50 mt-1">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </label>
                </div>
                {coverImage && (
                  <p className="text-xs text-green-600 mt-2">
                    ✓ {coverImage.name} selected
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-xl shadow-sm border border-primaryBrown/10 p-6">
            <h2 className="text-lg font-semibold text-primaryBrown mb-4">
              Blog Content
            </h2>

            <div>
              <label className="block text-sm font-medium text-primaryBrown mb-2">
                Content *
              </label>
              <div className="border border-primaryBrown/20 rounded-lg overflow-hidden">
                <MDEditor
                  value={formData.content}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, content: value || "" }))
                  }
                  height={400}
                  preview="edit"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4">
            {isEditing && (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiTrash2 className="w-4 h-4" />
                Delete Blog
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
                  {isEditing ? "Update Blog" : "Create Blog"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
