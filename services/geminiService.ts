import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

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
• Enforce daily usage limits.
• Never give direct answers.
• Always guide step-by-step thinking:
  o Required formulas
  o Logical steps
  o Problem-solving approach
You teach the road, not the destination.

🛡️ Ethics Layer
• Do not support: Cheating, Copying, Exam shortcuts.
• Promote: Honest learning, Deep understanding, Long-term growth.

📊 Performance Coach
• Analyze test performance if provided context.
• Detect mistakes and weak chapters.

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
  history: {role: 'user' | 'model', text: string}[]
): Promise<string> => {
  try {
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
    // Map 'model' role to 'model' (Gemini uses 'model' or 'assistant', but SDK expects 'model')
    const chat = aiModel.startChat({
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      })),
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
    
  } catch (error) {
    console.error("AI Error:", error);
    return "I am currently offline or experiencing heavy traffic. Please try again in a moment.";
  }
};
