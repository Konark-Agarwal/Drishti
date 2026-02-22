// app/about/page.tsx
import Link from 'next/link'
import { ArrowLeft, Building, Shield, Users, Zap } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header with back button */}
      <div className="border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-[#64748B] hover:text-[#F97316]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.1)] md:p-12">
          <h1 className="mb-6 font-serif text-3xl font-bold text-[#0A1929]">About Drishti</h1>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-[#1E293B]">
              Drishti is a cutting-edge platform that brings transparency, accountability, and AI-powered insights to construction project management. We empower owners, engineers, and contractors to collaborate seamlessly while combating fraud and ensuring project milestones are met.
            </p>

            <h2 className="mt-8 font-serif text-2xl font-semibold text-[#0A1929]">Our Mission</h2>
            <p className="text-[#475569]">
              To revolutionize the construction industry by leveraging artificial intelligence to verify site activities, detect anomalies, and provide real‑time alerts, ensuring every rupee is spent as intended.
            </p>

            <h2 className="mt-8 font-serif text-2xl font-semibold text-[#0A1929]">Key Features</h2>
            <div className="mt-4 grid gap-6 sm:grid-cols-2">
              <FeatureCard
                icon={Shield}
                title="AI-Powered Verification"
                description="Every site photo is analyzed for GPS consistency, material counts, and worker presence to flag potential fraud."
              />
              <FeatureCard
                icon={Zap}
                title="Real-Time Alerts"
                description="Instant notifications about discrepancies, material overuse, or location mismatches keep everyone informed."
              />
              <FeatureCard
                icon={Users}
                title="Role-Based Dashboards"
                description="Tailored views for owners, engineers, and contractors with relevant metrics and controls."
              />
              <FeatureCard
                icon={Building}
                title="Project Lifecycle Management"
                description="From planning to completion, track progress, budgets, and materials with intuitive visualizations."
              />
            </div>

            <h2 className="mt-8 font-serif text-2xl font-semibold text-[#0A1929]">The Team</h2>
            <p className="text-[#475569]">
              Drishti was founded by a team of construction veterans and AI specialists who saw the need for a digital watchdog in the industry. With backgrounds in civil engineering, computer vision, and enterprise software, we’re committed to building trust in every brick laid.
            </p>

            <div className="mt-8 flex justify-center">
              <Link
                href="/login"
                className="rounded-lg bg-[#F97316] px-6 py-3 font-medium text-white transition-colors hover:bg-[#EA580C]"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-5">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#F97316]/10 text-[#F97316]">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mb-1 font-semibold text-[#0A1929]">{title}</h3>
      <p className="text-sm text-[#64748B]">{description}</p>
    </div>
  )
}