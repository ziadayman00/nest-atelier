"use client";

import { useEffect, useState } from "react";
import { catalogApi } from "@/lib/api/catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import type { Category } from "@/lib/types/catalog";
import { ApiError } from "@/lib/api/client";
import { useToast } from "@/providers/toast-provider";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Category | null>(null);
  const { success: toastSuccess, error: toastError } = useToast();

  const load = () =>
    catalogApi
      .getCategories()
      .then((d) => setCategories(d.categories))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (editing) {
        await catalogApi.updateCategory(editing.id, { name, description });
        toastSuccess("Atmosphere category updated");
      } else {
        await catalogApi.createCategory({ name, description });
        toastSuccess("New atmosphere category created");
      }
      setName("");
      setDescription("");
      setEditing(null);
      await load();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Action failed";
      setError(msg);
      toastError(msg);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deactivate this category?")) return;
    try {
      await catalogApi.deleteCategory(id);
      toastSuccess("Category deactivated");
      await load();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed";
      setError(msg);
      toastError(msg);
    }
  };

  if (loading) return <Spinner className="h-8 w-8 text-[#4A5E4C]" />;

  return (
    <div className="space-y-6">
      {/* Header Bento Card */}
      <div className="bento-card p-8">
        <span className="pill-accent-sage text-xs">Spatial Taxonomy</span>
        <h2 className="font-display text-3xl sm:text-4xl text-[#161716] mt-1">
          Storefront Atmospheres
        </h2>
        <p className="text-xs text-[#6B7068] font-light mt-1">
          Group furniture pieces into architectural room collections (e.g. Living, Dining, Lighting).
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Create / Edit Form Bento Card */}
        <form onSubmit={handleSubmit} className="lg:col-span-5 bento-card p-8 space-y-5">
          <div className="border-b border-[#E2DCD2] pb-4">
            <h3 className="font-display text-2xl text-[#161716]">
              {editing ? "Edit Atmosphere" : "New Atmosphere"}
            </h3>
            <p className="pill-accent-sage text-[10px] mt-1">Category Attributes</p>
          </div>

          <Input
            label="Category Name"
            placeholder="e.g. Living Room, Dining Sanctuary"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Description"
            placeholder="Brief atmosphere summary..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" className="flex-1">
              {editing ? "Update Category ↗" : "+ Save Category ↗"}
            </Button>
            {editing && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setEditing(null);
                  setName("");
                  setDescription("");
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>

        {/* Category List Bento Card */}
        <div className="lg:col-span-7 bento-card p-6 space-y-4">
          <div className="pb-4 border-b border-[#E2DCD2] flex items-center justify-between">
            <span className="pill-accent-sage text-xs">Active Categories ({categories.length})</span>
          </div>

          <ul className="divide-y divide-[#E2DCD2]">
            {categories.map((cat, i) => (
              <li key={cat.id} className="p-4 flex items-center justify-between hover:bg-[#EDE7DC]/30 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-display text-xl text-[#161716]/40">0{i + 1}</span>
                    <p className="font-display text-2xl text-[#161716]">{cat.name}</p>
                  </div>
                  {cat.description && (
                    <p className="text-xs text-[#6B7068] font-light max-w-sm">
                      {cat.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(cat);
                      setName(cat.name);
                      setDescription(cat.description ?? "");
                    }}
                    className="text-xs font-semibold text-[#161716] hover:underline cursor-pointer"
                  >
                    Edit
                  </button>
                  <span className="text-[#6B7068]">·</span>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat.id)}
                    className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
