import { useEffect, useRef } from 'react';

export function useDebounce(fn, delay = 400){
    const t = useRef();

    useEffect(()=>()=>{ if(t.current) clearTimeout(t.current); },[]);
    return (...args) => {
        if(t.current) clearTimeout(t.current);
        t.current = setTimeout(()=> fn(...args), delay);
    };
}