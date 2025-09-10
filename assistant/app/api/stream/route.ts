// Función para manejar las solicitudes a la ruta /api/chat
import { streamText } from 'ai';
// Importar el cliente de Google AI SDK
import { google } from '@ai-sdk/google';

// Ruta para manejar las solicitudes POST a /api/chat
export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    // Generar texto utilizando el modelo Gemini 2.0 Flash de Google
    const result = streamText({
      model: google('gemini-2.0-flash'),
      prompt: prompt,
    });

    // Contar el numero de tokes generados
    result.usage.then((usage) => {
      console.log({
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        totalTokens: usage.totalTokens,
      });
    });

    // Devolver la respuesta generada
    return result.toUIMessageStreamResponse();
  } catch (error) {
    return Response.json({ error: 'Error al generar el texto' }, { status: 500 });
  }
}
