import { memo } from 'react';

function _Table({ columns, rows }){
    return (
        <div className="table-responsive">
            <table className="table">
                <thead>
                    <tr>
                        {columns.map(c=> <th key={String(c.key)}>{c.header}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {rows.map(r=> (
                        <tr key={r.id ?? JSON.stringify(r)}>
                            {columns.map(c=> <td key={String(c.key)}>{c.render? c.render(r): String(r[c.key])}</td>)}
                        </tr>
                    ))}
                </tbody>
            </table>        
        </div>
    );
}
export default memo(_Table); 