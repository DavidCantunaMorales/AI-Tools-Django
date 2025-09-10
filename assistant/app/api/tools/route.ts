import { convertToModelMessages, streamText, UIMessage, tool, UIDataTypes, InferUITools } from 'ai';
import { google } from '@ai-sdk/google';
import z from 'zod';

const tools = {
  getBalance: tool({
    description: 'Consulta el saldo de un cliente',
    inputSchema: z.object({
      id: z.string().describe('Numero del ID del cliente'),
    }),
    execute: async ({ id }) => {
      const res = await fetch(`${process.env.BACKEND_URL}/api/customers/${id}/`);
      const data = await res.json();
      if (!res.ok) {
        return `No se encontró el cliente con ID ${id}`;
      } else {
        return `El saldo del cliente ${data.name} es de ${data.balance} dolares`;
      }
    },
  }),

  createTicket: tool({
    description: 'Crea un ticket de soporte para un cliente',
    inputSchema: z.object({
      id: z.string().describe('Numero del ID del cliente'),
      description: z.string().describe('Descripción del problema'),
    }),
    execute: async ({ id, description }) => {
      const res = await fetch(`${process.env.BACKEND_URL}/api/tickets/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer: id, description: description }),
      });
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        return `No se pudo crear el ticket para el cliente con ID ${id}`;
      } else {
        return `Se ha creado el ticket con ID ${data.id} para el cliente con ID ${id}`;
      }
    },
  }),

  recordPayment: tool({
    description: 'Registra un pago realizado por un cliente',
    inputSchema: z.object({
      id: z.string().describe('Numero del ID del cliente'),
      amount: z.number().min(0).describe('Monto del pago'),
    }),
    execute: async ({ id, amount }) => {
      const res = await fetch(`${process.env.BACKEND_URL}/api/payments/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customer: id, amount: amount }),
      });
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        return `No se pudo registrar el pago para el cliente con ID ${id}`;
      } else {
        return `✅ Se ha registrado un pago de ${amount} dólares para el cliente con ID ${id} con fecha ${data.payment_date}`;
      }
    },
  }),
};

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(request: Request) {
  try {
    const { messages }: { messages: ChatMessage[] } = await request.json();
    // Generar texto utilizando el modelo Gemini 2.0 Flash de Google
    const result = streamText({
      model: google('gemini-2.0-flash'),

      // Usando Prompt Engineering para definir el rol del asistente según el contexto de la aplicacion
      messages: [
        {
          role: 'system',
          content:
            'Eres un asistente de soporte para una pyme, especializado en resolver dudas sobre saldos, creación de tickets y registro de pagos. Proporciona respuestas claras y concisas, y si no sabes la respuesta, indica que no puedes ayudar con esa consulta.',
        },
        ...convertToModelMessages(messages),
      ],
      tools,
    });

    // Devolver la respuesta generada
    return result.toUIMessageStreamResponse();
  } catch (error) {
    return Response.json({ error: 'Error al generar el texto' }, { status: 500 });
  }
}
