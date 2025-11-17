import { memo } from "react";
import PropTypes from "prop-types";

function DataTableInner({
  columns = [],
  rows = [],
  caption = "Listado de movimientos",
  getRowId = (r) => r.id,
  loading = false,
  emptyText = "Sin datos",
  onRowClick,
}) {
  const safeRows = Array.isArray(rows) ? rows : [];

  return (
    <div className="table-responsive">
      <table className="table">
        <caption className="sr-only">{caption}</caption>

        <colgroup>
          {columns.map((c) => (
            <col
              key={String(c.key)}
              style={c.width ? { width: c.width } : undefined}
            />
          ))}
        </colgroup>

        <thead>
          <tr>
            {columns.map((c) => (
              <th key={String(c.key)} scope="col">
                {c.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {loading && (
            <tr>
              <td
                colSpan={columns.length}
                role="status"
                style={{ textAlign: "center" }}
              >
                Cargando…
              </td>
            </tr>
          )}

          {!loading && safeRows.length === 0 && (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: "center" }}>
                {emptyText}
              </td>
            </tr>
          )}

          {!loading &&
            safeRows.map((r, i) => {
              const rowId = getRowId(r) ?? i;
              return (
                <tr
                  key={rowId}
                  onClick={onRowClick ? () => onRowClick(r) : undefined}
                >
                  {columns.map((c) => {
                    const value = r?.[c.key];
                    const content = c.render
                      ? c.render(r, value, i)
                      : String(value ?? "");
                    const alignClass =
                      c.align === "right"
                        ? "num"
                        : c.align === "center"
                        ? "center"
                        : "";

                    return (
                      <td
                        key={String(c.key)}
                        data-label={c.header}
                        className={`${alignClass} ${c.className ?? ""}`.trim()}
                      >
                        {content}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

DataTableInner.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      header: PropTypes.string.isRequired,
      width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      align: PropTypes.oneOf(["left", "right", "center"]),
      className: PropTypes.string,
      render: PropTypes.func,
    })
  ),
  rows: PropTypes.arrayOf(PropTypes.object),
  caption: PropTypes.string,
  getRowId: PropTypes.func,
  loading: PropTypes.bool,
  emptyText: PropTypes.string,
  onRowClick: PropTypes.func,
};

export const DataTable = memo(DataTableInner);
