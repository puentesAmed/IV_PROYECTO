export function MonthlyBar({
  data = [],
  xKey = "label",
  series = [{ key: "value", label: "Valor", color: "var(--primary)" }],
  height = 220,
  variant = "bars",
}) {
  const margin = { top: 10, right: 16, bottom: 40, left: 32 };
  const baseY = height - margin.bottom;
  const maxBarH = height - margin.top - margin.bottom;

  const maxVal = Math.max(1, ...data.flatMap((d) => series.map((s) => Number(d[s.key]) || 0)));

  const barW = 10;
  const gapInGroup = 2;
  const groupW = series.length * barW + (series.length - 1) * gapInGroup;
  const stepX = Math.max(groupW + 14, 28);
  const centerX = (i) => margin.left + i * stepX + stepX / 2;

  const svgW = Math.max(320, margin.left + data.length * stepX + margin.right);

  const ptsBySeries = series.map((s) =>
    data.map((d, i) => {
      const val = Number(d[s.key]) || 0;
      const y = baseY - Math.round((val / maxVal) * maxBarH);
      const x = centerX(i);
      return { x, y };
    })
  );

  return (
    <figure className="mb-chart" aria-label="Gráfico de movimientos">
      <figcaption className="mb-legend" aria-hidden="true">
        {series.map((s) => (
          <span key={s.key}>
            <i style={{ background: s.color || "var(--primary)" }} />
            {s.label}
          </span>
        ))}
      </figcaption>

      <svg viewBox={`0 0 ${svgW} ${height}`} className="mb-svg" role="img" aria-hidden="false">
        <line x1="0" y1={baseY} x2={svgW} y2={baseY} stroke="var(--border)" />

        {data.map((d, i) => (
          <text key={`x-${i}`} x={centerX(i)} y={height - 12} textAnchor="middle" className="mb-axis-x">
            {d[xKey]}
          </text>
        ))}

        {variant === "bars" &&
          data.map((d, i) => {
            const cx = centerX(i);
            return (
              <g key={`g-${i}`}>
                {series.map((s, j) => {
                  const val = Number(d[s.key]) || 0;
                  const h = Math.round((val / maxVal) * maxBarH);
                  const y = baseY - h;
                  const x = cx - groupW / 2 + j * (barW + gapInGroup);
                  return <rect key={s.key} x={x} y={y} width={barW} height={h} rx="3" fill={s.color || "var(--primary)"} />;
                })}
              </g>
            );
          })}

        {variant === "line" &&
          ptsBySeries.map((pts, si) => (
            <g key={`line-${si}`} fill="none" stroke={series[si].color || "var(--primary)"} strokeWidth="2">
              <polyline points={pts.map((p) => `${p.x},${p.y}`).join(" ")} />
              {pts.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="3" fill={series[si].color || "var(--primary)"} />
              ))}
            </g>
          ))}

        {variant === "points" &&
          ptsBySeries.map((pts, si) => (
            <g key={`pts-${si}`}>
              {pts.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="4" fill={series[si].color || "var(--primary)"} />
              ))}
            </g>
          ))}
      </svg>
    </figure>
  );
}
