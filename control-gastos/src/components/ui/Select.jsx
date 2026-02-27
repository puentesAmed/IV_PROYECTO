import { forwardRef, memo } from "react";

const SelectInner = forwardRef(function SelectInner(props, ref) {
  const { className = "", ...rest } = props;
  return <select ref={ref} {...rest} className={`select ${className}`.trim()} />;
});

export const Select = memo(SelectInner);
