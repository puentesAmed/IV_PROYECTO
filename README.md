# 📘 Gastos Fácil

Aplicación de control de gastos e ingresos construida con React.

---

## ✅ Estado actual del proyecto

Este proyecto funciona **100% en frontend** (sin `json-server` ni API externa):

- La autenticación (registro/login) se guarda en `sessionStorage`.
- Los movimientos se guardan en `localStorage`.
- Hay un botón para cargar datos de ejemplo.
- El feedback al usuario se muestra con notificaciones (toasts), no con `alert()`.

---

## 🚀 Stack tecnológico

- React 19 + Vite
- React Router
- React Hook Form
- Zod
- Context API
- CSS

---

## 📦 Instalación

```bash
npm install
```

---

## ▶️ Ejecución en desarrollo

```bash
npm run dev
```

Por defecto Vite abre la app en:

- `http://localhost:5173`

---

## 🏗️ Build de producción

```bash
npm run build
```

Para previsualizar el build:

```bash
npm run preview
```

---

## 🔐 Autenticación (sesión)

Flujo actual:

1. Regístrate en `/register`.
2. Inicia sesión en `/login`.
3. Las rutas privadas (`/`, `/home`, `/movimientos`, `/nuevo`) requieren sesión activa.

Notas:

- Los usuarios registrados se guardan en `sessionStorage`.
- Si cierras la pestaña/ventana, la sesión y usuarios de sesión se pierden.

---

## 💸 Movimientos y filtros

- Alta de movimiento desde `/nuevo`.
- Listado y borrado en `/movimientos`.
- Filtro combinado por:
  - Fecha
  - Concepto
  - Categoría
  - Importe
- Botón **“Cargar datos de ejemplo”** para poblar rápidamente el listado.

Persistencia:

- Los movimientos se guardan en `localStorage`, por lo que se conservan entre sesiones del navegador.

---

## 🔔 Notificaciones

La app usa un sistema de toasts reutilizable para mostrar feedback en acciones como:

- Registro
- Login / logout
- Creación de movimiento
- Eliminación de movimiento
- Carga de datos de ejemplo

---

## 📁 Estructura (resumen)

```text
src/
  components/
  context/
  hooks/
  pages/
  routes/
  styles/
```

---

## 🧪 Scripts disponibles

```bash
npm run dev      # entorno de desarrollo
npm run build    # build de producción
npm run preview  # previsualización del build
```

---

## 📝 Observaciones

- No requiere variables de entorno para funcionar en local.
- No requiere backend para probar la aplicación.