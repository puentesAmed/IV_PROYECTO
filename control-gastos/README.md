# 📘 Gastos Fácil — Gestión de ingresos y gastos con React + JSON Server

Aplicación completa para gestionar ingresos, gastos y estadísticas financieras.  
Incluye autenticación, CRUD de movimientos, filtrado, paginación, gráficos, modo claro/oscuro y análisis por periodos (día, mes, año).

---

## 🚀 Tecnologías utilizadas

- React + Vite  
- React Router v6  
- React Hook Form + Zod  
- Axios  
- JSON Server  
- Recharts  
- Context API (auth + tema)  
- CSS variables (modo dark/light)

---

## 📦 Instalación

Clona el repositorio:

```sh
git clone https://github.com/puentesAmed/IV_PROYECTO.git
cd gastos-facil
```

Instala dependencias:

```sh
npm install
```

---

## 🔧 Configuración del backend (JSON Server)

El proyecto usa un backend simulado con **db.json**.

Para iniciarlo:

```sh
npm run server
```

Esto ejecuta:

```sh
json-server --watch db.json --port 5179 --delay 500
```

Tu API estará disponible en:

```
http://localhost:5179/movimientos
http://localhost:5179/users
```

---

## ⚙️ Configuración del frontend (Vite)

Crea un archivo `.env` en la raíz del proyecto con tu valor correcto:

```
VITE_API_URL=http://localhost:5179
```

Esto conecta Axios con tu backend real o proxy.

---

## ▶️ Ejecución del proyecto

Frontend:

```sh
npm run dev
```

Backend (JSON Server):

```sh
npm run server
```

Abrir en navegador:

```
http://localhost:5173
```

---

## 🔐 Autenticación

El sistema usa JSON Server para validar usuarios.

Usuario por defecto:

```
email: demo@demo.com
password: demo
```

El estado se gestiona mediante `useAuth()` con Context API.

---

## 📁 Estructura del proyecto

```
src/
  components/
    charts/
    common/
    layout/
    table/
    ui/
  hooks/
    useAuth.js
    useMovimientos.js
    useResumenMovs.js
  pages/
    Home/
    Login/
    Movimientos/
    Nuevo/
  services/
    http.js
    movimientos.service.js
  utils/
    aggregateMovs.js
  router/
    index.jsx
    ProtectedRoute.jsx
  App.jsx
```

---

## 📊 Funcionalidades

### ✔️ Gestión de movimientos
- Crear/leer/actualizar/eliminar movimientos.
- Scroll infinito.
- Filtro por categorías.
- Búsqueda global.
- Eliminación con confirmación.

### ✔️ Dashboard financiero
- Gráficos por día, mes o año.
- KPIs de ingresos, gastos y balance.
- Resumen por periodos.
- Resumen por categorías.
- Selector dinámico de rango.

### ✔️ Interfaz
- Tema claro / oscuro.
- Diseño responsive.
- Componentes reutilizables.
- Accesibilidad optimizada.

---

## 🧪 Endpoints JSON Server

### Obtener movimientos

```
GET /movimientos?_page=1&_limit=20&q=texto&categoria=Vivienda
```

### Crear movimiento

```
POST /movimientos
```

### Actualizar movimiento

```
PUT /movimientos/:id
```

### Eliminar movimiento

```
DELETE /movimientos/:id
```

---

## 🛠 Scripts NPM

```
npm run dev       # Inicia frontend
npm run build     # Compila producción
npm run preview   # Previsualiza build
npm run server    # Inicia JSON Server en puerto 3000
```

---

## 🧩 Variables de entorno

```
VITE_API_URL=http://localhost:5179
```

---

## 📝 Licencia

MIT License — libre para uso, modificación y distribución.
