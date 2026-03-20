import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FloatingChatButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export default function FloatingChatButton({ onClick, isOpen }: FloatingChatButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-4 right-4 h-14 w-14 sm:h-16 sm:w-16 rounded-full shadow-lg z-30 transition-all duration-300",
        "bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700",
        "hover:shadow-xl hover:scale-110",
        "flex justify-center items-center",
        isOpen && "scale-90 opacity-80"
      )}
    >
      {isOpen ? (
        <MessageSquare className="h-6 w-6" />
      ) : (
        <img
          src="/ceph-avatar-tight.jpg"
          alt="Chat Icon"
          className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-contain"
        />
      )}
    </button>
  );
}
