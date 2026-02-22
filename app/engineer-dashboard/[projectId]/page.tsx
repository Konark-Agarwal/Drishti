"use client";

import { LiveCameraCapture } from "@/components/live-camera-capture";
import { VoiceRecorder } from "@/components/voice-recorder";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/dashboard-shell";
import {
  mockProjects,
  mockPhotos,
  mockPlans,
  mockMaterialLogs,
} from "@/lib/mock-data";

interface MaterialEntry {
  name: string;
  quantity: string;
  unit: string;
}

export default function EngineerProjectDetail() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.projectId as string;
  const [userName, setUserName] = useState("Engineer");
  const [materials, setMaterials] = useState<MaterialEntry[]>([
    { name: "Cement", quantity: "500", unit: "Bags" },
    { name: "Steel", quantity: "10", unit: "Tons" },
    { name: "Bricks", quantity: "25000", unit: "Units" },
    { name: "Sand", quantity: "50", unit: "Tons" },
  ]);
  const [workersPerDay, setWorkersPerDay] = useState("12");
  const [milestones, setMilestones] = useState({
    foundation: "2024-05-01",
    structure: "2024-08-01",
    roof: "2024-11-01",
    finishing: "2025-02-01",
  });

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      router.push("/");
      return;
    }
    const user = JSON.parse(stored);
    if (user.role !== "engineer") {
      router.push("/");
      return;
    }
    setUserName(user.name || "Engineer");
  }, [router]);

  const project = mockProjects.find((p) => p.id === projectId);
  const photos = mockPhotos.filter((p) => p.projectId === projectId);
  const plan = mockPlans.find((p) => p.projectId === projectId);
  const materialLogs = mockMaterialLogs.filter(
    (m) => m.projectId === projectId,
  );

  if (!project) {
    return (
      <DashboardShell role="engineer" userName={userName}>
        <p className="text-[#64748B]">Project not found.</p>
      </DashboardShell>
    );
  }

  const addMaterial = () => {
    setMaterials([...materials, { name: "", quantity: "", unit: "Bags" }]);
  };

  const removeMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const updateMaterial = (
    index: number,
    field: keyof MaterialEntry,
    value: string,
  ) => {
    const updated = [...materials];
    updated[index] = { ...updated[index], [field]: value };
    setMaterials(updated);
  };

  const handleSaveRoadmap = () => {
    toast.success(
      "Roadmap saved! This becomes the AI's baseline for monitoring.",
    );
  };

  const handlePhotoAction = (photoId: string, action: "approve" | "flag") => {
    toast.success(
      action === "approve"
        ? "Photo approved. Owner has been notified."
        : "Photo flagged for review. Alert created for owner.",
    );
  };

  // Material comparison table data
  const materialCompare = plan
    ? Object.entries(plan.materials).map(([name, planned]) => {
        const actual =
          materialLogs.find((m) => m.materialName.toLowerCase() === name)
            ?.quantityUsed || 0;
        const percentage = Math.round((actual / (planned as number)) * 100);
        return {
          name: name.charAt(0).toUpperCase() + name.slice(1),
          planned: planned as number,
          actual,
          percentage,
        };
      })
    : [];

  return (
    <DashboardShell role="engineer" userName={userName}>
      <Link
        href="/engineer-dashboard"
        className="mb-6 inline-flex items-center gap-2 text-sm text-[#64748B] hover:text-[#3B82F6]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <h1 className="mb-6 font-serif text-2xl font-bold text-[#0A1929]">
        {project.name}
      </h1>

      {/* Section 1: Create/Update Project Roadmap */}
      <div className="mb-6 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.1)]">
        <h2 className="mb-4 font-serif text-lg font-semibold text-[#0A1929]">
          Create/Update Project Roadmap
        </h2>

        {/* Materials */}
        <h3 className="mb-3 text-sm font-medium text-[#1E293B]">
          Materials Needed
        </h3>
        <div className="mb-4 flex flex-col gap-3">
          {materials.map((mat, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                type="text"
                value={mat.name}
                onChange={(e) => updateMaterial(i, "name", e.target.value)}
                placeholder="Material"
                className="w-36 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50"
              />
              <input
                type="number"
                value={mat.quantity}
                onChange={(e) => updateMaterial(i, "quantity", e.target.value)}
                placeholder="Qty"
                className="w-24 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50"
              />
              <select
                value={mat.unit}
                onChange={(e) => updateMaterial(i, "unit", e.target.value)}
                className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50"
              >
                <option>Bags</option>
                <option>Tons</option>
                <option>Kg</option>
                <option>Units</option>
              </select>
              <button
                onClick={() => removeMaterial(i)}
                className="text-[#EF4444] hover:text-[#DC2626]"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            onClick={addMaterial}
            className="flex w-fit items-center gap-1.5 rounded-lg border border-dashed border-[#E2E8F0] px-3 py-2 text-sm text-[#64748B] hover:border-[#3B82F6] hover:text-[#3B82F6]"
          >
            <Plus className="h-4 w-4" />
            Add Material
          </button>
        </div>

        {/* Labor Plan */}
        <h3 className="mb-3 text-sm font-medium text-[#1E293B]">
          Estimated Workers per Day
        </h3>
        <input
          type="number"
          value={workersPerDay}
          onChange={(e) => setWorkersPerDay(e.target.value)}
          className="mb-4 w-32 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50"
        />

        {/* Milestones */}
        <h3 className="mb-3 text-sm font-medium text-[#1E293B]">Milestones</h3>
        <div className="mb-4 grid gap-3 md:grid-cols-2">
          {Object.entries(milestones).map(([key, value]) => (
            <div key={key} className="flex items-center gap-3">
              <span className="w-24 text-sm capitalize text-[#64748B]">
                {key}:
              </span>
              <input
                type="date"
                value={value}
                onChange={(e) =>
                  setMilestones({ ...milestones, [key]: e.target.value })
                }
                className="flex-1 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50"
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleSaveRoadmap}
          className="flex items-center gap-2 rounded-lg bg-[#3B82F6] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2563EB]"
        >
          <Save className="h-4 w-4" />
          {"Save Roadmap (This becomes the AI's baseline)"}
        </button>
      </div>

      {/* Voice Updates Section */}
      <div className="mb-6 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.1)]">
        <h2 className="mb-4 font-serif text-lg font-semibold text-[#0A1929]">
          Voice Updates
        </h2>
        <p className="mb-4 text-sm text-[#64748B]">
          Record voice notes to update progress or flag issues. AI will
          transcribe and analyze.
        </p>
        <VoiceRecorder
          onSave={(blob, transcript) => {
            // Here you could send to an API
            toast.success("Voice note saved and transcribed.");
            console.log("Transcript:", transcript);
          }}
        />
      </div>

      {/* Live Camera Capture Section */}
      <div className="mb-6 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.1)]">
        <h2 className="mb-4 font-serif text-lg font-semibold text-[#0A1929]">
          Live Site Photo
        </h2>
        <p className="mb-4 text-sm text-[#64748B]">
          Capture site photos with GPS for AI verification. Gallery uploads are
          disabled to prevent fraud.
        </p>
        <LiveCameraCapture
          projectId={projectId}
          onCapture={({ imageBlob, gpsLat, gpsLng, timestamp }) => {
            // In a real app, you'd upload to server
            console.log("Photo captured", { gpsLat, gpsLng, timestamp });
            toast.success("Photo captured with GPS! (Demo)");
            // Optionally, you could add it to the mockPhotos array (but that's more complex)
          }}
        />
      </div>

      {/* Section 2: Contractor Monitor */}
      <div className="mb-6 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.1)]">
        <h2 className="mb-4 font-serif text-lg font-semibold text-[#0A1929]">
          Contractor Monitor
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="rounded-xl border border-[#E2E8F0] p-4"
            >
              <img
                src={photo.imageUrl}
                alt="Site photo"
                className="mb-3 aspect-video w-full rounded-lg object-cover"
              />
              <div className="mb-2 flex items-center gap-2">
                {photo.aiVerified ? (
                  <span className="flex items-center gap-1 text-xs text-[#10B981]">
                    <CheckCircle className="h-3.5 w-3.5" /> AI Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-[#EF4444]">
                    <XCircle className="h-3.5 w-3.5" /> AI Flagged
                  </span>
                )}
                <span className="text-xs text-[#94A3B8]">
                  {new Date(photo.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="mb-3 text-xs text-[#64748B]">{photo.aiNotes}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePhotoAction(photo.id, "approve")}
                  className="flex-1 rounded-lg border border-[#10B981] px-3 py-1.5 text-xs font-medium text-[#10B981] hover:bg-[#10B981]/5"
                >
                  Approve
                </button>
                <button
                  onClick={() => handlePhotoAction(photo.id, "flag")}
                  className="flex-1 rounded-lg border border-[#EF4444] px-3 py-1.5 text-xs font-medium text-[#EF4444] hover:bg-[#EF4444]/5"
                >
                  Flag for Review
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Material vs. Actual */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.1)]">
        <h2 className="mb-4 font-serif text-lg font-semibold text-[#0A1929]">
          Material vs. Actual
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#E2E8F0]">
                <th className="pb-3 font-medium text-[#64748B]">Material</th>
                <th className="pb-3 font-medium text-[#64748B]">Planned</th>
                <th className="pb-3 font-medium text-[#64748B]">Actual</th>
                <th className="pb-3 font-medium text-[#64748B]">Usage</th>
                <th className="pb-3 font-medium text-[#64748B]">Status</th>
              </tr>
            </thead>
            <tbody>
              {materialCompare.map((m) => (
                <tr
                  key={m.name}
                  className="border-b border-[#E2E8F0] last:border-0"
                >
                  <td className="py-3 font-medium text-[#1E293B]">{m.name}</td>
                  <td className="py-3 text-[#64748B]">
                    {m.planned.toLocaleString()}
                  </td>
                  <td className="py-3 text-[#64748B]">
                    {m.actual.toLocaleString()}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 rounded-full bg-[#E2E8F0]">
                        <div
                          className={`h-2 rounded-full ${m.percentage > 100 ? "bg-[#EF4444]" : "bg-[#3B82F6]"}`}
                          style={{ width: `${Math.min(m.percentage, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-[#64748B]">
                        {m.percentage}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    {m.percentage > 110 ? (
                      <span className="text-xs font-medium text-[#EF4444]">
                        Over Plan
                      </span>
                    ) : m.percentage > 90 ? (
                      <span className="text-xs font-medium text-[#F59E0B]">
                        Near Limit
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-[#10B981]">
                        On Track
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
