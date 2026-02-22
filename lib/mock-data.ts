// lib/mock-data.ts
// Mock data store for the Drishti platform
// In production, this would be backed by Google Sheets API

export interface User {
  id: string
  email: string
  name: string
  role: 'owner' | 'engineer' | 'contractor'
  verified: boolean
  aadharUrl?: string
  licenseNumber?: string
  gstNumber?: string
  experience?: number
  createdAt: string
}

export interface Project {
  id: string
  name: string
  location: string
  budget: number
  startDate: string
  endDate: string
  ownerEmail: string
  status: 'on-track' | 'at-risk' | 'delayed'
  progressPercent: number
  createdAt: string
  description?: string
  type?: string
}

export interface Application {
  id: string
  projectId: string
  applicantEmail: string
  applicantRole: 'engineer' | 'contractor'
  message: string
  proposedFee: number
  proposedTimeline: number
  status: 'pending' | 'accepted' | 'rejected'
  createdAt: string
}

export interface Plan {
  projectId: string
  materials: Record<string, number>
  laborPlan: { workers: number }
  milestones: Record<string, string>
  createdBy: string
  createdAt: string
}

export interface Photo {
  id: string
  projectId: string
  uploadedByEmail: string
  uploaderRole: string
  url: string                 // thumbnail for gallery
  imageUrl: string            // high-res for modal
  gpsLat: number
  gpsLng: number
  timestamp: string
  deviceId: string
  aiVerified: boolean | null
  aiNotes: string
  voiceNoteUrl?: string
  materialLog: { name: string; quantity: number; unit: string }[]
  reportedWorkerCount: number
  createdAt: string
}

export interface Alert {
  id: string
  projectId: string
  message: string
  severity: 'high' | 'medium' | 'low' | 'info'
  resolved: boolean
  createdAt: string
}

export interface MaterialLog {
  id: string
  projectId: string
  reportedByEmail: string
  materialName: string
  quantityUsed: number
  unit: string
  createdAt: string
}

// --- MOCK DATA ---

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'owner@demo.com',
    name: 'Rajesh Sharma',
    role: 'owner',
    verified: true,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    email: 'engineer@demo.com',
    name: 'Priya Patel',
    role: 'engineer',
    verified: true,
    licenseNumber: 'CE-RJ-2019-4521',
    experience: 8,
    createdAt: '2024-02-01',
  },
  {
    id: '3',
    email: 'contractor@demo.com',
    name: 'Ramesh Kumar',
    role: 'contractor',
    verified: true,
    gstNumber: '08AABCU9603R1ZP',
    experience: 12,
    createdAt: '2024-02-10',
  },
]

export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Green Valley Residency',
    location: 'Jaipur, Rajasthan',
    budget: 4000000,
    startDate: '2024-03-01',
    endDate: '2025-03-01',
    ownerEmail: 'owner@demo.com',
    status: 'at-risk',
    progressPercent: 67,
    createdAt: '2024-02-20',
    description: '3BHK residential villa with garden and parking',
    type: 'Residential',
  },
  {
    id: 'proj-2',
    name: 'Sunrise Commercial Complex',
    location: 'Udaipur, Rajasthan',
    budget: 12000000,
    startDate: '2024-04-15',
    endDate: '2025-10-15',
    ownerEmail: 'owner@demo.com',
    status: 'on-track',
    progressPercent: 45,
    createdAt: '2024-04-01',
    description: 'Multi-storey commercial building with retail spaces',
    type: 'Commercial',
  },
  {
    id: 'proj-3',
    name: 'Highway Bridge Expansion',
    location: 'Jodhpur, Rajasthan',
    budget: 50000000,
    startDate: '2024-06-01',
    endDate: '2026-06-01',
    ownerEmail: 'owner@demo.com',
    status: 'on-track',
    progressPercent: 22,
    createdAt: '2024-05-15',
    description: 'National highway bridge expansion project',
    type: 'Infrastructure',
  },
]

