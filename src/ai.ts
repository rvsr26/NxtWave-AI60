// AI Project Passport Generator
// Uses OpenAI API if VITE_OPENAI_API_KEY is configured, falls back to deterministic generator
import type { ProjectPassport } from './types';

interface PassportInput {
  interest: string;
  experience: string;
  goal: string;
  branch?: string;
  domain?: string;
}

// ─── Deterministic fallback ──────────────────────────────────────────────────
const projectDatabase: Record<string, Record<string, Partial<ProjectPassport>>> = {
  Web: {
    Beginner: {
      projectName: 'AI Study Assistant',
      description: 'A browser-based AI chatbot that helps students understand study material, summarize notes, and answer questions in simple language.',
      skills: ['Prompt Engineering', 'REST API Integration', 'HTML/CSS/JS Basics', 'Async JavaScript'],
      relevance: 'AI-powered learning tools are in high demand across EdTech. This project demonstrates real AI API usage and creates immediate value for students like you.',
      techStack: ['HTML/CSS/JavaScript', 'OpenAI API', 'Netlify (free deployment)'],
      workshopBuild: 'A working chat interface that uses an AI API to answer questions about a topic you choose — fully functional in 60 minutes.',
      nextStep: 'Add memory to remember conversation context, then style it as your personal AI tutor.',
    },
    Intermediate: {
      projectName: 'AI Resume Analyzer',
      description: 'Upload a resume, paste a job description, and get an AI-powered match score with specific improvement suggestions.',
      skills: ['File Parsing', 'Prompt Engineering', 'React Components', 'AI API Integration'],
      relevance: 'Resume optimization is a real pain point for final-year students. This project solves a real problem while demonstrating your AI skills.',
      techStack: ['React', 'OpenAI API', 'Vercel', 'Tailwind CSS'],
      workshopBuild: 'A functional resume analyzer that can parse text, call an AI API, and return structured improvement feedback.',
      nextStep: 'Add a cover letter generator and LinkedIn summary writer.',
    },
    Advanced: {
      projectName: 'AI Content Workflow Engine',
      description: 'A pipeline that takes a topic, generates an outline, writes sections, and produces social media posts — all with a single prompt.',
      skills: ['LLM Chaining', 'Prompt Orchestration', 'State Management', 'React Architecture'],
      relevance: 'Multi-step AI pipelines are the future of content production. Building one demonstrates advanced AI engineering skills.',
      techStack: ['React', 'TypeScript', 'OpenAI API', 'Zustand', 'Vercel'],
      workshopBuild: 'A working content pipeline with 3 chained AI steps: outline → draft → social snippets.',
      nextStep: 'Add streaming responses, revision history, and export to Notion.',
    },
  },
  Mobile: {
    Beginner: {
      projectName: 'AI Daily Planner',
      description: 'A simple mobile-first web app that takes your tasks and priorities, then uses AI to create an optimized daily schedule.',
      skills: ['Mobile-First Design', 'Local Storage', 'AI API Basics', 'UX Design'],
      relevance: 'Productivity tools have massive user bases. A well-designed AI planner can attract early users and become a real product.',
      techStack: ['React PWA', 'OpenAI API', 'Tailwind CSS', 'Vercel'],
      workshopBuild: 'A working planner that accepts tasks and outputs a time-blocked schedule with AI explanations.',
      nextStep: 'Add Google Calendar integration and recurring task learning.',
    },
    Intermediate: {
      projectName: 'AI Flashcard Generator',
      description: 'Paste any study text and instantly generate spaced-repetition flashcards with AI. Study smarter, not harder.',
      skills: ['Text Chunking', 'AI Prompt Design', 'React Native Web', 'Data Persistence'],
      relevance: 'Learning tools built on spaced repetition (like Anki) have millions of users. An AI-powered version is a natural evolution.',
      techStack: ['React', 'OpenAI API', 'IndexedDB', 'Tailwind CSS'],
      workshopBuild: 'A working flashcard generator that creates Q&A pairs from any pasted text using AI.',
      nextStep: 'Add spaced repetition algorithm, progress tracking, and PDF upload.',
    },
    Advanced: {
      projectName: 'AI Language Learning Companion',
      description: 'An AI conversational partner that corrects your grammar, explains idioms, and adapts difficulty to your level in real time.',
      skills: ['Adaptive AI Systems', 'Streaming API', 'Real-time Feedback', 'State Machines'],
      relevance: 'Language learning apps like Duolingo have 500M+ users. An AI-powered conversation tutor is a genuinely new product category.',
      techStack: ['React', 'OpenAI API (streaming)', 'Zustand', 'Tailwind CSS'],
      workshopBuild: 'A real-time conversation interface with grammar correction and explanation features.',
      nextStep: 'Add voice input, progress tracking, and adaptive difficulty.',
    },
  },
  Data: {
    Beginner: {
      projectName: 'AI Data Story Generator',
      description: 'Upload a CSV or paste data, and get an AI-generated narrative summary that explains trends, outliers, and insights in plain English.',
      skills: ['CSV Parsing', 'Data Analysis', 'AI Summarization', 'Visualization Basics'],
      relevance: 'Data storytelling is one of the most valuable skills in analytics. This project bridges raw data and executive-level communication.',
      techStack: ['Python / Streamlit', 'OpenAI API', 'Pandas', 'Streamlit Cloud'],
      workshopBuild: 'A working app that parses a CSV and generates a plain-English summary using AI.',
      nextStep: 'Add chart generation, executive summary export, and multi-table joins.',
    },
    Intermediate: {
      projectName: 'AI SQL Query Assistant',
      description: 'Describe a data question in plain English and get the SQL query. Then get an AI explanation of what the query does and why.',
      skills: ['Natural Language to SQL', 'Database Schema Design', 'Prompt Engineering', 'Python'],
      relevance: 'Text-to-SQL is a rapidly growing AI category used in enterprise analytics tools, BI platforms, and data products.',
      techStack: ['Python / FastAPI', 'OpenAI API', 'SQLite', 'React Frontend'],
      workshopBuild: 'A working text-to-SQL tool with schema awareness and query explanation.',
      nextStep: 'Add schema inference, query history, and export to data pipelines.',
    },
    Advanced: {
      projectName: 'AI Market Intelligence Dashboard',
      description: 'Automatically pulls product reviews, sentiment-analyzes them with AI, and visualizes trends, pain points, and opportunities.',
      skills: ['Web Scraping', 'Sentiment Analysis', 'Data Pipeline Design', 'NLP'],
      relevance: 'Competitive intelligence platforms charge thousands per month. An AI-powered version democratizes market research for startups.',
      techStack: ['Python', 'OpenAI API', 'Pandas', 'Plotly', 'FastAPI'],
      workshopBuild: 'A pipeline that takes product reviews and outputs a sentiment trend chart with AI-generated insights.',
      nextStep: 'Add competitor comparison, weekly reports, and Slack integration.',
    },
  },
  Education: {
    Beginner: {
      projectName: 'AI Quiz Generator',
      description: 'Paste any text — a chapter, a Wikipedia page, your notes — and get a multiple-choice quiz with explanations, generated by AI.',
      skills: ['Text Processing', 'AI Prompt Design', 'JSON Parsing', 'React'],
      relevance: 'Test preparation tools serve millions of students. An AI quiz generator that works on any content has immediate, real-world value.',
      techStack: ['React', 'OpenAI API', 'Tailwind CSS', 'Vercel'],
      workshopBuild: 'A working quiz generator that creates 5 MCQs with explanations from any pasted text.',
      nextStep: 'Add difficulty levels, topic tagging, leaderboards, and export to Anki.',
    },
    Intermediate: {
      projectName: 'AI Doubt Resolver',
      description: 'A subject-specific AI tutor that explains concepts at the student\'s level, uses analogies, and detects misunderstandings.',
      skills: ['Conversational AI', 'Context Management', 'Subject Prompting', 'React'],
      relevance: 'Personalized tutoring at scale is an unsolved problem in education. An AI that adapts to each student\'s misconceptions is genuinely valuable.',
      techStack: ['React', 'OpenAI API', 'Local Storage', 'Tailwind CSS'],
      workshopBuild: 'A working doubt resolver for one subject (e.g., Data Structures) that explains in multiple ways until the concept clicks.',
      nextStep: 'Add subject switching, learning analytics, and integration with course platforms.',
    },
    Advanced: {
      projectName: 'AI Curriculum Designer',
      description: 'Input a skill goal and a timeline, and get a personalized learning curriculum with resources, projects, and milestones generated by AI.',
      skills: ['AI Planning Systems', 'Knowledge Graph', 'React Architecture', 'API Orchestration'],
      relevance: 'Personalized learning path generation is the holy grail of EdTech. Building a working prototype demonstrates advanced AI product thinking.',
      techStack: ['React', 'TypeScript', 'OpenAI API', 'React Flow (for graphs)'],
      workshopBuild: 'A working curriculum generator that outputs a week-by-week learning plan for a chosen skill.',
      nextStep: 'Add resource curation, progress tracking, and adaptive plan adjustment.',
    },
  },
  Productivity: {
    Beginner: {
      projectName: 'AI Meeting Summarizer',
      description: 'Paste a meeting transcript or notes, and get a structured summary with action items, decisions, and next steps — formatted and ready to share.',
      skills: ['Text Summarization', 'Structured Output', 'AI API Basics', 'React'],
      relevance: 'Knowledge workers spend 30% of their time in meetings. AI summarization tools that reduce this overhead are in huge demand.',
      techStack: ['React', 'OpenAI API', 'Clipboard API', 'Vercel'],
      workshopBuild: 'A working summarizer that converts raw meeting text into a structured summary with action items.',
      nextStep: 'Add Notion export, recurring meeting templates, and team sharing.',
    },
    Intermediate: {
      projectName: 'AI Email Composer',
      description: 'Describe what you want to say in bullet points, and get a polished, professional email drafted by AI in your preferred tone and length.',
      skills: ['Tone Control', 'Few-shot Prompting', 'React Forms', 'UX Design'],
      relevance: 'Email remains the primary communication channel in business. An AI composer that respects tone and context is immediately useful.',
      techStack: ['React', 'OpenAI API', 'Tailwind CSS', 'Gmail API (optional)'],
      workshopBuild: 'A working email composer with tone selection (formal, friendly, assertive) and copy-to-clipboard.',
      nextStep: 'Add Gmail integration, email thread analysis, and scheduled sending.',
    },
    Advanced: {
      projectName: 'AI Project Manager',
      description: 'Describe a project goal, and get a complete breakdown: tasks, timelines, dependencies, risk flags, and weekly check-in templates.',
      skills: ['Project Decomposition', 'AI Planning', 'React State Management', 'Data Modeling'],
      relevance: 'AI-powered project management is reshaping how teams plan. A working prototype shows real understanding of AI + product integration.',
      techStack: ['React', 'TypeScript', 'OpenAI API', 'DnD-Kit', 'Vercel'],
      workshopBuild: 'A working project planner that generates a task breakdown with timelines from a single goal statement.',
      nextStep: 'Add team assignment, Gantt chart view, and Jira/Linear integration.',
    },
  },
  Finance: {
    Beginner: {
      projectName: 'AI Budget Advisor',
      description: 'Input your monthly income and expenses, and get personalized saving advice, budget allocation recommendations, and financial goals from AI.',
      skills: ['Number Processing', 'AI Recommendations', 'Data Visualization', 'React Forms'],
      relevance: 'Personal finance management is a massive market (Mint, YNAB). An AI-powered version with personalized advice adds real value.',
      techStack: ['React', 'OpenAI API', 'Chart.js', 'Local Storage'],
      workshopBuild: 'A working budget analyzer with AI-generated saving tips and expense breakdown chart.',
      nextStep: 'Add bank statement parsing, investment recommendations, and tax tips.',
    },
    Intermediate: {
      projectName: 'AI Stock News Analyst',
      description: 'Input a stock ticker, and get an AI-analyzed summary of recent news, sentiment score, key risks, and potential catalysts.',
      skills: ['News API Integration', 'Sentiment Analysis', 'AI Summarization', 'React'],
      relevance: 'Retail investors struggle with information overload. An AI news analyst that extracts signal from noise has real product value.',
      techStack: ['React', 'OpenAI API', 'News API', 'Recharts', 'Vercel'],
      workshopBuild: 'A working news analyzer for any stock with AI-generated sentiment summary and risk flags.',
      nextStep: 'Add portfolio tracking, price alerts, and comparative analysis.',
    },
    Advanced: {
      projectName: 'AI Financial Report Decoder',
      description: 'Upload a company annual report PDF, and get an AI-generated executive summary with key metrics, risks, and investment signals.',
      skills: ['PDF Processing', 'RAG (Retrieval Augmented Generation)', 'Document AI', 'React'],
      relevance: 'Financial report analysis is time-intensive. An AI tool that extracts key insights from 200-page reports is genuinely disruptive.',
      techStack: ['Python / FastAPI', 'OpenAI API', 'LangChain', 'React Frontend'],
      workshopBuild: 'A working report analyzer that extracts key financial metrics and generates an investment thesis from an uploaded PDF.',
      nextStep: 'Add multi-report comparison, historical trend analysis, and portfolio integration.',
    },
  },
  'Developer Tools': {
    Beginner: {
      projectName: 'AI Code Explainer',
      description: 'Paste any code snippet and get a line-by-line explanation in plain English, including what it does, why it works, and potential issues.',
      skills: ['Code Analysis', 'Technical Writing', 'Syntax Highlighting', 'React'],
      relevance: 'Code understanding is the bottleneck for most junior developers. An AI explainer that teaches as it explains is genuinely valuable for learning.',
      techStack: ['React', 'OpenAI API', 'Prism.js', 'Tailwind CSS'],
      workshopBuild: 'A working code explainer with syntax highlighting, line-by-line annotations, and potential bug detection.',
      nextStep: 'Add multiple language support, refactoring suggestions, and unit test generation.',
    },
    Intermediate: {
      projectName: 'AI API Documentation Generator',
      description: 'Paste your backend code or API routes, and get automatically generated documentation in OpenAPI format with example requests and responses.',
      skills: ['AST Parsing', 'OpenAPI Spec', 'AI Generation', 'React'],
      relevance: 'API documentation is universally underprioritized. An AI tool that generates docs from code removes a major developer pain point.',
      techStack: ['React', 'OpenAI API', 'Monaco Editor', 'Vercel'],
      workshopBuild: 'A working documentation generator that converts Express.js routes to OpenAPI YAML with example payloads.',
      nextStep: 'Add Postman export, interactive try-it UI, and GitHub integration.',
    },
    Advanced: {
      projectName: 'AI Code Review Assistant',
      description: 'Submit a pull request diff or code file and get a structured code review with issues, suggestions, security flags, and a quality score.',
      skills: ['Code Analysis', 'Security Awareness', 'Structured AI Output', 'GitHub API'],
      relevance: 'Code review is a critical but time-intensive process. AI-powered review tools are increasingly used in professional teams.',
      techStack: ['React', 'TypeScript', 'OpenAI API', 'GitHub API', 'Diff Viewer'],
      workshopBuild: 'A working code reviewer that analyzes a code diff and returns categorized issues with severity levels.',
      nextStep: 'Add GitHub PR integration, team review workflows, and historical quality tracking.',
    },
  },
  Other: {
    Beginner: {
      projectName: 'AI Idea Validator',
      description: 'Describe your startup idea, and get an AI analysis of market size, competition, target users, risks, and a go-to-market starting point.',
      skills: ['Structured Prompting', 'Business Analysis', 'React Forms', 'JSON Parsing'],
      relevance: 'Idea validation is the first step for every builder. An AI that gives structured feedback in minutes saves weeks of research.',
      techStack: ['React', 'OpenAI API', 'Tailwind CSS', 'Vercel'],
      workshopBuild: 'A working idea validator that returns a structured business analysis from a 3-sentence idea description.',
      nextStep: 'Add competitor discovery, user persona generation, and pitch deck outline.',
    },
    Intermediate: {
      projectName: 'AI Social Media Content Engine',
      description: 'Input a topic, target audience, and tone, and get a week\'s worth of social media posts across LinkedIn, Twitter, and Instagram.',
      skills: ['Multi-platform Content', 'Tone Matching', 'Content Strategy', 'React'],
      relevance: 'Content creation is one of the most time-intensive tasks for founders and creators. AI automation tools for creators are a massive market.',
      techStack: ['React', 'OpenAI API', 'Clipboard API', 'Tailwind CSS'],
      workshopBuild: 'A working content generator that produces 5 posts per platform from a single topic input.',
      nextStep: 'Add scheduling integration, image prompt generation, and performance analytics.',
    },
    Advanced: {
      projectName: 'AI Customer Support Agent',
      description: 'Train a conversational AI on your FAQ/docs, then deploy it as a support widget that answers customer questions 24/7 with escalation logic.',
      skills: ['RAG Architecture', 'Vector Databases', 'Prompt Engineering', 'Full-stack React'],
      relevance: 'Customer support automation is a multi-billion-dollar market. Building a working RAG-based support agent demonstrates advanced AI engineering.',
      techStack: ['React', 'OpenAI API', 'Supabase Vector', 'FastAPI', 'Vercel'],
      workshopBuild: 'A working FAQ chatbot with 10 seeded Q&As and an escalation-to-human flow.',
      nextStep: 'Add live chat escalation, multi-language support, and analytics dashboard.',
    },
  },
};

