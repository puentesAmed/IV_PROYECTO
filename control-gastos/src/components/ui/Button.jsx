import { memo } from 'react';

export default memo(function Button(props){
    return <button {...props} className={`btn ${props.className ?? ''}`.trim()} />;
});