export const mockApplications: Application[] = [
  {
    id: 'app-1',
    projectId: 'proj-1',
    applicantEmail: 'engineer@demo.com',
    applicantRole: 'engineer',
    message: 'I have 8 years of residential construction experience in Rajasthan.',
    proposedFee: 350000,
    proposedTimeline: 10,
    status: 'accepted',
    createdAt: '2024-02-25',
  },
  {
    id: 'app-2',
    projectId: 'proj-1',
    applicantEmail: 'contractor@demo.com',
    applicantRole: 'contractor',
    message: 'Our team specializes in residential builds with a track record of 50+ projects.',
    proposedFee: 200000,
    proposedTimeline: 10,
    status: 'accepted',
    createdAt: '2024-02-26',
  },
  {
    id: 'app-3',
    projectId: 'proj-2',
    applicantEmail: 'engineer@demo.com',
    applicantRole: 'engineer',
    message: 'Experienced in commercial construction with modern techniques.',
    proposedFee: 800000,
    proposedTimeline: 14,
    status: 'accepted',
    createdAt: '2024-04-05',
  },
]

export const mockPlans: Plan[] = [
  {
    projectId: 'proj-1',
    materials: { cement: 500, steel: 10, bricks: 25000, sand: 50 },
    laborPlan: { workers: 12 },
    milestones: {
      foundation: '2024-05-01',
      structure: '2024-08-01',
      roof: '2024-11-01',
      finishing: '2025-02-01',
    },
    createdBy: 'engineer@demo.com',
    createdAt: '2024-03-05',
  },
  {
    projectId: 'proj-2',
    materials: { cement: 800, steel: 20, bricks: 40000, sand: 80 },
    laborPlan: { workers: 15 },
    milestones: {
      foundation: '2024-06-01',
      structure: '2024-09-01',
      roof: '2024-12-01',
      finishing: '2025-03-01',
    },
    createdBy: 'engineer@demo.com',
    createdAt: '2024-04-20',
  },
]

