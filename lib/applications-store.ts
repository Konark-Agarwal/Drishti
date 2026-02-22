// lib/applications-store.ts
import { Application } from './mock-data'

const STORAGE_KEY = 'drishti_applications'

export function getApplications(projectId?: string): Application[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(STORAGE_KEY)
  const allApps: Application[] = stored ? JSON.parse(stored) : []
  if (projectId) {
    return allApps.filter(app => app.projectId === projectId)
  }
  return allApps
}

export function addApplication(app: Omit<Application, 'id' | 'status' | 'createdAt'>): Application {
  const stored = localStorage.getItem(STORAGE_KEY)
  const allApps: Application[] = stored ? JSON.parse(stored) : []
  const newApp: Application = {
    id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...app,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
  allApps.push(newApp)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allApps))
  return newApp
}

export function updateApplicationStatus(id: string, status: 'accepted' | 'rejected'): Application | undefined {
  const stored = localStorage.getItem(STORAGE_KEY)
  const allApps: Application[] = stored ? JSON.parse(stored) : []
  const index = allApps.findIndex(app => app.id === id)
  if (index === -1) return
  const updatedApp = { ...allApps[index], status }
  allApps[index] = updatedApp
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allApps))
  return updatedApp
}