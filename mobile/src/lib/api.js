import { useCallback, useEffect, useRef, useState } from "react";

// Same Django backend as the website. Override for local testing in mobile/.env:
// EXPO_PUBLIC_API_URL=http://192.168.1.10:8001   (your PC's Wi-Fi IP, not 127.0.0.1)
export const API_URL = (process.env.EXPO_PUBLIC_API_URL || "https://safristan.com").replace(/\/$/, "");

// WhatsApp: country code + number, no "+" and no spaces.
export const WHATSAPP_NUMBER = (process.env.EXPO_PUBLIC_WHATSAPP_NUMBER || "923150572710").replace(/\D/g, "");
export const CONTACT_EMAIL = process.env.EXPO_PUBLIC_CONTACT_EMAIL || "";
export const OFFICE_ADDRESS = process.env.EXPO_PUBLIC_OFFICE_ADDRESS || "";

export function whatsappUrl(text) {
  return `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

// 97750 -> "Rs 97,750" (done by hand: Intl is not reliable on every Android phone)
export function formatPrice(n) {
  const s = String(Math.round(Number(n) || 0));
  return `Rs ${s.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
}

// "+923150572710" -> "+92 315 0572710"
export function prettyPhone(digits) {
  const d = String(digits).replace(/\D/g, "");
  return d.startsWith("92") && d.length === 12 ? `+92 ${d.slice(2, 5)} ${d.slice(5)}` : `+${d}`;
}

export async function getJson(path) {
  const res = await fetch(path.startsWith("http") ? path : `${API_URL}${path}`);
  if (!res.ok) {
    const err = new Error(res.status === 404 ? "Not found" : "Server error");
    err.status = res.status;
    throw err;
  }
  return res.json();
}

// Loads featured items; falls back to the normal list if nothing is featured yet.
export async function getFeatured(endpoint) {
  const data = await getJson(`${endpoint}?is_featured=true`);
  if (data.results.length > 0) return data;
  return getJson(endpoint);
}

// Saves a booking / inquiry (it then shows up in the admin panel and sends the email alert).
export async function submitBooking(payload) {
  const res = await fetch(`${API_URL}/api/bookings/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 429) throw new Error("Too many requests. Please try again in a while.");
    const first = Object.values(data)[0];
    throw new Error(Array.isArray(first) ? first[0] : data.detail || "Something went wrong. Please try again.");
  }
  return data;
}

// One request with loading / error / reload.
export function useFetch(loader, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const load = useCallback(() => {
    let active = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    loader()
      .then((data) => active && setState({ data, loading: false, error: null }))
      .catch((error) => active && setState({ data: null, loading: false, error }));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  useEffect(load, [load]);
  return { ...state, reload: load };
}

// Paginated DRF list (12 per page) with infinite scroll and pull to refresh.
// `query` is an object of filters; empty values are left out.
export function usePagedList(endpoint, query) {
  const key = JSON.stringify(query);
  const [items, setItems] = useState([]);
  const [count, setCount] = useState(0);
  const [next, setNext] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const requestId = useRef(0);

  const firstPage = useCallback(
    (isRefresh = false) => {
      const id = ++requestId.current;
      const q = new URLSearchParams();
      Object.entries(JSON.parse(key)).forEach(([k, v]) => {
        if (v !== "" && v != null) q.set(k, String(v));
      });
      isRefresh ? setRefreshing(true) : setLoading(true);
      setError(null);
      getJson(`${endpoint}?${q.toString()}`)
        .then((data) => {
          if (id !== requestId.current) return; // a newer filter won
          setItems(data.results);
          setCount(data.count);
          setNext(data.next);
        })
        .catch((e) => id === requestId.current && setError(e))
        .finally(() => {
          if (id !== requestId.current) return;
          setLoading(false);
          setRefreshing(false);
        });
    },
    [endpoint, key]
  );

  useEffect(() => {
    firstPage();
  }, [firstPage]);

  const loadMore = useCallback(() => {
    if (!next || loadingMore || loading) return;
    const id = requestId.current;
    setLoadingMore(true);
    getJson(next)
      .then((data) => {
        if (id !== requestId.current) return;
        setItems((prev) => [...prev, ...data.results]);
        setNext(data.next);
      })
      .catch(() => {})
      .finally(() => setLoadingMore(false));
  }, [next, loadingMore, loading]);

  return {
    items,
    count,
    loading,
    loadingMore,
    refreshing,
    error,
    hasMore: Boolean(next),
    loadMore,
    refresh: () => firstPage(true),
    retry: () => firstPage(),
  };
}
