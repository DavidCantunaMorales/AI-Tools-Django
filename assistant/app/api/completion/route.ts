// Función para manejar las solicitudes a la ruta /api/chat
import { generateText } from 'ai';
// Importar el cliente de Google AI SDK
import { google } from '@ai-sdk/google';

// Ruta para manejar las solicitudes POST a /api/chat
export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    // Generar texto utilizando el modelo Gemini 2.0 Flash de Google
    const { text } = await generateText({
      model: google('gemini-2.0-flash'),
      prompt: prompt,
    });

    // Devolver la respuesta generada
    return Response.json({ text });
  } catch (error) {
    return Response.json({ error: 'Error al generar el texto' }, { status: 500 });
  }
}
