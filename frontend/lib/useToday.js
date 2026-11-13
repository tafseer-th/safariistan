"use client";

import { useSyncExternalStore } from "react";

// Today's date as "YYYY-MM-DD" for <input type="date" min=...>.
// Empty on the server (build time) and filled in the browser, so the
// prerendered page never contains a stale date.
const subscribe = () => () => {};
const getToday = () => new Date().toISOString().split("T")[0];
const getServerToday = () => "";

export default function useToday() {
  return useSyncExternalStore(subscribe, getToday, getServerToday);
}
