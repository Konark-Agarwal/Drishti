// lib/material-logs-store.ts
import { MaterialLog } from './mock-data'

const STORAGE_KEY = 'drishti_material_logs'

export function getMaterialLogs(projectId?: string): MaterialLog[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(STORAGE_KEY)
  const allLogs: MaterialLog[] = stored ? JSON.parse(stored) : []
  if (projectId) {
    return allLogs.filter(log => log.projectId === projectId)
  }
  return allLogs
}

export function addMaterialLog(log: Omit<MaterialLog, 'id' | 'createdAt'>) {
  if (typeof window === 'undefined') return
  const stored = localStorage.getItem(STORAGE_KEY)
  const allLogs: MaterialLog[] = stored ? JSON.parse(stored) : []
  const newLog: MaterialLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...log,
    createdAt: new Date().toISOString(),
  }
  allLogs.push(newLog)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allLogs))
  return newLog
}