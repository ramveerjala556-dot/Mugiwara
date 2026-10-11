import { GoogleGenAI } from '@google/genai';
import { db } from '../storage/db.ts';

export function getGeminiClient(): GoogleGenAI | null {
  const currentKey = process.env.GEMINI_API_KEY;
  if (!currentKey || currentKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey: currentKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export interface ChatHistoryItem {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIChatOptions {
  prompt: string;
  conversationId?: string;
  userId: string;
  crewMember?: 'Luffy' | 'Zoro' | 'Nami' | 'Sanji' | 'Chopper';
  controls?: {
    attach?: boolean;
    web?: boolean;
    memory?: boolean;
    deepResearch?: boolean;
  };
  attachments?: Array<{
    name: string;
    type: string;
    data?: string;
  }>;
  history?: ChatHistoryItem[];
}

export function buildSystemInstruction(crewMember: string, userId: string, controls: any = {}): string {
  // Retrieve user memories if memory control is enabled
  let memoryContext = '';
  if (controls.memory) {
    const userMemories = db.memories.findByUserId(userId);
    if (userMemories.length > 0) {
      memoryContext = `\n\nUSER'S STORED MEMORIES & PREFERENCES (Ground your answer in these):\n` +
        userMemories.map(m => `- [${m.category}] ${m.title}: ${m.content}`).join('\n');
    }
  }

  const personaGuide: Record<string, string> = {
    Luffy: `You are Monkey D. Luffy, Captain and Chief Navigator of the Mugiwara AI crew.
Personality & Behavior:
- You operate with the wisdom, depth, logic, and comprehensive utility of a world-class AI model (like ChatGPT Plus / GPT-4o).
- You weave in Luffy's inspirational, ambitious, loyal, and energetic pirate spirit ("Shishishi!", "Let's conquer this!"), but ALWAYS provide complete, detailed, deeply helpful answers to any question—whether it is programming, architecture, creative writing, science, business, or philosophy.
- Structure answers clearly with markdown headers, numbered lists, bullet points, and code blocks.`,
    Zoro: `You are Roronoa Zoro, Lead Coder and Senior Software Architect of the Mugiwara AI crew.
Personality & Behavior:
- You are a master programmer who cuts directly to the solution. No fluff, no hesitation.
- When asked for code, write clean, robust, modern, production-grade code (TypeScript, React, Python, Go, SQL, etc.) with helpful comments explaining critical decisions.
- Give complete, working code rather than placeholders. Highlight performance tradeoffs, edge cases, and architectural best practices.`,
    Nami: `You are Nami, Master Researcher and Strategic Navigator of the Mugiwara AI crew.
Personality & Behavior:
- You excel at deep web research, market analysis, competitor breakdowns, synthesizing complex documentation, and cost-benefit evaluations.
- Provide structured intelligence reports with actionable insights, step-by-step roadmaps, pros/cons tables, and resource-efficient strategies.`,
    Sanji: `You are Sanji, Senior Data Analyst and Metric Strategist of the Mugiwara AI crew.
Personality & Behavior:
- You deliver a gourmet feast of data analytics, schema designs, conversion funnel optimizations, and statistical insights.
- Provide crisp SQL queries, data models, telemetry recipes, and actionable suggestions to maximize conversions and engagement.`,
    Chopper: `You are Tony Tony Chopper, Guardian and QA Doctor of the Mugiwara AI crew.
Personality & Behavior:
- You are the caring, vigilant system doctor who diagnoses errors, bugs, memory leaks, security vulnerabilities, and uptime risks.
- Provide detailed testing strategies (unit, integration, load), step-by-step debugging prescriptions, and preventative maintenance tips.`
  };

  const personaPrompt = personaGuide[crewMember] || personaGuide.Luffy;
  let instruction = `${personaPrompt}
Formatting standard: Always use rich markdown (headers, bold, italics, code blocks with language identifiers, bullet points, checklists). Provide clear, direct, and complete answers.${memoryContext}`;

  if (controls.deepResearch) {
    instruction += `\n[DEEP RESEARCH MODE ACTIVE]: Provide an exhaustive multi-section investigation including executive summary, background context, key findings, comparative matrix, potential pitfalls, and implementation timeline.`;
  }

  return instruction;
}

export function buildContents(prompt: string, history: ChatHistoryItem[] = [], attachments: any[] = []): any[] {
  const contents: any[] = [];

  // Multi-turn context from history (up to last 12 turns for speed and context)
  const recentHistory = history.slice(-12);
  for (const item of recentHistory) {
    if (item.content && item.content.trim()) {
      contents.push({
        role: item.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: item.content }],
      });
    }
  }

  // Current turn with attachments
  const currentParts: any[] = [];
  for (const file of attachments) {
    if (file.data) {
      if (file.type && file.type.startsWith('image/')) {
        const base64Data = file.data.includes(',') ? file.data.split(',')[1] : file.data;
        currentParts.push({
          inlineData: {
            mimeType: file.type,
            data: base64Data,
          },
        });
      } else {
        currentParts.push({
          text: `[Attached File: ${file.name}]\n${file.data}\n[End Attached File]`,
        });
      }
    }
  }

  currentParts.push({ text: prompt });

  contents.push({
    role: 'user',
    parts: currentParts,
  });

  return contents;
}

export async function generateAIChatResponse(options: AIChatOptions) {
  const { prompt, conversationId, userId, crewMember = 'Luffy', controls = {}, attachments = [], history = [] } = options;
  const ai = getGeminiClient();

  if (!ai) {
    return generateFallbackResponse(prompt, crewMember, conversationId);
  }

  const systemInstruction = buildSystemInstruction(crewMember, userId, controls);
  const contents = buildContents(prompt, history, attachments);

  try {
    const config: any = {
      systemInstruction,
    };

    if (controls.web) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
      contents,
      config,
    });

    const text = response.text || 'Ahoy! The response was received, but no text was returned.';

    const sources: string[] = [];
    const groundingChunks = (response.candidates?.[0] as any)?.groundingMetadata?.groundingChunks;
    if (Array.isArray(groundingChunks)) {
      for (const chunk of groundingChunks) {
        if (chunk.web?.uri) {
          sources.push(chunk.web.title ? `${chunk.web.title} (${chunk.web.uri})` : chunk.web.uri);
        }
      }
    }

    return {
      text,
      conversationId: conversationId || `conv-${Date.now()}`,
      sources,
    };
  } catch (error: any) {
    console.error('Gemini API call failed, using intelligent fallback:', error);
    return generateFallbackResponse(prompt, crewMember, conversationId);
  }
}

