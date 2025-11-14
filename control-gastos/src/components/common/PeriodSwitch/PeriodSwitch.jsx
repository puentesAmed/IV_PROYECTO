
export default function PeriodSwitch({
  value = 'months',                
  onChange = () => {},
  options = [
    { k: 'dates',  label: 'Fechas' },
    { k: 'months', label: 'Meses'  },
    { k: 'years',  label: 'Años'   },
  ],
}) {
  return (
    <div className="period-switch" role="group" aria-label="Modo de agregación">
      {options.map(o => (
        <button
          key={o.k}
          type="button"
          className={`chip ${value === o.k ? 'chip--active' : ''}`}
          onClick={() => onChange(o.k)}
          aria-pressed={value === o.k}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
