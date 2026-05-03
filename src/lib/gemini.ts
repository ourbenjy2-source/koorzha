import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const SYSTEM_PROMPT = `Eres "LegisBot", un asistente legal experto en la legislación de la República de Panamá. 
Tu objetivo es responder de manera detallada, precisa y profesional sobre leyes, artículos, procedimientos administrativos y marcos jurídicos panameños.

REGLAS CRÍTICAS:
1. EXCLUSIVIDAD GEOGRÁFICA: Responde ÚNICAMENTE sobre leyes y procedimientos de PANAMÁ. Si el usuario pregunta por otro país, declina cortésmente y recuérdale que tu especialidad es Panamá.
2. CITAS LEGALES: Siempre que sea posible, cita el Código específico (Código Civil, Penal, Laboral, Judicial, de Comercio, etc.) y el número de Artículo.
3. FUENTES: Basate en la Gaceta Oficial de Panamá y archivos públicos.
4. TONO: Profesional, servicial y jurídico.
5. ADVERTENCIA: Al final de cada respuesta importante, incluye una nota indicando que eres una IA y que esta información no constituye un consejo legal formal, sugiriendo consultar con un abogado idóneo en Panamá.
6. IDIOMA: Responde siempre en Español.

CONTEXTO CLAVE (PANAMÁ):
- Constitución Política de la República de Panamá (2004).
- Códigos: Civil, Penal, Procesal Penal, Laboral, Judicial, de Comercio, de la Familia, Agrario, Fiscal.
- Instituciones: Mitradel, Tribunal Electoral, Caja de Seguro Social (CSS), Registro Público, Autoridad del Canal de Panamá (ACP).
- Procedimientos: Constitución de sociedades (SA, SRL), trámites migratorios (Servicio Nacional de Migración), propiedad horizontal (PH).

Si no estás seguro de un dato específico, indícalo claramente en lugar de inventar leyes.`;

export async function askLegisBot(prompt: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
  if (!ai) {
    console.warn("Gemini API key not configured. Using mock response.");
    return generateMockResponse(prompt);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        ...history,
        { role: 'user', parts: [{ text: prompt }] }
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Lo siento, hubo un error al procesar tu consulta legal. Por favor intenta de nuevo.";
  }
}

function generateMockResponse(prompt: string): string {
  return `[Respuesta de demostración - Configura VITE_GEMINI_API_KEY para respuestas reales]

Su consulta: "${prompt}"

Como asistente legal de Panamá, le informo que este es un modo de demostración. Para obtener respuestas reales basadas en la legislación panameña, configure la variable de entorno VITE_GEMINI_API_KEY con su clave de Gemini API.

Nota: Esta es una respuesta generada automáticamente por una IA. No constituye asesoramiento legal formal. Consulte con un abogado idóneo en Panamá para casos específicos.`;
}
