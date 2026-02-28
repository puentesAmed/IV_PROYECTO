import { Input } from "../ui/Input";
import { Select } from "../ui/Select";

const categorias = [
  "Alimentación",
  "Transporte",
  "Vivienda",
  "Ingresos",
  "Ahorro",
  "Hogar",
  "Tecnología",
  "Viajes",
  "Impuestos",
  "Niños",
  "Ocio",
  "Salud",
  "Educación",
  "Regalos",
  "Ropa",
  "Mascotas",
  "Deportes",
  "Suscripciones",
  "Otros",
];

export function MovimientosFilters({ onSearch, categoria, onCategoriaChange }) {
  return (
    <div className="filters-bar">
      <Input placeholder="Buscar por fecha, concepto, categoría o importe" onChange={(e) => onSearch(e.target.value)} id="search" />
      <Select value={categoria} onChange={(e) => onCategoriaChange(e.target.value)}>
        <option value="">Todas</option>
        {categorias.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </Select>
    </div>
  );
}
