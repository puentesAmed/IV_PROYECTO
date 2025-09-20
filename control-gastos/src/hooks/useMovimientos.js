import { useContext, useEffect, useMemo, useState, useCallback } from "react";
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
