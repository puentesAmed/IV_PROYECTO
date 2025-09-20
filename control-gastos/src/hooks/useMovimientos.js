import { useContext, useEffect, useMemo, useState, useCallback } from "react";
import { Ctx } from "../context/MovimientosContext";

const DEFAULTS = { page: 1, limit: 10, q: "", categoria: "" };

export function useMovimientos(initial = {}) {
  const { list, total, loading, error, fetchList, create, update, remove } = useContext(Ctx);

  const [filters, setFilters] = useState(() => ({ ...DEFAULTS, ...initial }));

  useEffect(() => { fetchList(filters); }, [filters, fetchList]);

  const setFilter = useCallback((patch) => {
    setFilters(prev => ({ ...prev, ...patch }));
  }, []);

  const refetch = useCallback(() => fetchList(filters), [fetchList, filters]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((total || 0) / (filters.limit || 10))),
    [total, filters.limit]
  );

  const pagination = useMemo(
    () => ({ total, totalPages, page: filters.page, limit: filters.limit }),
    [total, totalPages, filters.page, filters.limit]
  );

  return { list, total, loading, error, filters, setFilter, pagination, refetch, create, update, remove };
}
