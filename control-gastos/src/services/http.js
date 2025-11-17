
import axios from 'axios';

// Base configurada para json-server
const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5179',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// Interceptor de errores
http.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject({
      status: error.response?.status ?? 0,
      message: error.response?.data?.message ?? error.message ?? 'Error'
    })
);

// GET con headers y signal correctamente retornados
export async function get(url, { params, signal } = {}) {
  const res = await http.get(url, { params, signal });
  return {
    data: res.data,
    headers: res.headers
  };
}

export async function post(url, body) {
  const res = await http.post(url, body);
  return res.data;
}

export async function put(url, body) {
  const res = await http.put(url, body);
  return res.data;
}

export async function del(url) {
  const res = await http.delete(url);
  return res.data;
}