export const mockPhotos: Photo[] = [
  {
    id: 'photo-1',
    projectId: 'proj-1',
    uploadedByEmail: 'contractor@demo.com',
    uploaderRole: 'contractor',
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=800&fit=crop',
    gpsLat: 26.9124,
    gpsLng: 75.7873,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    deviceId: 'device-001',
    aiVerified: true,
    aiNotes: 'Photo verified. Foundation work matches milestone plan.',
    materialLog: [{ name: 'Cement', quantity: 50, unit: 'Bags' }],
    reportedWorkerCount: 8,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'photo-2',
    projectId: 'proj-1',
    uploadedByEmail: 'contractor@demo.com',
    uploaderRole: 'contractor',
    url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&h=800&fit=crop',
    gpsLat: 26.9124,
    gpsLng: 75.7873,
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    deviceId: 'device-001',
    aiVerified: true,
    aiNotes: 'GPS match confirmed. Background analysis consistent.',
    materialLog: [{ name: 'Steel', quantity: 2, unit: 'Tons' }],
    reportedWorkerCount: 10,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'photo-3',
    projectId: 'proj-1',
    uploadedByEmail: 'contractor@demo.com',
    uploaderRole: 'contractor',
    url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&h=800&fit=crop',
    gpsLat: 27.1,
    gpsLng: 76.0,
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    deviceId: 'device-002',
    aiVerified: false,
    aiNotes: 'WARNING: GPS location mismatch. Photo uploaded from location outside the project site.',
    materialLog: [{ name: 'Bricks', quantity: 5000, unit: 'Units' }],
    reportedWorkerCount: 12,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'photo-4',
    projectId: 'proj-1',
    uploadedByEmail: 'contractor@demo.com',
    uploaderRole: 'contractor',
    url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&h=800&fit=crop',
    gpsLat: 26.9124,
    gpsLng: 75.7873,
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    deviceId: 'device-001',
    aiVerified: true,
    aiNotes: 'Verified. Structural work consistent with milestone timeline.',
    materialLog: [{ name: 'Cement', quantity: 30, unit: 'Bags' }],
    reportedWorkerCount: 9,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
  // Photos for proj-2
  {
    id: 'photo-5',
    projectId: 'proj-2',
    uploadedByEmail: 'contractor@demo.com',
    uploaderRole: 'contractor',
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=800&fit=crop',
    gpsLat: 24.5854,
    gpsLng: 73.7125,
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    deviceId: 'device-003',
    aiVerified: true,
    aiNotes: 'Foundation excavation in progress. Matches plan.',
    materialLog: [{ name: 'Cement', quantity: 30, unit: 'Bags' }],
    reportedWorkerCount: 15,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'photo-6',
    projectId: 'proj-2',
    uploadedByEmail: 'contractor@demo.com',
    uploaderRole: 'contractor',
    url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&h=800&fit=crop',
    gpsLat: 24.5854,
    gpsLng: 73.7125,
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    deviceId: 'device-003',
    aiVerified: false,
    aiNotes: 'WARNING: Background analysis suggests possible stock photo.',
    materialLog: [{ name: 'Steel', quantity: 2, unit: 'Tons' }],
    reportedWorkerCount: 12,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'photo-7',
    projectId: 'proj-2',
    uploadedByEmail: 'contractor@demo.com',
    uploaderRole: 'contractor',
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=800&fit=crop',
    gpsLat: 24.5854,
    gpsLng: 73.7125,
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    deviceId: 'device-003',
    aiVerified: null,
    aiNotes: 'Pending AI analysis.',
    materialLog: [{ name: 'Bricks', quantity: 5000, unit: 'Units' }],
    reportedWorkerCount: 14,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
]

export const mockAlerts: Alert[] = [
  {
    id: 'alert-1',
    projectId: 'proj-1',
    message: 'FRAUD ALERT: GPS location mismatch! Photo uploaded from location outside the project site. (Uploaded by: Contractor Ramesh)',
    severity: 'high',
    resolved: false,
    createdAt: new Date(Date.now() - 120000).toISOString(),
  },
  {
    id: 'alert-2',
    projectId: 'proj-1',
    message: 'Labor count mismatch. Contractor reported 8 workers, AI detected 5 in the site photo.',
    severity: 'medium',
    resolved: false,
    createdAt: new Date(Date.now() - 900000).toISOString(),
  },
  {
    id: 'alert-3',
    projectId: 'proj-1',
    message: 'Material Update: 50 bags of cement used today. Remaining as per plan: 200 bags.',
    severity: 'info',
    resolved: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'alert-4',
    projectId: 'proj-1',
    message: 'Photo verified. Foundation work matches milestone plan.',
    severity: 'info',
    resolved: true,
    createdAt: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    id: 'alert-5',
    projectId: 'proj-2',
    message: 'Material usage exceeds plan for Steel. Possible theft or inaccurate reporting.',
    severity: 'medium',
    resolved: false,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
]

export const mockMaterialLogs: MaterialLog[] = [
  // proj-1 logs
  { id: 'ml-1', projectId: 'proj-1', reportedByEmail: 'contractor@demo.com', materialName: 'Cement', quantityUsed: 320, unit: 'Bags', createdAt: '2024-08-01' },
  { id: 'ml-2', projectId: 'proj-1', reportedByEmail: 'contractor@demo.com', materialName: 'Steel', quantityUsed: 8, unit: 'Tons', createdAt: '2024-08-01' },
  { id: 'ml-3', projectId: 'proj-1', reportedByEmail: 'contractor@demo.com', materialName: 'Bricks', quantityUsed: 18000, unit: 'Units', createdAt: '2024-08-01' },
  { id: 'ml-4', projectId: 'proj-1', reportedByEmail: 'contractor@demo.com', materialName: 'Sand', quantityUsed: 35, unit: 'Tons', createdAt: '2024-08-01' },
  // proj-2 logs
  { id: 'ml-5', projectId: 'proj-2', reportedByEmail: 'contractor@demo.com', materialName: 'Cement', quantityUsed: 450, unit: 'Bags', createdAt: '2024-08-15' },
  { id: 'ml-6', projectId: 'proj-2', reportedByEmail: 'contractor@demo.com', materialName: 'Steel', quantityUsed: 12, unit: 'Tons', createdAt: '2024-08-15' },
  { id: 'ml-7', projectId: 'proj-2', reportedByEmail: 'contractor@demo.com', materialName: 'Bricks', quantityUsed: 22000, unit: 'Units', createdAt: '2024-08-15' },
  { id: 'ml-8', projectId: 'proj-2', reportedByEmail: 'contractor@demo.com', materialName: 'Sand', quantityUsed: 45, unit: 'Tons', createdAt: '2024-08-15' },
]

// Helper to format currency in INR
export function formatINR(amount: number): string {
  if (amount >= 10000000) return `${(amount / 10000000).toFixed(1)} Cr`
  if (amount >= 100000) return `${(amount / 100000).toFixed(1)}L`
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)
}

// Helper to get relative time
export function timeAgo(dateStr: string): string {
  const now = Date.now()
  const date = new Date(dateStr).getTime()
  const diff = now - date
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} mins ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days > 1 ? 's' : ''} ago`
}