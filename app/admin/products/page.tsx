"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { catalogApi } from "@/lib/api/catalog";
import { useToast } from "@/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { formatPrice } from "@/lib/utils/format";
import type { Category, Product } from "@/lib/types/catalog";
import { ApiError } from "@/lib/api/client";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const { success: toastSuccess, error: toastError } = useToast();

  // State for slide-overs / modals
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [imageModalProduct, setImageModalProduct] = useState<Product | null>(null);
  const [variantModalProduct, setVariantModalProduct] = useState<Product | null>(null);

  // Form states
  const [form, setForm] = useState<{
    categoryId: string;
    name: string;
    description: string;
    price: string;
    stockQuantity: string;
    material: string;
    width: string;
    height: string;
    depth: string;
    imageFile?: File;
    imageUrl: string;
  }>({
    categoryId: "",
    name: "",
    description: "",
    price: "",
    stockQuantity: "0",
    material: "",
    width: "",
    height: "",
    depth: "",
    imageFile: undefined,
    imageUrl: "",
  });

  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
  });

  const [imageForm, setImageForm] = useState<{ url: string; file?: File; altText: string }>({
    url: "",
    altText: "",
  });

  const [variantForm, setVariantForm] = useState({
    name: "",
    color: "",
    sku: "",
    price: "",
    stockQuantity: "0",
  });

  const load = async () => {
    try {
      const [prodData, catData] = await Promise.all([
        catalogApi.getProducts({ limit: 100 }),
        catalogApi.getCategories(),
      ]);
      setProducts(prodData.products);
      setCategories(catData.categories);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.categoryId) {
      const msg = "Please select a category";
      setError(msg);
      toastError(msg);
      return;
    }

    try {
      const hasDimensions = Boolean(form.width || form.height || form.depth);
      const dimensions = hasDimensions
        ? {
            width: form.width ? Number(form.width) : undefined,
            height: form.height ? Number(form.height) : undefined,
            depth: form.depth ? Number(form.depth) : undefined,
          }
        : undefined;

      const { product } = await catalogApi.createProduct({
        categoryId: form.categoryId,
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        stockQuantity: form.stockQuantity ? Number(form.stockQuantity) : 0,
        material: form.material.trim() || undefined,
        dimensions,
      });

      if (form.imageFile || form.imageUrl) {
        try {
          await catalogApi.addImage(product.id, {
            file: form.imageFile,
            url: form.imageUrl || undefined,
            altText: form.name,
            sortOrder: 0,
          });
        } catch (imgErr) {
          toastError(imgErr instanceof ApiError ? imgErr.message : "Product created, but image upload failed");
        }
      }

      setShowForm(false);
      setForm({
        categoryId: "",
        name: "",
        description: "",
        price: "",
        stockQuantity: "0",
        material: "",
        width: "",
        height: "",
        depth: "",
        imageFile: undefined,
        imageUrl: "",
      });
      toastSuccess("Furniture piece created!");
      await load();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to create product";
      setError(msg);
      toastError(msg);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Deactivate this product?")) return;
    try {
      await catalogApi.deleteProduct(id);
      toastSuccess("Product deactivated");
      await load();
    } catch (err) {
      toastError(err instanceof ApiError ? err.message : "Failed to delete");
    }
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setEditForm({
      name: product.name,
      description: product.description ?? "",
      price: String(product.price),
      stockQuantity: String(product.stockQuantity),
    });
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      await catalogApi.updateProduct(editingProduct.id, {
        name: editForm.name,
        description: editForm.description,
        price: Number(editForm.price),
        stockQuantity: Number(editForm.stockQuantity),
      });
      toastSuccess("Piece updated successfully");
      setEditingProduct(null);
      await load();
    } catch (err) {
      toastError(err instanceof ApiError ? err.message : "Update failed");
    }
  };

  const saveAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageModalProduct) return;
    if (!imageForm.file && !imageForm.url) {
      toastError("Please select a file or enter an image URL");
      return;
    }
    try {
      await catalogApi.addImage(imageModalProduct.id, {
        file: imageForm.file,
        url: imageForm.url || undefined,
        altText: imageForm.altText || imageModalProduct.name,
        sortOrder: 0,
      });
      toastSuccess("Image attached to piece!");
      setImageModalProduct(null);
      setImageForm({ url: "", file: undefined, altText: "" });
      await load();
    } catch (err) {
      toastError(err instanceof ApiError ? err.message : "Failed to add image");
    }
  };

  const saveAddVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!variantModalProduct) return;
    try {
      await catalogApi.addVariant(variantModalProduct.id, {
        name: variantForm.name,
        color: variantForm.color || variantForm.name,
        sku: variantForm.sku,
        price: variantForm.price ? Number(variantForm.price) : undefined,
        stockQuantity: Number(variantForm.stockQuantity),
      });
      toastSuccess("Variant finish created!");
      setVariantModalProduct(null);
      setVariantForm({ name: "", color: "", sku: "", price: "", stockQuantity: "0" });
      await load();
    } catch (err) {
      toastError(err instanceof ApiError ? err.message : "Failed to add variant");
    }
  };

  if (loading) return <Spinner className="h-8 w-8 text-[#4A5E4C]" />;

  return (
    <div className="space-y-6">
      {/* Header Bento */}
      <div className="bento-card p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="pill-accent-sage text-xs">Atelier Collection</span>
          <h2 className="font-display text-3xl sm:text-4xl text-[#161716] mt-1">
            Furniture Inventory
          </h2>
          <p className="text-xs text-[#6B7068] font-light mt-1">
            Manage solid wood catalog pieces, finishes, and workshop inventory counts.
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close Form" : "+ Create Piece ↗"}
        </Button>
      </div>

      {/* Create Product Bento Form */}
      {showForm && (
        <form onSubmit={createProduct} className="bento-card p-8 space-y-6">
          <div className="border-b border-[#E2DCD2] pb-4">
            <h3 className="font-display text-2xl text-[#161716]">New Atelier Piece</h3>
            <p className="pill-accent-sage text-[10px] mt-1">Craft Specs & Attributes</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Select
              label="Category / Atmosphere"
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              options={[
                { value: "", label: "Select category…" },
                ...categories.map((c) => ({ value: c.id, label: c.name })),
              ]}
              required
            />
            <Input label="Piece Name" placeholder="e.g. Soliman Dining Table" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="Base Price (EGP)" type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            <Input label="Stock Quantity" type="number" min={0} value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })} />
            <Input label="Primary Wood / Material" placeholder="e.g. Solid Beech, Oak, Walnut" value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} />
            <Input label="Description" placeholder="Architectural notes, craftsmanship..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            <Input label="Width (cm)" type="number" value={form.width} onChange={(e) => setForm({ ...form, width: e.target.value })} />
            <Input label="Height (cm)" type="number" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} />
            <Input label="Depth (cm)" type="number" value={form.depth} onChange={(e) => setForm({ ...form, depth: e.target.value })} />

            <div className="sm:col-span-2 border-t border-[#E2DCD2] pt-4 mt-2 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#161716] mb-2">Product Image File</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setForm({ ...form, imageFile: e.target.files?.[0], imageUrl: "" })}
                  className="block w-full text-xs text-[#6B7068] file:mr-3 file:border file:border-[#E2DCD2] file:bg-[#FAFAF7] file:px-4 file:py-2 file:rounded-full file:text-xs file:font-semibold file:text-[#161716] hover:file:bg-[#EDE7DC] cursor-pointer"
                />
              </div>
              <Input
                label="Or Image URL"
                placeholder="https://…"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value, imageFile: undefined })}
              />
            </div>
          </div>

          {error && <p className="text-xs text-red-600 font-semibold">{error}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button type="submit">Save Piece ↗</Button>
          </div>
        </form>
      )}

      {/* Product List Bento Table Card */}
      <div className="bento-card p-6 overflow-hidden">
        <div className="pb-4 border-b border-[#E2DCD2] flex items-center justify-between">
          <span className="pill-accent-sage text-xs">Catalog List ({products.length})</span>
          <span className="text-xs text-[#6B7068] font-mono">Sorted by Newest</span>
        </div>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#E2DCD2] text-[#6B7068]">
              <tr>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider">Piece</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider">Price</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider">Stock</th>
                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2DCD2]">
              {products.map((p) => {
                const img = p.images?.[0]?.url;
                return (
                  <tr key={p.id} className="hover:bg-[#EDE7DC]/30 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {img ? (
                          <div className="relative h-12 w-12 shrink-0 rounded-2xl border border-[#E2DCD2] overflow-hidden bg-[#EDE7DC]">
                            <Image src={img} alt="" fill className="object-cover" sizes="48px" />
                          </div>
                        ) : (
                          <div className="h-12 w-12 shrink-0 rounded-2xl border border-[#E2DCD2] bg-[#EDE7DC] flex items-center justify-center font-bold text-base text-[#6B7068]">
                            N
                          </div>
                        )}
                        <div>
                          <p className="font-display text-lg text-[#161716]">{p.name}</p>
                          {p.material && <p className="text-[11px] text-[#6B7068] font-light">{p.material}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-[#6B7068] font-light">
                      {p.category?.name ?? "Unassigned"}
                    </td>
                    <td className="px-4 py-4 font-semibold text-[#161716]">
                      {formatPrice(p.price)}
                    </td>
                    <td className="px-4 py-4">
                      {p.stockQuantity <= 0 ? (
                        <span className="rounded-full bg-red-100 px-3 py-1 text-[10px] font-semibold text-red-800">Out of Stock</span>
                      ) : p.stockQuantity <= 3 ? (
                        <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-semibold text-amber-800">Low ({p.stockQuantity})</span>
                      ) : (
                        <span className="rounded-full bg-[#D8E2D6] px-3 py-1 text-[10px] font-semibold text-[#374739]">{p.stockQuantity} Units</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(p)}
                          className="text-xs font-semibold text-[#161716] hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                        <span className="text-[#6B7068]">·</span>
                        <button
                          type="button"
                          onClick={() => setImageModalProduct(p)}
                          className="text-xs font-semibold text-[#4A5E4C] hover:underline cursor-pointer"
                        >
                          + Image
                        </button>
                        <span className="text-[#6B7068]">·</span>
                        <button
                          type="button"
                          onClick={() => setVariantModalProduct(p)}
                          className="text-xs font-semibold text-[#4A5E4C] hover:underline cursor-pointer"
                        >
                          + Finish
                        </button>
                        <span className="text-[#6B7068]">·</span>
                        <button
                          type="button"
                          onClick={() => deleteProduct(p.id)}
                          className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center glass-backdrop p-4">
          <form onSubmit={saveEdit} className="w-full max-w-md bento-card p-8 space-y-5">
            <div className="border-b border-[#E2DCD2] pb-4 flex items-center justify-between">
              <h3 className="font-display text-2xl text-[#161716]">Edit Piece</h3>
              <button type="button" onClick={() => setEditingProduct(null)} className="text-xl text-[#6B7068]">×</button>
            </div>
            <Input label="Name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required />
            <Input label="Description" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} required />
            <Input label="Price (EGP)" type="number" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} required />
            <Input label="Stock Quantity" type="number" value={editForm.stockQuantity} onChange={(e) => setEditForm({ ...editForm, stockQuantity: e.target.value })} required />
            <div className="flex justify-end gap-3 pt-3">
              <Button type="button" variant="ghost" onClick={() => setEditingProduct(null)}>Cancel</Button>
              <Button type="submit">Save Changes ↗</Button>
            </div>
          </form>
        </div>
      )}

      {/* Image Modal */}
      {imageModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center glass-backdrop p-4">
          <form onSubmit={saveAddImage} className="w-full max-w-md bento-card p-8 space-y-5">
            <div className="border-b border-[#E2DCD2] pb-4 flex items-center justify-between">
              <h3 className="font-display text-2xl text-[#161716]">Attach Image</h3>
              <button type="button" onClick={() => setImageModalProduct(null)} className="text-xl text-[#6B7068]">×</button>
            </div>
            <p className="text-xs text-[#6B7068] font-light">Target piece: {imageModalProduct.name}</p>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#161716] mb-2">Image File</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageForm({ ...imageForm, file: e.target.files?.[0], url: "" })}
                className="block w-full text-xs text-[#6B7068] file:mr-3 file:border file:border-[#E2DCD2] file:bg-[#FAFAF7] file:px-4 file:py-2 file:rounded-full file:text-xs file:font-semibold file:text-[#161716] cursor-pointer"
              />
            </div>
            <Input label="Or Image URL" placeholder="https://..." value={imageForm.url} onChange={(e) => setImageForm({ ...imageForm, url: e.target.value, file: undefined })} />
            <Input label="Alt Description" placeholder="Living room view..." value={imageForm.altText} onChange={(e) => setImageForm({ ...imageForm, altText: e.target.value })} />
            <div className="flex justify-end gap-3 pt-3">
              <Button type="button" variant="ghost" onClick={() => setImageModalProduct(null)}>Cancel</Button>
              <Button type="submit">Upload Image ↗</Button>
            </div>
          </form>
        </div>
      )}

      {/* Variant Modal */}
      {variantModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center glass-backdrop p-4">
          <form onSubmit={saveAddVariant} className="w-full max-w-md bento-card p-8 space-y-5">
            <div className="border-b border-[#E2DCD2] pb-4 flex items-center justify-between">
              <h3 className="font-display text-2xl text-[#161716]">Add Finish / Variant</h3>
              <button type="button" onClick={() => setVariantModalProduct(null)} className="text-xl text-[#6B7068]">×</button>
            </div>
            <Input label="Variant Name" placeholder="e.g. Dark Walnut Stain" value={variantForm.name} onChange={(e) => setVariantForm({ ...variantForm, name: e.target.value })} required />
            <Input label="Color / Wood Code" placeholder="e.g. Walnut" value={variantForm.color} onChange={(e) => setVariantForm({ ...variantForm, color: e.target.value })} />
            <Input label="SKU Code" placeholder="e.g. SOL-WAL-01" value={variantForm.sku} onChange={(e) => setVariantForm({ ...variantForm, sku: e.target.value })} required />
            <Input label="Override Price (EGP, optional)" type="number" value={variantForm.price} onChange={(e) => setVariantForm({ ...variantForm, price: e.target.value })} />
            <Input label="Stock Quantity" type="number" value={variantForm.stockQuantity} onChange={(e) => setVariantForm({ ...variantForm, stockQuantity: e.target.value })} />
            <div className="flex justify-end gap-3 pt-3">
              <Button type="button" variant="ghost" onClick={() => setVariantModalProduct(null)}>Cancel</Button>
              <Button type="submit">Add Finish ↗</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
