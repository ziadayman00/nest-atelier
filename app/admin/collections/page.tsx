"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { catalogApi } from "@/lib/api/catalog";
import { adminApi } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import type { Collection } from "@/lib/types/catalog";
import { useToast } from "@/providers/toast-provider";

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { success: toastSuccess, error: toastError } = useToast();

  const [form, setForm] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });

  const load = () => {
    setLoading(true);
    catalogApi
      .getCollections()
      .then((d) => setCollections(d.collections ?? []))
      .catch(() => toastError("Could not load collections"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.createCollection({
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        imageUrl: form.imageUrl.trim() || undefined,
      });

      toastSuccess(`Collection ${form.name} created!`);
      setShowModal(false);
      setForm({ name: "", description: "", imageUrl: "" });
      await load();
    } catch {
      toastError("Failed to create collection");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deactivate this collection?")) return;
    try {
      await adminApi.deleteCollection(id);
      toastSuccess("Collection deleted");
      await load();
    } catch {
      toastError("Failed to delete collection");
    }
  };

  if (loading) return <Spinner className="h-8 w-8 text-[#4A5E4C]" />;

  return (
    <div className="space-y-6">
      {/* Header Bento */}
      <div className="bento-card p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="pill-accent-sage text-xs">Architectural Curation</span>
          <h1 className="font-display text-3xl sm:text-4xl text-[#161716] mt-1">
            Featured Collections
          </h1>
          <p className="text-xs text-[#6B7068] font-light mt-1">
            Manage marketing collection edits, room themes, and sculptural series.
          </p>
        </div>

        <Button onClick={() => setShowModal(true)}>
          + Create Collection ↗
        </Button>
      </div>

      {/* Grid Bento */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((col) => (
          <div key={col.id} className="bento-card p-6 flex flex-col justify-between space-y-4">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[20px] bg-[#EDE7DC]">
              {col.imageUrl ? (
                <Image src={col.imageUrl} alt={col.name} fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#EDE7DC] to-[#F4F1EA]">
                  <span className="font-display text-4xl text-[#161716]/10">NEST</span>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <span className="pill-accent-sage text-[10px]">Collection Series</span>
              <h2 className="font-display text-2xl text-[#161716]">{col.name}</h2>
              {col.description && (
                <p className="text-xs text-[#6B7068] font-light line-clamp-2">{col.description}</p>
              )}
            </div>

            <div className="pt-2 border-t border-[#E2DCD2] flex justify-end">
              <button
                type="button"
                onClick={() => handleDelete(col.id)}
                className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
              >
                Delete Collection
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center glass-backdrop p-4">
          <form onSubmit={handleCreate} className="w-full max-w-md bento-card p-8 space-y-5">
            <div className="border-b border-[#E2DCD2] pb-4 flex items-center justify-between">
              <div>
                <span className="pill-accent-sage text-xs">New Marketing Series</span>
                <h3 className="font-display text-3xl text-[#161716] mt-1">Create Collection</h3>
              </div>
              <button type="button" onClick={() => setShowModal(false)} className="text-2xl text-[#6B7068]">×</button>
            </div>

            <Input
              label="Collection Name"
              placeholder="e.g. Sculptural Living Edit"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              label="Description"
              placeholder="Architectural theme summary..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <Input
              label="Cover Image URL"
              placeholder="https://..."
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />

            <div className="flex justify-end gap-3 pt-3 border-t border-[#E2DCD2]">
              <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Collection ↗</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
