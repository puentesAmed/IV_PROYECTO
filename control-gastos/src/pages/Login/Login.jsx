import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../hooks/useAuth";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import "./Login.css";
import { useNavigate, useLocation } from "react-router-dom";

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(4, "Mínimo 4 caracteres"),
});

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });

  const onSubmit = async (values) => {
    await login(values);
    const to = loc.state?.from?.pathname || "/";
    nav(to, { replace: true });
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
          <div className="form-actions">
            <Button type="submit" loading={isSubmitting}>Entrar</Button>
          </div>
        </form>
      </div>
    </section>
  );
}
