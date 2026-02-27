import { DataTable } from "../../components/table/DataTable";
import { useDebounce } from "../../hooks/useDebounce";
import { useMovimientos } from "../../hooks/useMovimientos";
import { useMemo, useCallback, useRef, useState, useEffect } from "react";
import { MovimientosFilters } from "../../components/movimientos/MovimientosFilters";
import { useNotification } from "../../context/NotificationContext";
import "./Movimientos.css";
import eliminar from "../../assets/cesto.png";

export function Movimientos() {
  const { list, loading, hasMore, filters, setFilter, loadNextPage, remove, loadSampleData } = useMovimientos();
  const { notify } = useNotification();

  const [search, setSearch] = useState("");
  const tableRef = useRef();
  const { debounced: debouncedSearch } = useDebounce((v) => setSearch(v.toLowerCase()), 300);

  useEffect(() => {
    setFilter({ q: search });
  }, [search, setFilter]);

  const handleScroll = useCallback(() => {
    const el = tableRef.current;
    if (!el || loading) return;
    if (hasMore && el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
      loadNextPage();
    }
  }, [loading, hasMore, loadNextPage]);

  const handleDelete = useCallback(
    async (id) => {
      if (!id) return;
      await remove(id);
      notify("Movimiento eliminado", "info");
    },
    [remove, notify]
  );

  const eur = useMemo(() => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }), []);

  const columns = useMemo(
    () => [
      { key: "fecha", header: "Fecha" },
      { key: "concepto", header: "Concepto" },
      { key: "categoria", header: "Categoría" },
      {
        key: "importe",
        header: "Importe",
        render: (r) => eur.format(Number.isFinite(+r.importe) ? +r.importe : 0),
        align: "right",
      },
      {
        key: "acciones",
        header: "",
        render: (r) => (
          <button className="move-btn" onClick={() => handleDelete(r.id)} aria-label={`Eliminar movimiento ${r.concepto ?? r.id}`} title="Eliminar">
            <img src={eliminar} alt="" className="icon-invert-white" />
          </button>
        ),
      },
    ],
    [handleDelete, eur]
  );

  return (
    <section className="movimientos-view">
      <header className="mov-head">
        <h1>Movimientos</h1>
        <p className="muted">Consulta, busca y gestiona todos tus movimientos.</p>
        <button
          type="button"
          className="btn btn--outline"
          onClick={() => {
            loadSampleData();
            notify("Datos de ejemplo cargados", "info");
          }}
        >
          Cargar datos de ejemplo
        </button>
      </header>

      <MovimientosFilters
        onSearch={debouncedSearch}
        categoria={filters.categoria}
        onCategoriaChange={(categoria) => setFilter({ categoria })}
      />

      <div className="card table-card" ref={tableRef} onScroll={handleScroll} style={{ maxHeight: "500px", overflowY: "auto" }}>
        <DataTable columns={columns} rows={Array.isArray(list) ? list : []} />

        {loading && <p role="status" style={{ textAlign: "center", margin: "8px 0" }}>Cargando…</p>}

        {!loading && (!Array.isArray(list) || list.length === 0) && <p style={{ textAlign: "center", margin: "8px 0" }}>No hay movimientos</p>}
      </div>
    </section>
  );
}
