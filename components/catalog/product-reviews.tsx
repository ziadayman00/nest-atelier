"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
import { cn } from "@/lib/utils/cn";

const MAX_IMAGES = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

/* ─── SVG star row (consistent with product card stars) ─── */
function StarRow({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const dim = size === "lg" ? "h-4 w-4" : "h-3.5 w-3.5";
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        const half = !filled && rating >= star - 0.5;
        return (
          <svg key={star} viewBox="0 0 12 12" className={cn(dim, "shrink-0")} fill="none">
            {half ? (
              <>
                <defs>
                  <linearGradient id={`hg-rev-${star}`} x1="0" x2="1" y1="0" y2="0">
                    <stop offset="50%" stopColor="#B86A44" />
                    <stop offset="50%" stopColor="transparent" />
                  </linearGradient>
                </defs>
                <path
                  d="M6 1l1.39 2.82L10.5 4.27l-2.25 2.19.53 3.09L6 8.08 3.22 9.55l.53-3.09L1.5 4.27l3.11-.45L6 1z"
                  fill={`url(#hg-rev-${star})`}
                  stroke="#B86A44"
                  strokeWidth="0.8"
                />
              </>
            ) : (
              <path
                d="M6 1l1.39 2.82L10.5 4.27l-2.25 2.19.53 3.09L6 8.08 3.22 9.55l.53-3.09L1.5 4.27l3.11-.45L6 1z"
                fill={filled ? "#B86A44" : "none"}
                stroke={filled ? "#B86A44" : "#C8BFB4"}
                strokeWidth="0.8"
              />
            )}
          </svg>
        );
      })}
    </div>
  );
}

/* ─── Interactive star picker for the modal ─── */
function StarPicker({ rating, onChange }: { rating: number; onChange: (r: number) => void }) {
  const [hover, setHover] = useState(0);
  const labels = ["", "Poor", "Fair", "Good", "Great", "Excellent"];
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
          className="cursor-pointer transition-transform hover:scale-110"
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
        >
          <svg viewBox="0 0 20 20" className="h-7 w-7" fill="none">
            <path
              d="M10 2l2.09 4.26L17 7.27l-3.5 3.41.83 4.82L10 13.27l-4.33 2.23.83-4.82L3 7.27l4.91-.71L10 2z"
              fill={star <= (hover || rating) ? "#B86A44" : "none"}
              stroke={star <= (hover || rating) ? "#B86A44" : "#C8BFB4"}
              strokeWidth="1.2"
            />
          </svg>
        </button>
      ))}
      <span className="text-sm font-mono text-[#6B7068]">
        {labels[hover || rating]}
      </span>
    </div>
  );
}

/* ─── Reviewer avatar with deterministic initials + color ─── */
function ReviewerAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const palettes = [
    "bg-[#4A5E4C] text-[#FAFAF7]",
    "bg-[#B86A44] text-[#FAFAF7]",
    "bg-[#6B7068] text-[#FAFAF7]",
    "bg-[#161716] text-[#FAFAF7]",
    "bg-[#8B7355] text-[#FAFAF7]",
  ];
  const colorClass = palettes[(name.charCodeAt(0) ?? 0) % palettes.length];
  return (
    <div
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold font-mono select-none",
        colorClass
      )}
      aria-hidden
    >
      {initials || "?"}
    </div>
  );
}

/* ─── Image lightbox gallery ─── */
function ReviewImageGallery({ images }: { images: string[] }) {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      {mounted && lightbox && createPortal(
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-[#161716]/85 backdrop-blur-sm p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-2xl w-full aspect-square rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image src={lightbox} alt="Review photo" fill className="object-contain" />
          </div>
          <button
            type="button"
            className="absolute top-4 right-4 text-white text-3xl leading-none hover:text-[#EDE7DC] transition-colors cursor-pointer"
            onClick={() => setLightbox(null)}
          >
            ×
          </button>
        </div>,
        document.body
      )}
    </>
  );
}

/* ─── Individual review card ─── */
function ReviewCard({ rev }: { rev: Review }) {
  const reviewerName = rev.reviewer?.fullName ?? rev.user?.fullName ?? "Verified Buyer";
  const reviewImages = rev.images ?? [];
  return (
    <div className="rounded-2xl border border-[#E2DCD2]/70 bg-white/55 backdrop-blur-sm p-5 sm:p-6 space-y-3">
      {/* Reviewer header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <ReviewerAvatar name={reviewerName} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#161716] truncate leading-tight">
              {reviewerName}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <StarRow rating={rev.rating} />
              <span className="text-[10px] font-mono font-medium text-[#B86A44]">
                {rev.rating}.0
              </span>
            </div>
          </div>
        </div>
        <span className="text-[11px] text-[#6B7068] font-mono shrink-0 pt-0.5">
          {formatDate(rev.createdAt)}
        </span>
      </div>

      {/* Review headline */}
      {rev.title && (
        <h4 className="font-display text-lg text-[#161716] font-medium leading-snug">
          &ldquo;{rev.title}&rdquo;
        </h4>
      )}

      {/* Review body */}
      <p className="text-sm text-[#4A4A42] leading-relaxed">{rev.body}</p>

      {/* Photos */}
      {reviewImages.length > 0 && <ReviewImageGallery images={reviewImages} />}

      {/* Verified badge */}
      <div className="pt-1">
        <span className="inline-flex items-center gap-1 rounded-full bg-[#EDE7DC] px-2.5 py-0.5 text-[10px] font-mono font-medium text-[#4A5E4C]">
          <svg viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor">
            <path d="M8 0l1.76 5.41H15l-4.58 3.32 1.76 5.41L8 10.82l-4.18 3.32 1.76-5.41L1 5.41h5.24z" />
          </svg>
          Verified Purchase
        </span>
      </div>
    </div>
  );
}

