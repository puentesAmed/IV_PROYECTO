import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5179',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
})
http.interceptors.response.use(r=>r, e=>Promise.reject({
  status: e.response?.status ?? 0,
  message: e.response?.data?.message ?? e.message ?? 'Error'
}))

export async function get(url, params, signal){ 
    const { data, headers } = await http.get(url, { params, signal }); 
    return Object.assign(data, {headers: headers }); 
}
export async function post(url, body){ 
    const { data } = await http.post(url,body); 
    return data; 
}
export async function put(url, body){ 
    const { data } = await http.put(url,body); 
    return data; 
}
export async function del(url){ 
    const { data } = await http.delete(url);
    return data; 
}