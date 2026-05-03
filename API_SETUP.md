# Configuración del Asistente Legal IA

## Opción 1: Usando Gemini API Directamente (Recomendado)

1. Obtén tu API Key de Gemini en: https://aistudio.google.com/apikey

2. Crea un archivo `.env` en la raíz del proyecto:
   ```bash
   cp .env.example .env
   ```

3. Edita `.env` y agrega tu clave:
   ```
   VITE_GEMINI_API_KEY=tu_clave_aqui
   ```

4. Reinicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Opción 2: Usando tu Propia API

Si prefieres usar tu propio backend:

1. Configura la URL de tu API en `.env`:
   ```
   VITE_API_URL=http://tu-servidor.com/api/chat
   ```

2. Tu API debe aceptar POST requests con este formato:
   ```json
   {
     "message": "consulta del usuario",
     "history": [
       {"role": "user", "content": "mensaje anterior"},
       {"role": "assistant", "content": "respuesta anterior"}
     ],
     "systemPrompt": "instrucciones del sistema"
   }
   ```

3. Y responder con este formato:
   ```json
   {
     "response": "respuesta de la IA"
   }
   ```

## Notas Importantes

- El asistente está configurado para responder **únicamente** sobre legislación de Panamá
- Sin una API key configurada, el sistema mostrará respuestas de demostración
- Para producción, nunca commits tu archivo `.env` al repositorio
