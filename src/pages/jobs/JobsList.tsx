import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/stores/auth';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  Briefcase,
  Brain
} from 'lucide-react';
import { KanbanBoard } from '@/components/jobs/KanbanBoard';
import JobListings from '@/components/jobs/JobListings';
import { AIJobRecommendationsContent } from '@/components/jobs/AIJobRecommendationsContent';
import { KanbanFiltersDialog } from '@/components/jobs/KanbanFilters';
import { AddColumnDialog } from '@/components/jobs/AddColumnDialog';
import { NewTaskDialog } from '@/components/jobs/NewTaskDialog';
import { useKanbanStore } from '@/components/jobs/hooks/useKanbanStore';
import { Card, CardContent } from '@/components/ui/card';

export default function JobsList() {
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const [activeTab, setActiveTab] = useState('my-jobs');
  const {
    filters,
    setFilters,
    availableCategories,
    availableAssignees,
    addTask,
  } = useKanbanStore();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            {profile?.role === 'client' ? 'My Jobs' : 'Jobs'}
          </h1>
          <p className="text-muted-foreground">
            {profile?.role === 'client' 
              ? 'Manage your posted engineering projects' 
              : 'Connect with engineering projects across Saudi Arabia'
            }
          </p>
        </div>
        
        {profile?.role === 'client' && (
          <Button onClick={() => navigate('/client/jobs/create')} className="bg-gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        )}
      </div>

      {/* Tabs for Engineers */}
      {profile?.role === 'engineer' && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="my-jobs" onClick={() => setActiveTab('my-jobs')}>
              My Projects
            </TabsTrigger>
            <TabsTrigger value="available" onClick={() => setActiveTab('available')}>
              Available Jobs
            </TabsTrigger>
            <TabsTrigger value="ai-recommendations" onClick={() => setActiveTab('ai-recommendations')}>
              <Brain className="w-4 h-4 mr-2" />
              AI Job Recommendations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-jobs" className="mt-6">
            <div className="space-y-4">
              {/* Row 1: Title and Subtitle */}
              <div>
                <h2 className="text-lg font-semibold">Kanban Board</h2>
                <p className="text-muted-foreground">
                  Engineering project management board to track progress across all active assignments.
                </p>
              </div>

              {/* Row 2: Search and Actions (styled container like JobListings) */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-full flex-1">
                      <Input 
                        placeholder="Search tasks, columns, assignees..." 
                        aria-label="Search tasks"
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col lg:flex-row items-center gap-1">
                      <KanbanFiltersDialog
                        filters={filters}
                        onFiltersChange={setFilters}
                        availableCategories={availableCategories}
                        availableAssignees={availableAssignees}
                      />
                      <AddColumnDialog />
                      <NewTaskDialog
                        onTaskCreate={addTask}
                        availableCategories={availableCategories}
                        availableAssignees={availableAssignees}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <KanbanBoard />
            </div>
          </TabsContent>

          <TabsContent value="available" className="mt-6">
            <JobListings />
          </TabsContent>

          <TabsContent value="ai-recommendations" className="mt-6">
            <AIJobRecommendationsContent />
          </TabsContent>
        </Tabs>
      )}

      {/* Client Jobs View */}
      {profile?.role === 'client' && (
        <JobListings />
      )}
    </div>
  );
}