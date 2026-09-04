"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { designApi } from "@/lib/api/design";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";
import { RequireAuth } from "@/components/auth/require-auth";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PROPERTY_TYPES } from "@/lib/constants";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils/cn";

const STYLES = [
  "Modern Minimalist",
  "Warm Organic",
  "Heritage Egyptian",
  "Scandinavian Modern",
  "Contemporary Industrial",
];

const schema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phone: z.string().min(6, "Valid phone number is required"),
  email: z.string().email("Valid email is required"),
  propertyType: z.string().min(2),
  roomCount: z.number().min(1).max(100),
  areaSquareMeters: z.string().optional(),
  preferredStyle: z.string().optional(),
  budget: z.string().optional(),
  notes: z.string().optional(),
});

type ConsultationFormData = z.infer<typeof schema>;

function DesignConsultationForm() {
  const { user } = useAuth();
  const router = useRouter();
  const { success, error: toastError } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string>("Modern Minimalist");
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ConsultationFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: user?.fullName ?? "",
      email: user?.email ?? "",
      propertyType: PROPERTY_TYPES[0],
      roomCount: 2,
      preferredStyle: "Modern Minimalist",
    },
  });

  const handleStyleSelect = (style: string) => {
    setSelectedStyle(style);
    setValue("preferredStyle", style);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    if (selected.length > 5) {
      setFormError("Maximum 5 images allowed");
      return;
    }
    for (const file of selected) {
      if (file.size > 5 * 1024 * 1024) {
        setFormError("Each image must be under 5 MB");
        return;
      }
    }
    setFormError("");
    previews.forEach((url) => URL.revokeObjectURL(url));
    const urls = selected.map((f) => URL.createObjectURL(f));
    setFiles(selected);
    setPreviews(urls);
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
  };

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const onSubmit = async (data: ConsultationFormData) => {
    setFormError("");
    try {
      const fd = new FormData();
      fd.append("fullName", data.fullName);
      fd.append("phone", data.phone);
      fd.append("email", data.email);
      fd.append("propertyType", data.propertyType);
      fd.append("roomCount", String(data.roomCount));
      if (data.areaSquareMeters) fd.append("areaSquareMeters", data.areaSquareMeters);
      if (selectedStyle) fd.append("preferredStyle", selectedStyle);
      if (data.budget) fd.append("budget", data.budget);
      if (data.notes) fd.append("notes", data.notes);
      files.forEach((file) => fd.append("images", file));

      await designApi.create(fd);

      success("Spatial consultation request submitted! Our interior architects will reach out within 24 hours.");
      router.push("/account/design-requests");
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to submit request";
      setFormError(msg);
      toastError(msg);
    }
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-14 py-6 sm:py-8 space-y-8 sm:space-y-12">

      {/* Header */}
      <div className="space-y-3 border-b border-[#E2DCD2]/80 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="pill-accent-sage text-xs font-mono">Architectural Studio Service</span>
          <span className="text-xs text-[#6B7068] font-mono">Cairo Atelier Practice · 30.0444° N, 31.2357° E</span>
        </div>
        <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl text-[#161716] leading-[1.05]">
          Spatial & Residential Interior Planning
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7068] font-light max-w-2xl leading-relaxed">
          Share floor plans, room dimensions, or photos of your residence. Our Cairo interior architects will analyze your spatial flow and curate a custom solid hardwood furniture plan tailored to your home.
        </p>
      </div>

      <div className="grid gap-8 lg:gap-10 lg:grid-cols-[1fr_420px] items-start">
        {/* Main Consultation Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-5 sm:p-12 space-y-8 sm:space-y-10">
          
          {/* STEP 1 */}
          <div className="space-y-6">
            <div className="border-b border-[#E2DCD2] pb-4 flex items-baseline justify-between">
              <h2 className="font-display text-2xl sm:text-3xl text-[#161716]">1. Contact & Residence Details</h2>
              <span className="text-xs text-[#4A5E4C] font-semibold font-mono">Step 01 / 03</span>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <Input label="Your Full Name" placeholder="Soliman Mansour" {...register("fullName")} error={errors.fullName?.message} />
              <Input label="Phone Number" placeholder="010 1234 5678" {...register("phone")} error={errors.phone?.message} />
              <div className="sm:col-span-2">
                <Input label="Email Address" placeholder="soliman@example.com" type="email" {...register("email")} error={errors.email?.message} />
              </div>
            </div>
          </div>

          {/* STEP 2 */}
          <div className="space-y-6 pt-4 border-t border-[#E2DCD2]">
            <div className="border-b border-[#E2DCD2] pb-4 flex items-baseline justify-between">
              <h2 className="font-display text-2xl sm:text-3xl text-[#161716]">2. Property Parameters & Style</h2>
              <span className="text-xs text-[#4A5E4C] font-semibold font-mono">Step 02 / 03</span>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <Select
                label="Property Type"
                {...register("propertyType")}
                options={PROPERTY_TYPES.map((p) => ({ value: p, label: p.charAt(0).toUpperCase() + p.slice(1) }))}
              />
              <Input label="Number of Rooms" type="number" min={1} max={50} {...register("roomCount", { valueAsNumber: true })} error={errors.roomCount?.message} />
              <Input label="Approximate Area (m², optional)" type="number" placeholder="e.g. 180" {...register("areaSquareMeters")} />
              <Input label="Estimated Budget (optional)" placeholder="e.g. EGP 150,000" {...register("budget")} />
            </div>

            {/* Atmosphere Pills */}
            <div className="space-y-3 pt-3">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#161716] font-mono">
                Select Preferred Atmosphere / Style
              </label>
              <div className="flex flex-wrap gap-2.5">
                {STYLES.map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => handleStyleSelect(style)}
                    className={cn(
                      "rounded-full px-5 py-2.5 text-xs font-semibold transition-all cursor-pointer",
                      selectedStyle === style
                        ? "bg-[#161716] text-white shadow-xs scale-[1.02]"
                        : "bg-[#FAFAF7] border border-[#E2DCD2] text-[#6B7068] hover:border-[#161716] hover:text-[#161716]"
                    )}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* STEP 3 */}
          <div className="space-y-6 pt-4 border-t border-[#E2DCD2]">
            <div className="border-b border-[#E2DCD2] pb-4 flex items-baseline justify-between">
              <h2 className="font-display text-2xl sm:text-3xl text-[#161716]">3. Floor Plans & Space Imagery</h2>
              <span className="text-xs text-[#4A5E4C] font-semibold font-mono">Step 03 / 03</span>
            </div>

            {/* Generous File Dropzone */}
            <div className="relative rounded-[24px] border-2 border-dashed border-[#E2DCD2] bg-[#FAFAF7] p-10 text-center hover:border-[#4A5E4C] transition-colors space-y-3">
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={onFileChange}
                className="absolute inset-0 z-10 opacity-0 cursor-pointer"
              />
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EDE7DC] text-xl">
                📐
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-[#161716]">Click or drag room photographs & floor plan drawings</p>
                <p className="text-xs text-[#6B7068] font-light">Upload up to 5 images (JPEG, PNG, WebP — max 5 MB each)</p>
              </div>
            </div>

            {previews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                {previews.map((url, idx) => (
                  <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-[#E2DCD2] bg-[#EDE7DC] group">
                    <Image src={url} alt="" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="absolute top-2 right-2 rounded-full bg-[#161716]/85 text-white h-6 w-6 flex items-center justify-center text-xs shadow-md cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2">
              <Input label="Additional Notes or Specific Spatial Requests" placeholder="Specific timber requirements, room orientations, dining table seating..." {...register("notes")} />
            </div>
          </div>

          {formError && <p className="text-xs text-red-600 font-semibold">{formError}</p>}

          {/* Form Action */}
          <div className="pt-6 border-t border-[#E2DCD2] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#6B7068] font-light font-mono">
              🔒 Confidential consultation. Handled directly by our Cairo studio.
            </p>
            <Button type="submit" loading={isSubmitting} size="lg" className="w-full sm:w-auto px-10 py-4 text-sm font-semibold cursor-pointer">
              Submit Spatial Consultation Request ↗
            </Button>
          </div>
        </form>

        {/* Process Info Sticky Card */}
        <div className="glass-card-sage p-8 sm:p-10 space-y-8 lg:sticky lg:top-24 text-white">
          <span className="pill-accent-dark text-xs backdrop-blur-md">
            Architectural Workflow
          </span>

          <div className="space-y-6">
            <div className="space-y-1.5 border-b border-white/15 pb-6">
              <span className="font-display text-4xl text-white/40 leading-none">01</span>
              <p className="font-display text-2xl text-white">Spatial Analysis</p>
              <p className="text-xs text-white/80 leading-relaxed font-light">
                Our interior architects evaluate your room proportions, daylight exposure, and traffic flow.
              </p>
            </div>

            <div className="space-y-1.5 border-b border-white/15 pb-6">
              <span className="font-display text-4xl text-white/40 leading-none">02</span>
              <p className="font-display text-2xl text-white">Bespoke Curation</p>
              <p className="text-xs text-white/80 leading-relaxed font-light">
                Receive a tailored layout proposal with hardwood samples, finish options, and exact dimensions.
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="font-display text-4xl text-white/40 leading-none">03</span>
              <p className="font-display text-2xl text-white">White-Glove Delivery</p>
              <p className="text-xs text-white/80 leading-relaxed font-light">
                Custom milled in our Cairo workshop and hand-delivered directly into your living space.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default function DesignConsultationPage() {
  return (
    <RequireAuth>
      <DesignConsultationForm />
    </RequireAuth>
  );
}
