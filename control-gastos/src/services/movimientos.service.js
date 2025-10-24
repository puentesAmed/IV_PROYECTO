import { get, post, put, del } from '../services/http.js';


export async function getMovimientos(params = {}, signal){

    const { page = 1, limit = 10, q, categoria } = params;
    const { data, headers } = await get('/movimientos', { params:{ _page:page, _limit:limit, q, categoria }, signal })
    const total = Number(headers?.['x-total-count'] ?? (Array.isArray(data)?data.length:0))
    const items = Array.isArray(data) ? data : data?.data ?? data
    return { items, total };
}

export async function createMovimiento(data){ 
    return post(`/movimientos`,data); 
}

export async function updateMovimiento(id, data){ 
    return put(`/movimientos/${id}`, data); 
}

export async function deleteMovimiento(id){ 
    return del(`/movimientos/${id}`); 
}