// lib/photos-store.ts
import { Photo } from './mock-data'

const STORAGE_KEY = 'drishti_photos'

export function getPhotos(projectId?: string): Photo[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(STORAGE_KEY)
  const allPhotos: Photo[] = stored ? JSON.parse(stored) : []
  if (projectId) {
    return allPhotos.filter(p => p.projectId === projectId)
  }
  return allPhotos
}

export function addPhoto(photo: Omit<Photo, 'id' | 'createdAt'>) {
  if (typeof window === 'undefined') return
  const stored = localStorage.getItem(STORAGE_KEY)
  const allPhotos: Photo[] = stored ? JSON.parse(stored) : []
  const newPhoto: Photo = {
    id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...photo,
    createdAt: new Date().toISOString(),
  }
  allPhotos.push(newPhoto)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allPhotos))
  return newPhoto
}