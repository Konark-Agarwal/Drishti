import { NextResponse } from "next/server";
import { mockApplications } from "@/lib/mock-data";
import type { Application } from "@/lib/mock-data";

// GET /api/applications - List applications filtered by project or applicant
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");
  const applicantEmail = searchParams.get("applicantEmail");

  let applications = mockApplications;
  if (projectId)
    applications = applications.filter((a) => a.projectId === projectId);
  if (applicantEmail)
    applications = applications.filter(
      (a) => a.applicantEmail === applicantEmail,
    );

  return NextResponse.json({ success: true, data: applications });
}

// POST /api/applications - Submit an application
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newApp: Application = {
      id: `app-${Date.now()}`,
      projectId: body.projectId,
      applicantEmail: body.applicantEmail,
      applicantRole: body.applicantRole,
      message: body.message,
      proposedFee: body.proposedFee,
      proposedTimeline: body.proposedTimeline,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // In production: Append to Google Sheets "Applications" tab
    return NextResponse.json({ success: true, data: newApp }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 },
    );
  }
}
