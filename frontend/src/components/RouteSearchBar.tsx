/* ──────────────────────────────────────────────────────────────────────────
 * Title: RouteSearchBar
 * Purpose: Origin/Destination pickers with swap + keyboard shortcut.
 * Notes: Search disabled until both set.
 * ────────────────────────────────────────────────────────────────────────── */
import type { Location } from "../types";
import { useEffect } from "react";

type Props = {
  origin?: Location | null;
  destination?: Location | null;
  origins: Location[];
  destinations: Location[];
  onOrigin(o: Location | null): void;
  onDestination(d: Location | null): void;
  onSearch(): void;
  onSwap(): void;
  onReset(): void;
};

export default function RouteSearchBar(p: Props) {
  // ── Keyboard shortcut: Cmd/Ctrl + Shift + S → swap ──────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toLowerCase().includes("mac");
      const isSwap =
        (isMac ? e.metaKey : e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "s";
      if (isSwap) {
        e.preventDefault();
        p.onSwap();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // Depend only on the swap callback to avoid re-binding on unrelated prop changes
  }, [p.onSwap]);

  const canSearch = Boolean(p.origin && p.destination);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <section className="search card" aria-label="Route search">
      <div className="search__row search__row--with-swap">
        {/* Origin */}
        <div className="field">
          <label className="field__label" htmlFor="origin">
            Origin
          </label>
          <div className="field__control">
            <select
              id="origin"
              className="select"
              value={p.origin?.locationCode ?? ""}
              onChange={(e) =>
                p.onOrigin(p.origins.find((x) => x.locationCode === e.target.value) ?? null)
              }
              aria-label="Origin"
            >
              <option value="">Choose…</option>
              {p.origins.map((o) => (
                <option key={o.locationCode} value={o.locationCode}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap button (between selects) */}
        <button
          type="button"
          className="swap-btn"
          onClick={p.onSwap}
          title="Swap origin & destination (⌘/Ctrl + Shift + S)"
          aria-label="Swap origin and destination"
        >
          {/* double-arrow icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M7 7h14m-4-4 4 4-4 4M17 17H3m4-4-4 4 4 4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Destination */}
        <div className="field">
          <label className="field__label" htmlFor="destination">
            Destination
          </label>
          <div className="field__control">
            <select
              id="destination"
              className="select"
              value={p.destination?.locationCode ?? ""}
              onChange={(e) =>
                p.onDestination(
                  p.destinations.find((x) => x.locationCode === e.target.value) ?? null
                )
              }
              aria-label="Destination"
            >
              <option value="">Choose…</option>
              {p.destinations.map((d) => (
                <option key={d.locationCode} value={d.locationCode}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="search__actions">
        <button className="btn btn-primary" onClick={p.onSearch} disabled={!canSearch}>
          Search
        </button>
        <button className="btn btn-outline" onClick={p.onReset}>
          Reset
        </button>
      </div>
    </section>
  );
}
