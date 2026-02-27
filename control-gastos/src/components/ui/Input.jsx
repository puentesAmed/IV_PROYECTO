import { forwardRef, memo } from "react";

const InputInner = forwardRef(function InputInner(props, ref) {
  const { className = "", ...rest } = props;
  return <input ref={ref} {...rest} className={`input ${className}`.trim()} />;
});

export const Input = memo(InputInner);
