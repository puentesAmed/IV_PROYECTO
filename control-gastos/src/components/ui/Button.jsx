import { memo } from "react";

function ButtonInner({ className, loading = false, ...rest }) {
  return <button {...rest} disabled={loading || rest.disabled} className={`btn ${className ?? ""}`.trim()} />;
}

export const Button = memo(ButtonInner);
