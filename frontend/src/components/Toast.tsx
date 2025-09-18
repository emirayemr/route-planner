/* ──────────────────────────────────────────────────────────────────────────
 * Title: Toast
 * Purpose: Lightweight toast notifications with context-based API.
 * Notes: Auto-hides after 2.5s; accessible via aria-live region.
 * ────────────────────────────────────────────────────────────────────────── */
import { createContext, useCallback, useContext, useMemo, useState } from "react";

type Toast = { id: number; message: string; kind?: "success" | "error" | "info" };
type ToastCtx = { show: (message: string, kind?: Toast["kind"]) => void };

const Ctx = createContext<ToastCtx | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Add a toast and schedule auto-dismiss
  const show = useCallback((message: string, kind: Toast["kind"] = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, kind }]);

    // Auto-dismiss after 2.5s
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  }, []);

  const ctx = useMemo(() => ({ show }), [show]);

  return (
    <Ctx.Provider value={ctx}>
      {children}

      {/* Host (live region for screen readers) */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          display: "grid",
          gap: 8,
          zIndex: 9999,
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              minWidth: 240,
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              background:
                t.kind === "success" ? "#ecfdf5" : t.kind === "error" ? "#fef2f2" : "#f8fafc",
              color: t.kind === "success" ? "#065f46" : t.kind === "error" ? "#991b1b" : "#0f172a",
              boxShadow: "0 8px 30px rgba(0,0,0,.08)",
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useToast must be used inside <ToastProvider>");
  return v;
}
