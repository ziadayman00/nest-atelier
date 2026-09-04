"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { catalogApi } from "@/lib/api/catalog";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { formatDate } from "@/lib/utils/format";
import type { Review, ReviewSummary } from "@/lib/types/catalog";
import { ApiError } from "@/lib/api/client";

const MAX_IMAGES = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

function StarRatingBar({ rating }: { rating: number }) {
  return (
    <span className="text-xs text-amber-500 font-mono tracking-widest">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rating ? "text-amber-500" : "text-[#E2DCD2]"}>
          ★
        </span>
      ))}
    </span>
  );
}

function ReviewImageGallery({ images }: { images: string[] }) {
  const [lightbox, setLightbox] = useState<string | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="flex gap-2 mt-3 flex-wrap">
        {images.map((url, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setLightbox(url)}
            className="relative w-16 h-16 rounded-xl overflow-hidden border border-[#E2DCD2] hover:border-[#4A5E4C] transition-colors cursor-zoom-in"
          >
            <Image src={url} alt={`Review photo ${i + 1}`} fill className="object-cover" />
          </button>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-[#161716]/85 backdrop-blur-sm p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-2xl w-full aspect-square rounded-2xl overflow-hidden shadow-2xl">
            <Image src={lightbox} alt="Review photo" fill className="object-contain" />
          </div>
          <button
            type="button"
            className="absolute top-4 right-4 text-white text-3xl leading-none hover:text-[#EDE7DC] transition-colors cursor-pointer"
            onClick={() => setLightbox(null)}
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}

export function ProductReviews({
  productId,
  productSlug,
}: {
  productId: string;
  productSlug: string;
}) {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewSummary>({ count: 0, averageRating: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadReviews = async () => {
    try {
      const data = await catalogApi.getReviews(productSlug);
      setReviews(data.reviews ?? []);
      if (data.summary) setSummary(data.summary);
    } catch {
      // quiet fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productSlug]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => previews.forEach((p) => URL.revokeObjectURL(p));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previews]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const remaining = MAX_IMAGES - images.length;
    const accepted: File[] = [];
    const newPreviews: string[] = [];

    for (const file of files.slice(0, remaining)) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        toastError(`${file.name} is not a supported format (JPEG, PNG, WebP).`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        toastError(`${file.name} exceeds the 5 MB limit.`);
        continue;
      }
      accepted.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }

    setImages((prev) => [...prev, ...accepted]);
    setPreviews((prev) => [...prev, ...newPreviews]);
    // Reset input so same file can be re-selected after removal
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setRating(5);
    setHoverRating(0);
    setTitle("");
    setBody("");
    previews.forEach((p) => URL.revokeObjectURL(p));
    setImages([]);
    setPreviews([]);
    setFormError("");
  };

  const handleClose = () => {
    resetForm();
    setShowModal(false);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (body.trim().length < 20) {
      setFormError("Review body must contain at least 20 characters.");
      return;
    }

    setSubmitting(true);
    try {
      await catalogApi.createReview(productId, { rating, title, body, images });
      success("Review submitted! Your review is pending atelier verification.");
      handleClose();
      await loadReviews();
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to submit review";
      setFormError(msg);
      toastError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-card p-8 sm:p-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2DCD2] pb-6">
        <div className="space-y-1">
          <span className="pill-accent-sage text-xs font-mono">Client Impressions</span>
          <div className="flex items-center gap-3 pt-1">
            <h2 className="font-display text-3xl sm:text-4xl text-[#161716]">
              Verified Residence Reviews
            </h2>
            <div className="flex items-center gap-1.5 rounded-full bg-[#EDE7DC] px-3.5 py-1 text-xs font-semibold text-[#161716] font-mono">
              <span className="text-amber-600">★</span>
              <span>{summary.averageRating > 0 ? summary.averageRating.toFixed(1) : "New"}</span>
              <span className="text-[#6B7068]">({summary.count})</span>
            </div>
          </div>
        </div>

        {user && (
          <Button onClick={() => setShowModal(true)} size="md" className="cursor-pointer">
            + Write a Review ↗
          </Button>
        )}
      </div>

      {/* Review List */}
      {loading ? (
        <div className="py-12 flex justify-center">
          <Spinner className="h-6 w-6 text-[#4A5E4C]" />
        </div>
      ) : reviews.length > 0 ? (
        <div className="divide-y divide-[#E2DCD2]">
          {reviews.map((rev) => {
            const reviewerName = rev.reviewer?.fullName ?? rev.user?.fullName ?? "Verified Buyer";
            const reviewImages = rev.images ?? [];
            return (
              <div key={rev.id} className="py-6 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-display text-xl text-[#161716] font-medium">{rev.title}</span>
                    <StarRatingBar rating={rev.rating} />
                  </div>
                  <span className="text-[11px] text-[#6B7068] font-mono">{formatDate(rev.createdAt)}</span>
                </div>
                <p className="text-xs sm:text-sm text-[#6B7068] font-light leading-relaxed">{rev.body}</p>
                {reviewImages.length > 0 && <ReviewImageGallery images={reviewImages} />}
                <p className="text-[11px] font-semibold text-[#4A5E4C] font-mono pt-1">
                  By {reviewerName} · Verified Hand Delivery
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-10 text-center space-y-2">
          <p className="font-display text-2xl text-[#6B7068]">No client reviews registered yet.</p>
          <p className="text-xs text-[#6B7068] font-light">
            Be the first client with a delivered order to share your spatial feedback.
          </p>
        </div>
      )}

      {/* Write Review Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center glass-backdrop p-4 overflow-y-auto">
          <form
            onSubmit={handleSubmitReview}
            className="w-full max-w-lg rounded-[28px] ios-glass-dropdown p-8 sm:p-10 space-y-6 shadow-2xl my-8"
          >
            {/* Modal Header */}
            <div className="border-b border-[#E2DCD2] pb-4 flex items-center justify-between">
              <div>
                <span className="pill-accent-sage text-xs font-mono">Verified Purchaser Feedback</span>
                <h3 className="font-display text-3xl text-[#161716] mt-1">Share Piece Experience</h3>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="text-2xl text-[#6B7068] hover:text-[#161716] cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* Rating Picker */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#161716] font-mono">
                Rating Score
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className={`text-2xl transition-transform cursor-pointer ${
                      star <= (hoverRating || rating) ? "text-amber-500 scale-110" : "text-[#E2DCD2]"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <Input
              label="Review Headline"
              placeholder="e.g. Exceptional craftsmanship and monolithic presence"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#161716] font-mono">
                Detailed Review <span className="font-normal text-[#6B7068]">(min 20 characters)</span>
              </label>
              <textarea
                rows={4}
                placeholder="Describe wood finish, structural joinery, white-glove delivery experience..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full p-4 text-xs text-[#161716] rounded-2xl border border-[#E2DCD2] bg-[#FAFAF7] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#4A5E4C]"
                required
              />
              <p className="text-[10px] text-[#6B7068] text-right font-mono">{body.length} / 20 min chars</p>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#161716] font-mono">
                Photos <span className="font-normal text-[#6B7068]">(optional · up to {MAX_IMAGES}, 5 MB each)</span>
              </label>

              {previews.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {previews.map((src, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-[#E2DCD2] group">
                      <Image src={src} alt={`Preview ${i + 1}`} fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#161716]/80 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {images.length < MAX_IMAGES && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-dashed border-[#B0A898] text-xs text-[#6B7068] hover:border-[#4A5E4C] hover:text-[#4A5E4C] transition-colors cursor-pointer w-full justify-center"
                  >
                    <span className="text-lg leading-none">+</span>
                    Add Photos ({images.length}/{MAX_IMAGES})
                  </button>
                </>
              )}
            </div>

            {formError && <p className="text-xs text-red-600 font-semibold">{formError}</p>}

            <div className="flex justify-end gap-3 pt-3 border-t border-[#E2DCD2]">
              <Button type="button" variant="ghost" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" loading={submitting}>
                Submit Review ↗
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
