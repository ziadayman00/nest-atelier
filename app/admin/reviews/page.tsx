"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { formatDate } from "@/lib/utils/format";
import type { Review } from "@/lib/types/catalog";
import { useToast } from "@/providers/toast-provider";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"pending" | "approved" | "rejected">("pending");

  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [moderationNote, setModerationNote] = useState("");
  const { success: toastSuccess, error: toastError } = useToast();

  const load = () => {
    setLoading(true);
    adminApi
      .getReviews({ status: statusFilter, limit: 50 })
      .then((d) => setReviews(d.reviews ?? []))
      .catch(() => toastError("Could not load reviews"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [statusFilter]);

  const handleModerate = async (id: string, status: "approved" | "rejected") => {
    try {
      await adminApi.updateReviewStatus(id, status, moderationNote || undefined);
      toastSuccess(`Review ${status} successfully`);
      setSelectedReview(null);
      setModerationNote("");
      await load();
    } catch {
      toastError("Failed to update review status");
    }
  };

  if (loading) return <Spinner className="h-8 w-8 text-[#4A5E4C]" />;

  return (
    <div className="space-y-6">
      {/* Header Bento */}
      <div className="bento-card p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="pill-accent-sage text-xs">Quality Assurance</span>
          <h1 className="font-display text-3xl sm:text-4xl text-[#161716] mt-1">
            Client Review Moderation
          </h1>
          <p className="text-xs text-[#6B7068] font-light mt-1">
            Moderate verified buyer reviews before publishing to storefront.
          </p>
        </div>

        <div className="w-full sm:w-56">
          <Select
            label="Filter Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "pending" | "approved" | "rejected")}
            options={[
              { value: "pending", label: "Pending Approval" },
              { value: "approved", label: "Approved" },
              { value: "rejected", label: "Rejected" },
            ]}
          />
        </div>
      </div>

      {/* Review Table Bento */}
      <div className="bento-card p-6 overflow-hidden">
        <div className="pb-4 border-b border-[#E2DCD2] flex items-center justify-between">
          <span className="pill-accent-sage text-xs">Review Submissions ({reviews.length})</span>
        </div>

        {reviews.length > 0 ? (
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#E2DCD2] text-[#6B7068]">
                <tr>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Product / User</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Rating & Headline</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Submitted</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DCD2]">
                {reviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-[#EDE7DC]/30 transition-colors">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-[#161716]">{rev.product?.name ?? "Piece"}</p>
                      <p className="text-[11px] text-[#6B7068]">
                        By {rev.reviewer?.fullName ?? rev.user?.fullName ?? "Client"}
                      </p>
                    </td>
                    <td className="px-4 py-4 max-w-sm space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-amber-600 font-bold">★ {rev.rating}</span>
                        <span className="font-semibold text-[#161716]">{rev.title}</span>
                      </div>
                      <p className="text-[11px] text-[#6B7068] font-light line-clamp-2">{rev.body}</p>
                      {rev.images && rev.images.length > 0 && (
                        <div className="flex gap-1.5 pt-1">
                          {rev.images.map((img, idx) => (
                            <a
                              key={idx}
                              href={img}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="relative w-9 h-9 rounded-lg overflow-hidden border border-[#E2DCD2] hover:border-[#4A5E4C] transition-colors"
                              title="Click to view full image"
                            >
                              <img src={img} alt="Review attachment" className="w-full h-full object-cover" />
                            </a>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-[#6B7068] font-light">
                      {formatDate(rev.createdAt)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleModerate(rev.id, "approved")}
                          className="rounded-full bg-[#4A5E4C] px-3.5 py-1 text-xs font-semibold text-white hover:bg-[#374739] cursor-pointer"
                        >
                          Approve ↗
                        </button>
                        <button
                          type="button"
                          onClick={() => handleModerate(rev.id, "rejected")}
                          className="rounded-full bg-red-100 px-3.5 py-1 text-xs font-semibold text-red-700 hover:bg-red-200 cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center space-y-2">
            <p className="font-display text-2xl text-[#6B7068]">No reviews in {statusFilter}</p>
            <p className="text-xs text-[#6B7068] font-light">Change status filter to view history</p>
          </div>
        )}
      </div>
    </div>
  );
}
