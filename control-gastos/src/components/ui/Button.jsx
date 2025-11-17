import { memo } from "react";
import PropTypes from "prop-types";

function ButtonInner({ className, loading = false, ...rest }) {
  return (
    <button
      {...rest}
      disabled={loading || rest.disabled}
      className={`btn ${className ?? ""}`.trim()}
    />
  );
}

ButtonInner.propTypes = {
  className: PropTypes.string,
  loading: PropTypes.bool,
};

export const Button = memo(ButtonInner);
