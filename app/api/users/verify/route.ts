import { NextResponse } from 'next/server'

// POST /api/users/verify - Submit verification documents
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, role, licenseNumber, gstNumber, aadharUrl, experience } = body

    // Validation
    if (!email || !role) {
      return NextResponse.json({ success: false, error: 'Email and role are required' }, { status: 400 })
    }

    if (role === 'engineer' && !licenseNumber) {
      return NextResponse.json({ success: false, error: 'License number is required for engineers' }, { status: 400 })
    }

    // Mock Aadhar verification
    // In production: Call Aadhar verification API, verify license with council database
    // For hackathon: Auto-approve after simulated delay

    const verificationResult = {
      id: `ver-${Date.now()}`,
      email,
      role,
      verified: true,
      aadharVerified: !!aadharUrl,
      licenseVerified: role === 'engineer' ? !!licenseNumber : null,
      gstVerified: role === 'contractor' && gstNumber ? true : null,
      experience: experience || 0,
      verifiedAt: new Date().toISOString(),
      message: 'Verification successful! You can now apply for projects.',
    }

    // In production: Update Google Sheets "Users" tab with verified=true
    return NextResponse.json({ success: true, data: verificationResult })
  } catch {
    return NextResponse.json({ success: false, error: 'Verification failed' }, { status: 500 })
  }
}
