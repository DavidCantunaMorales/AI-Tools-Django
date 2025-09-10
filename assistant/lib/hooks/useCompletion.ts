import { useState } from 'react';
import { z } from 'zod';

// Esquema de validación para el prompt
const PromptSchema = z
  .string()
  .min(1, 'El prompt no puede estar vacío')
  .max(500, 'El prompt es demasiado largo');

// Esquema de validación para la respuesta de la API
const APIResponseSchema = z.object({
  text: z.string().min(1, 'La respuesta de la API está vacía'),
});

export function useCompletion(apiUrl: string) {
  const [prompt, setPrompt] = useState('');
  const [completion, setCompletion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validar el prompt con Zod
    const promptValidation = PromptSchema.safeParse(prompt);
    if (!promptValidation.success) {
      setError(promptValidation.error.issues[0].message);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptValidation.data }),
      });

      const data = await response.json();

      // Validar la respuesta de la API con Zod
      const apiResponseValidation = APIResponseSchema.safeParse(data);
      if (!response.ok || !apiResponseValidation.success) {
        throw new Error(
          apiResponseValidation.error?.issues[0]?.message ||
            data.error ||
            'Error en la respuesta de la API'
        );
      }

      setCompletion(apiResponseValidation.data.text);
      setPrompt(''); // Limpiar el input
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Algo salió mal. Por favor, intenta de nuevo.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    prompt,
    setPrompt,
    completion,
    isLoading,
    error,
    handleSubmit,
  };
}
