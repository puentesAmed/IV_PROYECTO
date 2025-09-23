import { useState, useEffect, useCallback } from "react";

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

  return { list, loading, error, filters, setFilter, refetch, loadNextPage };
}