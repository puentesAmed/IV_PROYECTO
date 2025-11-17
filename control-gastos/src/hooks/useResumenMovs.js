import { useMemo } from "react";
import { aggregate } from "../utils/aggregateMovs";

export function useResumenMovs(
  list = [],
  {
    mode,
    dateStart,
    dateEnd,
    monthStart,
    monthEnd,
    yearStart,
    yearEnd,
  }
) {
  const periodColLabel = useMemo(
    () => (mode === "years" ? "Año" : mode === "months" ? "Mes" : "Día"),
    [mode]
  );

  const bounds = useMemo(() => {
    let s, e;

    if (mode === "dates") {
      s = new Date(dateStart);
      e = new Date(dateEnd);
    } else if (mode === "months") {
      const [ys, ms] = (monthStart || "").split("-").map(Number);
      const [ye, me] = (monthEnd || "").split("-").map(Number);
      s = new Date(ys, (ms || 1) - 1, 1);
      e = new Date(ye, (me || 1), 0);
    } else {
      s = new Date(Number(yearStart), 0, 1);
      e = new Date(Number(yearEnd), 11, 31);
    }

    s.setHours(0, 0, 0, 0);
    e.setHours(23, 59, 59, 999);

    if (s > e) [s, e] = [e, s];

    return { s, e };
  }, [mode, dateStart, dateEnd, monthStart, monthEnd, yearStart, yearEnd]);

  const filtered = useMemo(
    () =>
      list.filter((m) => {
        const d = new Date(m.fecha || m.createdAt || Date.now());
        return d >= bounds.s && d <= bounds.e;
      }),
    [list, bounds]
  );

  const { series, totals } = useMemo(
    () =>
      aggregate(filtered, mode, {
        dateStart,
        dateEnd,
        monthStart,
        monthEnd,
        yearStart,
        yearEnd,
      }),
    [filtered, mode, dateStart, dateEnd, monthStart, monthEnd, yearStart, yearEnd]
  );

  const catRows = useMemo(() => {
    const map = new Map();

    filtered.forEach((m) => {
      const key = m.categoria || "Sin categoría";
      const row =
        map.get(key) || {
          categoria: key,
          ingresos: 0,
          gastos: 0,
          balance: 0,
        };

      const val = Number(m.importe) || 0;
      if (m.categoria === "Ingresos") {
        row.ingresos += Math.max(0, val);
      } else {
        row.gastos += Math.abs(val);
      }

      map.set(key, row);
    });

    const rows = Array.from(map.values()).map((r) => ({
      ...r,
      balance: r.ingresos - r.gastos,
    }));

    rows.sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance));

    return rows;
  }, [filtered]);

  return { series, totals, catRows, periodColLabel, bounds, filtered };
}
