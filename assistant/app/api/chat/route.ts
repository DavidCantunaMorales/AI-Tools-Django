// Función para manejar las solicitudes a la ruta /api/chat
import { convertToModelMessages, streamText, UIMessage } from 'ai';
// Importar el cliente de Google AI SDK
import { google } from '@ai-sdk/google';

// Ruta para manejar las solicitudes POST a /api/chat
export async function POST(request: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await request.json();
    // Generar texto utilizando el modelo Gemini 2.0 Flash de Google
    const result = streamText({
      model: google('gemini-2.0-flash'),
      // Mantiene el contexto de la conversación
      // messages: convertToModelMessages(messages),

      // Usando Prompt Engineering para definir el rol del asistente según el contexto de la aplicacion
      messages: [
        {
          role: 'system',
          content:
            'Eres un asistente de soporte para una pyme, especializado en resolver dudas sobre saldos, creación de tickets y registro de pagos. Proporciona respuestas claras y concisas, y si no sabes la respuesta, indica que no puedes ayudar con esa consulta.',
        },
        ...convertToModelMessages(messages),
      ],
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
