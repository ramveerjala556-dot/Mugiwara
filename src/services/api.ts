// API Client for Mugiwara AI Dashboard

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  title?: string;
  role?: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  status: 'In Progress' | 'Completed' | 'Planning' | 'Paused';
  progress: number;
  color?: string;
  tag?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  userId: string;
  projectId?: string;
  projectName?: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedCrew?: 'Luffy' | 'Zoro' | 'Nami' | 'Sanji' | 'Chopper';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Memory {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: 'Tech' | 'Ideas' | 'Tools' | 'Debug' | 'General';
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  userId: string;
  action: string;
  description: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  createdAt: string;
}

export interface DashboardSummary {
  projectsCount: number;
  activeProjectsCount: number;
  completedProjectsCount: number;
  tasksCount: number;
  pendingTasksCount: number;
  inProgressTasksCount: number;
  completedTasksCount: number;
  memoryCount: number;
  projects: Project[];
  recentProjects: Project[];
  memories: Memory[];
  activities: Activity[];
  productivity: {
    percentage: number;
    trend: string;
    weekdays: Array<{ day: string; hours: number; heightPct: number }>;
  };
  crew: Array<{
    name: string;
    role: string;
    focus: string;
    status: string;
    avatar: string;
  }>;
  systemStatus: {
    status: string;
    message: string;
    geminiConfigured: boolean;
    database: string;
    uptime: number;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  crewMember?: string;
  sources?: string[];
  attachments?: string[];
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  crewMember?: string;
  createdAt: string;
  updatedAt: string;
}

const API_BASE = '/api';

export const api = {
  // Auth
  async getMe(): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/me`);
    if (!res.ok) throw new Error('Not authenticated');
    return res.json();
  },

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }
    return res.json();
  },

  async signup(name: string, email: string, password: string): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Signup failed');
    }
    return res.json();
  },

  async logout(): Promise<void> {
    await fetch(`${API_BASE}/auth/logout`, { method: 'POST' });
  },

  // Dashboard
  async getDashboardSummary(): Promise<DashboardSummary> {
    const res = await fetch(`${API_BASE}/dashboard/summary`);
    if (!res.ok) throw new Error('Failed to load dashboard summary');
    return res.json();
  },

  // Health
  async getHealth(): Promise<any> {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  // Projects
  async getProjects(): Promise<{ projects: Project[] }> {
    const res = await fetch(`${API_BASE}/projects`);
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
  },

  async createProject(data: Partial<Project>): Promise<{ project: Project }> {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create project');
    return res.json();
  },

  async updateProject(id: string, data: Partial<Project>): Promise<{ project: Project }> {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update project');
    return res.json();
  },

  async deleteProject(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/projects/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete project');
  },

  // Tasks
  async getTasks(params?: { status?: string; projectId?: string }): Promise<{ tasks: Task[] }> {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/tasks${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return res.json();
  },

  async createTask(data: Partial<Task>): Promise<{ task: Task }> {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create task');
    return res.json();
  },

  async updateTask(id: string, data: Partial<Task>): Promise<{ task: Task }> {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update task');
    return res.json();
  },

  async deleteTask(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/tasks/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete task');
  },

  // Memories
  async getMemories(params?: { category?: string; search?: string }): Promise<{ memories: Memory[] }> {
    const query = new URLSearchParams(params as any).toString();
    const res = await fetch(`${API_BASE}/memories${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error('Failed to fetch memories');
    return res.json();
  },

  async createMemory(data: Partial<Memory>): Promise<{ memory: Memory }> {
    const res = await fetch(`${API_BASE}/memories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create memory');
    return res.json();
  },

  async updateMemory(id: string, data: Partial<Memory>): Promise<{ memory: Memory }> {
    const res = await fetch(`${API_BASE}/memories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update memory');
    return res.json();
  },

  async deleteMemory(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/memories/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete memory');
  },

  // Activities
  async getActivities(): Promise<{ activities: Activity[] }> {
    const res = await fetch(`${API_BASE}/activities`);
    if (!res.ok) throw new Error('Failed to fetch activities');
    return res.json();
  },

  async chatWithAI(payload: {
    prompt: string;
    conversationId?: string;
    crewMember?: string;
    controls?: {
      attach?: boolean;
      web?: boolean;
      memory?: boolean;
      deepResearch?: boolean;
    };
    attachments?: Array<{ name: string; type: string; data?: string }>;
  }): Promise<{ conversationId: string; reply: ChatMessage; conversation: Conversation }> {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'AI generation failed');
    }
    return res.json();
  },

  async chatWithAIStream(
    payload: {
      prompt: string;
      conversationId?: string;
      crewMember?: string;
      controls?: {
        attach?: boolean;
        web?: boolean;
        memory?: boolean;
        deepResearch?: boolean;
      };
      attachments?: Array<{ name: string; type: string; data?: string }>;
    },
    onChunk: (chunk: string) => void,
    onDone: (data: { conversationId: string; fullText: string; conversation: Conversation }) => void,
    onError: (err: any) => void
  ): Promise<() => void> {
    const controller = new AbortController();
    fetch(`${API_BASE}/ai/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    }).then(async (res) => {
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Stream request failed');
      }
      const reader = res.body?.getReader();
      if (!reader) throw new Error('ReadableStream not supported');
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            try {
              const data = JSON.parse(trimmed.slice(6));
              if (data.error) onError(new Error(data.error));
              if (data.chunk) onChunk(data.chunk);
              if (data.done) onDone(data);
            } catch {
              // ignore parse errors
            }
          }
        }
      }
    }).catch((err) => {
      if (err.name !== 'AbortError') onError(err);
    });

    return () => controller.abort();
  },

  async getConversations(): Promise<{ conversations: Conversation[] }> {
    const res = await fetch(`${API_BASE}/ai/conversations`);
    if (!res.ok) throw new Error('Failed to fetch conversations');
    return res.json();
  },

  async deleteConversation(id: string): Promise<void> {
    await fetch(`${API_BASE}/ai/conversations/${id}`, { method: 'DELETE' });
  },
};
