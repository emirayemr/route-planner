/**
 * Title: TransportationsPage (CRUD + Modal)
 * Purpose: List/create/update/delete Transportation edges with React Query cache sync.
 */

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Api } from "../api";
import type { Transportation, TransportationType, Location as AppLocation } from "../types";
import { useToast } from "../components/Toast";

/* ── UI helpers ──────────────────────────────────────────────────────────── */
function badgeClass(t: TransportationType) {
  switch (t) {
    case "FLIGHT":
      return "badge badge--flight";
    case "BUS":
      return "badge badge--bus";
    case "SUBWAY":
      return "badge badge--subway";
    case "UBER":
      return "badge badge--uber";
    default:
      return "badge";
  }
}

function getErrorMessage(err: unknown, fallback = "Operation failed"): string {
  if (typeof err === "string") return err;
  if (err && typeof err === "object" && "message" in err && typeof (err as any).message === "string") {
    return (err as any).message as string;
  }
  return fallback;
}

/* ── Types & Constants ───────────────────────────────────────────────────── */
type FormState = { originId: number | ""; destinationId: number | ""; type: TransportationType };
const EMPTY_FORM: FormState = { originId: "", destinationId: "", type: "BUS" };

/* ── Component ───────────────────────────────────────────────────────────── */
export default function TransportationsPage() {
  const qc = useQueryClient();
  const { show } = useToast();

  /* ── Section: Read (Lists) ─────────────────────────────────────────────── */
  const {
    data: transportations,
    isPending,
    error,
  } = useQuery<Transportation[]>({
    queryKey: ["transportations"],
    queryFn: Api.getTransportations,
  });

  const {
    data: locations,
    isPending: isLocLoading,
    error: locError,
  } = useQuery<AppLocation[]>({
    queryKey: ["locations"],
    queryFn: Api.getLocations,
  });

  /* ── Section: Local UI State ───────────────────────────────────────────── */
  const [isOpen, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editId, setEditId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const isEditing = useMemo(() => editId !== null, [editId]);

  /* ── Section: Mutations ────────────────────────────────────────────────── */
  const createMut = useMutation({
    mutationFn: (payload: { originId: number; destinationId: number; type: TransportationType }) =>
      Api.createTransportation(payload),
    onSuccess: (t) => {
      qc.invalidateQueries({ queryKey: ["transportations"] });
      show(`Transportation created: ${t.origin.locationCode} → ${t.destination.locationCode} (${t.type})`, "success");
      closeModal();
    },
    onError: (e) => show(getErrorMessage(e, "Create failed"), "error"),
  });

  const updateMut = useMutation({
    mutationFn: (vars: {
      id: number;
      payload: { originId: number; destinationId: number; type: TransportationType };
    }) => Api.updateTransportation(vars.id, vars.payload),
    onSuccess: (t) => {
      qc.invalidateQueries({ queryKey: ["transportations"] });
      show(`Transportation updated: ${t.origin.locationCode} → ${t.destination.locationCode} (${t.type})`, "success");
      closeModal();
    },
    onError: (e) => show(getErrorMessage(e, "Update failed"), "error"),
  });

  const deleteMut = useMutation({
    mutationFn: (id: number) => Api.deleteTransportation(id),
    onMutate: (id) => setDeletingId(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transportations"] });
      show("Transportation deleted", "success");
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
  function openEdit(t: Transportation) {
    setForm({ originId: t.origin.id, destinationId: t.destination.id, type: t.type });
    setEditId(t.id);
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
    if (confirm(`Are you sure you want to delete '${label}'?`)) deleteMut.mutate(id);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.originId === "" || form.destinationId === "") {
      show("Origin and destination must be selected.", "error");
      return;
    }
    if (form.originId === form.destinationId) {
      show("Origin and destination cannot be the same.", "error");
      return;
    }
    const payload = {
      originId: Number(form.originId),
      destinationId: Number(form.destinationId),
      type: form.type,
    };
    if (isEditing && editId !== null) updateMut.mutate({ id: editId, payload });
    else createMut.mutate(payload);
  }

  const busy = createMut.isPending || updateMut.isPending;

  /* ── Section: Render ───────────────────────────────────────────────────── */
  return (
    <div>
      <div className="flex items-center mb-3">
        <h2 className="m-0 mr-auto text-lg font-bold">Transportations</h2>
        <button className="btn btn-primary" onClick={openCreate} aria-label="Add Transportation">
          + Add Transportation
        </button>
      </div>

      <div className="card">
        {(isPending || isLocLoading) && <p>Loading…</p>}
        {(error || locError) && <p className="text-red-600">An error occurred</p>}

        {transportations && transportations.length > 0 && (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Origin</th>
                  <th>Destination</th>
                  <th>Type</th>
                  <th style={{ width: 160 }} />
                </tr>
              </thead>
              <tbody>
                {transportations.map((t) => (
                  <tr key={t.id}>
                    <td className="cell-strong">
                      {t.origin.name} <span className="label">({t.origin.locationCode})</span>
                    </td>
                    <td>
                      {t.destination.name} <span className="label">({t.destination.locationCode})</span>
                    </td>
                    <td>
                      <span className={badgeClass(t.type)}>{t.type}</span>
                    </td>
                    <td>
                      <div className="flex gap-2 justify-end">
                        <button
                          className="btn btn-ghost"
                          onClick={() => openEdit(t)}
                          aria-label={`Edit ${t.origin.locationCode} → ${t.destination.locationCode}`}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            onDelete(t.id, `${t.origin.locationCode} → ${t.destination.locationCode} (${t.type})`)
                          }
                          disabled={deletingId === t.id}
                          aria-label={`Delete ${t.origin.locationCode} → ${t.destination.locationCode}`}
                        >
                          {deletingId === t.id ? "Deleting…" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {transportations && transportations.length === 0 && <p>No transportations yet.</p>}
      </div>

      {/* ── Modal ─────────────────────────────────────────────────────────── */}
      {isOpen && (
        <div className="modal-overlay" onClick={() => !busy && closeModal()}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h3 className="modal__title">{isEditing ? "Edit Transportation" : "Add Transportation"}</h3>
              <button className="icon-btn" onClick={closeModal} disabled={busy} aria-label="Close modal">
                ×
              </button>
            </div>

            {(createMut.error || updateMut.error) && (
              <p className="text-red-600" style={{ marginTop: 0 }}>
                {getErrorMessage(createMut.error || updateMut.error, "Request failed")}
              </p>
            )}

            <form onSubmit={submit} className="form">
              <div className="grid-2">
                <div className="field">
                  <label className="field__label" htmlFor="tr-origin">
                    Origin
                  </label>
                  <select
                    id="tr-origin"
                    className="field__input"
                    value={form.originId}
                    onChange={(e) => onChange("originId", e.target.value === "" ? "" : Number(e.target.value))}
                  >
                    <option value="">Select origin…</option>
                    {locations?.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} ({l.locationCode})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label className="field__label" htmlFor="tr-dest">
                    Destination
                  </label>
                  <select
                    id="tr-dest"
                    className="field__input"
                    value={form.destinationId}
                    onChange={(e) =>
                      onChange("destinationId", e.target.value === "" ? "" : Number(e.target.value))
                    }
                  >
                    <option value="">Select destination…</option>
                    {locations?.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} ({l.locationCode})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="field">
                <label className="field__label" htmlFor="tr-type">
                  Type
                </label>
                <select
                  id="tr-type"
                  className="field__input"
                  value={form.type}
                  onChange={(e) => onChange("type", e.target.value as TransportationType)}
                >
                  <option value="FLIGHT">FLIGHT</option>
                  <option value="BUS">BUS</option>
                  <option value="SUBWAY">SUBWAY</option>
                  <option value="UBER">UBER</option>
                </select>
              </div>

              <div className="modal__footer">
                <button type="button" className="btn btn-ghost" onClick={closeModal} disabled={busy}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={busy}>
                  {isEditing ? (busy ? "Saving…" : "Save Changes") : busy ? "Creating…" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}