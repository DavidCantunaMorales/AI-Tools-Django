'use client';

import { useCompletion } from '@ai-sdk/react';

export default function StreamPage() {
  const { input, handleInputChange, handleSubmit, completion, isLoading, error, stop, setInput } =
    useCompletion({
      api: '/api/stream',
    });

  return (
    <div className='flex flex-col w-full max-w-md py-24 mx-auto stretch'>
      {error && <div className='text-red-500 mb-4'>{error.message}</div>}
      {/* Mostrar completion incluso durante la carga */}
      {completion && <div className='whitespace-pre-wrap mb-4'>{completion}</div>}
      {/* Indicador visual de carga */}
      {isLoading && !completion && (
        <div className='text-center'>Cargando...</div> // Mostrar solo si no hay completion
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setInput('');
          handleSubmit(e);
        }}
        className='fixed bottom-0 w-full max-w-md mx-auto left-0 right-0 p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 shadow-lg'
      >
        <div className='flex gap-2'>
          <input
            className='flex-1 dark:bg-zinc-800 p-2 border border-zinc-300 dark:border-zinc-700 rounded shadow-xl'
            value={input}
            onChange={handleInputChange}
            placeholder='¿Cómo puedo ayudarte?'
            disabled={isLoading}
            maxLength={500}
            autoFocus
            aria-label='Escribe tu prompt'
          />

          {isLoading ? (
            <button
              onClick={stop}
              className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors'
            >
              Cancelar
            </button>
          ) : (
            <button
              type='submit'
              className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              disabled={isLoading}
            >
              Enviar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
