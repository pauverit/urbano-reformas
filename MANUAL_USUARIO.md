# MANUAL DE USUARIO — URBANO REFORMAS ERP v5.0

**Software de gestión para profesionales de la reforma y construcción**
Versión 5.0 · Actualizado: Marzo 2026

---

## ÍNDICE

1. [Primeros pasos — Acceso y sesión](#1-primeros-pasos)
2. [Panel de control](#2-panel-de-control)
3. [Clientes](#3-clientes)
4. [Artículos — Catálogo de trabajos](#4-artículos)
5. [Presupuestos](#5-presupuestos)
6. [Facturas](#6-facturas)
7. [Recibos de entrega a cuenta](#7-recibos)
8. [Gastos](#8-gastos)
9. [Control de horas de peones](#9-horas)
10. [Personal — Equipo](#10-personal)
11. [Agenda](#11-agenda)
12. [Informes trimestrales](#12-informes)
13. [Mi Empresa — Configuración](#13-mi-empresa)
14. [Preguntas frecuentes](#14-faq)

---

## 1. PRIMEROS PASOS

### Acceder al programa

1. Abre el programa en tu navegador.
2. Escribe tu **nombre de usuario** y **contraseña**.
   - El nombre de usuario no distingue mayúsculas de minúsculas (`carlos` = `CARLOS`).
3. Pulsa **Entrar**.

Si los datos son incorrectos, verás un mensaje de error en rojo. Revisa tu usuario y contraseña.

### Sesión persistente

La sesión se guarda automáticamente. Si cierras el navegador o el móvil y vuelves a abrir el programa, **no tendrás que volver a introducir tu contraseña**.

### Cerrar sesión

En el menú lateral (parte inferior), pulsa **Cerrar sesión**. En móvil, el botón de salida está en la barra inferior.

---

## 2. PANEL DE CONTROL

El panel es la **pantalla de inicio** del programa. Te da un resumen rápido del negocio.

### Alertas de facturas vencidas

Si tienes facturas **pendientes de cobro con más de 30 días** de antigüedad, aparece un aviso en amarillo en la parte superior con:
- Número de facturas vencidas
- Importe total pendiente
- Enlace directo a la sección de Facturas

### Tarjetas resumen (parte superior)

| Tarjeta | Qué muestra |
|---|---|
| **Obras activas** | Número de presupuestos en estado "Aceptado" |
| **Presupuestos** | Total de presupuestos creados |
| **Facturas emitidas** | Número total de facturas |
| **Pendiente de cobro** | Suma de facturas menos lo ya cobrado en recibos |

### Obras en curso

Muestra las 3 obras más recientes en estado **Aceptado**, con su número de presupuesto, cliente, fecha e importe.

### Agenda del día

Panel lateral con las tareas programadas para hoy.

---

## 3. CLIENTES

Aquí gestionas la base de datos de tus clientes: particulares, comunidades de vecinos, empresas, etc.

### Ver la lista de clientes

- La lista muestra: **nombre**, NIF/CIF, teléfono, email y localidad.
- Puedes **buscar** por nombre o NIF usando el buscador superior.

### Añadir un cliente nuevo

1. Pulsa el botón **Nuevo Cliente**.
2. Rellena los campos del formulario:
   - **Nombre / Razón Social** *(obligatorio)*
   - NIF / CIF
   - Teléfono
   - Email
   - Dirección completa (calle, número, piso...)
   - Código postal
   - Población
   - Provincia
3. Pulsa **Guardar**.

### Editar o eliminar un cliente

- Pasa el ratón por encima de un cliente (o mantén pulsado en móvil).
- Aparecen los botones de **editar** (lápiz) y **eliminar** (papelera).
- Para eliminar, el sistema te pedirá confirmación.

### Ficha completa del cliente

Pulsa el **nombre del cliente** para abrir su ficha completa, que incluye:
- Datos de contacto
- **Pestaña Presupuestos**: todos los presupuestos creados para ese cliente, con estado e importe.
- **Pestaña Facturas**: todas las facturas emitidas a ese cliente, con estado de cobro.

---

## 4. ARTÍCULOS

El catálogo de artículos es tu lista de **trabajos y materiales habituales** con precio ya fijado. Sirve para añadir líneas rápidamente cuando creas un presupuesto.

### Ver el catálogo

Lista con descripción, unidad de medida y precio unitario. Puedes **buscar** por descripción.

### Unidades de medida disponibles

`ut` (unidades) · `m2` (metros cuadrados) · `ml` (metros lineales) · `m3` (metros cúbicos) · `kg` (kilogramos) · `h` (horas) · `pa` (partida alzada)

### Añadir un artículo nuevo

1. Pulsa **Nuevo Artículo**.
2. Escribe la descripción, selecciona la unidad y el precio.
3. Pulsa **Guardar**.

### Editar o eliminar artículos

Igual que en clientes: pasa el ratón y usa los botones de editar o eliminar.

> **Consejo:** Mantén el catálogo actualizado con tus precios actuales. La IA de generación de presupuestos utiliza este catálogo para sugerir precios.

---

## 5. PRESUPUESTOS

Esta es la sección principal del programa. Aquí creas, gestionas y envías presupuestos a tus clientes.

### Lista de presupuestos

Los presupuestos se muestran como tarjetas con:
- Número y estado del presupuesto
- Nombre del cliente
- Número de líneas de trabajo
- **Importe total** (con IVA)
- **Cobrado** y **pendiente** (si ya hay recibos asociados)
- **Rentabilidad**: beneficio neto y margen sobre el total

#### Filtrar por estado

Usa los botones de la parte superior para filtrar:

| Estado | Significado |
|---|---|
| **Borrador** | En preparación, no enviado |
| **Enviado** | Entregado al cliente para revisión |
| **Aceptado** | Cliente ha dado el OK, obra en marcha |
| **Facturado** | Ya se ha generado la factura |

### Crear un presupuesto nuevo

Pulsa **Crear Nuevo**. El programa te preguntará cómo quieres crearlo:

---

#### OPCIÓN A — Creación Manual

1. Selecciona el **cliente** del desplegable.
2. Añade líneas de trabajo:
   - Pulsa **Añadir línea** para una línea en blanco.
   - Pulsa **Añadir del catálogo** para seleccionar un artículo ya guardado.
3. Para cada línea, rellena:
   - **Descripción** del trabajo
   - **Cantidad**
   - **Unidad** (m2, ml, ut...)
   - **Precio unitario** (€)
   - El total de la línea se calcula solo.
4. Añade **notas o condiciones** en el campo inferior (texto libre).
5. Puedes **firmar el presupuesto** antes de enviarlo:
   - Pulsa **Firmar Presupuesto** para abrir el área de firma táctil.
   - Firma con el dedo (móvil) o ratón.
   - Pulsa **Confirmar Firma**.
6. Genera el **PDF** con el botón azul **Generar PDF**.
7. Guarda el presupuesto como **borrador** o directamente con el PDF generado.

---

#### OPCIÓN B — Creación con Inteligencia Artificial (IA)

Esta opción permite generar el presupuesto **haciendo fotos de la obra y contando lo que hay que hacer** en una nota de voz.

**Pasos:**

1. **Sube fotos de la obra:** Pulsa el área de fotos o arrastra imágenes. Puedes subir varias fotos a la vez (salón, cocina, baño, etc.).
2. **Graba una nota de voz:** Pulsa el botón del micrófono y explica el trabajo: *"Hay que alicatar el baño completo, poner tarima en el salón y pintar toda la casa de blanco"*.
3. Pulsa el botón **Analizar con IA**.
4. La IA analizará las fotos y el audio, y **generará automáticamente las líneas del presupuesto** con cantidades y precios estimados basados en tu catálogo.
5. Revisa y ajusta las líneas generadas a tu gusto.
6. Selecciona el cliente, añade notas y genera el PDF.

> **Nota:** La función IA requiere una clave de API de Google Gemini configurada en el sistema. Si no funciona, usa la creación manual.

---

### Cambiar el estado de un presupuesto

Desde la lista de presupuestos, usa el **desplegable de estado** en cada tarjeta para cambiar directamente: Borrador → Enviado → Aceptado → Facturado.

### Botones de acción en cada presupuesto

| Icono | Acción |
|---|---|
| Lápiz (verde) | Abrir y editar / firmar el presupuesto |
| Cámara (azul) | Galería de fotos de la obra (solo en estado Aceptado) |
| Recibo (morado) | Convertir a factura (solo en estado Aceptado) |

### Galería de fotos de la obra

Desde el botón de cámara puedes documentar fotográficamente el avance de la obra:
- Selecciona la fase: **Antes**, **Durante** o **Después**
- Haz una foto con la cámara del dispositivo o sube una imagen
- Las fotos quedan organizadas por fase y con la fecha automática
- Pulsa sobre una foto para verla en tamaño completo
- Puedes eliminar fotos con el botón de papelera (aparece al pasar el ratón)

### Rentabilidad

En cada tarjeta de presupuesto puedes ver al instante:
- **Beneficio (€):** Total del presupuesto menos los gastos registrados en esa obra
- **Costes:** Suma de todos los gastos vinculados al presupuesto
- **Margen (%):** Verde si es ≥30%, amarillo si es positivo pero bajo, rojo si pierdes dinero

---

## 6. FACTURAS

Las facturas se generan automáticamente desde los presupuestos aceptados.

### Generar una factura

Desde la lista de presupuestos, cuando un presupuesto está en estado **Aceptado**, pulsa el botón morado de recibo. El programa:
1. Crea la factura con todos los datos del presupuesto
2. Cambia el estado del presupuesto a "Facturado"

### Lista de facturas

Cada factura muestra:
- Número de factura y estado de cobro
- Cliente y fecha de emisión
- Importe total
- **Cobrado** y **pendiente** (calculado a partir de los recibos)

#### Estados de cobro

| Estado | Significado |
|---|---|
| **Pendiente** | Sin pagos registrados |
| **Parcial** | Cobrado en parte (hay recibos, pero no el total) |
| **Cobrada** | Pagada completamente |

### Descargar PDF de factura

Cada factura tiene un botón de descarga. El PDF incluye:
- Datos de tu empresa (nombre, NIF, dirección, teléfono, email)
- Datos del cliente
- Tabla de trabajos con descripción, cantidad, unidad, precio y total
- Base imponible, IVA (21%) y total
- Pie de página profesional

---

## 7. RECIBOS

Los recibos son comprobantes de **pagos a cuenta** o **cobros parciales**. Sirven para documentar cuando el cliente te entrega dinero antes o durante la obra.

### Crear un recibo nuevo

1. Pulsa **Nuevo Recibo**.
2. Selecciona el **presupuesto o factura** al que corresponde el pago.
3. Escribe el **concepto** (ej: "Entrega a cuenta inicio de obra").
4. Introduce el **importe** entregado.
5. Si el cliente firma en ese momento, pulsa **Firmar** para capturar su firma.
6. Pulsa **Crear y Descargar** para guardar el recibo y descargar el PDF.

### PDF del recibo

El documento incluye:
- Nombre del destinatario
- Concepto del pago
- Importe total de la obra, cantidad entregada y pendiente de pago
- Espacio para la firma del cliente
- Datos de tu empresa

### Resumen de caja

En el lateral derecho (o parte inferior en móvil) aparece el **total cobrado** en recibos y el número de recibos emitidos.

---

## 8. GASTOS

Registra todos los gastos de la empresa: materiales, herramientas, transporte, subcontratas, suministros, etc.

### Lista de gastos

Puedes **filtrar por:**
- **Búsqueda:** Escribe el nombre del proveedor o el concepto
- **Mes:** Selecciona el mes para ver los gastos de ese período

Cada gasto muestra: número, categoría, proveedor, importe total, base imponible y si tiene foto adjunta.

### Registrar un gasto nuevo

Pulsa **Nuevo Gasto**. Tienes dos opciones:

---

#### OPCIÓN A — Con foto del ticket o factura (IA)

1. Pulsa el icono de **cámara** para hacer una foto del ticket, o el icono de **PDF** para subir una factura.
2. La IA analiza el documento y rellena automáticamente:
   - Proveedor
   - Concepto
   - Categoría
   - Base imponible
   - IVA
3. Revisa y corrige los datos si es necesario.
4. Pulsa **Guardar**.

---

#### OPCIÓN B — Introducción manual

Rellena los campos:
- **Proveedor** (nombre de la tienda o empresa)
- **Categoría:** Material · Herramienta · Transporte · Subcontrata · Suministros · Otros
- **Concepto** (descripción del gasto)
- **Vincular a obra:** Selecciona el presupuesto al que pertenece este gasto (opcional, pero necesario para calcular la rentabilidad)
- **Base imponible** (importe sin IVA)
- **IVA %** (el importe del IVA y el total se calculan solos)
- **Notas** (campo libre)

---

### Exportar gastos a Excel

Pulsa el botón **Excel** (parte superior derecha). Se descarga un archivo `.xlsx` con todos los gastos del filtro activo (mes o todos). El archivo incluye: número, fecha, proveedor, concepto, categoría, base, IVA% y total.

### Resumen por categoría

En el lateral derecho hay un resumen del total de gastos y el desglose por categoría.

---

## 9. CONTROL DE HORAS DE PEONES

Registra las horas trabajadas por cada peón en cada obra para controlar el coste de mano de obra.

### Resumen superior

- **Total de horas** trabajadas (en el período filtrado)
- **Coste total** de mano de obra
- **Desglose por trabajador:** horas y coste de cada peón

### Filtros

Puedes filtrar el registro por:
- **Obra:** Ver solo las horas de un presupuesto concreto
- **Peón:** Ver solo las horas de un trabajador concreto
- Pulsa **Limpiar** para quitar los filtros

### Añadir horas trabajadas

Pulsa **Añadir Horas**. Rellena el formulario:

1. **Obra:** Selecciona el presupuesto/obra. Se muestra el número, el nombre del cliente y el importe.
2. **Trabajador:**
   - Si tienes personal dado de alta en la sección "Personal", aparecerán en el desplegable.
   - Selecciona **"Otro (subcontrata)"** si el trabajador no está en tu plantilla, y escribe su nombre.
3. **Fecha:** Por defecto hoy. Cámbiala si estás registrando horas de días anteriores.
4. **Horas:** Número de horas trabajadas (mínimo 0,5; pasos de 0,5 horas).
5. **€/Hora:** Precio por hora de ese trabajador.
6. **Total:** Se calcula automáticamente.
7. **Concepto:** Descripción opcional del trabajo (ej: "Alicatado baño").
8. Pulsa **Guardar**.

### Registro de horas

La lista muestra cada entrada con:
- Nombre del peón (con sus iniciales en un círculo)
- Obra/presupuesto y cliente
- Horas × precio hora
- Importe total
- Fecha y concepto
- Botón de eliminar (aparece al pasar el ratón)

---

## 10. PERSONAL — EQUIPO

Gestiona la ficha de tus trabajadores habituales. Los nombres añadidos aquí aparecen en el desplegable de la sección Horas.

### Lista de personal

Cada ficha muestra: nombre, cargo, email, teléfono y estado actual.

| Estado | Significado |
|---|---|
| **Disponible** | Libre para asignar a obra |
| **En Obra** | Actualmente trabajando en una obra |
| **Baja** | No disponible temporalmente |

El punto de color junto al estado parpadea si está activo (Disponible o En Obra).

### Añadir un trabajador

1. Pulsa **Nuevo Empleado**.
2. Rellena nombre, cargo, email, teléfono y estado.
3. Pulsa **Dar de Alta**.

### Editar o eliminar

Pasa el ratón sobre la fila del trabajador y usa los botones de editar o eliminar.

---

## 11. AGENDA

La agenda permite planificar las visitas y trabajos del día.

> **Nota:** La agenda está en desarrollo. Actualmente muestra la vista de calendario mensual y las tareas del día.

---

## 12. INFORMES TRIMESTRALES

Genera los informes de **IVA trimestral** para facilitar la declaración del modelo 303.

### Seleccionar el trimestre

Pulsa uno de los cuatro botones de trimestre y el año que quieres consultar:
- **1T** — Enero, Febrero, Marzo
- **2T** — Abril, Mayo, Junio
- **3T** — Julio, Agosto, Septiembre
- **4T** — Octubre, Noviembre, Diciembre

### Datos del informe

| Tarjeta | Descripción |
|---|---|
| **IVA Repercutido** | IVA cobrado a tus clientes (de las facturas) |
| **IVA Soportado** | IVA pagado a tus proveedores (de los gastos) |
| **Resultado IVA** | Lo que tienes que pagar a Hacienda (o lo que te devuelven) |
| **Beneficio neto** | Ingresos facturados menos gastos del trimestre |

### Tablas detalladas

- **Facturas del trimestre:** Número, fecha, cliente, base, IVA, total
- **Gastos del trimestre:** Número, fecha, proveedor, categoría, base, IVA, total

### Exportar informe en PDF

Pulsa **Exportar PDF**. Se genera un documento profesional con todas las tablas y el resumen fiscal.

> **Aviso legal:** Este informe es una ayuda para gestión interna. Consulta siempre con tu asesor fiscal para la presentación oficial de modelos tributarios.

---

## 13. MI EMPRESA — CONFIGURACIÓN

Aquí configuras los datos de tu empresa y los usuarios que tienen acceso al programa.

### Datos fiscales y de empresa

Rellena o actualiza:
- **Nombre comercial** (el que aparece en presupuestos y facturas)
- Razón social
- NIF / CIF
- Dirección completa
- Teléfono y email
- Página web

### Logotipo

- Pulsa **Subir Logo** para cargar la imagen de tu logo.
- El logo aparecerá en los PDF de presupuestos, facturas y recibos.

### Datos bancarios

- Introduce tu **IBAN** para que aparezca en los documentos.

### Condiciones del presupuesto

- Texto que aparece al pie de los presupuestos en PDF.
- Puedes escribir tus condiciones generales, forma de pago, garantías, etc.

### Gestión de usuarios de acceso

Esta sección te permite crear y gestionar las cuentas de acceso al programa.

#### Ver usuarios actuales

Lista de todos los usuarios con su nombre, nombre de usuario y estado (Activo/Inactivo).

#### Editar un usuario existente

1. Pulsa el botón **Editar** junto al usuario.
2. Puedes cambiar:
   - Nombre completo
   - Nombre de usuario
   - **Nueva contraseña** (déjalo en blanco para no cambiarla)
   - Confirmar nueva contraseña
   - Activar o desactivar el usuario
3. Pulsa **Guardar cambios**.

#### Crear un nuevo usuario

1. Pulsa **Nuevo Usuario**.
2. Introduce:
   - **Nombre de usuario** *(obligatorio)*
   - **Contraseña** *(obligatorio)*
   - **Confirmar contraseña** *(debe coincidir)*
   - Nombre completo (opcional)
3. Pulsa **Crear Usuario**.

> **Importante:** Siempre debe existir al menos un usuario activo. El sistema no te dejará eliminar o desactivar el último usuario activo.

#### Seguridad de contraseñas

- Usa el icono del ojo para mostrar u ocultar la contraseña mientras la escribes.
- Se recomienda usar contraseñas de al menos 6 caracteres.

#### Guardar cambios de empresa

Pulsa el botón **Guardar Cambios** al final de la página para guardar todos los datos fiscales, logo, IBAN y condiciones.

---

## 14. PREGUNTAS FRECUENTES

**¿Puedo usar el programa en el móvil?**
Sí. El programa está diseñado para funcionar en cualquier dispositivo: móvil, tablet u ordenador. En móvil aparece una barra de navegación en la parte inferior.

---

**¿Cómo genero un presupuesto con IA?**
Al crear un presupuesto, elige la opción "IA". Sube fotos de la zona a reformar y graba una nota de voz explicando lo que hay que hacer. La IA analizará todo y generará las líneas del presupuesto automáticamente.

---

**¿Cómo registro un ticket de compra?**
En la sección **Gastos**, pulsa "Nuevo Gasto" y usa el icono de cámara para fotografiar el ticket. La IA leerá el importe, el proveedor y el concepto de forma automática.

---

**¿Cómo sé cuánto me ha pagado un cliente?**
Los recibos que creas quedan vinculados al presupuesto o factura. Desde la lista de presupuestos y facturas verás en verde el importe cobrado y en amarillo lo que queda pendiente.

---

**¿Cómo sé si una obra me está dando beneficio?**
En la lista de presupuestos, cada tarjeta muestra el **beneficio neto** y el **margen porcentual** en tiempo real. Para que funcione correctamente, debes vincular los gastos de materiales y mano de obra al presupuesto correspondiente.

---

**¿Puedo registrar horas de peones que no tengo dados de alta?**
Sí. En la sección Horas, al añadir una entrada, selecciona "Otro (subcontrata)" en el desplegable de trabajadores y escribe el nombre manualmente.

---

**¿Cómo exporto los gastos a Excel?**
En la sección Gastos, usa el botón **Excel** en la parte superior derecha. Se descarga el archivo con los gastos del filtro activo.

---

**¿Cómo genero el informe de IVA?**
Ve a **Informes**, selecciona el trimestre y el año, y pulsa **Exportar PDF**.

---

**¿Puedo tener más de un usuario de acceso?**
Sí. En **Mi Empresa → Usuarios**, puedes crear todos los usuarios que necesites, por ejemplo si tienes un empleado de oficina o contable que también necesita acceso.

---

**¿Los datos se guardan en la nube?**
Sí. Todos los datos se guardan en la base de datos en la nube (Supabase). Puedes acceder desde cualquier dispositivo con conexión a internet y los datos siempre estarán actualizados.

---

*Urbano Reformas ERP · Desarrollado a medida · v5.0*
