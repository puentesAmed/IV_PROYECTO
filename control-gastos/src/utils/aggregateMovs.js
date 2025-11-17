const trunc = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  x.setHours(0, 0, 0, 0);
  return x;
};

const addMonths = (y, m, delta) => {
  const d = new Date(y, m, 1);
  d.setMonth(d.getMonth() + delta);
  d.setHours(0, 0, 0, 0);
  return d;
};

const yyyymm = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

const sumTotals = (series) => {
  const t = series.reduce(
    (a, r) => ({
      ingresos: a.ingresos + r.ingresos,
      gastos: a.gastos + r.gastos,
    }),
    { ingresos: 0, gastos: 0 }
  );
  return { ...t, balance: t.ingresos - t.gastos };
};

export function aggregateByDates(list, dateStart, dateEnd) {
  const s0 = trunc(new Date(dateStart));
  const e0 = trunc(new Date(dateEnd));
  const s = s0 <= e0 ? s0 : e0;
  const e = s0 <= e0 ? e0 : s0;

  const series = [];
  for (let d = new Date(s); d <= e; d = addDays(d, 1)) {
    series.push({
      key: +d,
      label: d.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
      }),
      ingresos: 0,
      gastos: 0,
    });
  }

  const map = new Map(series.map((r) => [r.key, r]));

  list.forEach((m) => {
    const d = trunc(m.fecha || m.createdAt || Date.now());
    if (d < s || d > e) return;

    const val = Number(m.importe) || 0;
    const row = map.get(+d);
    if (!row) return;

    if (m.categoria === "Ingresos") row.ingresos += Math.max(0, val);
    else row.gastos += Math.abs(val);
  });

  return { series, totals: sumTotals(series) };
}

export function aggregateByMonths(list, monthStart, monthEnd) {
  const [ys, ms] = monthStart.split("-").map(Number);
  const [ye, me] = monthEnd.split("-").map(Number);

  const s0 = new Date(ys, (ms || 1) - 1, 1);
  const e0 = new Date(ye, (me || 1) - 1, 1);

  const s = s0 <= e0 ? s0 : e0;
  const e = s0 <= e0 ? e0 : s0;

  const series = [];
  for (let d = new Date(s); d <= e; d = addMonths(d.getFullYear(), d.getMonth(), 1)) {
    series.push({
      key: yyyymm(d),
      label: d.toLocaleDateString("es-ES", { month: "short", year: "2-digit" }),
      ingresos: 0,
      gastos: 0,
    });
  }

  const map = new Map(series.map((r) => [r.key, r]));

  list.forEach((m) => {
    const d = trunc(m.fecha || m.createdAt || Date.now());
    const k = yyyymm(d);
    const row = map.get(k);
    if (!row) return;

    const val = Number(m.importe) || 0;
    if (m.categoria === "Ingresos") row.ingresos += Math.max(0, val);
    else row.gastos += Math.abs(val);
  });

  return { series, totals: sumTotals(series) };
}

export function aggregateByYears(list, yearStart, yearEnd) {
  const ys = Number(yearStart);
  const ye = Number(yearEnd);

  const s = Math.min(ys, ye);
  const e = Math.max(ys, ye);

  const series = [];
  for (let y = s; y <= e; y++) {
    series.push({
      key: String(y),
      label: String(y),
      ingresos: 0,
      gastos: 0,
    });
  }

  const map = new Map(series.map((r) => [r.key, r]));

  list.forEach((m) => {
    const d = new Date(m.fecha || m.createdAt || Date.now());
    const k = String(d.getFullYear());
    const row = map.get(k);
    if (!row) return;

    const val = Number(m.importe) || 0;
    if (m.categoria === "Ingresos") row.ingresos += Math.max(0, val);
    else row.gastos += Math.abs(val);
  });

  return { series, totals: sumTotals(series) };
}

/**
 * Facade unificada
 */
export function aggregate(list, mode, ranges) {
  if (mode === "dates") {
    return aggregateByDates(list, ranges.dateStart, ranges.dateEnd);
  }
  if (mode === "months") {
    return aggregateByMonths(list, ranges.monthStart, ranges.monthEnd);
  }
  return aggregateByYears(list, ranges.yearStart, ranges.yearEnd);
}
