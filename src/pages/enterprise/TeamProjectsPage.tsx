import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTeamStore } from '@/hooks/useTeamStore';
import { ProjectCard, NewProjectCard } from '@/components/enterprise/ProjectCard';
import { ProjectDrawer } from '@/components/enterprise/ProjectDrawer';
import { EditProjectModal } from '@/components/enterprise/EditProjectModal';
import { GlobalKanbanBoard } from '@/components/enterprise/GlobalKanbanBoard';
import { TeamMembersList } from '@/components/enterprise/TeamMembersList';
import { 
  Clock, 
  Users, 
  BarChart3, 
  FileText,
  Calendar,
  Target,
  DollarSign
} from 'lucide-react';

export function TeamProjectsPage() {
  const { 
    getProjectsWithDetails, 
    selectedProject, 
    setSelectedProject,
    editingProject,
    setEditingProject
  } = useTeamStore();
  
  const projects = getProjectsWithDetails();

  const TabPlaceholder = ({ title, icon: Icon, description }: { 
    title: string; 
    icon: React.ComponentType<{ className?: string }>; 
    description: string; 
  }) => (
    <div className="flex-1 flex items-center justify-center min-h-96">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto">
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            {description}
          </p>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="p-6">
      <Tabs defaultValue="management" className="space-y-6">
        <div className="border-b border-sidebar-border mb-6">
          <TabsList className="h-auto bg-transparent p-0 border-0 rounded-none w-full">
            <TabsTrigger value="timesheet" className="flex items-center gap-2 px-4 py-3 min-w-fit">Team Time Sheet</TabsTrigger>
            <TabsTrigger value="management" className="flex items-center gap-2 px-4 py-3 min-w-fit">Team & Role Management</TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2 px-4 py-3 min-w-fit">Projects Reports</TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2 px-4 py-3 min-w-fit">Document & File Management</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="timesheet" className="space-y-6">
          <TabPlaceholder 
            title="Team Time Sheet"
            icon={Clock}
            description="Track team member working hours, overtime, and time allocation across projects. Advanced time tracking and reporting tools coming soon."
          />
        </TabsContent>

        <TabsContent value="management" className="space-y-6">
          {/* Team Members Section */}
          <TeamMembersList />
          
          {/* Projects Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="pt-8 border-t border-border"
          >
            <div className="space-y-2 mb-6">
              <h3 className="text-lg font-semibold">Projects</h3>
              <p className="text-sm text-muted-foreground">
                Create and manage your team projects
              </p>
            </div>
            
            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <NewProjectCard />
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: (index + 1) * 0.1 
                  }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </div>

            {/* Empty State */}
            {projects.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center py-12"
              >
                <div className="space-y-3">
                  <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mx-auto">
                    <span className="text-3xl">📋</span>
                  </div>
                  <h4 className="font-medium">No Projects Yet</h4>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Get started by creating your first project. You can add team members, 
                    assign tasks, and track progress all in one place.
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Kanban Board Section */}
          {projects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="pt-8 border-t border-border"
            >
              <GlobalKanbanBoard />
            </motion.div>
          )}
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <TabPlaceholder 
            title="Projects Reports"
            icon={BarChart3}
            description="Comprehensive project analytics, progress reports, and performance metrics. Advanced reporting dashboard coming soon."
          />
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <TabPlaceholder 
            title="Document & File Management"
            icon={FileText}
            description="Centralized document storage, file sharing, and collaborative document management system coming soon."
          />
        </TabsContent>
      </Tabs>

      {/* Project Drawer */}
      {selectedProject && (
        <ProjectDrawer
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          projectId={selectedProject}
        />
      )}

      {/* Edit Project Modal */}
      {editingProject && (
        <EditProjectModal
          isOpen={!!editingProject}
          onClose={() => setEditingProject(null)}
          projectId={editingProject}
        />
      )}
    </div>
  );
}