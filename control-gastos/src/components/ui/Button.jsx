import { memo } from "react";

export default memo(function Button({ className, loading, ...rest }) {
  return (
    <button
      {...rest}
      disabled={loading || rest.disabled}
      className={`btn ${className ?? ""}`.trim()}
    />
  );
});
