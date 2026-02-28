import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import "../Login/Login.css";

const schema = z
  .object({
    name: z.string().min(2, "Nombre requerido"),
    email: z.string().email("Email inválido"),
    password: z.string().min(4, "Mínimo 4 caracteres"),
    confirmPassword: z.string().min(4, "Mínimo 4 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export function Register() {
  const { register: registerUser } = useAuth();
  const { notify } = useNotification();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (values) => {
    setErrorMessage("");
    try {
      await registerUser(values);
      notify("Registro completado. Ya puedes iniciar sesión.", "success");
      navigate("/login", { replace: true });
    } catch (error) {
      const msg = error.message || "No se pudo completar el registro";
      setErrorMessage(msg);
      notify(msg, "error");
    }
  };

  return (
    <section className="login-view">
      <div className="card login-card">
        <h1>Registro</h1>

        <form className="form-grid" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-field">
            <label htmlFor="name">Nombre</label>
            <Input id="name" type="text" autoComplete="name" {...register("name")} aria-invalid={!!errors.name} />
            {errors.name && <small className="error">{errors.name.message}</small>}
          </div>

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <Input id="email" type="email" autoComplete="email" {...register("email")} aria-invalid={!!errors.email} />
            {errors.email && <small className="error">{errors.email.message}</small>}
          </div>

          <div className="form-field">
            <label htmlFor="password">Contraseña</label>
            <Input id="password" type="password" autoComplete="new-password" {...register("password")} aria-invalid={!!errors.password} />
            {errors.password && <small className="error">{errors.password.message}</small>}
          </div>

          <div className="form-field">
            <label htmlFor="confirmPassword">Repite la contraseña</label>
            <Input id="confirmPassword" type="password" autoComplete="new-password" {...register("confirmPassword")} aria-invalid={!!errors.confirmPassword} />
            {errors.confirmPassword && <small className="error">{errors.confirmPassword.message}</small>}
          </div>

          {errorMessage && <small className="error">{errorMessage}</small>}

          <div className="form-actions">
            <Button type="submit" loading={isSubmitting}>
              Crear cuenta
            </Button>
          </div>

          <p className="muted">
            ¿Ya tienes cuenta? <Link to="/login" className="auth-link">Inicia sesión</Link>
          </p>
        </form>
      </div>
    </section>
  );
}
