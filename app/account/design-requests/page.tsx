"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { designApi } from "@/lib/api/design";
import { EmptyState } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { formatDate } from "@/lib/utils/format";
import type { DesignRequest } from "@/lib/types/design-request";
import { Button } from "@/components/ui/button";

function DesignRequestsList() {
  const [requests, setRequests] = useState<DesignRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    designApi
      .listMine()
      .then((data) => setRequests(data.designRequests))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <Spinner className="h-8 w-8 text-[#4A5E4C]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Bento */}
      <div className="glass-card p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="pill-accent-sage text-xs font-mono">Spatial Practice</span>
          <h1 className="font-display text-3xl sm:text-4xl text-[#161716] mt-1">
            Spatial Design Requests
          </h1>
          <p className="text-xs text-[#6B7068] font-light mt-1">
            Floor plan evaluations and interior architect consultations.
          </p>
        </div>
        <Link href="/design-consultation">
          <Button size="sm" className="cursor-pointer">
            + New Spatial Request ↗
          </Button>
        </Link>
      </div>

      {!requests.length ? (
        <div className="glass-card p-16 text-center">
          <EmptyState
            title="No spatial requests submitted yet"
            description="Upload drawings or room photos to collaborate with our Cairo interior architects on custom furniture layouts."
            action={
              <Link href="/design-consultation">
                <Button size="md" className="cursor-pointer">
                  Request Spatial Consultation ↗
                </Button>
              </Link>
            }
          />
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <ul className="divide-y divide-[#E2DCD2]/60">
            {requests.map((req) => (
              <li key={req.id} className="p-6 space-y-2 hover:bg-[#FAFAF7] transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-display text-xl text-[#161716] capitalize">
                      {req.propertyType} Residence
                    </h3>
                    <p className="text-xs text-[#6B7068] font-mono">
                      {req.roomCount} Rooms {req.areaSquareMeters ? `· ${req.areaSquareMeters} m²` : ""}
                      {req.createdAt ? ` · Submitted ${formatDate(req.createdAt)}` : ""}
                    </p>
                  </div>
                  <Badge variant="default" className="capitalize font-mono text-xs">
                    {req.status.replace(/_/g, " ")}
                  </Badge>
                </div>

                {req.preferredStyle && (
                  <p className="text-xs text-[#4A5E4C] font-mono">
                    Preferred Style: {req.preferredStyle}
                  </p>
                )}

                {req.notes && (
                  <p className="text-xs text-[#6B7068] font-light pt-1 line-clamp-2">
                    {req.notes}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function DesignRequestsPage() {
  return <DesignRequestsList />;
}
