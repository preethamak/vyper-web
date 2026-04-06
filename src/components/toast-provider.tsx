"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";
import type { ToastTone } from "@/lib/toast-rules";

type ToastItem = {
  id: number;
  message: string;
  tone: ToastTone;
};

type ToastContextValue = {
  showToast: (message: string, tone?: ToastTone) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const prefersReducedMotion = useReducedMotion();

  const showToast = useCallback((message: string, tone: ToastTone = "info") => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((current) => [...current.slice(-1), { id, message, tone }]);

    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 1800);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  const toneStyles: Record<ToastTone, string> = {
    success: "border-emerald-300 bg-emerald-50/90",
    info: "border-cyan-300 bg-cyan-50/90",
    warning: "border-amber-300 bg-amber-50/90",
    error: "border-rose-300 bg-rose-50/90",
  };

  const toneBarStyles: Record<ToastTone, string> = {
    success: "bg-emerald-600",
    info: "bg-cyan-600",
    warning: "bg-amber-600",
    error: "bg-rose-600",
  };

  const getToneAnimation = (tone: ToastTone) => {
    if (prefersReducedMotion) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.15 },
      };
    }

    if (tone === "success") {
      return {
        initial: { opacity: 0, y: 16, scale: 0.92 },
        animate: { opacity: 1, y: 0, scale: [0.98, 1.02, 1] },
        exit: { opacity: 0, y: 10, scale: 0.97 },
        transition: { duration: 0.24, times: [0, 0.65, 1] },
      };
    }

    if (tone === "warning") {
      return {
        initial: { opacity: 0, y: 14, scale: 0.95 },
        animate: { opacity: 1, y: [2, -2, 0], scale: 1 },
        exit: { opacity: 0, y: 8, scale: 0.98 },
        transition: { duration: 0.24, times: [0, 0.6, 1] },
      };
    }

    if (tone === "error") {
      return {
        initial: { opacity: 0, y: 10, scale: 0.96 },
        animate: { opacity: 1, y: 0, x: [0, -5, 5, -4, 4, 0], scale: 1 },
        exit: { opacity: 0, y: 8, scale: 0.98 },
        transition: { duration: 0.28, times: [0, 0.2, 0.4, 0.6, 0.8, 1] },
      };
    }

    return {
      initial: { opacity: 0, y: 12, scale: 0.97 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: 8, scale: 0.98 },
      transition: { duration: 0.2 },
    };
  };

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="pointer-events-none fixed bottom-4 left-1/2 z-[70] w-full max-w-md -translate-x-1/2 px-4">
        <AnimatePresence initial={false} mode="popLayout">
          {toasts.map((toast) => {
            const animation = getToneAnimation(toast.tone);
            return (
              <motion.div
                key={toast.id}
                initial={animation.initial}
                animate={animation.animate}
                exit={animation.exit}
                transition={animation.transition}
                className={`pointer-events-auto relative overflow-hidden rounded-2xl border-2 px-4 py-3 shadow-[5px_5px_0_#0f172a] ${toneStyles[toast.tone]}`}
                role="status"
                aria-live="polite"
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  {toast.tone === "success" ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                  ) : toast.tone === "warning" ? (
                    <AlertTriangle className="h-4 w-4 text-amber-700" />
                  ) : toast.tone === "error" ? (
                    <XCircle className="h-4 w-4 text-rose-700" />
                  ) : (
                    <Info className="h-4 w-4 text-cyan-700" />
                  )}
                  <span>{toast.message}</span>
                </div>

                {!prefersReducedMotion ? (
                  <motion.span
                    className={`absolute inset-x-0 bottom-0 h-1 origin-left ${toneBarStyles[toast.tone]}`}
                    initial={{ scaleX: 1 }}
                    animate={{ scaleX: 0 }}
                    transition={{ duration: 1.8, ease: "linear" }}
                  />
                ) : null}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
}
