/* ──────────────────────────────────────────────────────────────────────────
 * Title: RouteDetail
 * Purpose: Side panel showing a route timeline with optional alternatives.
 * Notes: Displays origin → destination per leg; highlights FLIGHT segments.
 * ────────────────────────────────────────────────────────────────────────── */
import type { Location, RouteDto } from "../types";

export default function RouteDetail({
  route,
  alts = [],
  altIndex = 0,
  onAltChange,
  onClose,
  codeToLocation,
}: {
  route: RouteDto | null;
  alts?: RouteDto[];
  altIndex?: number;
  onAltChange?: (i: number) => void;
  onClose: () => void;
  codeToLocation: Record<string, Location>;
}) {
  if (!route) return null;

  // ── Helpers ──────────────────────────────────────────────────────────────
  const resolveName = (code: string) => codeToLocation[code]?.name ?? code;

  const TypeBadge = ({ type }: { type: string }) => {
    const t = type.toLowerCase(); // "flight" | "bus" | "subway" | "uber"
    return <span className={`badge badge--${t}`}>{type}</span>;
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <aside className="panel" aria-label="Route detail">
      {/* Header */}
      <div className="list-row" style={{ marginBottom: 8 }}>
        <h3 style={{ margin: 0 }}>Route Detail</h3>
        <button className="button" onClick={onClose} aria-label="Close route detail">
          Close
        </button>
      </div>

      {/* Alternative selector (only when multiple options exist) */}
      {alts.length > 1 && (
        <div className="list-row" style={{ marginBottom: 8 }}>
          <span className="label">Alternatives</span>
          <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
            {alts.map((_, i) => (
              <button
                key={i}
                className="pill"
                style={{
                  cursor: "pointer",
                  background: i === altIndex ? "#dbeafe" : undefined,
                  borderColor: i === altIndex ? "#bfdbfe" : undefined,
                }}
                onClick={() => onAltChange && onAltChange(i)}
                aria-pressed={i === altIndex}
                title={`Option ${i + 1}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="timeline">
        {route.legs.map((leg, idx) => (
          <div key={idx}>
            {/* Origin node for this leg */}
            <div className={`node ${leg.type === "FLIGHT" ? "node--flight" : ""}`}>
              <span className="node__dot" />
              <div className="node__body">
                <div className="timeline__title">
                  {resolveName(leg.originCode)}{" "}
                  <span className="label">({leg.originCode})</span>
                </div>
                <div className="timeline__meta" style={{ marginTop: 6 }}>
                  <TypeBadge type={leg.type} />
                </div>
              </div>
            </div>

            {/* Destination node only for the final leg */}
            {idx === route.legs.length - 1 && (
              <div className="node" style={{ marginTop: 12 }}>
                <span className="node__dot" />
                <div className="node__body">
                  <div className="timeline__title">
                    {resolveName(leg.destinationCode)}{" "}
                    <span className="label">({leg.destinationCode})</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
