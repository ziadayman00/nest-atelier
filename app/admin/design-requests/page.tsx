"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { designApi } from "@/lib/api/design";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { DESIGN_STATUSES } from "@/lib/constants";
import { formatDate } from "@/lib/utils/format";
import type { DesignRequest, DesignRequestStatus } from "@/lib/types/design-request";
import { useToast } from "@/providers/toast-provider";
import { cn } from "@/lib/utils/cn";

export default function AdminDesignRequestsPage() {
  const [requests, setRequests] = useState<DesignRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<DesignRequest | null>(null);
  const [note, setNote] = useState("");
  const { success: toastSuccess, error: toastError } = useToast();

  const load = () =>
    designApi
      .listAll({ limit: 50, status: filter || undefined })
      .then((d) => setRequests(d.requests))
      .catch(() => toastError("Could not load design requests"))
      .finally(() => setLoading(false));

  useEffect(() => {
    setLoading(true);
    load();
  }, [filter]);

  const updateStatus = async (id: string, status: DesignRequestStatus) => {
    try {
      await designApi.updateStatus(id, status);
      toastSuccess(`Consultation status updated to ${status}`);
      await load();
      if (selected?.id === id) {
        setSelected((prev) => (prev ? { ...prev, status } : null));
      }
    } catch {
      toastError("Failed to update status");
    }
  };

  const addNote = async () => {
    if (!selected || !note.trim()) return;
    try {
      await designApi.addNote(selected.id, note.trim());
      toastSuccess("Architect note attached");
      setNote("");
    } catch {
      toastError("Failed to attach note");
    }
  };

  if (loading) return <Spinner className="h-8 w-8 text-[#4A5E4C]" />;

  return (
    <div className="space-y-6">
      {/* Header Bento Card */}
      <div className="bento-card p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="pill-accent-sage text-xs">Architectural Service</span>
          <h2 className="font-display text-3xl sm:text-4xl text-[#161716] mt-1">
            Spatial Design Requests
          </h2>
          <p className="text-xs text-[#6B7068] font-light mt-1">
            Review client floor plans, spatial photos, and interior consultation inquiries.
          </p>
        </div>

        <div className="w-full sm:w-64">
          <Select
            label="Filter Status"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            options={[
              { value: "", label: "All Consultations" },
              ...DESIGN_STATUSES.map((s) => ({ value: s.value, label: s.label })),
            ]}
          />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Request List Bento Card */}
        <div className="lg:col-span-5 bento-card p-6 space-y-4">
          <div className="pb-4 border-b border-[#E2DCD2] flex items-center justify-between">
            <span className="pill-accent-sage text-xs">Submissions ({requests.length})</span>
          </div>

          <div className="divide-y divide-[#E2DCD2] max-h-[600px] overflow-y-auto no-scrollbar">
            {requests.map((req) => {
              const isSelected = selected?.id === req.id;
              return (
                <button
                  key={req.id}
                  type="button"
                  onClick={() => setSelected(req)}
                  className={cn(
                    "w-full p-5 text-left transition-colors cursor-pointer rounded-2xl",
                    isSelected ? "bg-[#EDE7DC]/60 border border-[#161716]" : "hover:bg-[#EDE7DC]/30"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-display text-xl text-[#161716]">{req.fullName}</p>
                    <span className="rounded-full bg-[#FAFAF7] border border-[#E2DCD2] px-3 py-0.5 text-[10px] font-semibold text-[#161716]">
                      {req.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B7068] font-light mt-1">
                    {req.propertyType} · {req.roomCount} {req.roomCount === 1 ? "room" : "rooms"}
                    {req.createdAt ? ` · ${formatDate(req.createdAt)}` : ""}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Request Details Bento Card */}
        <div className="lg:col-span-7 bento-card p-8 space-y-6">
          {selected ? (
            <div className="space-y-6">
              <div className="border-b border-[#E2DCD2] pb-4 flex items-center justify-between">
                <div>
                  <span className="pill-accent-sage text-xs">Consultation Detail</span>
                  <h3 className="font-display text-3xl text-[#161716] mt-1">{selected.fullName}</h3>
                </div>
                <span className="text-xs text-[#6B7068] font-mono">Ref #{selected.id.slice(-6)}</span>
              </div>

              <dl className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <dt className="text-[#6B7068] font-medium">Email Contact</dt>
                  <dd className="font-semibold text-[#161716] mt-1">{selected.email}</dd>
                </div>
                <div>
                  <dt className="text-[#6B7068] font-medium">Phone Number</dt>
                  <dd className="font-semibold text-[#161716] mt-1">{selected.phone}</dd>
                </div>
                <div>
                  <dt className="text-[#6B7068] font-medium">Property Type</dt>
                  <dd className="font-semibold text-[#161716] mt-1 capitalize">{selected.propertyType}</dd>
                </div>
                <div>
                  <dt className="text-[#6B7068] font-medium">Room Count</dt>
                  <dd className="font-semibold text-[#161716] mt-1">{selected.roomCount} Rooms</dd>
                </div>
                {selected.preferredStyle && (
                  <div className="col-span-2">
                    <dt className="text-[#6B7068] font-medium">Preferred Style</dt>
                    <dd className="font-semibold text-[#161716] mt-1">{selected.preferredStyle}</dd>
                  </div>
                )}
                {selected.notes && (
                  <div className="col-span-2 border-t border-[#E2DCD2] pt-3">
                    <dt className="text-[#6B7068] font-medium">Client Notes</dt>
                    <dd className="text-[#6B7068] font-light leading-relaxed mt-1">{selected.notes}</dd>
                  </div>
                )}
              </dl>

              {/* Space images */}
              {selected.images && selected.images.length > 0 && (
                <div className="border-t border-[#E2DCD2] pt-4 space-y-2">
                  <p className="text-xs font-semibold text-[#161716]">Uploaded Space Images ({selected.images.length})</p>
                  <div className="grid grid-cols-3 gap-3">
                    {selected.images.map((img) => (
                      <div key={img.id} className="relative aspect-square border border-[#E2DCD2] rounded-2xl overflow-hidden bg-[#EDE7DC]">
                        <Image src={img.url} alt="" fill className="object-cover" sizes="160px" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Update */}
              <div className="border-t border-[#E2DCD2] pt-6 space-y-4">
                <Select
                  label="Update Status"
                  value={selected.status}
                  onChange={(e) => updateStatus(selected.id, e.target.value as DesignRequestStatus)}
                  options={DESIGN_STATUSES.map((s) => ({ value: s.value, label: s.label }))}
                />

                <div className="space-y-2 pt-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#161716]">Attach Architect Note</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Internal architect notes..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                    <Button onClick={addNote} className="shrink-0">
                      Save Note ↗
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-24 text-center space-y-2">
              <p className="font-display text-2xl text-[#6B7068]">Select a request</p>
              <p className="text-xs text-[#6B7068] font-light">Click any consultation on the left to inspect floor plans</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
