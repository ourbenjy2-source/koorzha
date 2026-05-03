import React from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  placeholder?: string;
}

export function ChatInput({ 
  value, 
  onChange, 
  onSubmit, 
  isLoading,
  placeholder = "Pregunte sobre pensiones, despidos o cualquier ley de Panamá..."
}: ChatInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="p-4 md:p-8 bg-gradient-to-t from-white via-white/80 to-transparent shrink-0">
      <form 
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto flex gap-4 p-2 bg-white border border-slate-300 rounded-2xl shadow-xl focus-within:ring-4 focus-within:ring-legal-500/10 focus-within:border-legal-500 transition-all items-center"
      >
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent px-5 py-4 outline-none text-slate-700 font-medium"
        />
        <button
          type="submit"
          disabled={isLoading || !value.trim()}
          className="bg-legal-800 p-4 rounded-xl text-white hover:bg-legal-900 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-transform active:scale-95"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}
