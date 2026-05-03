import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { Message } from '@/types';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex w-full mb-4",
        message.role === 'user' ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn(
        "max-w-[85%] rounded-2xl p-5 shadow-sm border",
        message.role === 'user' 
          ? "bg-legal-800 border-legal-700 text-white rounded-tr-none" 
          : "bg-white border-slate-200 text-slate-800 rounded-tl-none"
      )}>
        <div className="prose prose-slate prose-sm max-w-none">
          {message.content.split('\n').map((line, i) => (
            <p key={i} className="mb-2 last:mb-0 leading-relaxed">
              {line}
            </p>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
