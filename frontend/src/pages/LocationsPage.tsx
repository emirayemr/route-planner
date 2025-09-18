/**
 * Title: LocationsPage (CRUD + Modal)
 * Purpose: List, create, update, and delete Locations via REST API with React Query caching.
 */

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Api } from "../api";
import type { Location as AppLocation } from "../types";
import { useToast } from "../components/Toast";

/* ── Types & Constants ───────────────────────────────────────────────────── */
type FormState = Omit<AppLocation, "id">;

const EMPTY_FORM: FormState = { name: "", city: "", country: "", locationCode: "" };

/* ── Helpers (dev-friendly error) ────────────────────────────────────────── */
function getErrorMessage(err: unknown, fallback = "Operation failed"): string {
  if (typeof err === "string") return err;
  if (err && typeof err === "object" && "message" in err && typeof (err as any).message === "string") {
    return (err as any).message as string;
  }
  return fallback;
}

/* ── Component ───────────────────────────────────────────────────────────── */
export default function LocationsPage() {
  const qc = useQueryClient();
  const { show } = useToast();

  /* ── Section: Read (React Query) ─────────────────────────────────────────
     Purpose: Fetch the locations list and keep cache in sync on writes. */
  const { data, isPending, error } = useQuery<AppLocation[]>({
    queryKey: ["locations"],
    queryFn: Api.getLocations,
  });

  /* ── Section: Local UI State ─────────────────────────────────────────────
     Purpose: Modal visibility, form state, edit/delete tracking. */
  const [isOpen, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editId, setEditId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const isEditing = useMemo(() => editId !== null, [editId]);

  /* ── Section: Create ───────────────────────────────────────────────────── */
  const createMut = useMutation({
    mutationFn: (payload: FormState) => Api.createLocation(payload),
    onSuccess: (loc) => {
      qc.invalidateQueries({ queryKey: ["locations"] });
      show(`Location created: ${loc.name}`, "success");
      closeModal();
    },
    onError: (e) => show(getErrorMessage(e, "Create failed"), "error"),
  });

  /* ── Section: Update ───────────────────────────────────────────────────── */
  const updateMut = useMutation({
    mutationFn: (vars: { id: number; payload: FormState }) =>
      Api.updateLocation(vars.id, vars.payload),
    onSuccess: (loc) => {
      qc.invalidateQueries({ queryKey: ["locations"] });
      show(`Location updated: ${loc.name}`, "success");
      closeModal();
    },
    onError: (e) => show(getErrorMessage(e, "Update failed"), "error"),
  });

  /* ── Section: Delete ───────────────────────────────────────────────────── */
  const deleteMut = useMutation({
    mutationFn: (id: number) => Api.deleteLocation(id),
    onMutate: (id) => setDeletingId(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["locations"] });
      show("Location deleted", "success");
    },
    onError: (e) => show(getErrorMessage(e, "Delete failed"), "error"),
    onSettled: () => setDeletingId(null),
  });

  /* ── Section: UI Handlers ──────────────────────────────────────────────── */
  function openCreate() {
    setForm(EMPTY_FORM);
    setEditId(null);
    setOpen(true);
  }
  function openEdit(loc: AppLocation) {
    setForm({
      name: loc.name,
      city: loc.city,
      country: loc.country,
      locationCode: loc.locationCode,
    });
    setEditId(loc.id);
    setOpen(true);
  }
  function closeModal() {
    setOpen(false);
    setEditId(null);
    setForm(EMPTY_FORM);
  }
  function onChange<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }
  function onDelete(id: number, label: string) {
    if (confirm(`Are you sure you want to delete '${label}'?`)) {
      deleteMut.mutate(id);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload: FormState = {
      ...form,
      locationCode: form.locationCode.trim().toUpperCase(),
      name: form.name.trim(),
      city: form.city.trim(),
      country: form.country.trim(),
    };
    if (!payload.name || !payload.city || !payload.country || !payload.locationCode) {
      show("Please fill in all fields.", "error");
      return;
    }
    if (isEditing && editId !== null) updateMut.mutate({ id: editId, payload });
    else createMut.mutate(payload);
  }

  const busy = createMut.isPending || updateMut.isPending;

  /* ── Section: Render ───────────────────────────────────────────────────── */
  return (
    <div>
      <div className="flex items-center mb-3 gap-3">
        <h2 className="m-0 mr-auto text-lg font-bold">Locations</h2>
        <button className="btn btn-primary" onClick={openCreate} aria-label="Add Location">
          + Add Location
        </button>
      </div>

      <div className="card">
        {isPending && <p>Loading…</p>}
        {error && <p className="text-red-600">An error occurred</p>}

        {data && data.length > 0 && (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: "40%" }}>Name</th>
                  <th>City</th>
                  <th>Country</th>
                  <th>Code</th>
                  <th style={{ width: 140 }} />
                </tr>
              </thead>
              <tbody>
                {data.map((loc) => (
                  <tr key={loc.id}>
                    <td className="cell-strong">{loc.name}</td>
                    <td>{loc.city}</td>
                    <td>{loc.country}</td>
                    <td>
                      <span className="badge">{loc.locationCode}</span>
                    </td>
                    <td>
                      <div className="flex gap-2 justify-end">
                        <button
                          className="btn btn-ghost"
                          onClick={() => openEdit(loc)}
                          aria-label={`Edit ${loc.name}`}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => onDelete(loc.id, loc.name)}
                          disabled={deletingId === loc.id}
                          aria-label={`Delete ${loc.name}`}
                        >
                          {deletingId === loc.id ? "Deleting…" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data && data.length === 0 && <p>No locations yet.</p>}
      </div>

      {/* ── Modal ─────────────────────────────────────────────────────────── */}
      {isOpen && (
        <div className="modal-overlay" onClick={() => !busy && closeModal()}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">{isEditing ? "Edit Location" : "Add Location"}</h3>
              <button className="icon-btn" onClick={closeModal} disabled={busy} aria-label="Close modal">
                ×
              </button>
            </div>

            {(createMut.error || updateMut.error) && (
              <p className="text-red-600" style={{ marginTop: 0 }}>
                {getErrorMessage(createMut.error || updateMut.error, "Request failed")}
              </p>
            )}

            <form onSubmit={onSubmit} className="form">
              <div className="field">
                <label className="field__label" htmlFor="loc-name">Name</label>
                <input
                  id="loc-name"
                  className="field__input"
                  value={form.name}
                  onChange={(e) => onChange("name", e.target.value)}
                  placeholder="Istanbul Airport"
                />
              </div>

              <div className="grid-2">
                <div className="field">
                  <label className="field__label" htmlFor="loc-city">City</label>
                  <input
                    id="loc-city"
                    className="field__input"
                    value={form.city}
                    onChange={(e) => onChange("city", e.target.value)}
                    placeholder="Istanbul"
                  />
                </div>
                <div className="field">
                  <label className="field__label" htmlFor="loc-country">Country</label>
                  <input
                    id="loc-country"
                    className="field__input"
                    value={form.country}
                    onChange={(e) => onChange("country", e.target.value)}
                    placeholder="TR"
                  />
                </div>
              </div>

              <div className="field">
                <label className="field__label" htmlFor="loc-code">Code</label>
                <input
                  id="loc-code"
                  className="field__input"
                  value={form.locationCode}
                  onChange={(e) => onChange("locationCode", e.target.value)}
                  maxLength={10}
                  placeholder="IST / SAW / LHR…"
                />
                <div className="field__hint">Will be sent uppercase (e.g., IST, SAW, KDK…)</div>
              </div>

              <div className="modal__footer">
                <button type="button" className="btn btn-ghost" onClick={closeModal} disabled={busy}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={busy}>
                  {isEditing ? (busy ? "Saving…" : "Save Changes") : (busy ? "Creating…" : "Create")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
