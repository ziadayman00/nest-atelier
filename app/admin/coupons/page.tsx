"use client";

import { useEffect, useState } from "react";
import { couponApi } from "@/lib/api/coupons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import type { Coupon } from "@/lib/types/coupon";
import { useToast } from "@/providers/toast-provider";
import { formatPrice } from "@/lib/utils/format";

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { success: toastSuccess, error: toastError } = useToast();

  const [form, setForm] = useState({
    code: "",
    type: "percentage" as "percentage" | "fixed",
    value: "",
    minimumOrderAmount: "",
    maximumDiscountAmount: "",
    usageLimit: "",
    perUserLimit: "1",
  });

  const load = () => {
    setLoading(true);
    couponApi
      .list({ limit: 50 })
      .then((d) => setCoupons(d.coupons ?? []))
      .catch(() => toastError("Could not load coupons"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await couponApi.create({
        code: form.code.toUpperCase().trim(),
        type: form.type,
        value: Number(form.value),
        minimumOrderAmount: form.minimumOrderAmount ? Number(form.minimumOrderAmount) : undefined,
        maximumDiscountAmount: form.maximumDiscountAmount ? Number(form.maximumDiscountAmount) : undefined,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
        perUserLimit: form.perUserLimit ? Number(form.perUserLimit) : undefined,
      });

      toastSuccess(`Coupon ${form.code} created successfully!`);
      setShowModal(false);
      setForm({
        code: "",
        type: "percentage",
        value: "",
        minimumOrderAmount: "",
        maximumDiscountAmount: "",
        usageLimit: "",
        perUserLimit: "1",
      });
      await load();
    } catch {
      toastError("Failed to create coupon");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deactivate this coupon code?")) return;
    try {
      await couponApi.delete(id);
      toastSuccess("Coupon deleted");
      await load();
    } catch {
      toastError("Failed to delete coupon");
    }
  };

  if (loading) return <Spinner className="h-8 w-8 text-[#4A5E4C]" />;

  return (
    <div className="space-y-6">
      {/* Header Bento */}
      <div className="bento-card p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="pill-accent-sage text-xs">Promotions & Incentives</span>
          <h1 className="font-display text-3xl sm:text-4xl text-[#161716] mt-1">
            Coupon Codes Management
          </h1>
          <p className="text-xs text-[#6B7068] font-light mt-1">
            Create percentage or fixed amount promotional discount codes for checkout.
          </p>
        </div>

        <Button onClick={() => setShowModal(true)}>
          + Create Coupon Code ↗
        </Button>
      </div>

      {/* Coupons Table Bento */}
      <div className="bento-card p-6 overflow-hidden">
        <div className="pb-4 border-b border-[#E2DCD2] flex items-center justify-between">
          <span className="pill-accent-sage text-xs">Active Discounts ({coupons.length})</span>
        </div>

        {coupons.length > 0 ? (
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#E2DCD2] text-[#6B7068]">
                <tr>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Coupon Code</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Type & Value</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Min Order / Max Discount</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Usage Count</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DCD2]">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-[#EDE7DC]/30 transition-colors">
                    <td className="px-4 py-4 font-mono font-bold text-[#161716]">
                      {c.code}
                    </td>
                    <td className="px-4 py-4 font-semibold text-[#4A5E4C]">
                      {c.type === "percentage" ? `${c.value}% OFF` : `${formatPrice(c.value)} OFF`}
                    </td>
                    <td className="px-4 py-4 text-[#6B7068]">
                      Min: {c.minimumOrderAmount ? formatPrice(c.minimumOrderAmount) : "None"} · Max: {c.maximumDiscountAmount ? formatPrice(c.maximumDiscountAmount) : "Uncapped"}
                    </td>
                    <td className="px-4 py-4 text-[#6B7068]">
                      {c.usedCount} / {c.usageLimit ?? "∞"} Uses
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(c.id)}
                        className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center space-y-2">
            <p className="font-display text-2xl text-[#6B7068]">No active coupons</p>
            <p className="text-xs text-[#6B7068] font-light">Create a coupon code to offer client discounts</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center glass-backdrop p-4">
          <form onSubmit={handleCreateCoupon} className="w-full max-w-lg bento-card p-8 space-y-5">
            <div className="border-b border-[#E2DCD2] pb-4 flex items-center justify-between">
              <div>
                <span className="pill-accent-sage text-xs">New Promotional Code</span>
                <h3 className="font-display text-3xl text-[#161716] mt-1">Create Coupon</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-2xl text-[#6B7068] cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Coupon Code"
                placeholder="e.g. WELCOME10"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                required
              />
              <Select
                label="Discount Type"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as "percentage" | "fixed" })}
                options={[
                  { value: "percentage", label: "Percentage (%)" },
                  { value: "fixed", label: "Fixed Amount (EGP)" },
                ]}
              />
              <Input
                label="Discount Value"
                type="number"
                placeholder="10"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                required
              />
              <Input
                label="Min Order Amount (EGP)"
                type="number"
                placeholder="1000"
                value={form.minimumOrderAmount}
                onChange={(e) => setForm({ ...form, minimumOrderAmount: e.target.value })}
              />
              <Input
                label="Max Discount Cap (EGP)"
                type="number"
                placeholder="500"
                value={form.maximumDiscountAmount}
                onChange={(e) => setForm({ ...form, maximumDiscountAmount: e.target.value })}
              />
              <Input
                label="Total Usage Limit"
                type="number"
                placeholder="100"
                value={form.usageLimit}
                onChange={(e) => setForm({ ...form, usageLimit: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#E2DCD2]">
              <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Coupon Code ↗</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
