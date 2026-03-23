import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export interface ModalConfig {
  type: 'error' | 'confirm';
  title: string;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  datas?: {};
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onClose?: () => void;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  type?: 'danger' | 'info';
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  type = 'info',
}: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h3
            className={`font-bold ${type === 'danger' ? 'text-red-400' : 'text-slate-200'}`}
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded-lg text-slate-500"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6 text-slate-300 text-sm leading-relaxed">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
