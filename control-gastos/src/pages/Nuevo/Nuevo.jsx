import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { useMovimientos } from '../../hooks/useMovimientos';
import './Nuevo.css';

const schema = z.object({
  fecha: z.string().min(1),
  concepto: z.string().min(2),
  categoria: z.string().min(1),
  importe: z.coerce.number().refine(v => v !== 0, { message: 'No puede ser 0' })
});

export default function Nuevo() {
  const { create } = useMovimientos();
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } =
    useForm({ defaultValues: { fecha: new Date().toISOString().slice(0, 10) } });

  const onSubmit = async (data) => {
    const parsed = schema.safeParse(data);
    if (!parsed.success) return;

    const d = parsed.data;
    const normalizado = {
      ...d,
      importe:
        d.categoria === "Ingresos"
          ? Math.abs(Number(d.importe))
          : -Math.abs(Number(d.importe)),
    };

    await create(normalizado);
    reset();
    alert("Movimiento guardado");
  };

  return (
    <section className="nuevo-view">
      <div className="card form-card">
        <h1 className="form-title">Nuevo movimiento</h1>
        <form className="form-grid" onSubmit={handleSubmit(onSubmit)}>
          
          <div className="form-field">
            <label htmlFor="fecha">Fecha</label>
            <Input id="fecha" type="date" {...register('fecha', { required: true })} />
            {errors.fecha && <small className="error">Requerido</small>}
          </div>

          <div className="form-field">
            <label htmlFor="concepto">Concepto</label>
            <Input id="concepto" {...register('concepto', { required: true, minLength: 2 })} />
            {errors.concepto && <small className="error">Requerido</small>}
          </div>

          <div className="form-field">
            <label htmlFor="categoria">Categoría</label>
            <Select id="categoria" {...register('categoria', { required: true })}>
              <option value="">Selecciona</option>
              <option>Alimentación</option>
              <option>Transporte</option>
              <option>Vivienda</option>
              <option>Ingresos</option>
              <option>Ahorro</option>
              <option>Hogar</option>
              <option>Tecnología</option>
              <option>Viajes</option>
              <option>Impuestos</option>
              <option>Niños</option>
              <option>Ocio</option>
              <option>Salud</option>
              <option>Educación</option>
              <option>Regalos</option>
              <option>Ropa</option>
              <option>Mascotas</option>
              <option>Deportes</option>
              <option>Suscripciones</option>
              <option>Otros</option>
            </Select>
            {errors.categoria && <small className="error">Requerido</small>}
          </div>

          <div className="form-field">
            <label htmlFor="importe">Importe</label>
            <Input id="importe" type="number" step="0.01" {...register('importe', { valueAsNumber: true, required: true })} />
            {errors.importe && <small className="error">Importe inválido</small>}
          </div>

          <div className="form-actions">
            <Button type="submit" disabled={isSubmitting}>💾 Guardar</Button>
          </div>
        </form>
      </div>
    </section>
  );
}
