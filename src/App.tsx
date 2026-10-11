import React, { useState, useEffect } from 'react';
import {
  api,
  type User,
  type Project,
  type Task,
  type Memory,
  type Activity,
  type DashboardSummary,
  type Conversation,
} from './services/api.ts';
import { Sidebar, type TabType } from './components/Sidebar.tsx';
import { Header } from './components/Header.tsx';
import { HeroBanner } from './components/HeroBanner.tsx';
import { QuickActions, type QuickActionItem } from './components/QuickActions.tsx';
import { AITaskFlow } from './components/AITaskFlow.tsx';
import { AICrew, type CrewMember } from './components/AICrew.tsx';
import { ProductivityChart } from './components/ProductivityChart.tsx';
import { ProjectProgress } from './components/ProjectProgress.tsx';
import { RecentProjects } from './components/RecentProjects.tsx';
import { LiveActivity } from './components/LiveActivity.tsx';
import { MemoryCard } from './components/MemoryCard.tsx';
import { SystemStatus } from './components/SystemStatus.tsx';
import { ParchmentQuote } from './components/ParchmentQuote.tsx';

// Modals & Chatbot
import { AIChatModal } from './components/AIChatModal.tsx';
import { MugiwaraChatbot } from './components/MugiwaraChatbot.tsx';
import { ProjectModal } from './components/ProjectModal.tsx';
import { TaskModal } from './components/TaskModal.tsx';
import { MemoryModal } from './components/MemoryModal.tsx';
import { SearchModal } from './components/SearchModal.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { CrewModal } from './components/CrewModal.tsx';

