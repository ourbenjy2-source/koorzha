import React from 'react';
import { Scale, MessageSquare, Users } from 'lucide-react';
import { cn } from '@/utils/cn';
import { View } from '@/types';

interface SidebarProps {
  view: View;
  onViewChange: (view: View) => void;
}

export function Sidebar({ view, onViewChange }: SidebarProps) {
  return (
    <aside className="w-72 bg-legal-900 text-white flex flex-col hidden md:flex shrink-0">
      <div className="p-6 flex items-center gap-3 border-b border-legal-800">
        <Scale className="w-8 h-8 text-legal-300" />
        <h1 className="text-xl font-bold tracking-tight">LegisPanamá</h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        <div className="text-legal-400 text-xs uppercase font-semibold px-4 mb-2">Menú Principal</div>
        <button 
          onClick={() => onViewChange('assistant')}
          className={cn(
            "flex items-center gap-3 w-full px-4 py-2.5 rounded-lg transition-all group",
            view === 'assistant' ? "bg-legal-800 text-white shadow-inner" : "text-legal-300 hover:text-white hover:bg-legal-800/50"
          )}
        >
          <MessageSquare className="w-4 h-4" />
          <span className="text-sm font-medium">Asistente Legal IA</span>
        </button>
        
        <button 
          onClick={() => onViewChange('community')}
          className={cn(
            "flex items-center gap-3 w-full px-4 py-2.5 rounded-lg transition-all group",
            view === 'community' ? "bg-legal-800 text-white shadow-inner" : "text-legal-300 hover:text-white hover:bg-legal-800/50"
          )}
        >
          <Users className="w-4 h-4" />
          <span className="text-sm font-medium">Comunidad (Chat/Casos)</span>
        </button>
      </nav>

      <div className="p-6 bg-legal-950 border-t border-legal-800 text-legal-400 text-xs space-y-1">
        <p className="font-semibold text-legal-300">LegisPanamá</p>
        <p>Versión 1.1.0-beta</p>
      </div>
    </aside>
  );
}
