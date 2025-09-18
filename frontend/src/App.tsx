/**
 * Title: App Shell & Routing (BrowserRouter + Providers)
 * Purpose: Provide the global layout (header/sidebar/main) and client-side routes for the app.
 */

import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import LocationsPage from "./pages/LocationsPage";
import RoutesPage from "./pages/RoutesPage";
import TransportationsPage from "./pages/TransportationsPage";
import AppHeader from "./components/AppHeader";
import { RouteProvider } from "./context/RouteContext";
import { ToastProvider } from "./components/Toast";

import "./App.css";

/* ── Layout (Header • Sidebar • Main) ──────────────────────────────────────
   Purpose: Shared chrome for all routes; <Outlet/> renders the current page. */
function Layout() {
  return (
    <div className="app">
      <AppHeader />

      <aside className="app__sidebar">
        <nav className="side" aria-label="Primary">
          {/* NOTE: Intentionally using <a> (hard links) to match the current stable behavior. */}
          <a href="/locations" className="navlink">Locations</a>
          <a href="/transportations" className="navlink">Transportations</a>
          <a href="/routes" className="navlink">Routes</a>
        </nav>
      </aside>

      <main className="app__main">
        <Outlet />
      </main>
    </div>
  );
}

/* ── App (Providers + Router + Routes) ─────────────────────────────────────
   Purpose: Compose global providers and declare the route table. */
export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <RouteProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<RoutesPage />} />
              <Route path="/routes" element={<RoutesPage />} />
              <Route path="/transportations" element={<TransportationsPage />} />
              <Route path="/locations" element={<LocationsPage />} />
              <Route path="*" element={<div style={{ padding: 24 }}>Not found</div>} />
            </Route>
          </Routes>
        </RouteProvider>
      </BrowserRouter>
    </ToastProvider>
  );
}
