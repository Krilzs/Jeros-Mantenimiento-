# 🧰 Jeros Mantenimiento - Gestión de Servicios

**Jeros Mantenimiento** es una plataforma web diseñada para administrar clientes, pagos mensuales, trabajos extras y gastos relacionados con servicios de mantenimiento. Optimiza el seguimiento financiero y facilita la organización de tu negocio de forma moderna, rápida y profesional.

---

## 🧩 Funcionalidades Principales

### 💵 Gestión de Pagos Mensuales
- Registrar cobros de clientes.
- Asignar pagos a mensualidades específicas (ej: 2025-07).
- Visualizar historial completo de pagos por cliente.
- Balance automático: ingresos vs egresos.

### 🔧 Trabajos Extras
- Registrar servicios adicionales fuera del abono mensual.
- Asignar cliente, descripción, monto y fecha.
- Visualización ordenada por fecha en tabla dinámica.

### 📉 Gastos
- Registro de egresos con nombre, fecha y monto.
- Inclusión en el cálculo de balance mensual.

---

## 🌐 Demo en vivo

Probá la app desplegada en:

➡️ [https://jeros-mantenimiento.vercel.app](https://jeros-mantenimiento.vercel.app)

---

## 📸 Capturas (próximamente)

> Se agregarán imágenes de la interfaz para visualizar las secciones en funcionamiento.

---

## ⚙️ Tecnologías Utilizadas

- **Frontend:** React + Chakra UI  
- **Backend:** Next.js API Routes  
- **Base de datos & Auth:** Supabase (con policies y JWT)  
- **Gestión de estado:** React Hooks (`useState`, `useEffect`, `useDisclosure`)  
- **Estilos:** Chakra UI con colores personalizados (`brand`, `primary`)  
- **Autenticación:** Supabase + Headers con token  
- **Deploy:** Vercel  

---



## 🛠️ Desarrollo local

Para correr el proyecto en tu máquina local:

```bash
# Cloná el repositorio
git clone https://github.com/tu-usuario/jeros-mantenimiento.git
cd jeros-mantenimiento

# Instalá las dependencias
npm install

# Copiá el archivo de variables de entorno y configurá tus credenciales Supabase
cp .env.example .env.local
# 👉 Configurá SUPABASE_URL y SUPABASE_ANON_KEY en .env.local

# Iniciá la aplicación en modo desarrollo
npm run dev
