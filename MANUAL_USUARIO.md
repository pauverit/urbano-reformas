# 📘 Urbano Reformas ERP — Manual de Usuario v4.0

> **Guía paso a paso** para gestionar tu negocio de reformas: presupuestos, facturas, gastos e informes.
> No necesitas experiencia previa con software de facturación.

---

## Tabla de Contenidos

1. [Primeros pasos](#1-primeros-pasos)
2. [Mi Empresa — Tus datos fiscales](#2-mi-empresa)
3. [Clientes — Tu cartera de clientes](#3-clientes)
4. [Artículos — Tu catálogo de trabajos](#4-artículos)
5. [Presupuestos — Cómo crear un presupuesto](#5-presupuestos)
6. [Facturas — Cobrar tu trabajo](#6-facturas)
7. [Recibos — Justificantes de pago](#7-recibos)
8. [Gastos — Control de costes](#8-gastos)
9. [Informes — Para tu gestoría](#9-informes)
10. [Preguntas frecuentes](#10-preguntas-frecuentes)

---

## 1. Primeros Pasos

### ¿Qué es este programa?

Urbano Reformas ERP es tu herramienta para gestionar **todo el ciclo de una reforma**:

```
Cliente → Presupuesto → Factura → Cobro (Recibo)
```

Además controlas tus **gastos** (tickets de material, facturas de proveedores) y generas **informes de IVA** para llevar a tu gestoría.

### Acceso

1. Abre tu navegador (Chrome, Firefox, Safari...)
2. Ve a la dirección que te hayan proporcionado (ej: `http://localhost:5173`)
3. Introduce tu usuario y contraseña
4. Llegarás al **Dashboard** (panel principal)

### El menú lateral

A la izquierda verás el menú con todas las secciones:

| Icono | Sección | ¿Para qué sirve? |
|-------|---------|-------------------|
| 📊 | Dashboard | Vista general de tu negocio |
| 👤 | Clientes | Registrar y buscar clientes |
| 📦 | Artículos | Tu catálogo de trabajos y precios |
| 📝 | Presupuestos | Crear y gestionar presupuestos |
| 🧾 | Facturas | Facturas generadas desde presupuestos |
| 💰 | Recibos | Justificantes de los cobros |
| 💸 | Gastos | Tickets y facturas de proveedores |
| 📈 | Informes | IVA trimestral para la gestoría |
| 📅 | Agenda | Calendario de trabajos |
| 👥 | Equipo | Tu personal |
| 🏢 | Mi Empresa | Tus datos fiscales y logo (abajo del menú) |

---

## 2. Mi Empresa

> **Haz esto primero**. Sin los datos de tu empresa, los PDFs no saldrán completos.

### Cómo rellenar tus datos

1. Pulsa **"Mi Empresa"** en la parte inferior del menú lateral
2. Rellena los campos:
   - **Nombre comercial**: el nombre con el que trabajas (ej: "Urbano Reformas")
   - **Razón social**: tu nombre completo como autónomo
   - **NIF**: tu número de identificación fiscal
   - **Dirección, CP, Población, Provincia**
   - **Teléfono y Email**
   - **IBAN**: tu cuenta bancaria (aparecerá en los documentos si lo necesitas)
3. **Logo**: Pulsa "Subir Logo" y selecciona una imagen con el logo de tu empresa. Se mostrará en todos los PDFs.
4. **Condiciones de presupuesto**: El texto que aparecerá en el pie de tus presupuestos (ej: "Presupuesto válido 30 días").
5. Pulsa **"Guardar Cambios"**. Verás un mensaje de confirmación en verde.

---

## 3. Clientes

### ¿Qué datos necesito de un cliente?

Como mínimo, el **nombre**. Para que las facturas sean válidas fiscalmente, necesitarás también:
- **NIF/CIF** del cliente
- **Dirección completa** (calle, CP, población, provincia)

### Crear un cliente nuevo

1. Ve a **Clientes** en el menú
2. Pulsa **"Nuevo Cliente"** (botón azul arriba a la derecha)
3. Rellena los datos en la ventana que se abre
4. Pulsa **"Crear Cliente"**

### Buscar un cliente

Usa la **barra de búsqueda** en la parte superior. Puedes buscar por nombre o NIF.

### Editar o eliminar

Pasa el ratón por encima de la tarjeta del cliente. Aparecerán dos iconos:
- ✏️ **Lápiz** = Editar
- 🗑️ **Papelera** = Eliminar (te pedirá confirmación)

---

## 4. Artículos

Los artículos son tu **catálogo de trabajos y materiales** con precios predeterminados. Cuando hagas un presupuesto, podrás seleccionar artículos del catálogo sin tener que escribir todo de nuevo.

### Crear un artículo

1. Ve a **Artículos** en el menú
2. Pulsa **"Nuevo Artículo"**
3. Rellena:
   - **Descripción**: qué es el trabajo o material (ej: "Alicatado de paredes")
   - **Unidad**: cómo se mide (m² para metros cuadrados, ut para unidades, pa para partida alzada, etc.)
   - **Precio unitario**: cuánto cobras por cada unidad
4. Pulsa **"Crear Artículo"**

> **Consejo**: Al inicio, la base de datos viene con 26 artículos de ejemplo para reformas. Puedes editarlos o borrarlos.

---

## 5. Presupuestos

Esta es la sección más importante. Un presupuesto es el documento donde detallas los trabajos que vas a hacer y cuánto van a costar.

### Crear un presupuesto

1. Ve a **Presupuestos** → pulsa **"Crear Nuevo"**
2. Elige el modo:

#### Modo Manual
Para cuando tú mismo escribes las líneas:
1. **Selecciona un cliente** del desplegable
2. Añade líneas de dos formas:
   - **"Del Catálogo"**: elige un artículo que ya tengas registrado
   - **Botón "+"**: añade una línea en blanco y escríbela tú
3. Para cada línea, rellena: descripción, cantidad, unidad y precio
4. Los totales (base, IVA 21%, total) se calculan solos

#### Modo Foto + Audio (IA) 🤖
Para cuando estás en obra con el cliente:
1. **Sube fotos**: haz fotos de la estancia, del baño, de lo que haya que reformar. Puedes subir **varias fotos a la vez**
2. **Graba audio** (opcional): pulsa el botón verde de micrófono y explica lo que el cliente quiere. Ejemplo: *"El cliente quiere quitar la bañera, poner plato de ducha, alicatar todo el baño y cambiar la ventana por una cuadrada"*
3. Pulsa **"Analizar con IA"**
4. La IA analizará las fotos y el audio juntos y generará las líneas del presupuesto automáticamente
5. **Puedes editar todas las líneas** que la IA ha generado: cambiar precios, quitar líneas, añadir nuevas

> **Importante**: Si no tienes configurada la API de Gemini, el sistema usará datos de ejemplo para que puedas probar la función.

### Guardar y enviar

Una vez tengas las líneas listas:
- **"Guardar Borrador"**: lo guarda sin enviarlo, puedes editarlo después
- **"Firmar"**: abre un panel de firma digital donde el cliente firma con el dedo
- **"Generar PDF"**: crea un PDF profesional con tu logo, datos fiscales y las líneas del presupuesto

### Ciclo de vida de un presupuesto

Un presupuesto pasa por **4 estados**:

```
BORRADOR → ENVIADO → ACEPTADO → FACTURADO
```

| Estado | Significado | Acción |
|--------|-------------|--------|
| Borrador | Lo tienes guardado pero no lo has mandado | Pulsa ▶ para marcar como Enviado |
| Enviado | Se lo has dado al cliente, espera respuesta | Pulsa ✓ cuando el cliente lo acepte |
| Aceptado | El cliente ha dicho que sí | Pulsa 🧾 para pasarlo a Factura |
| Facturado | Ya se ha generado la factura | No se puede borrar ni modificar |

---

## 6. Facturas

### ¿Cómo se genera una factura?

Las facturas **no se crean manualmente**. Se generan automáticamente desde un presupuesto aceptado:

1. Ve a **Presupuestos**
2. Busca un presupuesto en estado **"Aceptado"**
3. Pulsa el botón 🧾 de la derecha
4. El sistema crea la factura automáticamente con un número secuencial (F-001, F-002...)

### ¿Qué incluye la factura?

- Logo y datos de tu empresa
- Datos del cliente (nombre, NIF, dirección)
- Todas las líneas del presupuesto
- Base imponible, IVA (21%) y total
- Número de factura y fecha

### Descargar el PDF

Cada factura tiene un botón de **descarga** (⬇️). El PDF es profesional y listo para entregar al cliente o a tu gestoría.

### Estados de factura

| Estado | Significado |
|--------|-------------|
| Pendiente | Aún no la has cobrado |
| Parcial | Has cobrado una parte (entrega a cuenta) |
| Cobrada | Totalmente pagada |

---

## 7. Recibos

Un recibo es un **justificante de pago**. Cuando un cliente te paga (toda la factura o una parte), le das un recibo.

### Crear un recibo

1. Ve a **Recibos** → pulsa **"Nuevo Recibo"**
2. **Selecciona la factura** a la que corresponde el pago
3. Escribe el **concepto** (ej: "Entrega a cuenta reforma baño")
4. Indica el **importe** que te pagan
5. Opcionalmente, pide al cliente que **firme** en la pantalla
6. Pulsa **"Crear y Descargar PDF"**

El sistema genera automáticamente un PDF con:
- Los datos del cliente
- El importe total de la factura
- Lo que ha entregado
- Lo que queda pendiente de pago
- La firma del cliente (si la ha puesto)

---

## 8. Gastos

Como autónomo, necesitas llevar control de tus gastos para la declaración de IVA. Esta sección te permite registrar tickets y facturas de proveedores.

### Registrar un gasto

1. Ve a **Gastos** → pulsa **"Nuevo Gasto"**
2. Puedes registrarlo de dos formas:

#### Foto de ticket (OCR con IA) 📷
1. Pulsa **"Foto de Ticket"**
2. Haz una foto al ticket o factura de proveedor
3. La IA lee el ticket y rellena automáticamente: proveedor, concepto, base, IVA y total
4. **Revisa y corrige** si algo no ha salido bien
5. Selecciona una **categoría**: Material, Herramienta, Transporte, Subcontrata, Suministros u Otros

#### Subir PDF 📄
Si tu proveedor te envía factura en PDF, pulsa **"Subir PDF"** y adjúntala.

### Panel de resumen

A la derecha verás un panel negro con:
- **Total de gastos** acumulado
- Desglose por **categoría**
- Número de gastos registrados

### Filtrar gastos

Puedes filtrar por **mes** usando el desplegable de la parte superior, o buscar por proveedor o concepto.

---

## 9. Informes

Esta sección es clave para llevar los datos a tu **gestoría**. Te calcula automáticamente el IVA trimestral.

### ¿Qué es el IVA trimestral?

Como autónomo, cada 3 meses tienes que declarar a Hacienda la diferencia entre:
- **IVA que has cobrado** a tus clientes (IVA repercutido) — sale de tus facturas
- **IVA que has pagado** a tus proveedores (IVA soportado) — sale de tus gastos

```
Si cobras más IVA del que pagas → tienes que pagar la diferencia a Hacienda
Si pagas más IVA del que cobras → Hacienda te devuelve
```

### Cómo usar los informes

1. Ve a **Informes**
2. Selecciona el **trimestre** (1T, 2T, 3T, 4T) y el **año**
3. Verás 4 tarjetas:
   - 🔵 **IVA Repercutido**: lo que has cobrado de IVA en tus facturas
   - 🟡 **IVA Soportado**: lo que has pagado de IVA en tus gastos
   - 🔴/🟢 **Resultado IVA**: lo que tienes que pagar o te deben devolver
   - **Beneficio Neto**: ingresos menos gastos (tu beneficio real)
4. Debajo verás el detalle de facturas y gastos del trimestre

### Exportar PDF para la gestoría

Pulsa **"Exportar PDF"** arriba a la derecha. Se descargará un PDF con:
- Resumen de IVA
- Listado completo de facturas emitidas
- Listado completo de gastos
- Todo organizado para que tu gestor lo tenga claro

---

## 10. Preguntas Frecuentes

### ¿Se pierden los datos si cierro el navegador?
**No.** Todos los datos se guardan en la nube (Supabase). Puedes cerrar y volver cuando quieras.

### ¿Puedo usar esto en el móvil?
**Sí.** La aplicación es responsive y se adapta a móviles y tablets. Es especialmente útil para hacer presupuestos con foto en obra.

### ¿Puedo cambiar un presupuesto después de enviarlo?
Puedes cambiar el estado, pero no editar las líneas una vez guardado. Si necesitas modificar algo, lo ideal es crear uno nuevo.

### ¿Puedo borrar una factura?
No. Las facturas tienen numeración correlativa obligatoria por ley. Una vez generada, no se debe borrar. Si necesitas anularla, consulta con tu gestoría.

### ¿Qué pasa si no tengo la API de Gemini configurada?
Las funciones de IA (foto de presupuesto, OCR de tickets) usarán **datos de ejemplo** para que puedas ver cómo funciona. Cuando configures la API, funcionará con datos reales.

### ¿Cómo configuro la API de Gemini?
Añade esta línea en el archivo `.env` del proyecto:
```
VITE_GEMINI_API_KEY=tu_clave_de_api_aqui
```
Puedes obtener una clave gratuita en [Google AI Studio](https://aistudio.google.com/apikey).

### ¿Necesito internet para usar esto?
**Sí.** Los datos se guardan en la nube, por lo que necesitas conexión a internet.

---

## 🔄 Flujo de trabajo típico

Para que veas cómo encaja todo, este es el flujo habitual de un profesional de reformas:

```
1. 🏢 Rellenar MI EMPRESA (solo la primera vez)
       ↓
2. 👤 Dar de alta al CLIENTE
       ↓
3. 📝 Crear PRESUPUESTO (manual o con foto+audio)
       ↓
4. ✉️ Enviar presupuesto al cliente (PDF)
       ↓
5. ✅ Cliente acepta → Marcar como ACEPTADO
       ↓
6. 🧾 Pasar a FACTURA
       ↓
7. 💰 Cobrar → Crear RECIBO
       ↓
8. 💸 Registrar GASTOS (tickets de material, etc.)
       ↓
9. 📈 Cada trimestre: INFORME → PDF → Gestoría
```

---

> **Última actualización**: v4.0 — Marzo 2026
> Incluye: Multi-foto + audio IA, Mi Empresa, Gastos OCR, Informes IVA trimestral, PDFs profesionales.
