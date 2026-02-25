# SDL — Smart Digital Learning

## Documento de Producto

### Objetivo del Producto
SDL es una plataforma corporativa de e-learning que permite a empresas manufactureras (ej. plantas industriales) capacitar a su personal mediante cursos, tutorías en vivo e IA generativa. Transforma el mock-up actual en un LMS (Learning Management System) multi-rol y multi-sitio completamente funcional.

---

### Usuario Principal y Secundarios

**Principal — Estudiante/Operario:** Empleado de planta que accede desde su sitio (ej. "Planta Monterrey") para tomar cursos, seguir su progreso y participar en la comunidad.

**Secundario 1 — Educador:** Instructor que imparte sesiones en vivo, asigna tareas y ve el rendimiento de sus alumnos.

**Secundario 2 — Administrador:** Gestiona usuarios, crea widgets de comunicación, ve analíticas globales y controla el acceso por roles.

**Secundario 3 — Content Creator:** Genera y sube material educativo, usa el Studio con IA (Gemini) para crear contenido estructurado.

---

### Flujo Principal (inicio → fin)

1. **Portal Selection** → El usuario elige su planta/sitio desde un dropdown y presiona "Validar".
2. **Role Selection** → Selecciona su rol: Estudiante, Educador, Content Creator o Administrador.
3. **Academy Selection** *(solo Estudiantes)* → Elige su área de conocimiento: Tecnología, Artes, Negocios o Ciencias.
4. **Dashboard** → Visualiza cursos activos, estadísticas personalizadas por rol y accesos rápidos.
5. **Acciones por módulo:**
   - Toma cursos desde el **Course Portal** (etapas: autónoma, guiada, práctica, interacción).
   - Asiste a **Live Sessions** con tutor IA (Gemini).
   - Publica en **Social Learning** (feed + comunidades).
   - Crea contenido en **Content Creator Studio** (IA genera título, cuerpo, tags, duración).
   - Consulta métricas en **Analytics**.
6. **Sign Out** → Regresa al Portal Selection.

---

### Reglas de Negocio

- Si rol = **Estudiante** → debe seleccionar Academia antes de acceder al Dashboard.
- Si rol = **Educador o Creator** → va directo al Dashboard sin pasar por Academia.
- Si rol = **Administrador** → accede directamente al Admin Panel (no al Dashboard estándar).
- Si no hay sitio seleccionado → el botón "Validar" no debe permitir avanzar *(actualmente el mock no lo valida — debe implementarse)*.
- Si el usuario no tiene sesión activa → vuelve al paso 1 (Portal Selection).
- Solo los Administradores ven la opción "Admin Panel" en la navegación.
- El Content Creator usa Gemini API para generar contenido; si no hay API key → el Studio debe degradarse con mensaje de error claro.

---

### Datos Relevantes (qué guardar y por qué)

| Entidad | Campos clave | Por qué |
|---|---|---|
| **Usuario** | id, nombre, rol, sitio/planta | Personalizar dashboard y controlar acceso |
| **Sesión** | userId, selectedAcademy, currentView | Restaurar estado al volver |
| **Curso** | id, título, categoría, progreso, etapas completadas, thumbnail | Trackear avance del estudiante |
| **Contenido generado** | título, cuerpo, tags, duración estimada, creatorId | Biblioteca de assets reutilizables |
| **Post social** | autor, contenido, likes, comentarios, tags, timestamp | Feed de comunidad y reconocimientos |
| **Analíticas** | horas aprendidas, progreso, rating, conexiones activas | Reportes para educadores y admins |
| **Planta/Sitio** | id, nombre, departamento | Multi-tenancy por ubicación industrial |

---

### Criterios de Éxito ("funciona cuando…")

1. **Onboarding completo:** Un usuario puede seleccionar planta → rol → academia y llegar al Dashboard en menos de 3 pasos sin errores.
2. **Progreso persistente:** El progreso de un curso se guarda y se refleja correctamente en el Dashboard al volver.
3. **IA operativa:** El Content Creator Studio genera contenido válido (título + cuerpo + tags) usando Gemini API en menos de 10 segundos.
4. **Live Session funcional:** La sesión con tutor IA responde mensajes de chat en tiempo real sin interrupciones.
5. **Admin Panel:** Un administrador puede ver métricas de conexión activas, gestionar usuarios y enviar comunicaciones.
6. **Multi-rol coherente:** Cada rol ve exactamente los módulos que le corresponden; ningún estudiante accede al Admin Panel.
7. **Responsive:** La navegación mobile (hamburger menu) funciona en pantallas <768px sin broken layout.
8. **Sin datos mock:** Todos los datos hardcodeados (cursos, posts, usuarios) son reemplazados por llamadas reales a API/base de datos.