function getDefaultResumeBullet(projectName: string, techStack: string[]): string {
  const stack = techStack.slice(0, 3).join(', ');
  return `Architected and deployed "${projectName}", an automated AI-driven solution using ${stack}, integrating prompt chaining and responsive UI for real-time inference.`;
}

function getDefaultInterviewPoint(projectName: string, branch?: string, techStack?: string[]): string {
  const stack = techStack && techStack.length > 0 ? techStack.slice(0, 2).join(' and ') : 'AI APIs';
  return `“In the NxtWave AI60 build sprint, I shipped ${projectName} using ${stack}, focusing on low-latency prompt integration, structured output validation, and practical utility for ${branch || 'engineering'} workflows.”`;
}

function getDefaultRoadmap(): { time: string; task: string }[] {
  return [
    { time: '00-15m', task: 'Architecture & API Key setup, baseline prompt design' },
    { time: '15-35m', task: 'Frontend interface assembly & user input parsing' },
    { time: '35-50m', task: 'AI API integration, streaming responses & error handling' },
    { time: '50-60m', task: 'Local verification, edge-case testing & 1-click cloud deployment' },
  ];
}

function generateDeterministicPassport(input: PassportInput): Partial<ProjectPassport> {
  const interest = input.interest || 'Web';
  const experience = input.experience || 'Beginner';

  const interestMap = projectDatabase[interest] || projectDatabase['Web'];
  const experienceMap = interestMap[experience] || interestMap['Beginner'];

  // Customize based on goal
  const goalLower = input.goal.toLowerCase();
  let customName = experienceMap.projectName || 'AI Project';
  let customDesc = experienceMap.description || '';

  if (goalLower.includes('interview') || goalLower.includes('job') || goalLower.includes('career')) {
    customDesc = `${customDesc} Designed to directly address recruiter questions during technical and problem-solving rounds.`;
  }
  if (goalLower.includes('startup') || goalLower.includes('product') || goalLower.includes('business')) {
    customDesc = `${customDesc} High-utility MVP architecture ready to gather pilot user feedback immediately.`;
  }

  const stack = experienceMap.techStack || ['React', 'OpenAI API', 'Tailwind CSS'];
  const resumeBullet = getDefaultResumeBullet(customName, stack);
  const interviewTalkingPoint = getDefaultInterviewPoint(customName, input.branch, stack);
  const buildRoadmap = getDefaultRoadmap();

  return {
    ...experienceMap,
    projectName: customName,
    description: customDesc,
    resumeBullet,
    interviewTalkingPoint,
    branch: input.branch || 'Computer Science',
    domain: input.domain || input.interest,
    buildRoadmap,
  };
}

