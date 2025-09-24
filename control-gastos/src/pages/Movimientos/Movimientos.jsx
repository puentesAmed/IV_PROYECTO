import DataTable from '../../components/table/DataTable';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { useDebounce } from '../../hooks/useDebounce';
import { useMovimientos } from '../../hooks/useMovimientos';
import { useMemo, useCallback, useRef, useState } from 'react';
import './Movimientos.css';
import eliminar from '../../assets/cesto.png';

export default function Movimientos() {
  const { list, loading, filters, setFilter, loadNextPage, remove } = useMovimientos({
    q: '',
    categoria: '',
    limit: 'ALL'   // 👈 traigo todos los movimientos
  });

  const [search, setSearch] = useState('');
  const tableRef = useRef();
  const debouncedSearch = useDebounce((v) => setSearch(v.toLowerCase()), 400);

  // Scroll (solo por si cambias a paginación)
  const handleScroll = useCallback(() => {
    const el = tableRef.current;
    if (!el || loading) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
      loadNextPage();
    }
  }, [loading, loadNextPage]);

  const handleDelete = useCallback(async (id) => {
    if (!id) return;
    const ok = window.confirm("¿Eliminar este movimiento?");
    if (!ok) return;
    await remove(id);
  }, [remove]);

  // 🔍 Filtro en frontend
  const filteredList = useMemo(() => {
    return list.filter((mov) => {
      const text = `${mov.fecha} ${mov.concepto} ${mov.categoria} ${mov.importe}`.toLowerCase();
      return text.includes(search);
    });
  }, [list, search]);

  const columns = useMemo(() => [
    { key: 'fecha', header: 'Fecha' },
    { key: 'concepto', header: 'Concepto' },
    { key: 'categoria', header: 'Categoría' },
    { key: 'importe', header: 'Importe', render: (r) => `${Number(r.importe).toFixed(2)}€` },
    { 
      key: "acciones", 
      header: "", 
      render: (r) =>
        <button className="move-btn" onClick={() => handleDelete(r.id)}>
          <img src={eliminar} alt="Eliminar" className='icon-invert-white'/>
        </button>
    },  
  ], [handleDelete]);

  return (
    <section className="movimientos-view">
      <header className="mov-head">
        <h1>Movimientos</h1>
        <p className="muted">Consulta, busca y gestiona todos tus movimientos.</p>
      </header>

      <div className="cardfilters-bar">
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
        <DataTable columns={columns} rows={filteredList} />
        {loading && <p style={{ textAlign: 'center', margin: '8px 0' }}>Cargando…</p>}
        {!loading && filteredList.length === 0 && <p style={{ textAlign: 'center', margin: '8px 0' }}>No hay movimientos</p>}
      </div>
    </section>
  );
}
