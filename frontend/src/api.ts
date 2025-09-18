import type {
  Location as AppLocation,
  Transportation,
  RouteDto,
  TransportationType,
} from "./types";

const API_BASE = "/api";

// Ortak fetch helper
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText}${txt ? ` - ${txt}` : ""}`);
  }
  // 204 No Content durumunu ele al
  // @ts-expect-error intentional
  return res.status === 204 ? undefined : await res.json();
}

/* -------------------- LOCATIONS -------------------- */

// LIST
function getLocations(): Promise<AppLocation[]> {
  return request<AppLocation[]>(`${API_BASE}/locations`);
}

// CREATE
function createLocation(payload: Omit<AppLocation, "id">): Promise<AppLocation> {
  return request<AppLocation>(`${API_BASE}/locations`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// UPDATE
function updateLocation(
  id: number,
  payload: Omit<AppLocation, "id">
): Promise<AppLocation> {
  return request<AppLocation>(`${API_BASE}/locations/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// DELETE
function deleteLocation(id: number): Promise<void> {
  return request<void>(`${API_BASE}/locations/${id}`, { method: "DELETE" });
}

/* ----------------- TRANSPORTATIONS ----------------- */

// Backend DTO'su id bazlı ise:
export type TransportationCreate = {
  originId: number;
  destinationId: number;
  type: TransportationType;
};

// LIST
function getTransportations(): Promise<Transportation[]> {
  return request<Transportation[]>(`${API_BASE}/transportations`);
}

// CREATE
function createTransportation(
  payload: TransportationCreate
): Promise<Transportation> {
  return request<Transportation>(`${API_BASE}/transportations`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// UPDATE
function updateTransportation(
  id: number,
  payload: TransportationCreate
): Promise<Transportation> {
  return request<Transportation>(`${API_BASE}/transportations/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// DELETE
function deleteTransportation(id: number): Promise<void> {
  return request<void>(`${API_BASE}/transportations/${id}`, { method: "DELETE" });
}

/* ---------------------- ROUTES --------------------- */

// code-based routes
function getRoutes(
  originCode: string,
  destinationCode: string,
  date?: string
): Promise<RouteDto[]> {
  const params = new URLSearchParams({
    origin: originCode,
    destination: destinationCode,
  });
  if (date) params.append("date", date);
  return request<RouteDto[]>(`${API_BASE}/routes?${params.toString()}`);
}

/* -------------------- Export API ------------------- */

export const Api = {
  // LOCATIONS
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,

  // TRANSPORTATIONS
  getTransportations,
  createTransportation,
  updateTransportation,
  deleteTransportation,

  // ROUTES
  getRoutes,
};
