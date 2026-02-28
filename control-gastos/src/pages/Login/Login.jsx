import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import "./Login.css";
import { Link, useLocation, useNavigate } from "react-router-dom";

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(4, "Mínimo 4 caracteres"),
});

export function Login() {
  const { login } = useAuth();
  const { notify } = useNotification();
  const nav = useNavigate();
  const loc = useLocation();
  const [authError, setAuthError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values) => {
    setAuthError("");
    try {
      await login(values);
      notify("Login correcto", "success");
      const to = loc.state?.from?.pathname || "/";
      nav(to, { replace: true });
    } catch (error) {
      const msg = error.message || "No se pudo iniciar sesión";
      setAuthError(msg);
      notify(msg, "error");
    }
  };

  return (
    <section className="login-view">
      <div className="card login-card">
        <h1>Iniciar sesión</h1>

        <form className="form-grid" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <Input id="email" type="email" autoComplete="email" {...register("email")} aria-invalid={!!errors.email} />
            {errors.email && <small className="error">{errors.email.message}</small>}
          </div>

          <div className="form-field">
            <label htmlFor="password">Contraseña</label>
            <Input id="password" type="password" autoComplete="current-password" {...register("password")} aria-invalid={!!errors.password} />
            {errors.password && <small className="error">{errors.password.message}</small>}
          </div>

          {authError && <small className="error">{authError}</small>}

          <div className="form-actions">
            <Button type="submit" loading={isSubmitting}>
              Entrar
            </Button>
          </div>

          <p className="muted">
            ¿No tienes cuenta? <Link to="/register" className="auth-link">Regístrate</Link>
          </p>
        </form>
      </div>
    </section>
  );
}
