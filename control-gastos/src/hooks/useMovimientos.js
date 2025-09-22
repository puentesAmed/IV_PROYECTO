/*import { useContext, useEffect, useMemo, useState, useCallback } from "react";
import { Ctx } from "../context/MovimientosContext";

const DEFAULTS = { page: 1, limit: 10, q: "", categoria: "" };

export function useMovimientos(initial = {}) {
  const { list, total, loading, error, fetchList, create, update, remove } = useContext(Ctx);

  const [filters, setFilters] = useState(() => ({ ...DEFAULTS, ...initial }));

  useEffect(() => { fetchList(filters); }, [filters, fetchList]);

  const setFilter = useCallback((patch) => {
    setFilters(prev => { const next = { ...prev, ...patch }
      if (("q" in patch && patch.q !== prev.q) ||
          ("categoria" in patch && patch.categoria !== prev.categoria) ||
          ("limit" in patch && patch.limit !== prev.limit)) {
        next.page = 1;
      }
      return next;
    });
  }, []);

  const refetch = useCallback(() => fetchList(filters), [fetchList, filters]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((total || 0) / (filters.limit || 10))),
    [total, filters.limit]
  );

  const goToPage = useCallback((p) => {
    setFilters(prev => ({ ...prev, page: Math.min(Math.max(1, p), totalPages) }));
  }, [totalPages]);

  const nextPage = useCallback(() => goToPage((filters.page || 1) + 1), [goToPage, filters.page]);
  const prevPage = useCallback(() => goToPage((filters.page || 1) - 1), [goToPage, filters.page]);

  const pagination = useMemo(
    () => ({ total, totalPages, page: filters.page, limit: filters.limit, nextPage, prevPage, goToPage }),
    [total, totalPages, filters.page, filters.limit, nextPage, prevPage, goToPage]
  );

  return { list, total, loading, error, filters, setFilter, pagination, refetch, create, update, remove };
}
*/
/*
import { useContext, useEffect, useState, useCallback } from "react";
import { Ctx } from "../context/MovimientosContext";

export function useMovimientos(initial = {}) {
  const { list, loading, error, fetchList, create, update, remove } = useContext(Ctx);

  const [filters, setFilters] = useState(initial);

  // Traer todos los movimientos al cargar o cambiar filtros
  useEffect(() => {
    fetchList(filters);
  }, [filters, fetchList]);

  const setFilter = useCallback((patch) => {
    setFilters(prev => ({ ...prev, ...patch }));
  }, []);

  const refetch = useCallback(() => fetchList(filters), [fetchList, filters]);

  return { list, loading, error, filters, setFilter, refetch, create, update, remove };
}*/

import { useState, useEffect, useCallback } from "react";

const DEFAULTS = { page: 1, limit: 10, q: "", categoria: "" };

export function useMovimientos(initial = {}) {
  const [filters, setFilters] = useState({ ...DEFAULTS, ...initial });
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  // Fetch movimientos
  const fetchMovimientos = useCallback(async ({ page = 1, append = false }) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        _page: page,
        _limit: filters.limit,
      });
      if (filters.q) params.append('q', filters.q);
      if (filters.categoria) params.append('categoria', filters.categoria);

      const res = await fetch(`http://localhost:3000/movimientos?${params.toString()}`);
      const data = await res.json();
      const total = Number(res.headers.get('X-Total-Count') || 0);

      setList(prev => append ? [...prev, ...data] : data);
      setHasMore((append ? list.length + data.length : data.length) < total);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Resetear lista al cambiar filtros
  useEffect(() => {
    setList([]);
    setHasMore(true);
    fetchMovimientos({ page: 1, append: false });
  }, [filters.q, filters.categoria, filters.limit, fetchMovimientos]);

  // Scroll infinito
  const loadNextPage = useCallback(() => {
    if (loading || !hasMore) return;
    const nextPage = filters.page + 1;
    fetchMovimientos({ page: nextPage, append: true });
    setFilters(prev => ({ ...prev, page: nextPage }));
  }, [filters, loading, hasMore, fetchMovimientos]);

  const setFilter = useCallback((patch) => {
    setFilters(prev => ({ ...prev, ...patch, page: 1 }));
  }, []);

  const refetch = useCallback(() => {
    fetchMovimientos({ page: 1, append: false });
  }, [fetchMovimientos]);

  return { list, loading, error, filters, setFilter, refetch, loadNextPage };
}
