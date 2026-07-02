# Landing Dropper

Sitio web de Dropper (mensajería) con cotizador y rastreo en vivo conectado a Sendabox.

## Estructura

```
index.html                     → el sitio (landing + cotizador + rastreo)
support.js                     → runtime del sitio (no editar)
api/v1/tracking/[guia].js      → proxy de rastreo (función serverless)
```

## Cómo funciona el rastreo

El sitio llama a `/api/v1/tracking/<GUIA>` en su **propio dominio**. Esa ruta es una
función serverless que reenvía la petición al endpoint **público** de Sendabox
agregando el header `x-tenant-id: droppergt`.

Como la llamada a Sendabox se hace **servidor-a-servidor**, no aplica la restricción
CORS del navegador: **funciona desde cualquier dominio sin pedirle nada a Sendabox.**

## Desplegar en Vercel (recomendado, gratis)

1. Sube esta carpeta a un repositorio de GitHub (por ejemplo `landing-dropper`).
2. Entra a https://vercel.com → **Add New → Project** → importa el repo.
3. Framework Preset: **Other**. Deja todo por defecto y da **Deploy**.
4. Vercel detecta `api/v1/tracking/[guia].js` como función automáticamente.
5. Listo: tu sitio queda en `https://<tu-proyecto>.vercel.app` con rastreo en vivo.

## Desplegar en Netlify

Igual de simple, pero las funciones van en otra carpeta. Si prefieres Netlify,
avísame y te dejo la versión con `netlify/functions/`.

## Probar el rastreo

Abre el sitio publicado, pestaña **Rastrear**, e ingresa una guía real
(ej. una que esté *en camino* o *entregada*). Verás la línea de tiempo con las
fechas reales de cada estado.

> En vista previa local (sin la función serverless corriendo) el rastreo muestra
> datos de **demostración**; en el sitio desplegado usa datos reales.

## Ajustes

Colores de marca, `apiBase` y `tenantId` se pueden cambiar desde el panel de
Tweaks del editor. Para producción con proxy, deja `apiBase` en `/api/v1`.
