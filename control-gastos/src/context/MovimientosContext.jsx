import { createContext, useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "movimientos_storage";
const DEFAULT_FILTERS = { page: 1, limit: 20, q: "", categoria: "" };

const sampleMovimientos = [
  { id: "m1", fecha: "2026-02-01", concepto: "Nómina", categoria: "Ingresos", importe: 1650 },
  { id: "m2", fecha: "2026-02-03", concepto: "Supermercado", categoria: "Alimentación", importe: -92.4 },
  { id: "m3", fecha: "2026-02-05", concepto: "Gasolina", categoria: "Transporte", importe: -55 },
  { id: "m4", fecha: "2026-02-08", concepto: "Internet", categoria: "Hogar", importe: -39.9 },
  { id: "m5", fecha: "2026-02-10", concepto: "Freelance", categoria: "Ingresos", importe: 420 },
];

function readMovimientos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export const MovimientosContext = createContext(null);

export function MovimientosProvider({ children }) {
  const [allMovimientos, setAllMovimientos] = useState(() => readMovimientos());
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allMovimientos));
  }, [allMovimientos]);

  const setFilter = useCallback((patch) => {
    setFilters((prev) => ({ ...prev, ...patch, page: 1 }));
  }, []);

  const filtered = useMemo(() => {
    const search = filters.q.trim().toLowerCase();

    return allMovimientos.filter((item) => {
      const byCategory = filters.categoria ? item.categoria === filters.categoria : true;
      if (!byCategory) return false;

      if (!search) return true;

      const fields = [item.fecha, item.concepto, item.categoria, String(item.importe ?? "")]
        .join(" ")
        .toLowerCase();

      return fields.includes(search);
    });
  }, [allMovimientos, filters.q, filters.categoria]);

  const total = filtered.length;
  const visibleCount = (filters.page || 1) * (filters.limit || 20);
  const list = filtered.slice(0, visibleCount);
  const hasMore = list.length < filtered.length;

  const create = useCallback(async (payload) => {
    const next = { ...payload, id: crypto.randomUUID() };
    setAllMovimientos((prev) => [next, ...prev]);
  }, []);

  const remove = useCallback(async (id) => {
    setAllMovimientos((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const loadNextPage = useCallback(() => {
    setFilters((prev) => ({ ...prev, page: prev.page + 1 }));
  }, []);

  const loadSampleData = useCallback(() => {
    setAllMovimientos(sampleMovimientos);
  }, []);

  const value = useMemo(
    () => ({
      list,
      total,
      loading: false,
      error: null,
      hasMore,
      filters,
      setFilter,
      loadNextPage,
      create,
      remove,
      loadSampleData,
    }),
    [list, total, hasMore, filters, setFilter, loadNextPage, create, remove, loadSampleData]
  );

  return <MovimientosContext.Provider value={value}>{children}</MovimientosContext.Provider>;
}
