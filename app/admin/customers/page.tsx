"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api/admin";
import { Spinner } from "@/components/ui/spinner";
import { formatDate } from "@/lib/utils/format";
import type { User } from "@/lib/types/user";
import { useToast } from "@/providers/toast-provider";
import { cn } from "@/lib/utils/cn";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Awaited<ReturnType<typeof adminApi.getCustomer>>["customer"] | null>(null);
  const { error: toastError } = useToast();

  useEffect(() => {
    adminApi
      .listCustomers({ limit: 50 })
      .then((d) => setCustomers(d.customers))
      .catch(() => toastError("Could not load client roster"))
      .finally(() => setLoading(false));
  }, []);

  const viewCustomer = async (id: string) => {
    try {
      const data = await adminApi.getCustomer(id);
      setSelected(data.customer);
    } catch {
      toastError("Failed to fetch customer profile");
    }
  };

  if (loading) return <Spinner className="h-8 w-8 text-[#4A5E4C]" />;

  return (
    <div className="space-y-6">
      {/* Header Bento Card */}
      <div className="bento-card p-8">
        <span className="pill-accent-sage text-xs">Client Directory</span>
        <h2 className="font-display text-3xl sm:text-4xl text-[#161716] mt-1">
          Atelier Client Roster
        </h2>
        <p className="text-xs text-[#6B7068] font-light mt-1">
          Registered accounts, client purchase histories, and custom design records.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Customer List Bento Card */}
        <div className="lg:col-span-5 bento-card p-6 space-y-4">
          <div className="pb-4 border-b border-[#E2DCD2] flex items-center justify-between">
            <span className="pill-accent-sage text-xs">Registered Clients ({customers.length})</span>
          </div>

          <div className="divide-y divide-[#E2DCD2] max-h-[600px] overflow-y-auto no-scrollbar">
            {customers.map((c) => {
              const isSelected = selected?.id === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => viewCustomer(c.id)}
                  className={cn(
                    "w-full p-5 text-left transition-colors cursor-pointer rounded-2xl",
                    isSelected ? "bg-[#EDE7DC]/60 border border-[#161716]" : "hover:bg-[#EDE7DC]/30"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-display text-xl text-[#161716]">{c.fullName}</p>
                    <span className="rounded-full bg-[#FAFAF7] border border-[#E2DCD2] px-3 py-0.5 text-[10px] font-semibold text-[#4A5E4C]">
                      {c.role}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B7068] font-light mt-0.5">{c.email}</p>
                  {c.createdAt && (
                    <p className="text-[10px] text-[#6B7068]/60 mt-2 font-mono">Member since {formatDate(c.createdAt)}</p>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Customer Dossier Bento Card */}
        <div className="lg:col-span-7 bento-card p-8 space-y-6">
          {selected ? (
            <div className="space-y-6">
              <div className="border-b border-[#E2DCD2] pb-4 flex items-center justify-between">
                <div>
                  <span className="pill-accent-sage text-xs">Client Dossier</span>
                  <h3 className="font-display text-3xl text-[#161716] mt-1">{selected.fullName}</h3>
                  <p className="text-xs text-[#6B7068] mt-0.5">{selected.email}</p>
                </div>
                <span className="rounded-full bg-[#FAFAF7] border border-[#E2DCD2] px-4 py-1 text-xs font-semibold text-[#161716]">
                  {selected.role}
                </span>
              </div>

              <dl className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <dt className="text-[#6B7068] font-medium">Account Status</dt>
                  <dd className="font-semibold text-[#4A5E4C] mt-1">
                    {selected.isActive !== false ? "Active Client" : "Deactivated"}
                  </dd>
                </div>
                {selected.createdAt && (
                  <div>
                    <dt className="text-[#6B7068] font-medium">Joined Date</dt>
                    <dd className="font-semibold text-[#161716] mt-1">{formatDate(selected.createdAt)}</dd>
                  </div>
                )}
              </dl>

              {/* Order history */}
              {"orders" in selected && Array.isArray(selected.orders) && selected.orders.length > 0 && (
                <div className="border-t border-[#E2DCD2] pt-4 space-y-3">
                  <p className="text-xs font-semibold text-[#161716]">Order History ({(selected.orders as unknown[]).length})</p>
                  <ul className="divide-y divide-[#E2DCD2] border border-[#E2DCD2] rounded-2xl bg-[#FAFAF7]">
                    {(selected.orders as { id: string; orderNumber: string; totalAmount?: number; status?: string }[]).map((o) => (
                      <li key={o.id} className="p-4 flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#161716]">{o.orderNumber}</span>
                        {o.status && <span className="pill-accent-sage text-[10px]">{o.status}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Design requests history */}
              {"designRequests" in selected && Array.isArray(selected.designRequests) && selected.designRequests.length > 0 && (
                <div className="border-t border-[#E2DCD2] pt-4 space-y-3">
                  <p className="text-xs font-semibold text-[#161716]">Design Inquiries ({(selected.designRequests as unknown[]).length})</p>
                  <ul className="divide-y divide-[#E2DCD2] border border-[#E2DCD2] rounded-2xl bg-[#FAFAF7]">
                    {(selected.designRequests as { id: string; propertyType: string; status: string }[]).map((r) => (
                      <li key={r.id} className="p-4 flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#161716] capitalize">{r.propertyType} Consultation</span>
                        <span className="rounded-full bg-[#EDE7DC] px-3 py-0.5 text-[10px] font-semibold text-[#B86A44]">{r.status}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="py-24 text-center space-y-2">
              <p className="font-display text-2xl text-[#6B7068]">Select a client</p>
              <p className="text-xs text-[#6B7068] font-light">Click any account on the left to review dossier</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
