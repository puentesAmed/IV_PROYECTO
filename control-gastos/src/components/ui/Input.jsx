import { forwardRef, memo } from "react";
import PropTypes from "prop-types";

const InputInner = forwardRef(function InputInner(props, ref) {
  const { className = "", ...rest } = props;
  return (
    <input
      ref={ref}
      {...rest}
      className={`input ${className}`.trim()}
    />
  );
});

InputInner.propTypes = {
  className: PropTypes.string,
};

export const Input = memo(InputInner);
