import { forwardRef, memo } from "react";
import PropTypes from "prop-types";

const SelectInner = forwardRef(function SelectInner(props, ref) {
  const { className = "", ...rest } = props;

  return (
    <select
      ref={ref}
      {...rest}
      className={`select ${className}`.trim()}
    />
  );
});

SelectInner.propTypes = {
  className: PropTypes.string,
};

export const Select = memo(SelectInner);
