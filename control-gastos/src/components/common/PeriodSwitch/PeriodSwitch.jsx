import PropTypes from "prop-types";

export function PeriodSwitch({
  value = "months",
  onChange,
  options = [
    { k: "dates", label: "Fechas" },
    { k: "months", label: "Meses" },
    { k: "years", label: "Años" },
  ],
}) {
  return (
    <div
      className="period-switch"
      role="group"
      aria-label="Selector de periodo"
    >
      {options.map((o) => (
        <button
          key={o.k}
          type="button"
          className={`chip ${value === o.k ? "chip--active" : ""}`}
          aria-pressed={value === o.k}
          onClick={() => onChange(o.k)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

PeriodSwitch.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      k: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
};
