'use client'

import { useState } from 'react'
import { toast } from 'sonner'

export function GetStartedForm() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success('Project posted successfully! Professionals will be notified.')
      ;(e.target as HTMLFormElement).reset()
    }, 1500)
  }

  return (
    <section id="get-started" className="bg-[#F8FAFC] py-20">
      <div className="mx-auto max-w-4xl px-4">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.1)] md:p-12">
          <h2 className="mb-2 text-center font-serif text-2xl font-bold text-[#0A1929] md:text-3xl">
            Ready to Build? Post Your Project in 2 Minutes.
          </h2>
          <p className="mb-8 text-center text-sm text-[#64748B]">
            Fill in your project details and we will match you with verified professionals.
          </p>
          <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1E293B]">Full Name</label>
              <input
                required
                type="text"
                placeholder="Rajesh Sharma"
                className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-3 text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#F97316]/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1E293B]">Email Address</label>
              <input
                required
                type="email"
                placeholder="rajesh@example.com"
                className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-3 text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#F97316]/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1E293B]">Project Name</label>
              <input
                required
                type="text"
                placeholder="Green Valley Residency"
                className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-3 text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#F97316]/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1E293B]">Project Type</label>
              <select
                required
                className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-3 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#F97316]/50"
              >
                <option value="">Select type</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="infrastructure">Infrastructure</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1E293B]">{'Approx. Budget (\u20B9)'}</label>
              <input
                required
                type="number"
                placeholder="4000000"
                className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-3 text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#F97316]/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1E293B]">City, State</label>
              <input
                required
                type="text"
                placeholder="Jaipur, Rajasthan"
                className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-3 text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#F97316]/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1E293B]">Estimated Timeline (months)</label>
              <input
                required
                type="number"
                placeholder="12"
                className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-3 text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#F97316]/50"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-[#1E293B]">Brief Description</label>
              <textarea
                rows={3}
                placeholder="Describe your construction project..."
                className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-3 text-sm text-[#1E293B] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#F97316]/50"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#F97316] px-8 py-3.5 font-semibold text-white transition-colors hover:bg-[#EA580C] disabled:opacity-60"
              >
                {loading ? 'Posting...' : 'Post Project & Find Professionals'}
              </button>
              <p className="mt-3 text-center text-xs text-[#64748B]">
                {'By posting, you agree to our '}
                <a href="#" className="text-[#F97316] underline">Terms</a>
                {' and '}
                <a href="#" className="text-[#F97316] underline">Privacy Policy</a>
                {'. Professionals will be verified before applying.'}
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
