# SDL — Smart Digital Learning

SDL es una plataforma corporativa de e-learning diseñada para plantas industriales, que combina capacitación multi-sitio, roles específicos, IA generativa y aprendizaje social.

## 🚀 Arquitectura Técnica (V2 - Next.js)

El proyecto ha sido evolucionado de una SPA simple a un framework profesional basado en Next.js para cumplir con los requisitos de escalabilidad y seguridad industrial.

- **Frontend**: Next.js 16 (App Router) + React 19 + TypeScript (Strict Mode).
- **Estilos**: Tailwind CSS 4 + Shadcn UI + Radix UI + Lucide React.
- **Backend / DB**: Supabase (PostgreSQL + Auth PKCE + RLS).
- **IA**: Google Gemini 2.0 Flash vía Vercel AI SDK.
- **Despliegue**: Docker + Google Cloud Run.

---

## 🛠️ Reglas de Construcción "Senior"

1. **Seguridad Extrema**: RLS (Row Level Security) activo en todas las tablas. El acceso a datos se valida siempre vía servidor.
2. **Server-First**: Todo componente es Server Component por defecto. `use client` solo para interactividad necesaria.
3. **Tipado Estricto**: Prohibido el uso de `any`. Interfaces claras en `@/lib/types`.
4. **Dominio Industrial**: Multi-tenancy lógico mediante `site_id` para aislar datos entre diferentes plantas físicas.

---

## 📋 Documento de Producto & MVP

### Objetivo del MVP
Capacitar al personal operativo mediante una plataforma ligera, auditable y con IA, permitiendo a los administradores visualizar el cumplimiento normativo en tiempo real.

### Flujo Principal (Happy Path)
1. **Portal Selection**: Selección de planta física (ej. Planta Monterrey).
2. **Role Selection**: Definición de perfil (Estudiante, Educador, Creador, Admin).
3. **Academy Selection**: Selección de área de especialidad (solo Estudiantes).
4. **Dashboard**: Acceso a cursos, analíticas y herramientas de IA.

### Entidades del Dominio
- **Site**: Planta física industrial.
- **Profile**: Datos del usuario extendidos (rol, sitio, academia).
- **Course**: Material educativo dividido en 4 etapas (Autónoma, Guiada, Práctica, Interacción).
- **GeneratedContent**: Activos creados vía IA Studio.

---

## 🚦 Guía de Desarrollo Local

1. Instalar dependencias:
   ```bash
   pnpm install
   ```
2. Configurar variables de entorno (`.env.local`):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key
   GOOGLE_GENERATIVE_AI_API_KEY=tu_gemini_key
   ```
3. Iniciar servidor de desarrollo:
   ```bash
   npm run dev
   ```
   *Nota: Por defecto corre en el puerto 3005 para evitar conflictos.*

---

## 📊 Métricas de Éxito
- **North Star**: Tasa de Completitud de Ruta de Aprendizaje.
- **Time-to-Value**: <30s para que un administrador vea el estado global de su planta.
- **Aislamiento**: 100% de segregación de datos entre sitios industriales.

---
&copy; 2026 SteelCore Industrial Systems / CrossLearning
