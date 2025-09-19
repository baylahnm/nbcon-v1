import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/auth';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  Briefcase,
  Plus
} from 'lucide-react';
import KanbanBoard from '@/components/jobs/KanbanBoard';
import JobListings from '@/components/jobs/JobListings';

export default function JobsList() {
  const navigate = useNavigate();
  const { profile } = useAuthStore();
  const [activeTab, setActiveTab] = useState('my-jobs');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Briefcase className="h-8 w-8 text-primary" />
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
          </TabsList>

          <TabsContent value="my-jobs" className="mt-6">
            <KanbanBoard />
          </TabsContent>

          <TabsContent value="available" className="mt-6">
            <JobListings />
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