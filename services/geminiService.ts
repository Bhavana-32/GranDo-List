
import { GoogleGenAI, Type } from "@google/genai";
import { Todo } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getTodaysDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const todoSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: {
        type: Type.STRING,
        description: "A unique identifier for the to-do item, preferably a timestamp or random string.",
      },
      text: {
        type: Type.STRING,
        description: "The content of the to-do item.",
      },
      completed: {
        type: Type.BOOLEAN,
        description: "The completion status of the to-do item, should always be false initially.",
      },
      dueDate: {
        type: Type.STRING,
        description: "The due date in YYYY-MM-DD format. If not specified in the user's prompt, default to today's date.",
      },
    },
    required: ["id", "text", "completed", "dueDate"],
  },
};

const parseJsonResponse = (jsonString: string): Todo[] => {
    try {
        const cleanedJsonString = jsonString.replace(/```json|```/g, "").trim();
        const data = JSON.parse(cleanedJsonString);
        if (Array.isArray(data)) {
            return data.filter(item => item.id && item.text);
        }
        return [];
    } catch (error) {
        console.error("Failed to parse JSON response:", error);
        return [];
    }
};

export const processTextPrompt = async (prompt: string): Promise<Todo[]> => {
  const today = getTodaysDate();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `The user's input is: "${prompt}". Today's date is ${today}.`,
      config: {
        systemInstruction: `You are a summarizing assistant. The user is giving you a raw text of things to do. Summarize their input into a clear, actionable to-do list. If a due date is mentioned (like 'tomorrow', 'next Friday', 'August 15th'), calculate the date and provide it in YYYY-MM-DD format. If no due date is mentioned for an item, set its dueDate to today's date. Respond ONLY with a JSON array of objects matching the provided schema. Do not add any commentary or conversational text outside of the JSON.`,
        responseMimeType: "application/json",
        responseSchema: todoSchema,
      },
    });
    
    return parseJsonResponse(response.text);
  } catch (error) {
    console.error("Error processing text prompt:", error);
    return [];
  }
};

export const processImagePrompt = async (base64ImageData: string, mimeType: string): Promise<Todo[]> => {
  const today = getTodaysDate();
  try {
    const imagePart = {
      inlineData: {
        data: base64ImageData,
        mimeType: mimeType,
      },
    };
    const textPart = {
      text: `Extract all events, tasks, and deadlines from this image. Format them as a to-do list. Today's date is ${today}.`,
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction: `You are an event extraction assistant. Analyze the image and pull out key tasks or events. If a due date is mentioned, provide it in YYYY-MM-DD format. If an item has no specific date, set its dueDate to today's date. Respond ONLY with a JSON array of objects matching the provided schema. Do not add any commentary or conversational text outside of the JSON.`,
        responseMimeType: "application/json",
        responseSchema: todoSchema,
      },
    });

    return parseJsonResponse(response.text);
  } catch (error) {
    console.error("Error processing image prompt:", error);
    return [];
  }
};


export const getGrandmaWisdom = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `The user's latest to-do thoughts are: "${prompt}"`,
            config: {
                systemInstruction: "You are a nagging but secretly caring grandma. The user just gave you a task or a rant. Give them a short, sassy, and slightly annoying piece of advice or a nagging comment about their input. Keep it to one or two sentences. Be a bit dramatic. For example: 'About time you got to that!' or 'Are you ever going to finish this? I won't be around forever, you know.'",
            }
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error getting grandma wisdom:", error);
        return "Honestly, with all that on your plate, I'm surprised you're still standing.";
    }
};
