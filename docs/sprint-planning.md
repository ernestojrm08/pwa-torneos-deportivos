# 🏆 Proyecto: PWA Torneos Deportivos  
## Documento: Planificación SCRUM (Elaborado por: Ernesto Rengifo)

---

##  SCRUM – Fase 1: Planificación del Proyecto

### 🧑‍💼 Roles del Equipo

| Rol | Integrante | Responsabilidades principales |
|------|-------------|------------------------------|
| **Product Owner** | Diego | Define requerimientos, prioriza historias de usuario y valida entregables. |
| **Scrum Master** | Paola | Supervisa cumplimiento de metodología SCRUM, gestiona reuniones y bloqueos. |
| **Developer A** | Ernesto | Configuración del entorno, desarrollo del Login, estructura base de BD, manual técnico inicial. |
| **Developer B** | *Diego* | Desarrollo del Dashboard, endpoint `/register`, diseño del flujo principal. |
| **Developer C** | *Paola* | Integración del Login + Dashboard, documentación OpenAPI, guías finales del manual técnico. |

---

## 📅 Sprint 1 – Planificación

**Duración:** 2 semanas  
**Objetivo del Sprint:**  
Establecer la base funcional del proyecto con autenticación inicial, estructura de base de datos y entorno de desarrollo listo para todo el equipo.  

---

### 📋 Backlog del Sprint 1

| ID | Historia de Usuario | Prioridad | Criterios de Aceptación |
|----|----------------------|------------|--------------------------|
| HU-01 | Como *usuario*, quiero poder iniciar sesión para acceder al sistema. | Alta | Login funcional con validación de credenciales. |
| HU-02 | Como *admin*, quiero registrar nuevos usuarios para el sistema. | Media | Endpoint `/register` funcional. |
| HU-03 | Como *equipo de desarrollo*, queremos tener una base de datos inicial lista. | Alta | Tablas creadas y conectadas al backend. |
| HU-04 | Como *equipo*, queremos contar con un entorno configurado (React + Node + MySQL). | Alta | Proyecto corre en local sin errores. |

---

### 🧩 Tareas del Sprint 1

| ID | Tarea | Responsable | Estado inicial |
|----|--------|--------------|----------------|
| T1 | Crear estructura de carpetas (frontend, backend, database, docs). | Ernesto LISTO
| T2 | Configurar React + Vite en frontend. | Ernesto LISTO
| T3 | Configurar backend con Express y conexión a MySQL. | Ernesto LISTO
| T4 | Crear tablas base sin relaciones complejas. | Ernesto LISTO
| T5 | Endpoint `/login` funcional. | Ernesto LISTO
| T6 | Diseñar pantalla de login y registro en Figma. | Ernesto LISTO
| T7 | Endpoint `/register` funcional. | Diego LISTO
| T8 | Diseño del Dashboard principal. | Diego LISTO
| T9 | Integrar login + dashboard. | Paola PENDIENTE
| T10 | Documentar OpenAPI. | Paola PENDIENTE

---

## Herramientas usadas para Gestión:

- **Trello** para gestión visual de tareas (*Backlog*, *En progreso*, *En revisión*, *Completado*).  
- **GitHub Projects** para seguimiento de issues y commits.  
- **Figma** para diseño de interfaces (UI/UX).  
- **Draw.io / MySQL Workbench** para diagramas de base de datos y flujo.  