async function generateWithOpenAI(input: PassportInput): Promise<Partial<ProjectPassport>> {
  const apiKey = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_OPENAI_API_KEY : undefined;
  if (!apiKey) throw new Error('No OpenAI API key');

  const prompt = `You are a principal growth engineer helping a 2027 graduating batch engineering student build their first AI project.

Student profile:
- Branch: ${input.branch || 'Computer Science'}
- Interest area: ${input.interest}
- Experience level: ${input.experience}
- Preferred domain: ${input.domain || input.interest}
- What they want to build: "${input.goal}"

Generate a personalized AI Project Passport JSON:
{
  "projectName": "Engaging descriptive title",
  "description": "One sentence summary highlighting user utility",
  "difficulty": "${input.experience}",
  "skills": ["Skill 1", "Skill 2", "Skill 3", "Skill 4"],
  "relevance": "Why this specific project builds tangible credibility for 2027 placement candidates",
  "techStack": ["Tool 1", "Tool 2", "Tool 3"],
  "workshopBuild": "Concrete 60-minute MVP scope",
  "nextStep": "Immediate post-workshop extension",
  "resumeBullet": "Action-oriented bullet point for their resume (Action + Tech + Impact)",
  "interviewTalkingPoint": "A concise 2-sentence talking point the student can say to a recruiter explaining their architecture and design tradeoff",
  "buildRoadmap": [
    {"time": "00-15m", "task": "..."},
    {"time": "15-35m", "task": "..."},
    {"time": "35-50m", "task": "..."},
    {"time": "50-60m", "task": "..."}
  ]
}

Rules:
- Realistic prototype scope for 60 minutes
- Must include tangible resume bullet point, interview talking point, and 4-phase build roadmap
- Do not mention specific corporate employer names
- Respond ONLY with valid JSON.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 650,
    }),
  });

  if (!response.ok) throw new Error('OpenAI API error');
  const data = await response.json();
  const text = data.choices[0]?.message?.content || '{}';
  return JSON.parse(text);
}

function getWhyReasons(interest: string, experience: string, goal: string): string[] {
  return [
    `Demonstrates real-world AI integration in ${interest} for modern engineering roles.`,
    `Calibrated for ${experience} skill level to ensure you ship a working demo in 60 minutes without getting blocked.`,
    `Directly aligns with your goal ("${goal.slice(0, 45)}${goal.length > 45 ? '...' : ''}") so you can explain architectural decisions in interviews.`,
  ];
}

export async function generateProjectPassport(input: PassportInput): Promise<ProjectPassport> {
  let partial: Partial<ProjectPassport>;

  try {
    partial = await generateWithOpenAI(input);
  } catch {
    partial = generateDeterministicPassport(input);
  }

  const stack = partial.techStack || ['JavaScript', 'OpenAI API', 'Tailwind CSS'];
  const pName = partial.projectName || 'AI Automation Agent';

  const passport: ProjectPassport = {
    id: `pp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    projectName: pName,
    description: partial.description || 'An AI-powered application designed for rapid 60-minute build and deployment.',
    difficulty: (partial.difficulty as ProjectPassport['difficulty']) || (input.experience as ProjectPassport['difficulty']) || 'Beginner',
    skills: partial.skills || ['AI API Integration', 'Prompt Engineering', 'Frontend UI', 'API Security'],
    relevance: partial.relevance || 'Generative AI projects demonstrate active modern engineering capabilities for 2027 placements.',
    techStack: stack,
    workshopBuild: partial.workshopBuild || 'A functional prototype with real API calls and intuitive interface.',
    nextStep: partial.nextStep || 'Add persistence layer and deploy to public URL to showcase on LinkedIn.',
    resumeBullet: partial.resumeBullet || getDefaultResumeBullet(pName, stack),
    interviewTalkingPoint: partial.interviewTalkingPoint || getDefaultInterviewPoint(pName, input.branch, stack),
    branch: input.branch || 'Computer Science',
    domain: input.domain || input.interest,
    buildRoadmap: partial.buildRoadmap || getDefaultRoadmap(),
    whyReasons: getWhyReasons(input.interest, input.experience, input.goal),
    interest: input.interest,
    experience: input.experience,
    goal: input.goal,
    generatedAt: new Date().toISOString(),
  };

  return passport;
}

