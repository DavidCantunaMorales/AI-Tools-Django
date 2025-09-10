'use client';

import { useState, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

export default function ChatToolPage() {
  const [input, setInput] = useState('');

  // El useChat() -> Definido de la siguiente manera apunto a la ruta /api/tools
  const { messages, sendMessage, status, error, stop } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/tools',
    }),
  });

  // Debug: inspeccionar mensajes entrantes para ver tipos/estructura
  useEffect(() => {
    if (messages.length > 0) {
      // eslint-disable-next-line no-console
      console.log('useChat messages:', messages);
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage({ text: input });
    setInput('');
  };

  return (
    <div className='flex flex-col w-full max-w-md py-24 mx-auto stretch'>
      {error && <div className='text-red-500 mb-4'>{error.message}</div>}

      {messages.map((message) => (
        <div
          key={message.id}
          className='mb-4'
        >
          <div className='font-semibold'>{message.role === 'user' ? 'David:' : 'Assistant:'}</div>
          {message.parts.map((part, index) => {
            const p = part as any;

            // Priorizar text si existe
            if (p?.text) {
              return (
                <div
                  key={`${message.id}-${index}`}
                  className='whitespace-pre-wrap'
                >
                  {p.text}
                </div>
              );
            }

            // Muchas tools devuelven su resultado en 'output'
            if (p?.output) {
              const out =
                typeof p.output === 'string' ? p.output : JSON.stringify(p.output, null, 2);
              return (
                <div
                  key={`${message.id}-${index}`}
                  className='whitespace-pre-wrap'
                >
                  {out}
                </div>
              );
            }

            // Algunos adaptadores usan 'content' o 'message'
            if (p?.content || p?.message) {
              const anyText = p.content ?? p.message;
              const text = typeof anyText === 'string' ? anyText : JSON.stringify(anyText, null, 2);
              return (
                <div
                  key={`${message.id}-${index}`}
                  className='whitespace-pre-wrap'
                >
                  {text}
                </div>
              );
            }

            // Mostrar un pequeño indicador para eventos de control como 'step-start'
            if (p?.type === 'step-start') {
              return (
                <div
                  key={`${message.id}-${index}`}
                  className='text-sm text-zinc-500'
                >
                  {/* (iniciando paso...) */}
                </div>
              );
            }

            // Fallback legible para debugging cuando no hay campo text/output
            return (
              <pre
                key={`${message.id}-${index}`}
                className='whitespace-pre-wrap bg-zinc-100 dark:bg-zinc-900 p-2 rounded text-sm overflow-auto'
              >
                {JSON.stringify(part, null, 2)}
              </pre>
            );
          })}
        </div>
      ))}
      {(status === 'submitted' || status === 'streaming') && (
        <div className='mb-4 flex items-center gap-2'>
          <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400'></div>
          <span>Procesando...</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className='fixed bottom-0 w-full max-w-md mx-auto left-0 right-0 p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 shadow-lg'
      >
        <div className='flex gap-2'>
          <input
            className='flex-1 dark:bg-zinc-800 p-2 border border-zinc-300 dark:border-zinc-700 rounded shadow-xl'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='How can I help you?'
          />
          {status === 'submitted' || status === 'streaming' ? (
            <button
              onClick={stop}
              className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors'
            >
              Stop
            </button>
          ) : (
            <button
              type='submit'
              className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              disabled={status !== 'ready'}
            >
              Send
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
