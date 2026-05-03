import { useState, useRef, useEffect } from 'react';
import { Message, ChatHistoryItem } from '@/types';
import { askLegisBot } from '@/lib/gemini';

const WELCOME_MESSAGE: Message = {
  id: '1',
  role: 'model',
  content: 'Bienvenido a LegisPanamá. Soy su asistente experto en la legislación de la República de Panamá. ¿En qué asunto legal o institucional puedo asistirle hoy?',
  timestamp: new Date()
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const history: ChatHistoryItem[] = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.content }]
    }));

    try {
      const response = await askLegisBot(input, history);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: response || 'No se pudo obtener una respuesta.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: 'Lo siento, hubo un error al procesar tu consulta.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([WELCOME_MESSAGE]);
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    scrollRef,
    handleSubmit,
    resetChat
  };
}
