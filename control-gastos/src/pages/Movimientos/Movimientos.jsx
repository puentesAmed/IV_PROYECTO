import DataTable from '../../components/table/DataTable';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { useDebounce } from '../../hooks/useDebounce';
import { useMovimientos } from '../../hooks/useMovimientos';
import { useMemo, useCallback, useRef } from 'react';
import './Movimientos.css';

export default function Movimientos() {
  const { list, loading, filters, setFilter, loadNextPage } = useMovimientos({
    q: '',
    categoria: ''
  });

  const tableRef = useRef();
  const debouncedSearch = useDebounce((v) => setFilter({ q: v }), 400);

  // Scroll infinito con debounce
  const handleScroll = useCallback(() => {
    const el = tableRef.current;
    if (!el || loading) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
      loadNextPage();
    }
  }, [loading, loadNextPage]);

  const columns = useMemo(() => [
    { key: 'fecha', header: 'Fecha' },
    { key: 'concepto', header: 'Concepto' },
    { key: 'categoria', header: 'Categoría' },
    { key: 'importe', header: 'Importe', render: (r) => `${Number(r.importe).toFixed(2)}€` },
  ], []);

  return (
    <section className="movimientos-view">
      <header className="mov-head">
        <h1>Movimientos</h1>
        <p className="muted">Consulta, busca y gestiona todos tus movimientos.</p>
      </header>

      <div className="card filters-bar">
        <Input
          placeholder="Buscar por fecha, concepto, categoría o importe"
          defaultValue={filters.q}
          onChange={(e) => debouncedSearch(e.target.value)}
        />
        <Select
          value={filters.categoria}
          onChange={(e) => setFilter({ categoria: e.target.value })}
        >
          <option value="">Todas</option>
          <option>Alimentación</option>
          <option>Transporte</option>
          <option>Vivienda</option>
          <option>Ingresos</option>
        </Select>
      </div>

      <div
        className="card table-card"
        ref={tableRef}
        onScroll={handleScroll}
        style={{ maxHeight: '500px', overflowY: 'auto' }} // asegura scroll vertical
      >
        <DataTable columns={columns} rows={list} />
        {loading && <p style={{ textAlign: 'center', margin: '8px 0' }}>Cargando…</p>}
        {!loading && list.length === 0 && <p style={{ textAlign: 'center', margin: '8px 0' }}>No hay movimientos</p>}
      </div>
    </section>
  );
}
