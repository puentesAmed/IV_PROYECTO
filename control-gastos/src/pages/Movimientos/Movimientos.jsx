import DataTable from '../../components/table/DataTable';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { useDebounce } from '../../hooks/useDebounce';
import { useMovimientos } from '../../hooks/useMovimientos';
import { useMemo, useCallback, useRef, useState, useEffect } from 'react';
import './Movimientos.css';
import eliminar from '../../assets/cesto.png';

export default function Movimientos() {
  const { list, loading, hasMore, filters, setFilter, loadNextPage, remove } = useMovimientos({
    q: '',
    categoria: '',
    limit: 20
  });

  const [search, setSearch] = useState('');
  const tableRef = useRef();
  const { debounced: debouncedSearch } = useDebounce((v) => setSearch(v.toLowerCase()), 300);

  // sincroniza búsqueda con backend
  useEffect(() => { setFilter({ q: search }); }, [search, setFilter]);

  const handleScroll = useCallback(() => {
    const el = tableRef.current;
    if (!el || loading) return;
    if (hasMore && el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
      loadNextPage();
    }
  }, [loading, hasMore, loadNextPage]);

  const handleDelete = useCallback(async (id) => {
    if (!id) return;
    const ok = window.confirm("¿Eliminar este movimiento?");
    if (!ok) return;
    await remove(id);
  }, [remove]);

  const eur = useMemo(
    () => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }),
    []
  );

  const columns = useMemo(() => [
    { key: 'fecha', header: 'Fecha' },
    { key: 'concepto', header: 'Concepto' },
    { key: 'categoria', header: 'Categoría' },
    {
      key: 'importe',
      header: 'Importe',
      render: (r) => eur.format(Number.isFinite(+r.importe) ? +r.importe : 0),
      align: 'right'
    },
    {
      key: "acciones",
      header: "",
      render: (r) =>
        <button className="move-btn" onClick={() => handleDelete(r.id)} aria-label={`Eliminar movimiento ${r.concepto ?? r.id}`} title="Eliminar">
          <img src={eliminar} alt="" className='icon-invert-white'/>
        </button>
    },
  ], [handleDelete, eur]);

  return (
    <section className="movimientos-view">
      <header className="mov-head">
        <h1>Movimientos</h1>
        <p className="muted">Consulta, busca y gestiona todos tus movimientos.</p>
      </header>

      <div className="filters-bar">
        <Input
          placeholder="Buscar por fecha, concepto, categoría o importe"
          onChange={(e) => debouncedSearch(e.target.value)}
          id="search"
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
          <option>Ahorro</option>
          <option>Hogar</option>
          <option>Tecnología</option>
          <option>Viajes</option>
          <option>Impuestos</option>
          <option>Niños</option>
          <option>Ocio</option>
          <option>Salud</option>
          <option>Educación</option>
          <option>Regalos</option>
          <option>Ropa</option>
          <option>Mascotas</option>
          <option>Deportes</option>
          <option>Suscripciones</option>
          <option>Otros</option>
        </Select>
      </div>

      <div
        className="card table-card"
        ref={tableRef}
        onScroll={handleScroll}
        style={{ maxHeight: '500px', overflowY: 'auto' }}
      >
        <DataTable columns={columns} rows={Array.isArray(list) ? list : []} />
        {loading && <p role="status" style={{ textAlign: 'center', margin: '8px 0' }}>Cargando…</p>}
        {!loading && (!Array.isArray(list) || list.length === 0) && (
          <p style={{ textAlign: 'center', margin: '8px 0' }}>No hay movimientos</p>
        )}
      </div>
    </section>
  );
}
