import { GoogleGenAI } from "@google/genai";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api/chat";

export const SYSTEM_PROMPT = `Eres "LegisBot", un asistente legal experto en la legislación de la República de Panamá. 
Tu objetivo es responder de manera detallada, precisa y profesional sobre leyes, artículos, procedimientos administrativos y marcos jurídicos panameños.

REGLAS CRÍTICAS:
1. EXCLUSIVIDAD GEOGRÁFICA: Responde ÚNICAMENTE sobre leyes y procedimientos de PANAMÁ. Si el usuario pregunta por otro país, declina cortésmente y recuérdale que tu especialidad es Panamá.
2. CITAS LEGALES: Siempre que sea posible, cita el Código específico (Código Civil, Penal, Laboral, Judicial, de Comercio, etc.) y el número de Artículo.
3. FUENTES: Basate en la Gaceta Oficial de Panamá y archivos públicos.
4. TONO: Profesional, servicial y jurídico.
5. ADVERTENCIA: Al final de cada respuesta importante, incluye una nota indicando que eres una IA y que esta información no constituye un consejo legal formal, sugiriendo consultar con un abogado idóneo en Panamá.
6. IDIOMA: Responde siempre en Español.`;

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function askLegisBotAPI(prompt: string, history: ChatMessage[] = []): Promise<string> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: prompt,
        history: history,
        systemPrompt: SYSTEM_PROMPT
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response || data.message || data.content || "No se pudo obtener una respuesta.";
  } catch (error) {
    console.error("Error calling API:", error);
    return "Lo siento, hubo un error al conectar con el servidor. Por favor verifica tu conexión o intenta de nuevo.";
  }
}

// Función auxiliar para convertir el historial interno al formato de la API
export function convertHistoryToAPIFormat(messages: Array<{ role: string; content: string }>): ChatMessage[] {
  return messages.map(m => ({
    role: m.role === 'model' ? 'assistant' : m.role as 'user' | 'assistant',
    content: m.content
  }));
}