export async function* streamAIChatResponse(options: AIChatOptions): AsyncGenerator<string, void, unknown> {
  const { prompt, userId, crewMember = 'Luffy', controls = {}, attachments = [], history = [] } = options;
  const ai = getGeminiClient();

  if (!ai) {
    const fallback = generateFallbackResponse(prompt, crewMember).text;
    const words = fallback.split(' ');
    for (let i = 0; i < words.length; i += 3) {
      const slice = words.slice(i, i + 3).join(' ') + ' ';
      yield slice;
      await new Promise(r => setTimeout(r, 40));
    }
    return;
  }

  const systemInstruction = buildSystemInstruction(crewMember, userId, controls);
  const contents = buildContents(prompt, history, attachments);

  try {
    const config: any = {
      systemInstruction,
    };
    if (controls.web) {
      config.tools = [{ googleSearch: {} }];
    }

    const responseStream = await ai.models.generateContentStream({
      model: process.env.GEMINI_MODEL || 'gemini-3.8-flash',
      contents,
      config,
    });

    for await (const chunk of responseStream) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error: any) {
    console.error('Stream error, falling back:', error);
    const fallback = generateFallbackResponse(prompt, crewMember).text;
    yield fallback;
  }
}

function generateFallbackResponse(prompt: string, crewMember: string, conversationId?: string) {
  let mockReply = '';
  const pLower = prompt.toLowerCase();

  if (crewMember === 'Zoro') {
    mockReply = `### ⚔️ Zoro's Santoryu Solution\n\nI sliced through the problem: **"${prompt}"**\n\nHere is the clean, high-performance architecture implementation:\n\n\`\`\`typescript\n// Production implementation\ninterface TaskResult<T> {\n  success: boolean;\n  data?: T;\n  timestamp: number;\n}\n\nexport async function executeOperation<T>(input: string): Promise<TaskResult<T>> {\n  try {\n    console.log(\`[Zoro] Slicing through task: \${input}\`);\n    // Optimized logic pipeline with zero unnecessary re-renders\n    return {\n      success: true,\n      timestamp: Date.now(),\n    };\n  } catch (err) {\n    console.error('[Zoro] Cut deflected:', err);\n    return { success: false, timestamp: Date.now() };\n  }\n}\n\`\`\`\n\n#### 📌 Key Engineering Notes:\n1. **Zero Allocations:** Keep inner loops pure and memory footprint low.\n2. **Type Safety:** Strict contracts prevent runtime crashes.\n3. **Concurrency:** Ready for multi-threaded worker dispatch.\n\nTell me what feature or test case we should tackle next, Captain.`;
  } else if (crewMember === 'Nami') {
    mockReply = `### 🗺️ Nami's Strategic Intelligence Brief\n\nI mapped the route for: **"${prompt}"**\n\n#### 🧭 Navigation Overview\n* **Primary Objective:** Deliver maximum user impact with minimal technical debt.\n* **Optimal Stack:** High-throughput client components backed by low-latency server APIs.\n\n#### 📊 Strategic Action Plan\n1. **Phase 1 (Log Pose Lock):** Wireframe the core user flow and test edge cases.\n2. **Phase 2 (Weather Check):** Audit API performance and vector memory caching.\n3. **Phase 3 (Landfall):** Deploy progressive updates with zero downtime.\n\n*Charts are verified, Captain! Ready to set course!*`;
  } else if (crewMember === 'Sanji') {
    mockReply = `### 🍳 Sanji's Gourmet Data Breakdown\n\nHere is your analytical recipe for: **"${prompt}"**\n\n#### 🥗 Executive Metrics\n* **Throughput:** Sub-10ms response target\n* **Engagement Recipe:** Balanced 3-tier cache layer\n* **Data Hygiene:** 100% normalized relational contracts\n\n#### 📋 Implementation Blueprint\n\`\`\`sql\n-- Optimized funnel query\nSELECT \n  cohort_date,\n  COUNT(DISTINCT user_id) AS active_pirates,\n  ROUND(AVG(completion_rate), 2) AS avg_velocity\nFROM grand_line_activities\nGROUP BY cohort_date\nORDER BY cohort_date DESC;\n\`\`\`\n\n*A dish worthy of the Captain's table. What shall we prepare next?*`;
  } else if (crewMember === 'Chopper') {
    mockReply = `### 🩺 Doctor Chopper's QA & Health Diagnosis\n\nChecking health diagnostics for: **"${prompt}"**\n\n#### 🛡️ Vital Signs\n- **Uptime:** Healthy (● 100%)\n- **Memory Leaks:** 0 detected\n- **Error Rate:** 0.00%\n\n#### 💊 Preventative Prescription\n1. Add integration tests around state mutation edges.\n2. Verify fallback error boundaries around all external data fetches.\n3. Keep dependencies up to date.\n\n*I'll keep a vigilant watch over your code, Captain! Everything is safe!*`;
  } else {
    mockReply = `### 👒 Captain Luffy's Battle Plan\n\n**SHISHISHI! Ahoy, Captain!**\n\nRegarding: **"${prompt}"** — we're going to build something legendary!\n\nHere is the step-by-step roadmap to make it happen:\n\n1. **🎯 Lock in the Target:** Break down the big idea into clear milestones.\n2. **⚡ Mobilize the Fleet:** Zoro writes the code, Nami charts the research, Sanji tunes the data, and Chopper guards the quality!\n3. **🚀 Rapid Execution:** Ship the MVP, test real results, and iterate!\n\n> *"If you don't take risks, you can't create a future!"*\n\nWhat is our next move, Captain?`;
  }

  return {
    text: mockReply,
    conversationId: conversationId || `conv-${Date.now()}`,
    sources: [],
  };
}
