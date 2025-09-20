import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL });
console.log('API URL:', import.meta.env.VITE_API_URL);

export async function get(url, params, signal){ 
    const { data, headers } = await api.get(url, { params, signal }); 
    return Object.assign(data, {headers: headers }); 
}
export async function post(url, body){ 
    const { data } = await api.post(url,body); 
    return data; 
}
export async function put(url, body){ 
    const { data } = await api.put(url,body); 
    return data; 
}
export async function del(url){ 
    const { data } = await api.delete(url);
    return data; 
}