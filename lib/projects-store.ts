// lib/projects-store.ts
import { Project } from './mock-data'

const STORAGE_KEY = 'projects'

// Get all projects from localStorage
export function getAllProjects(): Project[] {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

// Get projects for a specific owner
export function getProjects(ownerEmail: string): Project[] {
  return getAllProjects().filter(p => p.ownerEmail === ownerEmail)
}

// Get project by ID
export function getProjectById(id: string): Project | undefined {
  return getAllProjects().find(p => p.id === id)
}

// Add a new project
export function addProject(project: Project) {
  const projects = getAllProjects()
  projects.push(project)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
}