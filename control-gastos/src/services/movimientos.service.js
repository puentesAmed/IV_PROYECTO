import { get, post, put, del } from '../hooks/useApi';

export async function getMovimientos(params = {}, signal){

    const { page = 1, limit = 10, q, categoria } = params;
    const res = await get(`/movimientos`, { _page: page, _per_page: limit, q, categoria }, signal);
    const total = Number(res._headers?.['x-total-count'] ?? res.length ?? 0);
    const items = Array.isArray(res) ? res : res.data || res;
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