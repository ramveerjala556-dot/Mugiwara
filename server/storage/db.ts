import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import type { User, Project, Task, Memory, Conversation, Activity } from '../models/types.ts';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');

interface DatabaseSchema {
  users: User[];
  projects: Project[];
  tasks: Task[];
  memories: Memory[];
  conversations: Conversation[];
  activities: Activity[];
}

let dbData: DatabaseSchema = {
  users: [],
  projects: [],
  tasks: [],
  memories: [],
  conversations: [],
  activities: []
};

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Load data or initialize with seeds
export function initDB(): void {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      dbData = JSON.parse(content);
      // Ensure all collections exist
      dbData.users = dbData.users || [];
      dbData.projects = dbData.projects || [];
      dbData.tasks = dbData.tasks || [];
      dbData.memories = dbData.memories || [];
      dbData.conversations = dbData.conversations || [];
      dbData.activities = dbData.activities || [];
    } else {
      seedDefaultData();
      saveDB();
    }
  } catch (err) {
    console.error('Error reading db.json, reinitializing seeds:', err);
    seedDefaultData();
    saveDB();
  }
}

export function saveDB(): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write db.json:', err);
  }
}

function seedDefaultData(): void {
  const defaultUserId = 'captain-luffy-001';
  const hashedPassword = bcrypt.hashSync('pirateking123', 10);

  const defaultUser: User = {
    id: defaultUserId,
    name: 'Captain',
    email: 'captain@mugiwara.com',
    passwordHash: hashedPassword,
    title: 'Student • Builder • Dreamer',
    role: 'Captain',
    avatar: '/src/assets/images/luffy_avatar_1791651465157.jpg',
    createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  };

  const defaultProjects: Project[] = [
    {
      id: 'proj-nexora',
      userId: defaultUserId,
      name: 'NEXORA',
      description: 'Next-generation AI orchestration platform with distributed agents and dynamic execution graph.',
      status: 'In Progress',
      progress: 87,
      color: 'teal',
      tag: 'Core Engine',
      createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString() // Updated 2h ago
    },
    {
      id: 'proj-recallops',
      userId: defaultUserId,
      name: 'ReCallOps',
      description: 'Ultra-low latency vector recall memory mesh for long-term agent retention and retrieval.',
      status: 'In Progress',
      progress: 92,
      color: 'purple',
      tag: 'Memory Mesh',
      createdAt: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString() // Updated 5h ago
    },
    {
      id: 'proj-crm',
      userId: defaultUserId,
      name: 'CRM Platform',
      description: 'Full-stack client relationship portal with automated intelligent outreach and pipeline analytics.',
      status: 'In Progress',
      progress: 45,
      color: 'blue',
      tag: 'Enterprise App',
      createdAt: new Date(Date.now() - 21 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString() // Updated 1d ago
    }
  ];

  const defaultTasks: Task[] = [
    {
      id: 'task-1',
      userId: defaultUserId,
      projectId: 'proj-nexora',
      projectName: 'NEXORA',
      title: 'Optimize distributed agent message bus latency',
      description: 'Benchmarking WebSocket and gRPC message latency under 10k concurrent payloads.',
      status: 'in_progress',
      priority: 'high',
      assignedCrew: 'Zoro',
      dueDate: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'task-2',
      userId: defaultUserId,
      projectId: 'proj-recallops',
      projectName: 'ReCallOps',
      title: 'Finalize HNSW embedding index serialization',
      description: 'Persist vector indexes with zero-copy mmap for instant query bootup.',
      status: 'completed',
      priority: 'medium',
      assignedCrew: 'Sanji',
      dueDate: new Date(Date.now() + 1 * 24 * 3600 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'task-3',
      userId: defaultUserId,
      projectId: 'proj-crm',
      projectName: 'CRM Platform',
      title: 'Build automated pipeline funnel visualization',
      description: 'Interactive conversion sankey diagram with cohort filtering and export.',
      status: 'pending',
      priority: 'medium',
      assignedCrew: 'Nami',
      dueDate: new Date(Date.now() + 5 * 24 * 3600 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'task-4',
      userId: defaultUserId,
      projectId: 'proj-nexora',
      projectName: 'NEXORA',
      title: 'Conduct end-to-end load stress testing on Sunny cluster',
      description: 'Run automated chaos experiments and verify resilience in disaster recovery.',
      status: 'in_progress',
      priority: 'urgent',
      assignedCrew: 'Chopper',
      dueDate: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const defaultMemories: Memory[] = [
    {
      id: 'mem-1',
      userId: defaultUserId,
      title: 'Tech stack preference',
      content: 'React + Supabase, Express.js backend with TypeScript, Tailwind CSS and Vite.',
      category: 'Tech',
      icon: 'tech',
      createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'mem-2',
      userId: defaultUserId,
      title: 'Project ideas',
      content: 'NEXORA (agent graph), ReCallOps (vector memory mesh), CRM (intelligent customer portal).',
      category: 'Ideas',
      icon: 'ideas',
      createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'mem-3',
      userId: defaultUserId,
      title: 'Preferred tools',
      content: 'Vercel, GitHub, Figma, Docker, Google AI Studio, Postman.',
      category: 'Tools',
      icon: 'tools',
      createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'mem-4',
      userId: defaultUserId,
      title: 'Past issues',
      content: 'API timeout during high payload batches, deployment cold starts on micro instances.',
      category: 'Debug',
      icon: 'debug',
      createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const defaultActivities: Activity[] = [
    {
      id: 'act-1',
      userId: defaultUserId,
      action: 'Analyzing your request',
      description: 'AI Crew reviewed query specifications and broke down execution graph.',
      relatedEntityType: 'ai',
      createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString() // 2m ago
    },
    {
      id: 'act-2',
      userId: defaultUserId,
      action: 'Searching the web',
      description: 'Fetched recent library updates and API specifications for vector indexing.',
      relatedEntityType: 'ai',
      createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString() // 3m ago
    },
    {
      id: 'act-3',
      userId: defaultUserId,
      action: 'Generating plan',
      description: 'Luffy synthesized operational route and designated responsibilities to crew.',
      relatedEntityType: 'crew',
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString() // 5m ago
    },
    {
      id: 'act-4',
      userId: defaultUserId,
      action: 'Executing tasks',
      description: 'Zoro compiled optimized TypeScript models and middleware bindings.',
      relatedEntityType: 'task',
      createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString() // 8m ago
    },
    {
      id: 'act-5',
      userId: defaultUserId,
      action: 'Verifying results',
      description: 'Chopper ran health checks and verified zero memory leaks in the engine.',
      relatedEntityType: 'project',
      createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString() // 12m ago
    }
  ];

  const defaultConversations: Conversation[] = [
    {
      id: 'conv-1',
      userId: defaultUserId,
      title: 'Grand Line Architectural Roadmap',
      messages: [
        {
          id: 'msg-1',
          role: 'user',
          content: 'Luffy, how do we navigate through the Grand Line of our tech stack?',
          timestamp: new Date(Date.now() - 3600 * 1000).toISOString()
        },
        {
          id: 'msg-2',
          role: 'assistant',
          content: 'Shishishi! Leave it to me, Captain! With Zoro writing razor-sharp code, Nami researching the charts, Sanji structuring the data, and Chopper guarding the health of our system, we are setting sail for the greatest build in the world!',
          timestamp: new Date(Date.now() - 3500 * 1000).toISOString(),
          crewMember: 'Luffy'
        }
      ],
      crewMember: 'Luffy',
      createdAt: new Date(Date.now() - 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3500 * 1000).toISOString()
    }
  ];

  dbData = {
    users: [defaultUser],
    projects: defaultProjects,
    tasks: defaultTasks,
    memories: defaultMemories,
    conversations: defaultConversations,
    activities: defaultActivities
  };
}

// Database query helpers
export const db = {
  users: {
    find: () => dbData.users,
    findById: (id: string) => dbData.users.find(u => u.id === id),
    findByEmail: (email: string) => dbData.users.find(u => u.email.toLowerCase() === email.toLowerCase()),
    create: (user: User) => {
      dbData.users.push(user);
      saveDB();
      return user;
    },
    update: (id: string, updates: Partial<User>) => {
      const idx = dbData.users.findIndex(u => u.id === id);
      if (idx !== -1) {
        dbData.users[idx] = { ...dbData.users[idx], ...updates, updatedAt: new Date().toISOString() };
        saveDB();
        return dbData.users[idx];
      }
      return null;
    }
  },
  projects: {
    findByUserId: (userId: string) => dbData.projects.filter(p => p.userId === userId),
    findById: (id: string) => dbData.projects.find(p => p.id === id),
    create: (project: Project) => {
      dbData.projects.unshift(project);
      saveDB();
      return project;
    },
    update: (id: string, updates: Partial<Project>) => {
      const idx = dbData.projects.findIndex(p => p.id === id);
      if (idx !== -1) {
        dbData.projects[idx] = { ...dbData.projects[idx], ...updates, updatedAt: new Date().toISOString() };
        saveDB();
        return dbData.projects[idx];
      }
      return null;
    },
    delete: (id: string) => {
      const idx = dbData.projects.findIndex(p => p.id === id);
      if (idx !== -1) {
        const deleted = dbData.projects.splice(idx, 1)[0];
        saveDB();
        return deleted;
      }
      return null;
    }
  },
  tasks: {
    findByUserId: (userId: string) => dbData.tasks.filter(t => t.userId === userId),
    findById: (id: string) => dbData.tasks.find(t => t.id === id),
    create: (task: Task) => {
      dbData.tasks.unshift(task);
      saveDB();
      return task;
    },
    update: (id: string, updates: Partial<Task>) => {
      const idx = dbData.tasks.findIndex(t => t.id === id);
      if (idx !== -1) {
        dbData.tasks[idx] = { ...dbData.tasks[idx], ...updates, updatedAt: new Date().toISOString() };
        saveDB();
        return dbData.tasks[idx];
      }
      return null;
    },
    delete: (id: string) => {
      const idx = dbData.tasks.findIndex(t => t.id === id);
      if (idx !== -1) {
        const deleted = dbData.tasks.splice(idx, 1)[0];
        saveDB();
        return deleted;
      }
      return null;
    }
  },
  memories: {
    findByUserId: (userId: string) => dbData.memories.filter(m => m.userId === userId),
    findById: (id: string) => dbData.memories.find(m => m.id === id),
    create: (memory: Memory) => {
      dbData.memories.unshift(memory);
      saveDB();
      return memory;
    },
    update: (id: string, updates: Partial<Memory>) => {
      const idx = dbData.memories.findIndex(m => m.id === id);
      if (idx !== -1) {
        dbData.memories[idx] = { ...dbData.memories[idx], ...updates, updatedAt: new Date().toISOString() };
        saveDB();
        return dbData.memories[idx];
      }
      return null;
    },
    delete: (id: string) => {
      const idx = dbData.memories.findIndex(m => m.id === id);
      if (idx !== -1) {
        const deleted = dbData.memories.splice(idx, 1)[0];
        saveDB();
        return deleted;
      }
      return null;
    }
  },
  conversations: {
    findByUserId: (userId: string) => dbData.conversations.filter(c => c.userId === userId),
    findById: (id: string) => dbData.conversations.find(c => c.id === id),
    create: (conversation: Conversation) => {
      dbData.conversations.unshift(conversation);
      saveDB();
      return conversation;
    },
    update: (id: string, updates: Partial<Conversation>) => {
      const idx = dbData.conversations.findIndex(c => c.id === id);
      if (idx !== -1) {
        dbData.conversations[idx] = { ...dbData.conversations[idx], ...updates, updatedAt: new Date().toISOString() };
        saveDB();
        return dbData.conversations[idx];
      }
      return null;
    },
    delete: (id: string) => {
      const idx = dbData.conversations.findIndex(c => c.id === id);
      if (idx !== -1) {
        const deleted = dbData.conversations.splice(idx, 1)[0];
        saveDB();
        return deleted;
      }
      return null;
    }
  },
  activities: {
    findByUserId: (userId: string) => dbData.activities.filter(a => a.userId === userId),
    create: (activity: Activity) => {
      dbData.activities.unshift(activity);
      // Keep most recent 50 activities
      if (dbData.activities.length > 50) {
        dbData.activities = dbData.activities.slice(0, 50);
      }
      saveDB();
      return activity;
    }
  },
  getStats: () => ({
    userCount: dbData.users.length,
    projectCount: dbData.projects.length,
    taskCount: dbData.tasks.length,
    memoryCount: dbData.memories.length,
    conversationCount: dbData.conversations.length,
    activityCount: dbData.activities.length,
    storageType: 'Persistent File Engine (data/db.json) + Mongoose Ready'
  })
};

// Initialize DB on module load
initDB();
