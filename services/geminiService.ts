import { GoogleGenerativeAI, GenerativeModel, Part } from "@google/generative-ai";

// The System Prompt defined in the requirements
const SYSTEM_INSTRUCTION = `
AI SYSTEM PROMPT: “Ethical Smart Learning Platform Brain”
You are an ethical, study-focused AI powering a full-scale digital education platform for Bangladeshi students.
You are not a shortcut machine.
You are a mentor, coach, and guide.
Your mission: teach students how to think, not what to copy.

🎯 CORE PURPOSE
Build a controlled, distraction-free, structured learning ecosystem that replaces chaos with clarity and pressure with progress.

🔟 SMART AI LEARNING SYSTEM (YOU)
🧠 Guided AI Mentor
• Respond only to study-related queries.
• Enforce daily usage limits (remind them if they seem addicted, though the UI handles the hard limit).
• Never give direct answers.
• Always guide step-by-step thinking:
  o Required formulas
  o Logical steps
  o Problem-solving approach
• You teach the road, not the destination.
• If an image is provided (e.g., a math problem), analyze it and explain the CONCEPTS and STEPS. Do not solve it directly.

🛡️ Ethics Layer
• Do not support: Cheating, Copying, Exam shortcuts.
• Promote: Honest learning, Deep understanding, Long-term growth.

📊 Performance Coach
• Analyze test performance if provided context.
• Detect mistakes and weak chapters.
• Suggest specific topics to review based on mistakes.

🧭 Smart Onboarding Guide
• Guide new students on how to use the platform:
  o How to find classes
  o How to take exams
  o How to download content

🔗 Intelligent Class Finder
• If a student asks "Where is my Physics class?", provide a direct link if you have context, or guide them to the 'Classroom' section.

LANGUAGE PREFERENCE:
• Explain complex concepts in simple Bangla (Bengali) mixed with English technical terms (Banglish style is okay if natural, but formal Bangla is preferred for explanations).
• Keep the tone encouraging and professional.

If a student asks "What is the answer to 5x + 3 = 13", DO NOT say "x=2".
Instead, ask: "What is the first step to isolate x? What should we do with the +3?"
`;

let genAI: GoogleGenerativeAI | null = null;
let model: GenerativeModel | null = null;

const getModel = () => {
  if (!model) {
    // Read API key from Vite env (supports both VITE_API_KEY and GEMINI_API_KEY)
    const apiKey = import.meta.env.VITE_API_KEY || import.meta.env.GEMINI_API_KEY;

    if (!apiKey) {
        console.warn("API_KEY is missing. AI features will run in simulation mode.");
        return null;
    }
    
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: SYSTEM_INSTRUCTION
    });
  }
  return model;
};

export const sendMessageToAI = async (
  message: string, 
  history: {role: 'user' | 'model', text: string}[],
  image?: string, // Base64 image string
  context?: string // Additional context about user/app
): Promise<string> => {
  const pickMime = (dataUrlOrBase64: string) => {
    const head = dataUrlOrBase64.split(';')[0];
    if (head.startsWith('data:image/')) {
      const mt = head.replace('data:', '');
      return mt;
    }
    return 'image/jpeg';
  };
  try {
    // Prefer dev-time proxy to avoid domain restrictions
    const parts: Part[] = [];
    parts.push({ text: SYSTEM_INSTRUCTION });
    if (context) {
      parts.push({ text: `[CONTEXT]: ${context}\n\n[USER QUERY]: ` });
    }
    parts.push({ text: message });
    if (image) {
      const base64Data = image.split(',')[1] || image;
      const mimeType = pickMime(image);
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType,
        },
      });
    }
    if (import.meta.env.DEV) {
      const resp = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history, parts, model: 'gemini-1.5-flash' }),
      });
      const data = await resp.json();
      if (resp.ok && data?.text) return data.text;
    }
    const aiModel = getModel();
    
    // Fallback for Demo if no key is present
    if (!aiModel) {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Fake delay
      
      const lowerMsg = message.toLowerCase();
      if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
        return "👋 Greetings, Scholar! I am your AI Mentor. I'm here to guide you through complex topics. What are we studying today? (Physics, Math, Biology?) [Demo Mode]";
      }
      if (lowerMsg.includes('physics')) {
        return "⚛️ Physics is fascinating! Remember to start by listing your known variables. Are we dealing with kinematics or forces today? [Demo Mode]";
      }
      if (lowerMsg.includes('math') || lowerMsg.includes('calculus') || lowerMsg.includes('algebra')) {
        return "📐 Mathematics requires practice. Don't rush to the answer. What formula do you think applies to this problem? [Demo Mode]";
      }
      if (lowerMsg.includes('chemistry')) {
        return "🧪 Chemistry is all about interactions. Are you balancing an equation or looking at organic structures? [Demo Mode]";
      }
      
      return "✨ (Demo Simulation) That's a thought-provoking question. To help you best, could you break down what you've tried so far? I want to guide your thinking process, not just give the answer. [Note: Connect a valid API Key to get real AI responses]";
    }
    
    // Construct the chat history for context
    const chat = aiModel.startChat({
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      })),
      generationConfig: {
        maxOutputTokens: 600,
        temperature: 0.6,
      },
    });

    const maxAttempts = 3;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const result = await chat.sendMessage(parts);
        const response = await result.response;
        return response.text();
      } catch (err) {
        const msg = (err as any)?.message || '';
        const status = (err as any)?.status || (err as any)?.cause?.status || (err as any)?.response?.status;
        const isRetryable = status === 429 || (status && status >= 500) || /quota|rate|limit/i.test(msg);
        if (attempt < maxAttempts - 1 && isRetryable) {
          const delay = 1000 * Math.pow(2, attempt) + Math.floor(Math.random() * 300);
          await new Promise(r => setTimeout(r, delay));
          continue;
        }
        throw err;
      }
    }
    
  } catch (error) {
    const msg = (error as any)?.message || '';
    const status = (error as any)?.status || (error as any)?.cause?.status || (error as any)?.response?.status;
    if (status === 401 || /unauthorized|permission|api key|invalid/i.test(msg)) {
      return "Authentication issue. Check API key and allowed domains in AI Studio.";
    }
    if (status === 403) {
      return "Access blocked. Verify AI Studio project access or domain restrictions.";
    }
    if (status === 429 || /quota|rate/i.test(msg)) {
      // Fallback to demo mode response when rate limited
      const lowerMsg = message.toLowerCase();
      if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
        return "👋 Greetings, Scholar! I am your AI Mentor. I'm here to guide you through complex topics. What are we studying today? (Physics, Math, Biology?) [Rate Limited - Demo Mode]";
      }
      if (lowerMsg.includes('physics')) {
        return "⚛️ Physics is fascinating! Remember to start by listing your known variables. Are we dealing with kinematics or forces today? [Rate Limited - Demo Mode]";
      }
      if (lowerMsg.includes('math') || lowerMsg.includes('calculus') || lowerMsg.includes('algebra')) {
        return "📐 Mathematics requires practice. Don't rush to the answer. What formula do you think applies to this problem? [Rate Limited - Demo Mode]";
      }
      if (lowerMsg.includes('chemistry')) {
        return "🧪 Chemistry is all about interactions. Are you balancing an equation or looking at organic structures? [Rate Limited - Demo Mode]";
      }
      return "✨ That's a thought-provoking question. To help you best, could you break down what you've tried so far? I want to guide your thinking process, not just give the answer. [Rate Limited - Demo Mode]";
    }
    return "I am currently offline or experiencing heavy traffic. Please try again in a moment.";
  }
};
