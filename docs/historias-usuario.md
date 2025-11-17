# 📘 Historias de Usuario – Sistema de Torneos Deportivos

---

## 🟦 HU-001 – Login de usuarios
**Como** usuario registrado  
**Quiero** iniciar sesión con mi email y contraseña  
**Para** acceder al sistema según mi rol

### ✅ Criterios de aceptación
- Debe validar correo y contraseña.
- Si el login es correcto, debe iniciar sesión y redirigir según rol.
- Si el usuario no existe, debe mostrar error 404.
- Si la contraseña es incorrecta, debe mostrar error 401.

### 🧪 Pruebas (Gherkin)
- **Dado** que estoy en la página /login  
- **Cuando** ingreso credenciales válidas  
- **Entonces** debo iniciar sesión y ver mi dashboard  

---

## 🟦 HU-002 – Registro de usuario
**Como** nuevo usuario  
**Quiero** registrarme proporcionando mis datos básicos  
**Para** poder iniciar sesión y usar el sistema

### Criterios de aceptación
- Validar email único.
- Mostrar error si el email ya existe.
- Guardar contraseña encriptada.
- Redirigir al login al registrarse.

### Gherkin
- **Dado** que estoy en /register  
- **Cuando** lleno los campos obligatorios  
- **Entonces** debo registrarme y ver un mensaje de éxito  

---

## 🟦 HU-003 – Ver lista de torneos
**Como** administrador  
**Quiero** ver todos los torneos registrados  
**Para** gestionarlos desde el dashboard

### Criterios de aceptación
- Mostrar tabla con nombre, deporte, fecha, cupos y estado.
- Debe tener paginación.
- Debe consumir el endpoint /torneos.

### Gherkin
- **Dado** que soy admin  
- **Cuando** entro al dashboard  
- **Entonces** veo la tabla de torneos  

---

## 🟦 HU-004 – Crear torneo
**Como** administrador  
**Quiero** crear un nuevo torneo desde un formulario  
**Para** agregarlo al sistema

### Criterios de aceptación
- Validar fecha, cupos y deporte.
- Guardar la información con el endpoint POST /torneos.
- Mostrar notificación al completar la acción.

### Gherkin
- **Dado** que estoy en “Crear torneo”  
- **Cuando** lleno el formulario  
- **Entonces** se debe registrar un nuevo torneo  

---

## 🟦 HU-005 – Editar torneo
**Como** administrador  
**Quiero** actualizar los datos de un torneo  
**Para** corregir información o modificar cupos

### Criterios
- Debe permitir editar únicamente torneos existentes.
- Validar campos obligatorios.
- Debe actualizarse en la BD.

### Gherkin
- **Dado** un torneo existente  
- **Cuando** edito su información  
- **Entonces** los cambios deben guardarse correctamente  

---

## 🟦 HU-006 – Eliminar torneo
**Como** administrador  
**Quiero** borrar un torneo  
**Para** retirarlo del sistema

### Criterios
- Debe pedir confirmación.
- El torneo debe eliminarse de forma lógica o física.
- Debe mostrar mensaje “Torneo eliminado”.

### Gherkin
- **Dado** un torneo visible en la tabla  
- **Cuando** presiono eliminar  
- **Entonces** debe ser removido  

---

## 🟦 HU-007 – Ver resultados de torneo
**Como** usuario  
**Quiero** ver los resultados de los torneos  
**Para** consultar puntajes y posiciones

### Criterios
- Mostrar tabla de resultados.
- Mostrar nombre del torneo, atleta, puntaje o tiempo.
- Recibir datos desde el endpoint /resultados.

### Gherkin
- **Dado** que entro en “Resultados”  
- **Cuando** selecciono un torneo  
- **Entonces** veo los resultados del mismo  

---

## 🟦 HU-008 – Inscripción a torneo
**Como** usuario  
**Quiero** inscribirme a un torneo disponible  
**Para** participar en él

### Criterios
- Validar cupos disponibles.
- Debe registrarse la inscripción.
- No permitir duplicados.

### Gherkin
- **Dado** un torneo con cupos  
- **Cuando** hago clic en “Inscribirme”  
- **Entonces** debo quedar registrado en ese torneo  
