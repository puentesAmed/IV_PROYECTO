import { get, post, put, del } from "./http.js";

export async function getMovimientos(params = {}, { signal } = {}) {
  const { page = 1, limit = 20, q, categoria } = params;

  const query = {
    _page: page,
    _limit: limit,
  };

  if (q) query.q = q;
  if (categoria) query.categoria = categoria;

  const { data, headers } = await get("/movimientos", {
    params: query,
    signal,
  });

  const items = Array.isArray(data) ? data : [];

  const totalHeader =
    headers?.["x-total-count"] ??
    headers?.["X-Total-Count"] ??
    null;

  const total = Number(totalHeader ?? items.length);

  return { items, total };
}

export function createMovimiento(payload) {
  return post("/movimientos", payload);
}

export function updateMovimiento(id, payload) {
  return put(`/movimientos/${id}`, payload);
}

export function deleteMovimiento(id) {
  return del(`/movimientos/${id}`);
}
