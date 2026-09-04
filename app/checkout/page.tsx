"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cartApi } from "@/lib/api/cart";
import { orderApi } from "@/lib/api/orders";
import { deliveryZoneApi } from "@/lib/api/delivery-zones";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";
import { RequireAuth } from "@/components/auth/require-auth";
import { EmptyState } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { formatPrice } from "@/lib/utils/format";
import type { CartItem } from "@/lib/types/cart";
import type { DeliveryZone } from "@/lib/types/delivery-zone";
import { ApiError } from "@/lib/api/client";

const schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(6, "Valid phone number is required"),
  addressLine1: z.string().min(5, "Delivery address is required"),
  city: z.string().min(2, "City is required"),
  couponCode: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

function lineTotal(item: CartItem): number {
  return Number(item.variant?.price ?? item.product?.price ?? 0) * item.quantity;
}

function CheckoutContent() {
  const { user } = useAuth();
  const router = useRouter();
  const { success: toastSuccess, error: toastError } = useToast();

  const [items, setItems] = useState<CartItem[]>([]);
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null);

  const [appliedCoupon, setAppliedCoupon] = useState<string>("");
  const [couponInput, setCouponInput] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: user?.fullName ?? "",
      city: "",
      couponCode: "",
    },
  });

  const selectedCity = watch("city");

  useEffect(() => {
    if (user?.fullName) {
      reset((current) => ({ ...current, fullName: user.fullName }));
    }
  }, [user, reset]);

  useEffect(() => {
    Promise.all([cartApi.get(), deliveryZoneApi.listPublic()])
      .then(([cartData, zoneData]) => {
        setItems(cartData.cart.items ?? []);
        const zones = zoneData.deliveryZones ?? [];
        setDeliveryZones(zones);
        if (zones.length > 0 && zones[0].cities.length > 0) {
          const defaultCity = zones[0].cities[0];
          setValue("city", defaultCity);
          setSelectedZone(zones[0]);
        }
      })
      .catch(() => setError("Could not load checkout data"))
      .finally(() => setLoading(false));
  }, [setValue]);

  // Update selected zone when city changes
  useEffect(() => {
    if (!selectedCity) return;
    const match = deliveryZones.find((z) =>
      z.cities.some((c) => c.toLowerCase() === selectedCity.toLowerCase())
    );
    setSelectedZone(match ?? null);
  }, [selectedCity, deliveryZones]);

  const subtotal = items.reduce((sum, item) => sum + lineTotal(item), 0);
  const shippingFee = selectedZone ? selectedZone.shippingFee : subtotal >= 5000 ? 0 : 250;
  const estimatedDays = selectedZone
    ? `${selectedZone.estimatedDeliveryMinDays} – ${selectedZone.estimatedDeliveryMaxDays} business days`
    : "2 – 4 business days";

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    const code = couponInput.trim().toUpperCase();
    setAppliedCoupon(code);
    setValue("couponCode", code);
    toastSuccess(`Coupon ${code} staged for order summary`);
  };

  const onSubmit = async (data: FormData) => {
    setError("");
    try {
      const payload = {
        shippingAddress: {
          fullName: data.fullName,
          phone: data.phone,
          addressLine1: data.addressLine1,
          city: data.city,
        },
        couponCode: appliedCoupon || data.couponCode || undefined,
      };

      const result = await orderApi.checkout(payload);
      toastSuccess("Order placed! Our Cairo atelier will contact you to schedule white-glove hand delivery.");
      router.push(`/account/orders/${result.order.id}?placed=1`);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Checkout failed";
      setError(msg);
      toastError(msg);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-28">
        <Spinner className="h-8 w-8 text-[#4A5E4C]" />
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="w-full px-6 sm:px-10 lg:px-14 py-12">
        <div className="glass-card p-16 text-center space-y-4">
          <EmptyState title="Nothing to Checkout" description="Your shopping bag is currently empty." />
        </div>
      </div>
    );
  }

  const cityOptions = deliveryZones.flatMap((z) =>
    z.cities.map((city) => ({
      value: city,
      label: `${city.charAt(0).toUpperCase() + city.slice(1)} (${z.name})`,
    }))
  );

  return (
    <div className="w-full px-4 sm:px-8 lg:px-14 py-4 sm:py-6 space-y-8 sm:space-y-10">

      {/* Progress Step Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-2 text-xs font-mono">
        <div className="flex items-center gap-2.5 text-[#6B7068]">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EDE7DC] text-[#6B7068] text-[11px]">1</span>
          <span>Shopping Bag</span>
        </div>
        <span className="text-[#D1CCC4] hidden sm:inline">——</span>
        <div className="flex items-center gap-2.5 font-semibold text-[#161716]">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#161716] text-white text-[11px]">2</span>
          <span>Delivery & Coupon Details</span>
        </div>
        <span className="text-[#D1CCC4] hidden sm:inline">——</span>
        <div className="flex items-center gap-2.5 text-[#6B7068]">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#EDE7DC] text-[#6B7068] text-[11px]">3</span>
          <span>Order Confirmation</span>
        </div>
      </div>

      {/* Header */}
      <div className="space-y-2 border-b border-[#E2DCD2]/80 pb-6">
        <span className="pill-accent-sage text-xs font-mono">Atelier Delivery</span>
        <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl text-[#161716]">
          White-Glove Delivery Setup
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7068] font-light">
          Handcrafted in our Cairo workshop. Verified Cash on Delivery (COD) upon personal inspection.
        </p>
      </div>

      {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

      <div className="grid gap-8 lg:gap-10 lg:grid-cols-[1fr_380px] items-start">
        {/* Shipping Form Card */}
        <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-5 sm:p-10 space-y-6">
          <div className="border-b border-[#E2DCD2] pb-4">
            <h2 className="font-display text-2xl text-[#161716]">Recipient & Delivery Zone</h2>
            <p className="text-xs text-[#6B7068] font-light mt-0.5">Metropolitan Cairo & Greater Egypt Hand Delivery</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Full Name"
              placeholder="e.g. Soliman Mansour"
              {...register("fullName")}
              error={errors.fullName?.message}
            />
            <Input
              label="Phone Number"
              placeholder="010 1234 5678"
              {...register("phone")}
              error={errors.phone?.message}
            />
            <div className="sm:col-span-2">
              <Input
                label="Street Address & Villa / Apt #"
                placeholder="e.g. 14 El Standard Street, Maadi"
                {...register("addressLine1")}
                error={errors.addressLine1?.message}
              />
            </div>

            {/* City Select from Delivery Zones */}
            {cityOptions.length > 0 ? (
              <Select
                label="Delivery City / Zone"
                {...register("city")}
                options={cityOptions}
                error={errors.city?.message}
              />
            ) : (
              <Input
                label="City"
                placeholder="Cairo"
                {...register("city")}
                error={errors.city?.message}
              />
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#161716] font-mono">
                Payment Mode
              </label>
              <div className="rounded-full border border-[#4A5E4C]/50 bg-[#EDE7DC]/50 px-4 py-3 text-xs font-semibold text-[#161716] flex items-center justify-between">
                <span>Cash on Delivery (COD)</span>
                <span className="pill-accent-sage text-[10px] font-mono">Verified</span>
              </div>
            </div>
          </div>

          {/* Selected Zone Card */}
          {selectedZone && (
            <div className="rounded-2xl border border-[#4A5E4C]/30 bg-[#FAFAF7] p-4 text-xs space-y-1">
              <div className="flex items-center justify-between font-semibold text-[#161716]">
                <span>Delivery Zone: {selectedZone.name}</span>
                <span className="text-[#4A5E4C] font-mono">Est. {estimatedDays}</span>
              </div>
              <p className="text-[#6B7068] font-light">
                White-Glove Delivery Fee: {selectedZone.shippingFee === 0 ? "FREE" : `${formatPrice(selectedZone.shippingFee)} EGP`}
              </p>
            </div>
          )}

          {/* Coupon Code Input */}
          <div className="border-t border-[#E2DCD2] pt-6 space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#161716] font-mono">
              Apply Promotional Coupon Code
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g. CAIRO500, WELCOME10"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
              />
              <Button type="button" variant="outline" onClick={handleApplyCoupon} className="shrink-0 cursor-pointer">
                Apply Coupon
              </Button>
            </div>
            {appliedCoupon && (
              <p className="text-xs text-[#4A5E4C] font-semibold font-mono">
                ✓ Coupon Code <span className="underline">{appliedCoupon}</span> staged for order placement.
              </p>
            )}
          </div>

          <div className="border-t border-[#E2DCD2] pt-6 flex justify-end">
            <Button type="submit" loading={isSubmitting} size="lg" className="w-full sm:w-auto px-10 py-4 text-sm font-semibold cursor-pointer">
              Confirm & Place Order ↗
            </Button>
          </div>
        </form>

        {/* Order Summary Card */}
        <div className="glass-card p-8 space-y-6 lg:sticky lg:top-24">
          <h2 className="font-display text-2xl text-[#161716] border-b border-[#E2DCD2]/60 pb-4">
            Order Pieces ({items.length})
          </h2>

          <div className="divide-y divide-[#E2DCD2] max-h-60 overflow-y-auto no-scrollbar">
            {items.map((item) => (
              <div key={item.id} className="py-3 flex justify-between text-xs">
                <div>
                  <p className="font-semibold text-[#161716]">{item.product?.name}</p>
                  <p className="text-[10px] text-[#6B7068] font-mono">
                    Qty: {item.quantity} {item.variant ? `· ${item.variant.name}` : ""}
                  </p>
                </div>
                <p className="font-semibold text-[#161716] font-mono">{formatPrice(lineTotal(item))} EGP</p>
              </div>
            ))}
          </div>

          <div className="border-t border-[#E2DCD2] pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-[#6B7068]">
              <span>Subtotal</span>
              <span className="font-semibold text-[#161716] font-mono">{formatPrice(subtotal)} EGP</span>
            </div>
            <div className="flex justify-between text-[#6B7068]">
              <span>Delivery Fee ({selectedZone?.name ?? "Standard"})</span>
              <span className="font-semibold text-[#4A5E4C] font-mono">
                {shippingFee === 0 ? "FREE" : `${formatPrice(shippingFee)} EGP`}
              </span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-[#B86A44] font-mono">
                <span>Coupon Code ({appliedCoupon})</span>
                <span className="font-semibold">Applied on Server</span>
              </div>
            )}
            <div className="flex justify-between border-t border-[#E2DCD2] pt-3 text-base text-[#161716]">
              <span className="font-display text-xl">Estimated Total</span>
              <span className="font-bold font-mono">{formatPrice(subtotal + shippingFee)} EGP</span>
            </div>
          </div>

          <p className="text-center text-[11px] text-[#6B7068] font-mono">
            🔒 Payment collected in cash upon personal inspection of pieces.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <RequireAuth>
      <CheckoutContent />
    </RequireAuth>
  );
}
