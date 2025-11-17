import { useCallback, useEffect, useRef, useState } from "react";
import {
  getMovimientos,
  createMovimiento,
  deleteMovimiento,
} from "../services/movimientos.service";

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
        const { items, total: totalCount } = await getMovimientos(
          {
            page,
            limit: filters.limit,
            q: filters.q || undefined,
            categoria: filters.categoria || undefined,
          },
          { signal: ctrl.signal }
        );

        setList((prev) => (append ? [...prev, ...items] : items));
        setTotal(totalCount);
      } catch (e) {
        if (e.name !== "AbortError") setError(e);
      } finally {
        setLoading(false);
      }
    },
    [filters.limit, filters.q, filters.categoria]
  );

  useEffect(() => {
    setList([]);
    setTotal(0);
    fetchMovs({ page: 1, append: false });

    return () => abortRef.current?.abort();
  }, [filters.limit, filters.q, filters.categoria, fetchMovs]);

  const loadNextPage = useCallback(() => {
    if (loading || !hasMore) return;
    const next = (filters.page ?? 1) + 1;
    fetchMovs({ page: next, append: true });
    setFilters((prev) => ({ ...prev, page: next }));
  }, [loading, hasMore, filters.page, fetchMovs]);

  const setFilter = useCallback(
    (patch) => setFilters((prev) => ({ ...prev, ...patch, page: 1 })),
    []
  );

  const refetch = useCallback(
    () => fetchMovs({ page: 1, append: false }),
    [fetchMovs]
  );

  const create = useCallback(
    async (payload) => {
      await createMovimiento(payload);
      await refetch();
    },
    [refetch]
  );

  const remove = useCallback(
    async (id) => {
      await deleteMovimiento(id);
      setList((prev) => prev.filter((m) => m.id !== id));
      setTotal((t) => Math.max(0, t - 1));
    },
    []
  );

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
