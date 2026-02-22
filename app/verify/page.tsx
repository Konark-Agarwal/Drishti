'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Upload } from 'lucide-react'

export default function VerifyPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  // Professional details
  const [licenseNumber, setLicenseNumber] = useState('')
  const [experience, setExperience] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [gstNumber, setGstNumber] = useState('')
  const [aadharFront, setAadharFront] = useState<File | null>(null)
  const [aadharBack, setAadharBack] = useState<File | null>(null)
  const [declaration, setDeclaration] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) {
      router.push('/login')
      return
    }
    const userData = JSON.parse(stored)
    if (userData.role === 'owner') {
      router.push('/owner-dashboard')
      return
    }
    setUser(userData)
  }, [router])

  const handleFileUpload = (side: 'front' | 'back') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (side === 'front') setAadharFront(file)
      else setAadharBack(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Update user in localStorage as verified
      const updatedUser = { ...user, verified: true }
      if (user.role === 'engineer') {
        updatedUser.licenseNumber = licenseNumber
        updatedUser.experience = parseInt(experience)
      } else if (user.role === 'contractor') {
        updatedUser.gstNumber = gstNumber
        updatedUser.experience = parseInt(experience)
        updatedUser.companyName = companyName
      }
      localStorage.setItem('user', JSON.stringify(updatedUser))

      // Redirect to appropriate dashboard
      router.push(user.role === 'engineer' ? '/engineer-dashboard' : '/contractor-dashboard')
      setLoading(false)
    }, 1500)
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.1)]">
          <h1 className="mb-2 font-serif text-2xl font-bold text-[#0A1929]">Complete Your One-Time Verification</h1>
          <p className="mb-6 text-sm text-[#64748B]">
            Get verified to apply for projects. This is mandatory and free.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role display */}
            <div className="rounded-lg bg-[#F8FAFC] p-4">
              <span className="text-sm text-[#64748B]">Verifying as</span>
              <p className="font-medium text-[#1E293B] capitalize">
                {user.role === 'engineer' ? '📐 Civil Engineer' : '⛑️ Contractor'}
              </p>
            </div>

            {/* Professional details */}
            {user.role === 'engineer' && (
              <>
                <div>
                  <label className="mb-1.5 block text-sm text-[#64748B]">License Number *</label>
                  <input
                    type="text"
                    required
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="CE-RJ-2019-4521"
                    className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-3 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-[#64748B]">Years of Experience</label>
                  <input
                    type="number"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="8"
                    className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-3 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/50"
                  />
                </div>
              </>
            )}

            {user.role === 'contractor' && (
              <>
                <div>
                  <label className="mb-1.5 block text-sm text-[#64748B]">Company Name (optional)</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="ABC Constructions"
                    className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-3 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-[#64748B]">GST Number (optional)</label>
                  <input
                    type="text"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value)}
                    placeholder="08AABCU9603R1ZP"
                    className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-3 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-[#64748B]">Years of Experience</label>
                  <input
                    type="number"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="12"
                    className="w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-3 text-sm text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50"
                  />
                </div>
              </>
            )}

            {/* Aadhar Upload */}
            <div>
              <label className="mb-1.5 block text-sm text-[#64748B]">Upload Aadhar Card (Front & Back)</label>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-[#E2E8F0] p-4">
                  <p className="mb-2 text-xs text-[#64748B]">Front side</p>
                  <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-[#E2E8F0] p-4 hover:bg-[#F8FAFC]">
                    <Upload className="h-5 w-5 text-[#64748B]" />
                    <span className="text-xs text-[#64748B]">Click to upload</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload('front')} />
                  </label>
                  {aadharFront && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-[#10B981]">
                      <CheckCircle className="h-3 w-3" /> Uploaded
                    </div>
                  )}
                </div>
                <div className="rounded-lg border border-[#E2E8F0] p-4">
                  <p className="mb-2 text-xs text-[#64748B]">Back side</p>
                  <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-[#E2E8F0] p-4 hover:bg-[#F8FAFC]">
                    <Upload className="h-5 w-5 text-[#64748B]" />
                    <span className="text-xs text-[#64748B]">Click to upload</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload('back')} />
                  </label>
                  {aadharBack && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-[#10B981]">
                      <CheckCircle className="h-3 w-3" /> Uploaded
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Declaration */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="declaration"
                checked={declaration}
                onChange={(e) => setDeclaration(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-[#E2E8F0] text-[#F97316] focus:ring-[#F97316]"
              />
              <label htmlFor="declaration" className="text-xs text-[#64748B]">
                I confirm that the information provided is true and correct.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !declaration || !aadharFront || !aadharBack}
              className="w-full rounded-lg bg-[#F97316] px-4 py-3 font-medium text-white transition-colors hover:bg-[#EA580C] disabled:opacity-60"
            >
              {loading ? 'Submitting...' : 'Submit for Verification'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}