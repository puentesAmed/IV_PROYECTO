import MonthlyBar from '../components/charts/MonthlyBar';
import { useMovimientos } from '../hooks/useMovimientos';
import { useMemo } from 'react';


export default function Home(){
    const { list } = useMovimientos({ page: 1, limit: 10 });
    const { totalIngresos, gastosAbs, balance } = useMemo(() => {
        const ingresos = list
            .filter(m => m.categoria === "Ingresos")
            .reduce((a, b) => a + Math.max(0, Number(b.importe)), 0);

        const gastos = list
            .filter(m => m.categoria !== "Ingresos")
            .reduce((a, b) => a + Math.abs(Number(b.importe)), 0);

        return { totalIngresos: ingresos, gastosAbs: gastos, balance: ingresos - gastos };
    }, [list]);


    return (
        <section>
            <h1>Panel</h1>
            <div className="grid">
                <div className="card kpi">
                    <div>Ingresos</div>
                    <strong>{totalIngresos.toFixed(2)}€</strong>
                </div>
                <div className="card kpi">
                    <div>Gastos</div>
                    <strong>-{gastosAbs.toFixed(2)}€</strong>
                </div>
                <div className="card kpi">
                    <div>Balance</div>
                    <strong>{balance.toFixed(2)}€</strong>
                </div>
            </div>
            <MonthlyBar />
        </section>
    );
}