// Views
import { WorkspaceView } from './components/WorkspaceView.tsx';
import { ProjectsView } from './components/ProjectsView.tsx';
import { TasksView } from './components/TasksView.tsx';
import { MemoriesView } from './components/MemoriesView.tsx';
import { AnalyticsView } from './components/AnalyticsView.tsx';
import { CrewsView } from './components/CrewsView.tsx';
import { SettingsView } from './components/SettingsView.tsx';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [user, setUser] = useState<User | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);

  // Floating Chatbot State
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatbotActiveCrew, setChatbotActiveCrew] = useState<string>('ChatGPT');
  const [chatbotInitialPrompt, setChatbotInitialPrompt] = useState<string>('');

  // Modal Visibility States
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [selectedCrewForChat, setSelectedCrewForChat] = useState<string>('Luffy');
  const [initialPromptForChat, setInitialPromptForChat] = useState<string>('');
  const [isPromptSubmitting, setIsPromptSubmitting] = useState(false);

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  const [isCrewModalOpen, setIsCrewModalOpen] = useState(false);
  const [selectedCrewMember, setSelectedCrewMember] = useState<CrewMember | null>(null);

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Initial load
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // 1. Fetch user profile
      try {
        const userRes = await api.getMe();
        setUser(userRes.user);
      } catch {
        // Fallback default captain if session not yet established
        setUser({
          id: 'captain-luffy-001',
          name: 'Captain',
          email: 'captain@mugiwara.com',
          title: 'Student • Builder • Dreamer',
          role: 'Captain',
        });
      }

      // 2. Fetch dashboard summary
      const sum = await api.getDashboardSummary();
      setSummary(sum);
      setProjects(sum.projects || []);
      setMemories(sum.memories || []);
      setActivities(sum.activities || []);

      // 3. Fetch tasks
      const taskRes = await api.getTasks();
      setTasks(taskRes.tasks || []);

      // 4. Fetch conversations
      const convRes = await api.getConversations();
      setConversations(convRes.conversations || []);
      if (convRes.conversations?.length > 0) {
        setActiveConversation(convRes.conversations[0]);
      }
    } catch (err) {
      console.error('Error loading initial app data:', err);
    }
  };

  // Refresh summary metrics
  const refreshSummary = async () => {
    try {
      const sum = await api.getDashboardSummary();
      setSummary(sum);
      setProjects(sum.projects || []);
      setMemories(sum.memories || []);
      setActivities(sum.activities || []);
      const taskRes = await api.getTasks();
      setTasks(taskRes.tasks || []);
    } catch (err) {
      console.error('Failed to refresh summary:', err);
    }
  };

  // --- Handlers for AI Prompts & Chat ---
  const handleHeroPrompt = async (payload: {
    prompt: string;
    controls: {
      attach: boolean;
      web: boolean;
      memory: boolean;
      deepResearch: boolean;
    };
    attachments: Array<{ name: string; type: string; data?: string }>;
  }) => {
    setIsPromptSubmitting(true);
    setChatbotActiveCrew('ChatGPT');
    setIsChatbotOpen(true);

    try {
      const result = await api.chatWithAI({
        prompt: payload.prompt,
        conversationId: activeConversation?.id,
        crewMember: 'ChatGPT',
        controls: payload.controls,
        attachments: payload.attachments,
      });

      setActiveConversation(result.conversation);
      refreshSummary();
    } catch (err) {
      console.error('Hero prompt error:', err);
    } finally {
      setIsPromptSubmitting(false);
    }
  };

  const handleSendChatMessage = async (payload: {
    prompt: string;
    conversationId?: string;
    crewMember: string;
    controls: {
      attach: boolean;
      web: boolean;
      memory: boolean;
      deepResearch: boolean;
    };
    attachments: Array<{ name: string; type: string; data?: string }>;
  }) => {
    const res = await api.chatWithAI(payload);
    setActiveConversation(res.conversation);
    refreshSummary();
  };

  const handleNewConversation = () => {
    setActiveConversation(null);
    setInitialPromptForChat('');
    setChatbotInitialPrompt('');
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      await api.deleteConversation(id);
      setActiveConversation(null);
      const convRes = await api.getConversations();
      setConversations(convRes.conversations || []);
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    }
  };

  // --- Quick Actions Click ---
  const handleSelectQuickAction = (action: QuickActionItem) => {
    setChatbotActiveCrew(action.crewSpecialist);
    setChatbotInitialPrompt(action.promptSuggestion);
    setIsChatbotOpen(true);
  };

  // --- Project CRUD ---
  const handleSaveProject = async (data: Partial<Project>) => {
    if (selectedProject) {
      await api.updateProject(selectedProject.id, data);
    } else {
      await api.createProject(data);
    }
    refreshSummary();
  };

  const handleDeleteProject = async (id: string) => {
    await api.deleteProject(id);
    refreshSummary();
  };

  // --- Task CRUD ---
  const handleSaveTask = async (data: Partial<Task>) => {
    if (selectedTask) {
      await api.updateTask(selectedTask.id, data);
    } else {
      await api.createTask(data);
    }
    refreshSummary();
  };

  const handleDeleteTask = async (id: string) => {
    await api.deleteTask(id);
    refreshSummary();
  };

  const handleToggleTaskStatus = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'in_progress' : 'completed';
    await api.updateTask(task.id, { status: newStatus });
    refreshSummary();
  };

  // --- Memory CRUD ---
  const handleSaveMemory = async (data: Partial<Memory>) => {
    if (selectedMemory) {
      await api.updateMemory(selectedMemory.id, data);
    } else {
      await api.createMemory(data);
    }
    refreshSummary();
  };

  const handleDeleteMemory = async (id: string) => {
    await api.deleteMemory(id);
    refreshSummary();
  };

  // --- Auth Handlers ---
  const handleLogin = async (email: string, pass: string) => {
    const res = await api.login(email, pass);
    setUser(res.user);
    refreshSummary();
  };

  const handleSignup = async (name: string, email: string, pass: string) => {
    const res = await api.signup(name, email, pass);
    setUser(res.user);
    refreshSummary();
  };

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
    refreshSummary();
  };

  return (
    <div className="min-h-screen bg-[#101726] text-slate-800 flex">
      {/* 1. Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* 2. Main Content Layout (Offset for lg:w-64 sidebar) */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0 bg-[#f7f8fa]">
        {/* Top Header Bar */}
        <Header
          user={user}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenSearch={() => setIsSearchModalOpen(true)}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
        />

        {/* Dynamic Page Views based on currentTab */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {currentTab === 'home' && (
            <div className="space-y-6">
              {/* Hero Banner with Thousand Sunny Artwork & Floating Prompt Panel */}
              <HeroBanner
                userName={user?.name || 'Captain'}
                onSendPrompt={handleHeroPrompt}
                isSubmitting={isPromptSubmitting}
              />

              {/* 5 Pastel Quick Actions Cards */}
              <QuickActions
                onSelectAction={handleSelectQuickAction}
                onViewAll={() => setCurrentTab('workspace')}
              />

              {/* Two-Column Dashboard Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column (~65% width = 8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                  {/* AI Task Flow Stepper Card */}
                  <AITaskFlow
                    onStepClick={(step) => {
                      setChatbotActiveCrew('Luffy');
                      setChatbotInitialPrompt(`Guide me through the ${step.toUpperCase()} phase for our project.`);
                      setIsChatbotOpen(true);
                    }}
                  />

                  {/* Your AI Crew 5 Agents Card */}
                  <AICrew
                    onSelectMember={(member) => {
                      setChatbotActiveCrew(member.name);
                      setChatbotInitialPrompt(`Ahoy ${member.name}! I need your specialist expertise.`);
                      setIsChatbotOpen(true);
                    }}
                    onManageCrew={() => setCurrentTab('crews')}
                  />

                  {/* Bottom 3-Card Row: Productivity + Project Progress + Recent Projects */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* 1. Productivity Bar Chart */}
                    <ProductivityChart
                      percentage={summary?.productivity?.percentage ?? 42}
                      weekdays={summary?.productivity?.weekdays}
                    />

                    {/* 2. Project Progress Bars */}
                    <ProjectProgress
                      projects={projects}
                      onViewAll={() => setCurrentTab('projects')}
                      onSelectProject={(p) => {
                        setSelectedProject(p);
                        setIsProjectModalOpen(true);
                      }}
                    />

                    {/* 3. Recent Projects with Timestamps */}
                    <RecentProjects
                      projects={projects}
                      onViewAll={() => setCurrentTab('projects')}
                      onSelectProject={(p) => {
                        setSelectedProject(p);
                        setIsProjectModalOpen(true);
                      }}
                    />
                  </div>
                </div>

                {/* Right Column (~35% width = 4 cols) */}
                <div className="lg:col-span-4 space-y-5">
                  {/* Live Activity Stream */}
                  <LiveActivity activities={activities} />

                  {/* Persistent Memory Card */}
                  <MemoryCard
                    memories={memories}
                    onViewAll={() => setCurrentTab('memory')}
                    onSelectMemory={(m) => {
                      setSelectedMemory(m);
                      setIsMemoryModalOpen(true);
                    }}
                  />

                  {/* System Status Card */}
                  <SystemStatus
                    status={summary?.systemStatus?.status ?? 'Healthy'}
                    message={summary?.systemStatus?.message ?? 'No issues detected.'}
                  />

                  {/* Bottom Right Parchment Quote */}
                  <ParchmentQuote />
                </div>
              </div>
            </div>
          )}

          {currentTab === 'workspace' && (
            <WorkspaceView
              projects={projects}
              tasks={tasks}
              onSelectProject={(p) => {
                setSelectedProject(p);
                setIsProjectModalOpen(true);
              }}
              onSelectTask={(t) => {
                setSelectedTask(t);
                setIsTaskModalOpen(true);
              }}
              onOpenNewProject={() => {
                setSelectedProject(null);
                setIsProjectModalOpen(true);
              }}
              onOpenNewTask={() => {
                setSelectedTask(null);
                setIsTaskModalOpen(true);
              }}
              onToggleTaskStatus={handleToggleTaskStatus}
            />
          )}

          {currentTab === 'projects' && (
            <ProjectsView
              projects={projects}
              onOpenNewProject={() => {
                setSelectedProject(null);
                setIsProjectModalOpen(true);
              }}
              onEditProject={(p) => {
                setSelectedProject(p);
                setIsProjectModalOpen(true);
              }}
              onDeleteProject={handleDeleteProject}
            />
          )}

          {currentTab === 'tasks' && (
            <TasksView
              tasks={tasks}
              projects={projects}
              onOpenNewTask={() => {
                setSelectedTask(null);
                setIsTaskModalOpen(true);
              }}
              onEditTask={(t) => {
                setSelectedTask(t);
                setIsTaskModalOpen(true);
              }}
              onToggleStatus={handleToggleTaskStatus}
              onDeleteTask={handleDeleteTask}
            />
          )}

          {currentTab === 'memory' && (
            <MemoriesView
              memories={memories}
              onOpenNewMemory={() => {
                setSelectedMemory(null);
                setIsMemoryModalOpen(true);
              }}
              onEditMemory={(m) => {
                setSelectedMemory(m);
                setIsMemoryModalOpen(true);
              }}
              onDeleteMemory={handleDeleteMemory}
            />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsView summary={summary} />
          )}

          {currentTab === 'crews' && (
            <CrewsView
              onChatWithCrew={(crewName) => {
                setChatbotActiveCrew(crewName);
                setChatbotInitialPrompt(`Oi ${crewName}! Need your assistance.`);
                setIsChatbotOpen(true);
              }}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              user={user}
              onLogout={handleLogout}
              onRefreshData={refreshSummary}
            />
          )}
        </main>
      </div>

      {/* --- Modals & Drawers --- */}

      {/* AI Chat Drawer / Modal */}
      <AIChatModal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        activeConversation={activeConversation}
        onSendMessage={handleSendChatMessage}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
        selectedCrew={selectedCrewForChat}
        initialPrompt={initialPromptForChat}
      />

      {/* Project Manager Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        project={selectedProject}
        onSave={handleSaveProject}
        onDelete={handleDeleteProject}
      />

      {/* Task Manager Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        task={selectedTask}
        projects={projects}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
      />

      {/* Memory Manager Modal */}
      <MemoryModal
        isOpen={isMemoryModalOpen}
        onClose={() => setIsMemoryModalOpen(false)}
        memory={selectedMemory}
        onSave={handleSaveMemory}
        onDelete={handleDeleteMemory}
      />

      {/* Crew Specialist Detail Modal */}
      <CrewModal
        isOpen={isCrewModalOpen}
        onClose={() => setIsCrewModalOpen(false)}
        member={selectedCrewMember}
        onStartChat={(member) => {
          setSelectedCrewForChat(member.name);
          setIsChatModalOpen(true);
        }}
      />

      {/* Global Search & Command Palette (⌘ K) */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        projects={projects}
        tasks={tasks}
        memories={memories}
        onSelectProject={(p) => {
          setSelectedProject(p);
          setIsProjectModalOpen(true);
        }}
        onSelectTask={(t) => {
          setSelectedTask(t);
          setIsTaskModalOpen(true);
        }}
        onSelectMemory={(m) => {
          setSelectedMemory(m);
          setIsMemoryModalOpen(true);
        }}
        onAskAI={(q) => {
          setChatbotActiveCrew('Luffy');
          setChatbotInitialPrompt(q);
          setIsChatbotOpen(true);
        }}
      />

      {/* Sign In & Sign Up Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onSignup={handleSignup}
      />

      {/* Floating Mugiwara AI Chatbot Widget */}
      <MugiwaraChatbot
        isOpen={isChatbotOpen}
        onToggle={() => setIsChatbotOpen(!isChatbotOpen)}
        activeConversation={activeConversation}
        onSendMessage={handleSendChatMessage}
        onNewConversation={handleNewConversation}
        onDeleteConversation={handleDeleteConversation}
        activeCrewMember={chatbotActiveCrew}
        onChangeCrewMember={(crew) => setChatbotActiveCrew(crew)}
        initialPrompt={chatbotInitialPrompt}
      />
    </div>
  );
}
