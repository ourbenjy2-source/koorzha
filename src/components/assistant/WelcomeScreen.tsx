import React from 'react';
import { Scale, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

interface WelcomeScreenProps {
  onSuggestionClick: (query: string) => void;
}

const SUGGESTIONS = [
  "¿Cuáles son los requisitos para una Sociedad Anónima?",
  "Procedimiento de despido según Código de Trabajo",
  "¿Cómo registrar una marca en DIGERPI?",
  "Trámites de residencia para inversionistas"
];

export function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
  return (
    <div className="max-w-3xl mx-auto space-y-8 mt-12">
      <div className="text-center space-y-4">
        <div className="inline-block p-4 bg-legal-50 rounded-full mb-4 ring-8 ring-legal-50/50">
          <Scale className="w-12 h-12 text-legal-700 fill-legal-100" />
        </div>
        <h2 className="text-4xl font-extrabold text-legal-900 tracking-tight">Consulte el Derecho Panameño</h2>
        <p className="text-lg text-slate-500 max-w-xl mx-auto">
          Respuestas instantáneas y detalladas basadas en la Gaceta Oficial y archivos públicos de Panamá.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SUGGESTIONS.map((q, i) => (
          <button
            key={i}
            onClick={() => onSuggestionClick(q)}
            className="p-5 text-left bg-white border border-slate-200 rounded-2xl hover:border-legal-500 hover:shadow-lg transition-all group flex items-center justify-between shadow-sm"
          >
            <span className="text-slate-700 font-semibold text-sm">{q}</span>
            <ChevronRight className="w-4 h-4 text-legal-300 group-hover:text-legal-600 group-hover:translate-x-1 transition-all" />
          </button>
        ))}
      </div>
    </div>
  );
}
