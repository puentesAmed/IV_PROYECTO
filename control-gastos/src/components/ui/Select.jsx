import { forwardRef, memo } from 'react';

export default memo(forwardRef(function Select(props, ref){
    return <select ref={ref} {...props} className={`select ${props.className ?? ''}`.trim()} />;
}));