/* ─── Main export ─── */
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Form state
  const [rating, setRating] = useState(5);
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

  useEffect(() => {
    return () => previews.forEach((p) => URL.revokeObjectURL(p));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previews]);

  // Lock body scroll when review modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  // Close review modal on Escape key
  useEffect(() => {
    if (!showModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showModal]);

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
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setRating(5);
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

  const bodyOk = body.trim().length >= 20;

  return (
    <div className="glass-card p-6 sm:p-10 space-y-8">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2DCD2] pb-6">
        <div className="space-y-1">
          <span className="pill-accent-sage text-xs font-mono">Client Impressions</span>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <h2 className="font-display text-3xl sm:text-4xl text-[#161716]">
              Residence Reviews
            </h2>
            {summary.count > 0 && (
              <div className="flex items-center gap-2 rounded-full bg-[#EDE7DC] px-3.5 py-1.5">
                <StarRow rating={Math.round(summary.averageRating * 2) / 2} />
                <span className="text-xs font-semibold font-mono text-[#161716]">
                  {summary.averageRating.toFixed(1)}
                </span>
                <span className="text-xs font-mono text-[#6B7068]">
                  ({summary.count} {summary.count === 1 ? "review" : "reviews"})
                </span>
              </div>
            )}
          </div>
        </div>
        {user && (
          <Button onClick={() => setShowModal(true)} size="md" className="cursor-pointer shrink-0">
            + Write a Review ↗
          </Button>
        )}
      </div>

      {/* ── List ── */}
      {loading ? (
        <div className="py-12 flex justify-center">
          <Spinner className="h-6 w-6 text-[#4A5E4C]" />
        </div>
      ) : reviews.length > 0 ? (
        <div className="grid gap-4">
          {reviews.map((rev) => (
            <ReviewCard key={rev.id} rev={rev} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center space-y-3">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EDE7DC]">
              <svg viewBox="0 0 24 24" className="h-8 w-8 text-[#B0A898]" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            </div>
          </div>
          <p className="font-display text-2xl text-[#6B7068]">No reviews yet</p>
          <p className="text-sm text-[#6B7068] font-light max-w-xs mx-auto">
            Be the first client with a delivered order to share your spatial feedback.
          </p>
          {user && (
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="mt-2 text-sm font-semibold text-[#4A5E4C] underline underline-offset-4 cursor-pointer hover:text-[#161716] transition-colors"
            >
              Write the first review →
            </button>
          )}
        </div>
      )}

      {/* ── Write Review Modal ── */}
      {mounted &&
        showModal &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#161716]/65 backdrop-blur-md p-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) handleClose();
            }}
          >
            <form
              onSubmit={handleSubmitReview}
              className="w-full max-w-lg rounded-[28px] ios-glass-dropdown p-7 sm:p-10 space-y-6 shadow-2xl my-8 relative z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="border-b border-[#E2DCD2] pb-5 flex items-start justify-between gap-4">
                <div>
                  <span className="pill-accent-sage text-xs font-mono">Verified Purchaser</span>
                  <h3 className="font-display text-3xl text-[#161716] mt-1">Share Your Experience</h3>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-2xl text-[#6B7068] hover:text-[#161716] cursor-pointer mt-1 leading-none"
                >
                  ×
                </button>
              </div>

              {/* Star picker */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#161716] font-mono">
                  Your Rating
                </label>
                <StarPicker rating={rating} onChange={setRating} />
              </div>

              {/* Headline */}
              <Input
                label="Review Headline"
                placeholder="e.g. Exceptional craftsmanship and monolithic presence"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              {/* Body */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#161716] font-mono">
                  Detailed Review{" "}
                  <span className="font-normal text-[#6B7068]">(min 20 characters)</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe the wood finish, structural joinery, white-glove delivery experience..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full p-4 text-sm text-[#161716] rounded-2xl border border-[#E2DCD2] bg-[#FAFAF7] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#4A5E4C] resize-none"
                  required
                />
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "text-[10px] font-mono transition-colors",
                    bodyOk ? "text-[#4A5E4C]" : "text-[#6B7068]"
                  )}>
                    {bodyOk ? "✓ Minimum length reached" : `${20 - body.trim().length} more characters needed`}
                  </span>
                  <span className="text-[10px] font-mono text-[#6B7068]">{body.length} chars</span>
                </div>
              </div>

              {/* Image upload */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#161716] font-mono">
                  Photos{" "}
                  <span className="font-normal text-[#6B7068]">
                    (optional · up to {MAX_IMAGES}, 5 MB each)
                  </span>
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

              {formError && (
                <p className="text-xs text-red-600 font-semibold bg-red-50 rounded-xl px-4 py-2.5">
                  {formError}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-2 border-t border-[#E2DCD2]">
                <Button type="button" variant="ghost" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" loading={submitting}>
                  Submit Review ↗
                </Button>
              </div>
            </form>
          </div>,
          document.body
        )}
    </div>
  );
}