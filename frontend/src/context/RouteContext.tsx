/* ────────────────────────────────────────────────────────────────
 * Title: RouteContext
 * Purpose: React Context for managing breadcrumb state (origin & destination).
 * Usage: Wrap app in <RouteProvider> and call useRouteCrumb() inside components.
 * ──────────────────────────────────────────────────────────────── */
import { createContext, useContext, useState } from "react";
import type { PropsWithChildren } from "react";

type RouteCrumb = { origin?: string; destination?: string };
type Ctx = {
  crumb: RouteCrumb;
  setCrumb: (c: RouteCrumb) => void;
  clear: () => void;
};

// Context container
const RouteContext = createContext<Ctx | undefined>(undefined);

// Provider: holds crumb state & exposes update/clear
export function RouteProvider({ children }: PropsWithChildren) {
  const [crumb, setCrumb] = useState<RouteCrumb>({});
  const clear = () => setCrumb({});
  return (
    <RouteContext.Provider value={{ crumb, setCrumb, clear }}>
      {children}
    </RouteContext.Provider>
  );
}

// Hook for consuming the route crumb state
export function useRouteCrumb() {
  const ctx = useContext(RouteContext);
  if (!ctx) throw new Error("useRouteCrumb must be used within RouteProvider");
  return ctx;
}