// 3 Growth Hypotheses Generator (Career, Project, Community angles)
export interface GrowthHypothesisVariant {
  angle: 'Career Angle' | 'Project Angle' | 'Community Angle';
  hypothesis: string;
  headline: string;
  body: string;
  rationale: string;
}

const hypothesisFallbacks: GrowthHypothesisVariant[] = [
  {
    angle: 'Career Angle',
    hypothesis: 'Framing around 2027 campus placements and tangible resume artifacts converts placement-focused seniors better than technical curiosity.',
    headline: 'Build an AI project recruiters will actually ask you about in interviews.',
    body: 'Don\'t just list languages on your resume. Build and ship an AI application in 60 minutes with an verified GitHub starter kit.',
    rationale: 'Placement urgency is highest among final-year students facing an evolving tech job market.',
  },
  {
    angle: 'Project Angle',
    hypothesis: 'Showing a personalized project specification before asking for workshop registration lowers commitment friction.',
    headline: 'What AI project could YOU build in 60 minutes?',
    body: 'Take 60 seconds to personalize your AI Project Passport. Get your architecture blueprint, then join the live sprint to code it.',
    rationale: 'Value-first framing replaces passive webinar resistance with personal project ownership.',
  },
  {
    angle: 'Community Angle',
    hypothesis: 'Campus-wide peer leaderboards drive organic social distribution faster than direct institutional broadcasts.',
    headline: 'Can your college top the AI60 Campus League? 🏆',
    body: 'Your classmates are locking in their 60-minute AI projects. Join your campus cohort and push your college up the ranks.',
    rationale: 'Engineering students have strong college identity; inter-college competition sparks peer-to-peer forwarding.',
  },
];


