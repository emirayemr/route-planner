/* ──────────────────────────────────────────────────────────────────────────
 * Title: AppHeader
 * Purpose: Application header with brand and contextual breadcrumb.
 * Notes: Breadcrumb appears only on Routes page when both ends are selected.
 * ────────────────────────────────────────────────────────────────────────── */
import { Link, useLocation } from "react-router-dom";
import { useRouteCrumb } from "../context/RouteContext";

export default function AppHeader() {
  // ── Routing context ──────────────────────────────────────────────────────
  const { pathname } = useLocation();
  const { crumb } = useRouteCrumb();

  const onRoutesPage = pathname.startsWith("/routes") || pathname === "/";
  const hasSelection = Boolean(crumb.origin && crumb.destination);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <header className="app__header app-header">
      <div className="app-header__left">
        {/* Brand (clickable to home) */}
        <Link to="/" className="brand" aria-label="Go to home">
          <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden>
            <circle cx="12" cy="12" r="10" fill="currentColor" opacity=".08" />
            <path
              d="M4 12h8L8 6m4 6 4 6h4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span className="brand__name text-2xl font-bold">Route Planner</span>
        </Link>

        {/* Breadcrumb: only on Routes page and when both origin & destination exist */}
        {onRoutesPage && hasSelection && (
          <nav className="crumbs" aria-label="Breadcrumb">
            <span className="crumb">{crumb.origin}</span>
            <span className="sep" aria-hidden>
              →
            </span>
            <span className="crumb">{crumb.destination}</span>
          </nav>
        )}
      </div>

      <div className="app-header__right">
        {/* Simple affordances; replace with real actions when available */}
        <button className="icon-btn" title="Help">
          ?
        </button>
        <button className="avatar" aria-label="Account">
          <span>EA</span>
        </button>
      </div>
    </header>
  );
}
