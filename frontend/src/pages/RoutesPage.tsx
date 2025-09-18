/**
 * Title: RoutesPage (Search • Group by Via • Detail Panel)
 * Purpose: Fetch locations & routes, group route alternatives by flight "via", and render a list + detail panel.
 */

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Location, RouteDto, TransportationType } from "../types";
import RouteDetail from "../components/RouteDetail";
import RouteSearchBar from "../components/RouteSearchBar";
import { useRouteCrumb } from "../context/RouteContext";

/* ── Constants ───────────────────────────────────────────────────────────── */
const NO_FLIGHT_KEY = "_NO_FLIGHT_";

/* ── API helpers ─────────────────────────────────────────────────────────── */
async function fetchLocations(): Promise<Location[]> {
  const res = await fetch("/api/locations");
  if (!res.ok) throw new Error("Failed to load locations");
  return res.json();
}

async function fetchRoutes(originCode: string, destinationCode: string): Promise<RouteDto[]> {
  const res = await fetch(
    `/api/routes?origin=${encodeURIComponent(originCode)}&destination=${encodeURIComponent(
      destinationCode
    )}`
  );
  if (!res.ok) throw new Error("Failed to load routes");
  return res.json();
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */
const summarize = (r: RouteDto) =>
  r.legs
    .map(
      (leg) => `${leg.originCode} → ${leg.destinationCode} (${leg.type as TransportationType})`
    )
    .join("  ➜  ");

const getViaCode = (r: RouteDto): string | null => {
  const flight = r.legs.find((l) => l.type === "FLIGHT");
  return flight ? flight.originCode : null;
};

export default function RoutesPage() {
  /* ── Section: Primary Selections ─────────────────────────────────────────
     Purpose: Hold chosen origin/destination as full Location objects. */
  const [origin, setOrigin] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);

  /* ── Section: Right Panel (Selected Group/Alt) ─────────────────────────── */
  const [selectedVia, setSelectedVia] = useState<string | null>(null);
  const [altIndex, setAltIndex] = useState<number>(0);

  /* ── Section: Breadcrumb Context ───────────────────────────────────────── */
  const { setCrumb, clear } = useRouteCrumb();

  /* ── Section: Load Locations ───────────────────────────────────────────── */
  const locQ = useQuery<Location[]>({
    queryKey: ["locations"],
    queryFn: fetchLocations,
  });
  const locations = locQ.data ?? [];

  /* ── Section: Code → Location lookup ───────────────────────────────────── */
  const codeToLoc = useMemo(() => {
    const map: Record<string, Location> = {};
    locations.forEach((l) => {
      map[l.locationCode] = l;
    });
    return map;
  }, [locations]);

  /* ── Section: Load Routes (depends on selection) ───────────────────────── */
  const originCode = origin?.locationCode ?? "";
  const destCode = destination?.locationCode ?? "";

  const routesQ = useQuery<RouteDto[]>({
    queryKey: ["routes", originCode, destCode],
    enabled: Boolean(originCode && destCode),
    queryFn: () => fetchRoutes(originCode, destCode),
  });

  /* ── Section: Group by VIA (flight origin) ───────────────────────────────
     Purpose: Group route alternatives by flight origin (if any), alphabetically. */
  const groupedByVia = useMemo(() => {
    const m = new Map<string, RouteDto[]>();
    (routesQ.data ?? []).forEach((r) => {
      const via = getViaCode(r) ?? NO_FLIGHT_KEY;
      if (!m.has(via)) m.set(via, []);
      m.get(via)!.push(r);
    });

    // stable, human-friendly sort: non-flight group goes to the end
    return new Map<string, RouteDto[]>(
      [...m.entries()].sort((a, b) => {
        const ak = a[0] === NO_FLIGHT_KEY ? "ZZZ" : a[0];
        const bk = b[0] === NO_FLIGHT_KEY ? "ZZZ" : b[0];
        return ak.localeCompare(bk);
      })
    );
  }, [routesQ.data]);

  const groupCount = useMemo(() => [...groupedByVia.keys()].length, [groupedByVia]);

  /* ── Section: Active Route in Right Panel ──────────────────────────────── */
  const selectedRoute = useMemo(() => {
    if (!selectedVia) return null;
    const list = groupedByVia.get(selectedVia) ?? [];
    return list[altIndex] ?? list[0] ?? null;
  }, [selectedVia, altIndex, groupedByVia]);

  /* ── Section: Breadcrumb Sync ──────────────────────────────────────────── */
  useEffect(() => {
    if (origin && destination) {
      const o = `${origin.name} (${origin.locationCode})`;
      const d = `${destination.name} (${destination.locationCode})`;
      setCrumb({ origin: o, destination: d });
    } else {
      clear();
    }
  }, [origin, destination, setCrumb, clear]);

  // Clear crumb on unmount (nice-to-have)
  useEffect(() => clear, [clear]);

  /* ── Section: Handlers (for RouteSearchBar) ───────────────────────────── */
  const handleSearch = async () => {
    setSelectedVia(null);
    setAltIndex(0);
    await routesQ.refetch();
  };

  const handleSwap = () => {
    if (!origin || !destination) return;
    setSelectedVia(null);
    setAltIndex(0);
    setOrigin(destination);
    setDestination(origin);
  };

  const handleReset = () => {
    setOrigin(null);
    setDestination(null);
    setSelectedVia(null);
    setAltIndex(0);
  };

  const getViaLabel = (viaCode: string | null): string => {
    if (!viaCode) return "—";
    const name = codeToLoc[viaCode]?.name ?? viaCode;
    return `Via ${name} (${viaCode})`;
  };

  /* ── Section: Render ───────────────────────────────────────────────────── */
  return (
    <div className="grid2">
      {/* LEFT: Search + Grouped List */}
      <div>
        {/* Search Card */}
        <RouteSearchBar
          origin={origin}
          destination={destination}
          origins={locations}
          destinations={locations}
          onOrigin={setOrigin}
          onDestination={setDestination}
          onSearch={handleSearch}
          onSwap={handleSwap}
          onReset={handleReset}
        />

        {/* Results List */}
        <div className="card" style={{ marginTop: 12 }}>
          <div className="section-title" style={{ marginBottom: 8 }}>
            <span className="text-[13px] font-semibold text-gray-500">Available Routes</span>
          </div>

          {routesQ.isLoading && <p>Loading…</p>}
          {routesQ.isError && <p className="text-red-600">Routes could not be loaded.</p>}
          {routesQ.isSuccess && (routesQ.data?.length ?? 0) === 0 && <p>No routes found</p>}

          {routesQ.isSuccess && groupCount > 0 && (
            <ul className="space-y-2">
              {[...groupedByVia.entries()].map(([via, routes]) => {
                const viaCode = via === NO_FLIGHT_KEY ? null : via;
                return (
                  <li key={via}>
                    <button
                      onClick={() => {
                        setSelectedVia(via);
                        setAltIndex(0);
                      }}
                      className="route-item"
                      title={
                        routes.length > 1 ? `${routes.length} alternative available` : summarize(routes[0])
                      }
                      aria-label={`Select ${getViaLabel(viaCode)}`}
                    >
                      <div className="list-row">
                        <span className="route-title">{getViaLabel(viaCode)}</span>
                        {routes.length > 1 && (
                          <span className="pill">
                            {routes.length} option{routes.length > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* RIGHT: Detail Panel */}
      <RouteDetail
        route={selectedRoute}
        alts={selectedVia ? groupedByVia.get(selectedVia) ?? [] : []}
        altIndex={altIndex}
        onAltChange={setAltIndex}
        onClose={() => {
          setSelectedVia(null);
          setAltIndex(0);
        }}
        codeToLocation={codeToLoc}
      />
    </div>
  );
}
