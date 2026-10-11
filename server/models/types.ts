export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  avatar?: string;
  title?: string;
  role?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string;
  status: 'In Progress' | 'Completed' | 'Planning' | 'Paused';
  progress: number; // 0 - 100
  color?: string; // hex or tailwind identifier
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

export interface Activity {
  id: string;
  userId: string;
  action: string;
  description: string;
  relatedEntityType?: 'project' | 'task' | 'memory' | 'ai' | 'crew';
  relatedEntityId?: string;
  createdAt: string;
}
