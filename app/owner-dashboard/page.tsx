"use client";

import React from "react";
import { getProjects, addProject } from "@/lib/projects-store";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Activity,
  AlertTriangle,
  IndianRupee,
  ArrowRight,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { toast } from "sonner";
import { mockProjects, formatINR, Project, Alert } from "@/lib/mock-data";
import { getAlerts } from "@/lib/alerts-store";

export default function OwnerDashboard() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"projects" | "post">("projects");
  const [userName, setUserName] = useState("Owner");
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [projects, setProjects] = useState<Project[]>(() =>
    getProjects("owner@demo.com"),
  );

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      router.push("/");
      return;
    }
    const user = JSON.parse(stored);
    if (user.role !== "owner") {
      router.push("/");
      return;
    }
    setUserName(user.name || "Owner");
  }, [router]);

  useEffect(() => {
    const loadAlerts = () => {
      setAlerts(getAlerts());
    };

    loadAlerts();

    const interval = setInterval(loadAlerts, 5000); // refresh every 5s

    return () => clearInterval(interval);
  }, []);

  const activeProjects = projects.filter((p) => p.status !== "delayed");
  const openAlerts = alerts.filter((a) => !a.resolved);
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);

  const statusConfig = {
    "on-track": {
      label: "On Track",
      bg: "bg-[#10B981]/10",
      text: "text-[#10B981]",
      dot: "bg-[#10B981]",
    },
    "at-risk": {
      label: "At Risk",
      bg: "bg-[#F59E0B]/10",
      text: "text-[#F59E0B]",
      dot: "bg-[#F59E0B]",
    },
    delayed: {
      label: "Delayed",
      bg: "bg-[#EF4444]/10",
      text: "text-[#EF4444]",
      dot: "bg-[#EF4444]",
    },
  };

  const getProjectAlertSnippet = (projectId: string) => {
    const projectAlerts = alerts
      .filter((a) => a.projectId === projectId && !a.resolved)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

    if (projectAlerts.length === 0) {
      return { text: "All Quiet: No new alerts.", severity: "info" as const };
    }

    const latest = projectAlerts[0];

    return {
      text: latest.message.substring(0, 80) + "...",
      severity: latest.severity,
    };
  };

  return (
    <DashboardShell role="owner" userName={userName}>
      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-lg bg-white p-1 border border-[#E2E8F0] w-fit">
        <button
          onClick={() => setActiveTab("projects")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "projects"
              ? "bg-[#F97316] text-white"
              : "text-[#64748B] hover:text-[#1E293B]"
          }`}
        >
          My Projects
        </button>
        <button
          onClick={() => setActiveTab("post")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "post"
              ? "bg-[#F97316] text-white"
              : "text-[#64748B] hover:text-[#1E293B]"
          }`}
        >
          Post New Project
        </button>
      </div>

      {activeTab === "projects" ? (
        <div className="flex flex-col gap-6">
          {/* Metric Cards */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <MetricCard
              icon={Briefcase}
              label="Total Projects"
              value={String(projects.length)}
            />
            <MetricCard
              icon={Activity}
              label="Active Projects"
              value={String(activeProjects.length)}
            />
            <MetricCard
              icon={AlertTriangle}
              label="Open Alerts"
              value={String(openAlerts.length)}
              highlight={openAlerts.length > 0}
            />
            <MetricCard
              icon={IndianRupee}
              label="Total Budget"
              value={formatINR(totalBudget)}
            />
          </div>

          {/* Project Cards */}
          <div className="flex flex-col gap-4">
            {projects.map((project) => {
              const status = statusConfig[project.status];
              const alertSnippet = getProjectAlertSnippet(project.id);
              const budgetUsed = Math.round(
                (project.progressPercent * project.budget) / 100,
              );
              return (
                <div
                  key={project.id}
                  className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.1)] transition-shadow hover:shadow-[0_10px_15px_-3px_rgb(0_0_0/0.1)]"
                >
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <h3 className="font-serif text-lg font-semibold text-[#1E293B]">
                        {project.name}
                      </h3>
                      <p className="text-sm text-[#64748B]">
                        {project.location}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${status.bg} ${status.text}`}
                    >
                      <span className={`h-2 w-2 rounded-full ${status.dot}`} />
                      {status.label}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-[#64748B]">Overall Progress</span>
                      <span className="font-medium text-[#1E293B]">
                        {project.progressPercent}%
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-[#E2E8F0]">
                      <div
                        className="h-2.5 rounded-full bg-[#F97316] transition-all"
                        style={{ width: `${project.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* AI Snapshot */}
                  <div
                    className={`mb-4 rounded-lg p-3 text-sm ${
                      alertSnippet.severity === "high"
                        ? "bg-[#EF4444]/5 text-[#EF4444]"
                        : alertSnippet.severity === "medium"
                          ? "bg-[#F59E0B]/5 text-[#92400E]"
                          : "bg-[#10B981]/5 text-[#065F46]"
                    }`}
                  >
                    {alertSnippet.text}
                  </div>

                  {/* Budget Usage */}
                  <div className="mb-4">
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-[#64748B]">Budget Used</span>
                      <span className="text-[#1E293B]">
                        {formatINR(budgetUsed)} / {formatINR(project.budget)}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#E2E8F0]">
                      <div
                        className="h-1.5 rounded-full bg-[#3B82F6]"
                        style={{ width: `${project.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/owner-dashboard/${project.id}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#F97316] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#EA580C]"
                    >
                      View Live Dashboard
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/owner-dashboard/applications/${project.id}`} // ✅ new target
                      className="rounded-lg border border-[#E2E8F0] px-4 py-2 text-sm text-[#64748B] transition-colors hover:border-[#F97316] hover:text-[#F97316]"
                    >
                      View Applications
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <PostProjectTab
          onProjectCreated={() => {
            // Refresh projects from localStorage and switch tab
            const stored = localStorage.getItem("projects");
            const allProjects = stored ? JSON.parse(stored) : mockProjects;
            setProjects(
              allProjects.filter(
                (p: Project) => p.ownerEmail === "owner@demo.com",
              ),
            );
            setActiveTab("projects");
          }}
        />
      )}
    </DashboardShell>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: typeof Briefcase;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.1)]">
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-4 w-4 text-[#64748B]" />
        <span className="text-sm text-[#64748B]">{label}</span>
      </div>
      <p
        className={`font-serif text-2xl font-bold ${highlight ? "text-[#EF4444]" : "text-[#1E293B]"}`}
      >
        {value}
      </p>
    </div>
  );
}

function PostProjectTab({
  onProjectCreated,
}: {
  onProjectCreated: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    budget: "",
    type: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      // Create new project object
      const newProject: Project = {
        id: `proj-${Date.now()}`,
        name: formData.name,
        location: formData.location,
        budget: parseInt(formData.budget),
        startDate: formData.startDate,
        endDate: formData.endDate,
        ownerEmail: "owner@demo.com", // from logged-in user
        status: "on-track",
        progressPercent: 0,
        createdAt: new Date().toISOString(),
        description: formData.description,
        type: formData.type,
      };

      // Get existing projects from localStorage
      const stored = localStorage.getItem("projects");
      const existing = stored ? JSON.parse(stored) : mockProjects;
      const updated = [...existing, newProject];
      localStorage.setItem("projects", JSON.stringify(updated));

      toast.success("Project created successfully!");
      setLoading(false);
      setFormData({
        name: "",
        location: "",
        budget: "",
        type: "",
        startDate: "",
        endDate: "",
        description: "",
      });

      // Switch back to "My Projects" and refresh list
      onProjectCreated();
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.1)]">
        <h2 className="mb-6 font-serif text-xl font-bold text-[#0A1929]">
          Post a New Project
        </h2>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm text-[#64748B]">
              Project Name
            </label>
            <input
              required
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Project Name"
              className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-3 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#F97316]/50"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-[#64748B]">
              Location
            </label>
            <input
              required
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="City, State"
              className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-3 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#F97316]/50"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-[#64748B]">
              Budget (₹)
            </label>
            <input
              required
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="4000000"
              className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-3 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#F97316]/50"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-[#64748B]">
              Project Type
            </label>
            <select
              required
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-3 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#F97316]/50"
            >
              <option value="">Select type</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Infrastructure">Infrastructure</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-[#64748B]">
              Start Date
            </label>
            <input
              required
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-3 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#F97316]/50"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-[#64748B]">
              End Date
            </label>
            <input
              required
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-3 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#F97316]/50"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm text-[#64748B]">
              Description
            </label>
            <textarea
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Project description..."
              className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-3 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#F97316]/50"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#F97316] px-8 py-3 font-semibold text-white transition-colors hover:bg-[#EA580C] disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
