/*import { useState, useEffect, useCallback } from "react";

const DEFAULTS = { page: 1, limit: 'ALL', q: '', categoria: '' }; 
const API = (import.meta.env.VITE_API_URL || 'http://localhost:5179').replace(/\/$/,'');

export function useMovimientos(initial = {}) {
  const [filters, setFilters] = useState({ ...DEFAULTS, ...initial });
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false); 

  const fetchMovimientos = useCallback(async ({ page = 1, append = false } = {}) => {
    setLoading(true);
    try {
      const isAll = String(filters.limit).toUpperCase() === 'ALL';
      const p = new URLSearchParams();
      if (!isAll) { p.set('_page', String(page)); p.set('_limit', String(filters.limit)); }
      if (filters.q) p.append('q', filters.q);
      if (filters.categoria) p.append('categoria', filters.categoria);

      const res  = await fetch(`${API}/movimientos?${p.toString()}`);
      const data = await res.json();
      const total = Number(res.headers.get('X-Total-Count') || (isAll ? data.length : 0));

      setList(prev => {
        const next = append ? [...prev, ...data] : data;
        setHasMore(!isAll && next.length < total);
        return next;
      });
      setError(null);
    } catch (e) { setError(e); } 
    finally { setLoading(false); }
  }, [filters.q, filters.categoria, filters.limit]);

  useEffect(() => { 
    setList([]);
    fetchMovimientos({ page: 1, append: false });
  }, [filters.q, filters.categoria, filters.limit, fetchMovimientos]);

  const loadNextPage = useCallback(() => {
    if (String(filters.limit).toUpperCase() === 'ALL') return; 
    if (loading || !hasMore) return;
    const nextPage = (filters.page ?? 1) + 1;
    fetchMovimientos({ page: nextPage, append: true });
    setFilters(prev => ({ ...prev, page: nextPage }));
  }, [filters.page, filters.limit, loading, hasMore, fetchMovimientos]);

  const setFilter = useCallback(patch => setFilters(prev => ({ ...prev, ...patch, page: 1 })), []);
  const refetch  = useCallback(() => fetchMovimientos({ page: 1, append: false }), [fetchMovimientos]);

  // ✅ NUEVO: crear movimiento
  const create = useCallback(async (nuevo) => {
    const res = await fetch(`${API}/movimientos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevo),
    });
    if (!res.ok) throw new Error("Error al crear movimiento");
    const data = await res.json();
    setList(prev => [...prev, data]);
    return data;
  }, []);

  // ✅ NUEVO: eliminar movimiento
  const remove = useCallback(async (id) => {
    const res = await fetch(`${API}/movimientos/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error al eliminar movimiento");
    setList(prev => prev.filter(m => m.id !== id));
  }, []);

  return { 
    list, loading, error, filters, setFilter, 
    refetch, loadNextPage, 
    create, remove  // 👉 ahora disponibles
  };
}
*/

import { useCallback, useEffect, useRef, useState } from "react";

const API = (import.meta.env.VITE_API_URL || "http://localhost:5179").replace(/\/$/, "");
const DEFAULTS = { page: 1, limit: 20, q: "", categoria: "" };

export function useMovimientos(initial = {}) {
  const [filters, setFilters] = useState({ ...DEFAULTS, ...initial });
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const hasMore = list.length < total;

  const fetchMovs = useCallback(
    async ({ page = 1, append = false } = {}) => {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          _page: String(page),
          _limit: String(filters.limit),
        });
        if (filters.q) params.append("q", filters.q);
        if (filters.categoria) params.append("categoria", filters.categoria);

        const res = await fetch(`${API}/movimientos?${params.toString()}`, {
          signal: ctrl.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const arr = Array.isArray(data) ? data : [];
        const totalCount = Number(res.headers.get("X-Total-Count") || arr.length || 0);

        setList((prev) => (append ? [...prev, ...arr] : arr));
        setTotal(totalCount);
      } catch (e) {
        if (e.name !== "AbortError") setError(e);
      } finally {
        setLoading(false);
      }
    },
    [filters.q, filters.categoria, filters.limit]
  );

  useEffect(() => {
    setList([]);
    setTotal(0);
    fetchMovs({ page: 1, append: false });
    return () => abortRef.current?.abort();
  }, [filters.q, filters.categoria, filters.limit, fetchMovs]);

  const loadNextPage = useCallback(() => {
    if (loading || !hasMore) return;
    const next = (filters.page ?? 1) + 1;
    fetchMovs({ page: next, append: true });
    setFilters((p) => ({ ...p, page: next }));
  }, [loading, hasMore, filters.page, fetchMovs]);

  const setFilter = useCallback(
    (patch) => setFilters((p) => ({ ...p, ...patch, page: 1 })),
    []
  );

  const refetch = useCallback(() => fetchMovs({ page: 1, append: false }), [fetchMovs]);

  const create = useCallback(
    async (payload) => {
      const res = await fetch(`${API}/movimientos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Error al crear");
      await refetch();
    },
    [refetch]
  );

  const remove = useCallback(async (id) => {
    const res = await fetch(`${API}/movimientos/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Error al eliminar");
    setList((prev) => prev.filter((m) => m.id !== id));
    setTotal((t) => Math.max(0, t - 1));
  }, []);

  return {
    list,
    total,
    loading,
    error,
    hasMore,
    filters,
    setFilter,
    refetch,
    loadNextPage,
    create,
    remove,
  };
}
