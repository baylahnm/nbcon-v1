/**
 * Client Dashboard Page
 * AI-powered dashboard with live Supabase data, conversations, and projects
 * 
 * @version 2.0.0
 * @updated January 28, 2025 - Integrated real data via useClientDashboardData hook
 */

import { AIPoweredDashboard } from '@/components/portal/shared/AIPoweredDashboard';
import { Plus, Search, FileText, TrendingUp, DollarSign, Receipt, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/pages/2-auth/others/stores/auth';
import { useAiStore } from '@/shared/stores/useAiStore';
import { useClientDashboardData } from '@/hooks/useClientDashboardData';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { sendMessage, starThread, deleteThread } = useAiStore();
  
  // Fetch live dashboard data
  const {
    conversations,
    projects,
    conversationsLoading,
    projectsLoading,
  } = useClientDashboardData();

  // Conversation handlers - wire to real store actions
  const handleNewConversation = () => {
    navigate('/free/ai');
  };

  const handleConversationSelect = (id: string) => {
    navigate(`/free/ai?thread=${id}`);
  };

  const handleDeleteConversation = async (id: string) => {
    await deleteThread(id);
  };

  const handleToggleStar = async (id: string) => {
    await starThread(id);
  };

  const handleSendMessage = async (message: string) => {
    await sendMessage(message);
  };

  return (
    <AIPoweredDashboard
      role="client"
      userName={user?.name || 'Client'}
      
      // ✅ ENABLE ADVANCED COMPONENTS: Live Supabase data, expandable modals, carousels
      useAdvancedComponents={true}
      
      // Conversation handlers for advanced components
      onNewConversation={handleNewConversation}
      onConversationSelect={handleConversationSelect}
      onDeleteConversation={handleDeleteConversation}
      onToggleStar={handleToggleStar}
      onSendMessage={handleSendMessage}
      
      // Quick actions for AI toolbar
      quickActions={[
        { id: 'start-project', label: 'Start new project', icon: Plus, onClick: () => navigate('/free/job/new') },
        { id: 'post-job', label: 'Post job listing', icon: FileText, onClick: () => navigate('/free/job/new') },
        { id: 'find-engineers', label: 'Find engineers', icon: Search, onClick: () => navigate('/free/browse') },
        { id: 'create-invoice', label: 'Create invoice', icon: Receipt, onClick: () => navigate('/free/finance') },
        { id: 'check-budget', label: 'Check budget', icon: CreditCard, onClick: () => navigate('/free/finance') },
        { id: 'summary', label: 'Summary', icon: TrendingUp, onClick: () => navigate('/free/ai') }
      ]}
      
      // Live data from Supabase (fetched by useClientDashboardData hook)
      projects={projects}
      conversations={conversations}
      
      // Loading states
      isLoadingProjects={projectsLoading}
      isLoadingConversations={conversationsLoading}
      
      aiWelcomeMessage="Hello! How can I help you today? You can ask me to start a new project, check the status of an existing one, or find qualified engineers. What would you like to do?"
    />
  );
}
