# Sistema de Prestamos

Plantilla inicial de la Etapa 1 para la calculadora de prestamos en linea.

## Requisitos

- Node.js 22+
- npm 10+
- Docker (opcional para despliegue local en contenedor)

## Ejecutar en local

```bash
npm install
npm run dev
```

Abrir http://localhost:3000

## Tests

```bash
npm test
```

## Build de produccion

```bash
npm run build
npm run start
```

## Docker

Construir imagen:

```bash
docker build -t prestamos-web .
```

Ejecutar contenedor:

```bash
docker run --rm -p 3000:3000 prestamos-web
```

Con compose:

```bash
docker compose up --build
```

## Estructura base

- app/: interfaz Next.js (App Router)
- lib/loan-engine/: motor financiero puro
- tests/loan-engine/: pruebas del motor con Vitest
- components/: componentes de UI de la calculadora
