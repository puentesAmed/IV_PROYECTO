import { forwardRef, memo } from 'react';

export default memo(forwardRef(function Input(props, ref){
    return <input ref={ref} {...props} className={`input ${props.className ??''}`.trim()}/>;
}));

