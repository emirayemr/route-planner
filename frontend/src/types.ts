/**
 * Title: Shared Types for Frontend (Domain & DTOs)
 * Purpose: Define strong TypeScript contracts matching backend entities and DTOs.
 */

// ── Location entity ─────────────────────────────────────────────
export interface Location {
  id: number;
  name: string;
  country: string;
  city: string;
  locationCode: string; // e.g., TAK, IST, LHR, WEM
}

// ── Transportation entity ───────────────────────────────────────
export type TransportationType = "FLIGHT" | "BUS" | "SUBWAY" | "UBER";

export interface Transportation {
  id: number;
  origin: Location;       // backend returns nested Location
  destination: Location;
  type: TransportationType;
}

// ── Routes endpoint DTOs ────────────────────────────────────────
/**
 * GET /api/routes?origin=<CODE>&destination=<CODE>
 * Each leg is one transportation segment (1–3 total).
 */
export interface RouteLegDto {
  originCode: string;
  destinationCode: string;
  type: TransportationType;
  transportationId?: number; // present if mapped to DB entity
}

export interface RouteDto {
  legs: RouteLegDto[]; // 1–3 legs per valid route
}
