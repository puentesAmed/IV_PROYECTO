import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { useMovimientos } from '../hooks/useMovimientos';


const schema = z.object({
    fecha: z.string().min(1),
    concepto: z.string().min(2),
    categoria: z.string().min(1),
    importe: z.coerce.number().refine(v=> v !== 0, { message: 'No puede ser 0' })
});

export default function Nuevo(){
    const { create } = useMovimientos();
    const { register, handleSubmit, formState: { errors, isSubmitting },
    reset } = useForm({ defaultValues: { fecha: new Date().toISOString().slice(0, 10) } });
    const onSubmit = async (data) => {
        const parsed = schema.safeParse(data);
        if (!parsed.success) return;

        const d = parsed.data;
        const normalizado = {
            ...d,
            importe: d.categoria === "Ingresos"
            ? Math.abs(Number(d.importe))
            : -Math.abs(Number(d.importe)),
        };

        await create(normalizado);
        reset();
        alert("Movimiento guardado");
    };

    return (
        <section>
            <h1>Nuevo movimiento</h1>
            <form className="form" onSubmit={handleSubmit(onSubmit)}>
                <label>Fecha<Input type="date" {...register('fecha', { required: true })} /></label>
                {errors.fecha && <small className="error">Requerido</small>}
                <label>Concepto<Input {...register('concepto', { required: true, minLength: 2 })} /></label>
                {errors.concepto && <small className="error">Requerido</small>}
                <label>Categoría
                    <Select {...register('categoria', { required: true })}>
                        <option value="">Selecciona</option>
                        <option>Alimentación</option>
                        <option>Transporte</option>
                        <option>Vivienda</option>
                        <option>Ingresos</option>
                    </Select>
                </label>
                {errors.categoria && <small className="error">Requerido</small>}
                <label>Importe<Input type="number" step="0.01" {...register('importe', { valueAsNumber: true, required: true })} /></label>
                {errors.importe && <small className="error">Importe inválido</small>}
                <Button type="submit" disabled={isSubmitting}>Guardar</Button>
            </form>
        </section>
    );
}
