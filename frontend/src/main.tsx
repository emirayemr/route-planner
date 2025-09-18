/**
 * Title: Main Entry Point (ReactDOM + Providers)
 * Purpose: Bootstrap React app, attach it to #root, and provide global query client.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";

/* ── Create a single QueryClient instance ───────────────────────── */
const queryClient = new QueryClient();

/* ── Mount app into #root ───────────────────────────────────────── */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