export async function generateGrowthHypotheses(
  audience: string,
  channel: string,
  goal: string
): Promise<GrowthHypothesisVariant[]> {
  const apiKey = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.VITE_OPENAI_API_KEY : undefined;

  if (apiKey) {
    try {
      const prompt = `You are a principal growth strategist generating 3 testable growth hypotheses for a free 60-minute AI workshop campaign.
Audience: ${audience}
Channel: ${channel}
Goal: ${goal}

Generate exactly 3 growth hypotheses corresponding to:
1. "Career Angle" (placement, resume, recruiter credibility)
2. "Project Angle" (hands-on ownership, personalized project passport)
3. "Community Angle" (campus peer league, batchmate cohorts)

Return a JSON array of 3 objects:
[
  {
    "angle": "Career Angle",
    "hypothesis": "Testable growth hypothesis...",
    "headline": "Under 15 words headline",
    "body": "Under 35 words campaign message",
    "rationale": "Strategic reasoning based on student psychology"
  },
  ...
]
Respond ONLY with the JSON array.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 600,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const result = JSON.parse(data.choices[0]?.message?.content || '[]');
        if (Array.isArray(result) && result.length === 3) return result;
      }
    } catch {
      // Fall through to deterministic
    }
  }

  // Deterministic fallback with the 3 distinct angles
  return hypothesisFallbacks;
}

