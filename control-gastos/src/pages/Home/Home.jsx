import MonthlyBar from '../../components/charts/MonthlyBar';
import PeriodSwitch from '../../components/PeriodSwitch/PeriodSwitch';
import { aggregate } from '../../utils/aggregateMovs';
import { useMovimientos } from '../../hooks/useMovimientos';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home(){
  const { list = [] } = useMovimientos({ page: 1, limit: 1000 });

  // Modo: 'dates' | 'months' | 'years'
  const [mode, setMode] = useState('months');

  // Rango inicial por modo
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth()+1).padStart(2,'0');
  const dd = String(now.getDate()).padStart(2,'0');

  const [dateStart, setDateStart]   = useState(`${yyyy}-${mm}-01`);
  const [dateEnd, setDateEnd]       = useState(`${yyyy}-${mm}-${dd}`);
  const [monthStart, setMonthStart] = useState(`${yyyy}-01`);
  const [monthEnd, setMonthEnd]     = useState(`${yyyy}-${mm}`);
  const [yearStart, setYearStart]   = useState(String(yyyy-2));
  const [yearEnd, setYearEnd]       = useState(String(yyyy));

  const fmtMoney = useMemo(
    () => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }),
    []
  );
  const fmtDate = useMemo(
    () => new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium' }),
    []
  );

  // Serie + totales ya calculados por el util
  const { series, totals } = useMemo(
    () => aggregate(list, mode, { dateStart, dateEnd, monthStart, monthEnd, yearStart, yearEnd }),
    [list, mode, dateStart, dateEnd, monthStart, monthEnd, yearStart, yearEnd]
  );

  const { ingresos: tIng = 0, gastos: tGas = 0, balance = 0 } = totals || {};

  return (
    <section className="home-view">
      <header className="home-head">
        <h1>Panel</h1>
        <p className="muted">Elige rango por fechas, meses o años.</p>
      </header>

      <div className="card period">
        {/* Selector de modo */}
        <PeriodSwitch value={mode} onChange={setMode} />

        {/* Controles de rango */}
        <div className="card" style={{ marginTop: 12 }}>
          {mode === 'dates' && (
            <div className="period-controls">
              <div className="pc-item">
                <label htmlFor="d1">Desde</label>
                <input id="d1" type="date" className="input" value={dateStart} onChange={e=>setDateStart(e.target.value)} />
              </div>
              <div className="pc-item">
                <label htmlFor="d2">Hasta</label>
                <input id="d2" type="date" className="input" value={dateEnd} onChange={e=>setDateEnd(e.target.value)} />
              </div>
            </div>
          )}
          {mode === 'months' && (
            <div className="period-controls">
              <div className="pc-item">
                <label htmlFor="m1">Desde</label>
                <input id="m1" type="month" className="input" value={monthStart} onChange={e=>setMonthStart(e.target.value)} />
              </div>
              <div className="pc-item">
                <label htmlFor="m2">Hasta</label>
                <input id="m2" type="month" className="input" value={monthEnd} onChange={e=>setMonthEnd(e.target.value)} />
              </div>
            </div>
          )}
          {mode === 'years' && (
            <div className="period-controls">
              <div className="pc-item">
                <label htmlFor="y1">Desde</label>
                <input id="y1" type="number" className="input" min="1970" max="9999" value={yearStart} onChange={e=>setYearStart(e.target.value)} />
              </div>
              <div className="pc-item">
                <label htmlFor="y2">Hasta</label>
                <input id="y2" type="number" className="input" min="1970" max="9999" value={yearEnd} onChange={e=>setYearEnd(e.target.value)} />
              </div>
            </div>
          )}
        </div>

        {/* KPIs */}
        <div className="grid kpis" style={{ marginTop: 12 }}>
          <article className="card kpi">
            <span className="kpi__label">Ingresos</span>
            <span className="kpi__value kpi__value--pos">{fmtMoney.format(tIng)}</span>
          </article>
          <article className="card kpi">
            <span className="kpi__label">Gastos</span>
            <span className="kpi__value kpi__value--neg">-{fmtMoney.format(tGas).replace('€','').trim()}€</span>
          </article>
          <article className="card kpi">
            <span className="kpi__label">Balance</span>
            <span className={`kpi__value ${balance>=0?'kpi__value--pos':'kpi__value--neg'}`}>{fmtMoney.format(balance)}</span>
          </article>
        </div>

        {/* Gráfico */}
        <article className="card chart">
          <h2 className="chart__title">
            Resumen por {mode === 'dates' ? 'días' : mode === 'years' ? 'años' : 'meses'}
          </h2>
          <MonthlyBar
            data={series}
            xKey="label"
            series={[
              { key: 'ingresos', label: 'Ingresos', color: 'var(--button)' },
              { key: 'gastos',   label: 'Gastos',   color: 'var(--accent)' }
            ]}
            height={220}
            variant="line"   // o "line" si quieres con líneas
          />
        </article>
      </div>

      {/* Últimos movimientos */}
      <article className="card data-card">
        <div className="data-card__bar">
          <h2 className="data-card__title">Últimos movimientos</h2>
          <Link to="/movimientos" className="btn">Ver todos</Link>
        </div>

        <div className="table-wrap">
          <table className="table table-modern">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Concepto</th>
                <th>Categoría</th>
                <th className="num">Importe</th>
              </tr>
            </thead>
            <tbody>
              {list.slice(0,10).map((m,i)=>{
                const ingreso = m.categoria === 'Ingresos';
                const val = Number(m.importe)||0;
                return (
                  <tr key={m._id || i}>
                    <td data-label="Fecha">{fmtDate.format(new Date(m.fecha || m.createdAt || Date.now()))}</td>
                    <td data-label="Concepto" className="text-strong">{m.concepto || '-'}</td>
                    <td data-label="Categoría">
                      <span className={`badge ${ingreso?'badge--pos':'badge--muted'}`}>{m.categoria}</span>
                    </td>
                    <td data-label="Importe" className={`num amount ${ingreso?'amount--pos':'amount--neg'}`}>
                      {fmtMoney.format(ingreso ? Math.max(0,val) : -Math.abs(val))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}
