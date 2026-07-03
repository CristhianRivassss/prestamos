# Sistema de Préstamos — Plan del proyecto

Sistema en línea para gestionar préstamos personales y préstamos a medias con un socio.
Se construye en 3 etapas. **Estamos en la Etapa 1.**

## Stack

- **Next.js 15 (App Router) + TypeScript + Tailwind CSS + shadcn/ui**
- **Vitest** para tests del motor de cálculo
- **Supabase** (Postgres + Auth) — se integra en la Etapa 2, no antes
- Deploy en **Vercel**
- Idioma de la interfaz: **español**. Moneda: colones costarricenses (CRC), formato `₡1.000.000` sin decimales.

## Principio de arquitectura

Toda la lógica financiera vive en `lib/loan-engine/` como funciones puras de TypeScript,
sin dependencias de React ni de la base de datos. La UI y (después) la persistencia solo
consumen ese motor. Cada tipo de interés tiene tests unitarios con casos numéricos verificados.

---

## Etapa 1 — Creador de planilla (calculadora de préstamos)

Página única, sin login ni base de datos. El usuario ingresa los datos del préstamo y
obtiene la tabla de pagos completa con fechas y montos, más un resumen.

### Entradas del formulario

| Campo | Detalle |
|---|---|
| Monto prestado | número en CRC |
| Tasa de interés | porcentaje por periodo (ej: 10% mensual) |
| Tipo de interés | selector con los 4 tipos de abajo |
| Frecuencia de pago | mensual, **quincenal (default)**, semanal, diario |
| Número de cuotas | entero |
| Fecha del primer pago | date picker; default = hoy + un periodo |
| Fecha del desembolso | date picker; default = hoy |

### Tipos de interés (los 4 son seleccionables)

1. **Interés fijo mensual (simple sobre capital)** — el más usado.
   Cada periodo paga `capital × tasa` de interés. El capital se puede abonar por partes
   iguales en las N cuotas o dejarse configurable. El interés siempre se calcula sobre
   el capital inicial (no sobre saldo).
2. **Cuota fija (sistema francés / amortizado)** — cuota constante calculada con la
   fórmula estándar `C = P·i / (1 − (1+i)^−n)`. El interés de cada cuota se calcula
   sobre el saldo; el resto abona a capital.
3. **Solo interés, capital al final** — N−1 cuotas de puro interés (`capital × tasa`)
   y la última cuota = interés + todo el capital.
4. **Interés total repartido (flat)** — total a pagar = `capital × (1 + tasa × n_periodos)`
   dividido en N cuotas iguales.

Nota: si la tasa se ingresa mensual pero la frecuencia es quincenal/semanal/diaria,
convertir la tasa proporcionalmente al periodo (ej: 10% mensual → 5% quincenal).
Mostrar la tasa por periodo resultante para que el usuario la verifique.

### Salida

1. **Tabla de pagos** estilo Excel, una fila por cuota:
   `# cuota | fecha | cuota total | interés | abono a capital | saldo restante`
2. **Resumen**: total a pagar, total de intereses (ganancia), tasa efectiva del préstamo,
   fecha del último pago.
3. Fechas: quincenal = cada 15 días exactos; mensual = mismo día del mes siguiente
   (ajustar fin de mes, ej: 31 ene → 28 feb); semanal = +7 días; diario = +1 día.
4. Botón **imprimir / exportar** (al menos versión imprimible con `window.print`;
   export a Excel puede quedar para después).
5. Los resultados se recalculan en vivo al cambiar cualquier campo.
6. Debe poner un campo para abonos extra porque eso bajaria el interes si fuera amortizado

### Criterios de aceptación de la Etapa 1

- Los 4 tipos de interés producen tablas correctas (verificadas con tests).
- Redondeo: montos a colones enteros; la última cuota absorbe la diferencia de redondeo
  para que la suma cuadre exacto con el total.
- Funciona bien en celular (los usuarios la usarán desde el teléfono).

---

## Etapa 2 — Préstamos guardados y sociedad (futuro)

- Integrar Supabase; guardar préstamos creados desde la planilla.
- Cada préstamo marca si es **a medias con el socio** o **personal**, y el porcentaje
  de reparto (default 50/50, configurable porque a veces no es a medias).
- Registrar **pagos reales** contra la tabla (pagó/no pagó, pago parcial, fecha real).
- **Restructuración**: un préstamo puede cerrarse y generar uno nuevo vinculado
  (saldo pendiente + nuevas condiciones), conservando el historial.
- Reportes: ganancia por mes, ganancia por socio, cartera activa, cuotas vencidas.

## Etapa 3 — Autenticación y roles (futuro)

- Login con Supabase Auth (2 usuarios: dueño y socio).
- Rol **dueño**: ve todo, incluidos sus préstamos personales.
- Rol **socio**: solo ve los préstamos compartidos. Los préstamos personales del dueño
  son invisibles para el socio (aplicar con Row Level Security de Postgres, no solo en la UI).
