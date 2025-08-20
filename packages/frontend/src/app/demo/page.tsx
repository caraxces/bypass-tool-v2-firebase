'use client'

import { Header } from '@/components/header'
import { AddProjectDialog } from '@/components/add-project-dialog'

// Mock data for demo
const mockProjects = [
  {
    id: '1',
    name: 'Tech Blog Pro',
    domain: 'https://techblogpro.com',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'E-commerce Store',
    domain: 'https://mystore.com',
    createdAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-10T14:30:00Z'
  },
  {
    id: '3',
    name: 'Portfolio Site',
    domain: 'https://myportfolio.dev',
    createdAt: '2024-01-05T09:15:00Z',
    updatedAt: '2024-01-05T09:15:00Z'
  }
]

export default function DemoPage() {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background-secondary to-background-tertiary pt-20 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent leading-tight">
              macOS-Inspired Design
            </h1>
            <p className="mt-6 text-xl md:text-2xl text-foreground-secondary font-medium max-w-3xl mx-auto leading-relaxed">
              Experience the beauty of macOS design principles with smooth animations and elegant typography
            </p>
            <div className="mt-8 flex justify-center">
              <AddProjectDialog />
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-float" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-accent/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-primary/5 rounded-full blur-xl animate-float" style={{ animationDelay: '4s' }} />
      </section>

      {/* Projects Grid */}
      <section className="py-16 bg-background-secondary/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Sample Projects
              </h2>
              <p className="text-lg text-foreground-secondary max-w-2xl mx-auto">
                Beautiful project cards with hover effects and smooth transitions
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mockProjects.map((project, index) => (
                <div 
                  key={project.id}
                  className="group bg-card hover:bg-card-secondary border border-border hover:border-border-secondary rounded-2xl p-6 transition-all duration-300 ease-macos hover:shadow-macos-hover transform hover:-translate-y-1 animate-fade-in-up"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                      </svg>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 text-foreground-secondary hover:text-foreground hover:bg-background rounded-lg transition-colors duration-200">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button className="p-2 text-foreground-secondary hover:text-foreground hover:bg-background rounded-lg transition-colors duration-200">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                    {project.name}
                  </h3>
                  <p className="text-foreground-secondary text-sm mb-4 break-all">
                    {project.domain}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-foreground-tertiary">
                    <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                    <span className="px-2 py-1 bg-accent/10 text-accent rounded-full font-medium">
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Performance Overview
              </h2>
              <p className="text-lg text-foreground-secondary max-w-2xl mx-auto">
                Beautiful statistics cards with gradient backgrounds and hover effects
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-4">
              {[
                { label: 'Total Projects', value: mockProjects.length, icon: '📊', color: 'from-blue-500 to-blue-600' },
                { label: 'Active Keywords', value: '24', icon: '🔍', color: 'from-green-500 to-green-600' },
                { label: 'Avg. Position', value: '12.5', icon: '📈', color: 'from-purple-500 to-purple-600' },
                { label: 'Total Searches', value: '1,234', icon: '👥', color: 'from-orange-500 to-orange-600' }
              ].map((stat, index) => (
                <div 
                  key={stat.label}
                  className="bg-card border border-border rounded-2xl p-6 text-center transition-all duration-300 ease-macos hover:shadow-macos-hover transform hover:-translate-y-1 animate-fade-in-up"
                  style={{ animationDelay: `${0.5 + 0.1 * index}s` }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl`}>
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold text-foreground mb-2">{stat.value}</div>
                  <div className="text-sm text-foreground-secondary">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
