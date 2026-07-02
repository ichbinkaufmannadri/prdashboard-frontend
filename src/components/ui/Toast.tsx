import { create } from 'zustand';
import { useEffect } from 'react';
import { cn } from '@/lib/cn';
import { CheckCircle2, XCircle } from 'lucide-react';

type Tone = 'success' | 'error';
interface Toast {
  id: number;
  tone: Tone;
  message: string;
}

interface ToastState {
  toasts: Toast[];
  push: (message: string, tone?: Tone) => void;
  dismiss: (id: number) => void;
}

let nextId = 1;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (message, tone = 'success') =>
    set((s) => ({ toasts: [...s.toasts, { id: nextId++, tone, message }] })),
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export function toast(message: string, tone: Tone = 'success') {
  useToastStore.getState().push(message, tone);
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const Icon = toast.tone === 'success' ? CheckCircle2 : XCircle;

  return (
    <div
      className={cn(
        'pointer-events-auto flex items-start gap-2.5 p-3 pr-4 bg-elevated border rounded-md shadow-xl max-w-sm animate-fade-in',
        toast.tone === 'success' ? 'border-success/30' : 'border-danger/30',
      )}
    >
      <Icon
        className={cn(
          'w-4 h-4 mt-0.5 shrink-0',
          toast.tone === 'success' ? 'text-success' : 'text-danger',
        )}
      />
      <p className="text-sm text-text">{toast.message}</p>
    </div>
  );
}
