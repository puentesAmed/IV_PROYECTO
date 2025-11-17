import { MonthlyBar } from '../../components/charts/MonthlyBar';
import {PeriodSwitch} from '../../components/common/PeriodSwitch/PeriodSwitch';
import { useResumenMovs } from '../../hooks/useResumenMovs';
import { useMovimientos } from '../../hooks/useMovimientos';
import { useMemo, useState } from 'react';
import './Home.css';

export function Home(){
  const { list = [] } = useMovimientos({ page: 1, limit: 1000 });

  // Modo: 'dates' | 'months' | 'years'
  const [mode, setMode] = useState('months');

  // Rango inicial por modo
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');

  const [dateStart, setDateStart] = useState(`${yyyy}-${mm}-01`);
  const [dateEnd, setDateEnd] = useState(`${yyyy}-${mm}-${dd}`);
  const [monthStart, setMonthStart] = useState(`${yyyy}-01`);
  const [monthEnd, setMonthEnd] = useState(`${yyyy}-${mm}`);
  const [yearStart, setYearStart] = useState(String(yyyy - 2));
  const [yearEnd, setYearEnd] = useState(String(yyyy));
  const [summaryTab, setSummaryTab] = useState('period'); // 'period' | 'cats'

  const fmtMoney = useMemo(
    () => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }),
    []
  );

  const { series, totals, catRows, periodColLabel } = useResumenMovs(list, {
    mode, dateStart, dateEnd, monthStart, monthEnd, yearStart, yearEnd
  });

  const { ingresos: tIng = 0, gastos: tGas = 0, balance = 0 } = totals || {};

  return (
    <section className="home-view">
      <header className="home-head">
        <h1>Panel</h1>
        <p className="muted">Elige rango por fechas, meses o años.</p>
      </header>

      <div className="home-grid">
        <div className="home-left">
          <div className="card period">
            {/* Selector de modo */}
            <PeriodSwitch value={mode} onChange={setMode} />

            {/* Controles de rango */}
            <div className="card" style={{ marginTop: 12 }}>
              {mode === 'dates' && (
                <div className="period-controls">
                  <div className="pc-item">
                    <label htmlFor="d1">Desde</label>
                    <input id="d1" type="date" className="input" value={dateStart}
                      onChange={e => setDateStart(e.target.value)} />
                  </div>
                  <div className="pc-item">
                    <label htmlFor="d2">Hasta</label>
                    <input id="d2" type="date" className="input" value={dateEnd}
                      onChange={e => setDateEnd(e.target.value)} />
                  </div>
                </div>
              )}

              {mode === 'months' && (
                <div className="period-controls">
                  <div className="pc-item">
                    <label htmlFor="m1">Desde</label>
                    <input id="m1" type="month" className="input" value={monthStart}
                      onChange={e => setMonthStart(e.target.value)} />
                  </div>
                  <div className="pc-item">
                    <label htmlFor="m2">Hasta</label>
                    <input id="m2" type="month" className="input" value={monthEnd}
                      onChange={e => setMonthEnd(e.target.value)} />
                  </div>
                </div>
              )}

              {mode === 'years' && (
                <div className="period-controls">
                  <div className="pc-item">
                    <label htmlFor="y1">Desde</label>
                    <input id="y1" type="number" min="1970" max="9999" className="input"
                      value={yearStart} onChange={e => setYearStart(e.target.value)} />
                  </div>
                  <div className="pc-item">
                    <label htmlFor="y2">Hasta</label>
                    <input id="y2" type="number" min="1970" max="9999" className="input"
                      value={yearEnd} onChange={e => setYearEnd(e.target.value)} />
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
                <span className="kpi__value kpi__value--neg">
                  -{fmtMoney.format(tGas).replace('€', '').trim()}€
                </span>
              </article>
              <article className="card kpi">
                <span className="kpi__label">Balance</span>
                <span className={`kpi__value ${balance >= 0 ? 'kpi__value--pos' : 'kpi__value--neg'}`}>
                  {fmtMoney.format(balance)}
                </span>
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
                  { key: 'gastos', label: 'Gastos', color: 'var(--accent)' }
                ]}
                height={220}
                variant="line"
              />
            </article>
          </div>
        </div>

        {/* Derecha: tabla de resúmenes */}
        <div className="home-right">
          <article className="card data-card">
            <div className="data-card__bar">
              <h2 className="data-card__title">
                {summaryTab === 'period'
                  ? `Resumen por ${periodColLabel.toLowerCase()}`
                  : 'Resumen por categorías'}
              </h2>

              <div className="period-switch">
                <button className={`chip ${summaryTab === 'period' ? 'chip--active' : ''}`}
                  onClick={() => setSummaryTab('period')}>Periodo</button>
                <button className={`chip ${summaryTab === 'cats' ? 'chip--active' : ''}`}
                  onClick={() => setSummaryTab('cats')}>Categorías</button>
              </div>
            </div>

            {summaryTab === 'period' ? (
              <div className="table-wrap">
                <table className="table table-modern">
                  <thead>
                    <tr>
                      <th>{periodColLabel}</th>
                      <th className="num">Ingresos</th>
                      <th className="num">Gastos</th>
                      <th className="num">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {series.map((r, i) => (
                      <tr key={r.key || i}>
                        <td className="text-strong">{r.label}</td>
                        <td className="num amount amount--pos">{fmtMoney.format(r.ingresos || 0)}</td>
                        <td className="num amount amount--neg">
                          -{fmtMoney.format(r.gastos || 0).replace('€', '').trim()}€
                        </td>
                        <td className={`num amount ${(r.ingresos - r.gastos) >= 0 ? 'amount--pos' : 'amount--neg'}`}>
                          {fmtMoney.format((r.ingresos || 0) - (r.gastos || 0))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th>Total</th>
                      <th className="num amount amount--pos">{fmtMoney.format(tIng)}</th>
                      <th className="num amount amount--neg">
                        -{fmtMoney.format(tGas).replace('€', '').trim()}€
                      </th>
                      <th className={`num amount ${balance >= 0 ? 'amount--pos' : 'amount--neg'}`}>
                        {fmtMoney.format(balance)}
                      </th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div className="table-wrap">
                <table className="table table-modern">
                  <thead>
                    <tr>
                      <th>Categoría</th>
                      <th className="num">Ingresos</th>
                      <th className="num">Gastos</th>
                      <th className="num">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {catRows.map((r, i) => (
                      <tr key={r.categoria || i}>
                        <td className="text-strong">{r.categoria}</td>
                        <td className="num amount amount--pos">{fmtMoney.format(r.ingresos)}</td>
                        <td className="num amount amount--neg">
                          -{fmtMoney.format(r.gastos).replace('€', '').trim()}€
                        </td>
                        <td className={`num amount ${r.balance >= 0 ? 'amount--pos' : 'amount--neg'}`}>
                          {fmtMoney.format(r.balance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </article>
        </div>
      </div>
    </section>
  );
}
