import { useSyncExternalStore, useEffect } from "react";
import {
  getCatalog,
  subscribeCatalog,
  loadCatalog,
  backend,
} from "../lib/catalog";

/**
 * Subscribe a component to the live catalog. Returns the current categories +
 * products (seeded synchronously from static data, then refreshed from the
 * configured backend). Kick off the one-time load on first mount.
 */
export function useCatalog() {
  const snapshot = useSyncExternalStore(subscribeCatalog, getCatalog, getCatalog);

  useEffect(() => {
    if (!snapshot.loaded) void loadCatalog();
  }, [snapshot.loaded]);

  return { ...snapshot, backend };
}