---

## DOCUMENTO MVP

### 1) OBJETIVO DEL MVP

**Producto:** SDL — Smart Digital Learning. Plataforma LMS corporativa multi-sitio para capacitación de personal operativo en plantas industriales, con IA generativa integrada (Gemini) y aprendizaje social.

**Usuario principal:** Operario/Empleado de planta industrial (Estudiante) que accede desde su sitio asignado para tomar cursos estructurados y seguir su progreso de formación.

**Problema (Dolor concreto):** Las empresas manufactureras multi-planta no tienen un canal unificado para capacitar a su personal por sitio y por rol; el progreso se pierde, el contenido es genérico, y no hay visibilidad real del avance ni del cumplimiento formativo por parte de los administradores.

**Resultado deseado:** Que cada empleado pueda acceder a su ruta de aprendizaje personalizada por planta, rol y academia, completar cursos con progreso persistente, y que el administrador pueda visualizar en tiempo real el estado de capacitación de toda la organización.

---

### 2) FLUJO PRINCIPAL (Happy Path)

1. **Alineación (Portal → Rol → Academia):** El usuario entra, selecciona su planta (ej. Planta Monterrey), elige su rol (Estudiante) y su academia (ej. Tecnología). El sistema valida que la combinación planta + rol esté autorizada antes de permitir el acceso al Dashboard.
2. **Captura Frugal (Curso → Progreso):** El estudiante accede al Course Portal, inicia un curso con sus 4 etapas (autónoma, guiada, práctica, interacción), y cada avance se persiste en base de datos inmediatamente. Si hay conexión inestable (contexto industrial), el progreso se guarda localmente y sincroniza al reconectar.
3. **Consolidación y Alerta (Panel Colaborativo):** El Administrador ve en el Admin Panel el porcentaje de completitud por planta, recibe alertas de empleados sin actividad en N días, puede enviar comunicaciones segmentadas y exportar reportes de cumplimiento.
4. **Éxito:** Un empleado completa su primera ruta de aprendizaje desde cero hasta certificación, y el administrador puede ver ese logro reflejado en el panel en menos de 1 minuto.

---

### 3) RESTRICCIONES DEL DOMINIO (Reglas)

- **Innovación Frugal:** El MVP debe funcionar en dispositivos de gama media (teléfonos Android de planta), con interfaces ligeras, sin depender de conexión permanente para consumir contenido ya descargado, y sin requerir instalación compleja por parte del usuario final.
- **Cumplimiento Normativo Estricto:** Los registros de capacitación deben ser auditables e inmutables (quién completó qué, cuándo y en qué sitio) para cumplir con normativas de seguridad industrial (ej. STPS en México, ISO 45001). El sistema no puede permitir que un administrador borre historial de formación completada.
- **Soberanía de Datos:** Los datos de cada organización (planta, empleados, progreso) deben estar aislados. Ninguna organización puede acceder a datos de otra. Los datos deben poder alojarse en infraestructura propia o en región geográfica específica si el cliente lo requiere.
- **Interoperabilidad:** El sistema debe poder exportar datos de progreso en formatos estándar (CSV, xAPI/TinCan, SCORM) para integrarse con sistemas HR existentes (SAP, Workday). La API de Gemini es reemplazable; la arquitectura no debe acoplarse a un único proveedor de IA.

---

### 4) MÉTRICAS CLAVE

- **Métrica North Star:** Tasa de Completitud de Ruta de Aprendizaje — porcentaje de empleados activos que completan al menos una ruta de capacitación asignada en el período (mensual). Refleja el valor real entregado: formación completada, no solo acceso.
- **Tiempo de ciclo de reporte (Time-to-Value):** Tiempo desde que un administrador entra al Admin Panel hasta que puede visualizar el estado de capacitación completo de su planta. Target MVP: menos de 30 segundos con datos reales.
- **Tasa de retención de conocimiento:** Porcentaje de estudiantes que retoman el curso dentro de los 7 días siguientes a su última sesión, indicador de que el contenido genera engagement sostenido.

---

### 5) SUPOSICIÓN ARQUITECTÓNICA

El MVP será **multi-tenant con aislamiento lógico**. El dropdown de Portal Selection lista múltiples plantas, lo que implica que una misma instancia del sistema sirve a varias plantas, con datos segregados por `siteId`. Se recomienda comenzar con un único cliente piloto (single-tenant operativo) para validar el producto, con arquitectura diseñada desde el día 1 para escalar a multi-tenant sin refactoring mayor.
