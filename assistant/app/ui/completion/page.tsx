'use client';

import { useCompletion } from '@/lib/hooks/useCompletion';

export default function CompletionPage() {
  const { prompt, setPrompt, completion, isLoading, error, handleSubmit } =
    useCompletion('/api/stream');

  return (
    <div className='flex flex-col w-full max-w-md py-24 mx-auto stretch'>
      {error && <div className='text-red-500 mb-4'>{error}</div>}
      {isLoading ? (
        <div className='text-center'>Cargando...</div>
      ) : completion ? (
        <div className='whitespace-pre-wrap'>{completion}</div>
      ) : null}
      <form
        onSubmit={handleSubmit}
        className='fixed bottom-0 w-full max-w-md mx-auto left-0 right-0 p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 shadow-lg'
      >
        <div className='flex gap-2'>
          <input
            className='flex-1 dark:bg-zinc-800 p-2 border border-zinc-300 dark:border-zinc-700 rounded shadow-xl'
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder='¿Cómo puedo ayudarte?'
            disabled={isLoading}
            maxLength={500} // Refleja el límite de Zod
            autoFocus
            aria-label='Escribe tu prompt'
          />
          <button
            type='submit'
            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            disabled={isLoading}
          >
            {isLoading ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </form>
    </div>
  );
}
