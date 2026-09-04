"use client";

import { useEffect, useState } from "react";
import { deliveryZoneApi } from "@/lib/api/delivery-zones";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import type { DeliveryZone } from "@/lib/types/delivery-zone";
import { useToast } from "@/providers/toast-provider";
import { formatPrice } from "@/lib/utils/format";

export default function AdminDeliveryZonesPage() {
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { success: toastSuccess, error: toastError } = useToast();

  const [form, setForm] = useState({
    name: "",
    cities: "",
    shippingFee: "0",
    estimatedDeliveryMinDays: "2",
    estimatedDeliveryMaxDays: "5",
  });

  const load = () => {
    setLoading(true);
    deliveryZoneApi
      .listAdmin()
      .then((d) => setZones(d.deliveryZones ?? []))
      .catch(() => toastError("Could not load delivery zones"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreateZone = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cityList = form.cities
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);

      await deliveryZoneApi.create({
        name: form.name.trim(),
        cities: cityList,
        shippingFee: Number(form.shippingFee),
        estimatedDeliveryMinDays: Number(form.estimatedDeliveryMinDays),
        estimatedDeliveryMaxDays: Number(form.estimatedDeliveryMaxDays),
      });

      toastSuccess(`Delivery zone ${form.name} created!`);
      setShowModal(false);
      setForm({
        name: "",
        cities: "",
        shippingFee: "0",
        estimatedDeliveryMinDays: "2",
        estimatedDeliveryMaxDays: "5",
      });
      await load();
    } catch {
      toastError("Failed to create delivery zone");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deactivate this delivery zone?")) return;
    try {
      await deliveryZoneApi.delete(id);
      toastSuccess("Delivery zone deleted");
      await load();
    } catch {
      toastError("Failed to delete zone");
    }
  };

  if (loading) return <Spinner className="h-8 w-8 text-[#4A5E4C]" />;

  return (
    <div className="space-y-6">
      {/* Header Bento */}
      <div className="bento-card p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="pill-accent-sage text-xs">Logistics & White-Glove Shipping</span>
          <h1 className="font-display text-3xl sm:text-4xl text-[#161716] mt-1">
            Delivery Zones & Rates
          </h1>
          <p className="text-xs text-[#6B7068] font-light mt-1">
            Configure Egyptian metropolitan delivery zones, cities, fees, and lead times.
          </p>
        </div>

        <Button onClick={() => setShowModal(true)}>
          + Create Delivery Zone ↗
        </Button>
      </div>

      {/* Zones Table Bento */}
      <div className="bento-card p-6 overflow-hidden">
        <div className="pb-4 border-b border-[#E2DCD2] flex items-center justify-between">
          <span className="pill-accent-sage text-xs">Active Zones ({zones.length})</span>
        </div>

        {zones.length > 0 ? (
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#E2DCD2] text-[#6B7068]">
                <tr>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Zone Name</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Supported Cities</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Shipping Fee</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider">Est Lead Time</th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DCD2]">
                {zones.map((z) => (
                  <tr key={z.id} className="hover:bg-[#EDE7DC]/30 transition-colors">
                    <td className="px-4 py-4 font-semibold text-[#161716]">
                      {z.name}
                    </td>
                    <td className="px-4 py-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {z.cities.map((city) => (
                          <span key={city} className="rounded-full bg-[#FAFAF7] border border-[#E2DCD2] px-2.5 py-0.5 text-[10px] text-[#161716]">
                            {city}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4 font-semibold text-[#4A5E4C]">
                      {z.shippingFee === 0 ? "FREE" : formatPrice(z.shippingFee)}
                    </td>
                    <td className="px-4 py-4 text-[#6B7068]">
                      {z.estimatedDeliveryMinDays} – {z.estimatedDeliveryMaxDays} Business Days
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(z.id)}
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
            <p className="font-display text-2xl text-[#6B7068]">No delivery zones defined</p>
            <p className="text-xs text-[#6B7068] font-light">Add delivery zones to enable checkout shipping fees</p>
          </div>
        )}
      </div>

      {/* Create Zone Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center glass-backdrop p-4">
          <form onSubmit={handleCreateZone} className="w-full max-w-lg bento-card p-8 space-y-5">
            <div className="border-b border-[#E2DCD2] pb-4 flex items-center justify-between">
              <div>
                <span className="pill-accent-sage text-xs">New Logistics Zone</span>
                <h3 className="font-display text-3xl text-[#161716] mt-1">Create Delivery Zone</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-2xl text-[#6B7068] cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <Input
                label="Zone Name"
                placeholder="e.g. Greater Cairo & Maadi"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <Input
                label="Cities (Comma-separated)"
                placeholder="Cairo, Giza, New Cairo, Maadi, October"
                value={form.cities}
                onChange={(e) => setForm({ ...form, cities: e.target.value })}
                required
              />
              <div className="grid grid-cols-3 gap-3">
                <Input
                  label="Shipping Fee (EGP)"
                  type="number"
                  placeholder="0"
                  value={form.shippingFee}
                  onChange={(e) => setForm({ ...form, shippingFee: e.target.value })}
                  required
                />
                <Input
                  label="Min Days"
                  type="number"
                  placeholder="2"
                  value={form.estimatedDeliveryMinDays}
                  onChange={(e) => setForm({ ...form, estimatedDeliveryMinDays: e.target.value })}
                  required
                />
                <Input
                  label="Max Days"
                  type="number"
                  placeholder="5"
                  value={form.estimatedDeliveryMaxDays}
                  onChange={(e) => setForm({ ...form, estimatedDeliveryMaxDays: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#E2DCD2]">
              <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Delivery Zone ↗</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
