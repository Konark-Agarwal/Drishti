// lib/alerts-store.ts
import { Alert } from './mock-data'

const STORAGE_KEY = 'drishti_alerts'

export function getAlerts(projectId?: string): Alert[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(STORAGE_KEY)
  const allAlerts: Alert[] = stored ? JSON.parse(stored) : []
  if (projectId) {
    return allAlerts.filter(a => a.projectId === projectId)
  }
  return allAlerts
}

export function addAlert(alert: Omit<Alert, 'id' | 'resolved' | 'createdAt'>) {
  if (typeof window === 'undefined') return
  const stored = localStorage.getItem(STORAGE_KEY)
  const allAlerts: Alert[] = stored ? JSON.parse(stored) : []
  const newAlert: Alert = {
    id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...alert,
    resolved: false,
    createdAt: new Date().toISOString(),
  }
  allAlerts.push(newAlert)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allAlerts))
  return newAlert
}