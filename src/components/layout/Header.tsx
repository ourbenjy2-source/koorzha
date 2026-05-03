import React from 'react';
import { User, LogOut } from 'lucide-react';
import { auth, signInWithEmail } from '@/lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';

interface HeaderProps {
  user: FirebaseUser | null;
  currentView: string;
}

export function Header({ user, currentView }: HeaderProps) {
  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 z-10 shrink-0">
      <div className="flex items-center gap-4">
        <span className="text-legal-700 font-bold md:hidden">LegisPanamá</span>
        <div className="hidden md:flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-slate-500 font-medium">
            {currentView === 'assistant' ? 'Asistente Legal IA' : 'Muro de Comunidad'}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-700 truncate max-w-[120px]">{user.displayName || 'Usuario'}</p>
              <button onClick={() => auth.signOut()} className="text-[10px] text-red-500 hover:underline flex items-center justify-end gap-1">
                <LogOut className="w-2.5 h-2.5" /> Salir
              </button>
            </div>
            <div className="h-8 w-8 rounded-full bg-legal-100 flex items-center justify-center border border-legal-200 overflow-hidden shadow-sm">
              {user.photoURL ? <img src={user.photoURL} alt="Avatar" /> : <User className="w-5 h-5 text-legal-700" />}
            </div>
          </div>
        ) : (
          <button 
            onClick={signInWithEmail}
            className="text-xs font-bold bg-legal-800 text-white px-5 py-2 rounded-xl hover:bg-legal-900 transition-all shadow-md active:scale-95"
          >
            Iniciar Sesión
          </button>
        )}
      </div>
    </header>
  );
}
