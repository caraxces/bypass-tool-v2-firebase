'use client'

import { useState, useEffect } from 'react'
import { Header } from '@/components/header'
import { AddProjectDialog } from '@/components/add-project-dialog'
import { apiClient, Project } from '@/lib/api-client'

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const data = await apiClient.getProjects()
      setProjects(data)
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleProjectCreated = (newProject: Project) => {
    setProjects(prev => [newProject, ...prev])
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="pt-20 pb-16 bg-gradient-to-br from-background via-background-secondary to-background-tertiary">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Your Projects
            </h1>
            <p className="mt-6 text-xl text-foreground-secondary">
              Manage your SEO projects and track keyword rankings
            </p>
            <div className="mt-8">
              <AddProjectDialog onProjectCreated={handleProjectCreated} />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Projects
          </h2>
          
          {loading ? (
            <div className="text-center py-20">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20">
              <h3 className="text-2xl font-bold text-foreground mb-4">No Projects Yet</h3>
              <p className="text-foreground-secondary mb-6">Create your first project to get started</p>
              <AddProjectDialog onProjectCreated={handleProjectCreated} />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <div key={project.id} className="bg-card border border-border rounded-2xl p-6 hover:shadow-macos-hover transition-all duration-300">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{project.name}</h3>
                  <p className="text-foreground-secondary text-sm mb-4">{project.domain}</p>
                  <div className="text-xs text-foreground-tertiary">
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
