import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { ChatMessage } from '@/components/assistant/ChatMessage';
import { ChatInput } from '@/components/assistant/ChatInput';
import { WelcomeScreen } from '@/components/assistant/WelcomeScreen';
import { CommunityWall } from '@/components/community/CommunityWall';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import { View } from '@/types';

export default function App() {
  const [view, setView] = useState<View>('assistant');
  const { user, loading } = useAuth();
  const {
    messages,
    input,
    setInput,
    isLoading,
    scrollRef,
    handleSubmit,
    resetChat
  } = useChat();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f8fafc]">
        <div className="text-legal-700 font-bold text-xl">Cargando LegisPanamá...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-800 font-sans">
      <Sidebar view={view} onViewChange={setView} />

      <main className="flex-1 flex flex-col relative h-full min-w-0">
        <Header user={user} currentView={view} />

        {view === 'assistant' ? (
          <div className="flex-1 flex flex-col min-h-0 bg-[#f8fafc]">
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth"
            >
              {messages.length === 1 && (
                <WelcomeScreen onSuggestionClick={setInput} />
              )}

              {messages.map((m) => (
                <ChatMessage key={m.id} message={m} />
              ))}

              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-sm flex gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-legal-400 animate-bounce" />
                    <div className="w-1.5 h-1.5 rounded-full bg-legal-400 animate-bounce delay-75" />
                    <div className="w-1.5 h-1.5 rounded-full bg-legal-400 animate-bounce delay-150" />
                  </div>
                </div>
              )}
            </div>

            <ChatInput
              value={input}
              onChange={setInput}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        ) : (
          <CommunityWall user={user} />
        )}
      </main>
    </div>
  );
}
