import { createContext, useState, useCallback, useMemo, useRef } from "react";

import * as svc from '../services/movimientos.service';

const Ctx = createContext(null);

function MovimientosProvider({ children }) {
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const ctrlRef = useRef(null);

  const fetchList = useCallback(async (params) => {
    ctrlRef.current?.abort();
    ctrlRef.current = new AbortController();
    setLoading(true);
    setError(null);
    
    try {
        const res = await svc.getMovimientos(params, ctrlRef.current.signal);
        setList(res.items);
        setTotal(res.total);
    } catch (e) {
        if (e.name !== 'AbortError') setError(e.message ?? 'Error desconocido');
    } finally {
        setLoading(false);
    }
  }, []);

  const create = useCallback(async (data) => {
    await svc.createMovimiento(data);
    await fetchList();
  }, [fetchList]);
  const update = useCallback(async (id, data) => {
    await svc.updateMovimiento(id, data);
    await fetchList();
  }, [fetchList]);
  const remove = useCallback(async (id) => {
    await svc.deleteMovimiento(id);
    await fetchList();
  }, [fetchList]);


  const value = useMemo(() => ({
    list,
    total,
    loading,
    error,
    fetchList,
    create,
    update,
    remove
  }), [list, total, loading, error, fetchList, create, update, remove]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};



export { MovimientosProvider, Ctx };
