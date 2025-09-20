import DataTable from '../components/table/DataTable';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { useDebounce } from '../hooks/useDebounce';
import { useMovimientos } from '../hooks/useMovimientos';
import { useMemo, useCallback } from 'react';


export default function Movimientos(){
    const { list, loading, filters, setFilter, pagination, remove } = useMovimientos({page: 1, limit: 10, q: '', categoria: '' });
    const debounced = useDebounce((v)=> setFilter({ q: v, page: 1 }), 400);

    const handleDelete = useCallback(async (id) => {
        if (!id) return;
        const ok = window.confirm("¿Eliminar este movimiento?");
        if (!ok) return;
        await remove(id);
  }, [remove]);

    const columns = useMemo(()=>[
        { key: 'fecha', header: 'Fecha' },
        { key: 'concepto', header: 'Concepto' },
        { key: 'categoria', header: 'Categoría' },
        { key: 'importe', header: 'Importe', render: (r)=> `${r.importe.toFixed(2)}€` },
        { key: "acciones", header: "", render: (r) =><button className="btn" onClick={() => handleDelete(r.id)}>Eliminar</button>},  
    ],[handleDelete]);
        return (
            <section>
                <h1>Movimientos</h1>
                <div className="filters">
                    <Input placeholder="Buscar" defaultValue={filters.q} onChange={(e)=> debounced(e.target.value)} />
                    <Select value={filters.categoria} onChange={(e)=> setFilter({ categoria: e.target.value, page: 1 })}>
                        <option value="">Todas</option>
                        <option>Alimentación</option>
                        <option>Transporte</option>
                        <option>Vivienda</option>
                        <option>Ingresos</option>
                    </Select>
                </div>

                {loading ? <p>Cargando…</p> : <DataTable columns={columns} rows={list} />}
                <div className="pagination">
                    <button disabled={(pagination.page ?? 1) <= 1} onClick={()=> setFilter({ page: (pagination.page ?? 1) - 1 })}>Anterior</button>
                    <span>{pagination.page} / {Math.max(1, Math.ceil(pagination.total / (pagination.limit ?? 10)))}</span>
                    <button disabled={(pagination.page ?? 1) >= Math.ceil(pagination.total / (pagination.limit ?? 10))} onClick={()=>
                    setFilter({ page: (pagination.page ?? 1) + 1 })}>Siguiente</button>
                </div>
            </section>
        );
}