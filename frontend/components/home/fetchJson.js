import { API_URL } from "@/lib/api";

// Server-side GET for home page sections. Returns null if the backend is down.
export default async function fetchJson(path) {
  try {
    const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// Loads featured items; falls back to the normal list if nothing is featured yet.
export async function fetchFeatured(endpoint) {
  let data = await fetchJson(`${endpoint}?is_featured=true`);
  if (data && data.results.length === 0) data = await fetchJson(endpoint);
  return data;
}
