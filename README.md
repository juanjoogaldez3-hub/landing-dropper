# Landing Dropper — versión Netlify

Sitio de Dropper con cotizador y rastreo en vivo. Alternativa a Vercel: evita
por completo el conflicto de "reclamar dominio" que aparece cuando el apex ya está
en otra cuenta de Vercel.

## Archivos

```
index.html                      → el sitio
support.js                      → runtime del sitio (no editar)
netlify.toml                    → redirige /api/v1/tracking/<GUIA> a la función
netlify/functions/track.js      → proxy de rastreo (función serverless)
```

## Desplegar en Netlify (gratis)

**Opción A — arrastrar y soltar (sin GitHub):**
1. Entra a https://app.netlify.com → **Add new site → Deploy manually**.
2. Arrastra **el contenido de esta carpeta** a la zona de subida.
3. Listo, queda en `https://<algo>.netlify.app`.

**Opción B — con GitHub (re-deploy automático):**
1. Sube esta carpeta a un repo de GitHub.
2. Netlify → **Add new site → Import from Git** → elige el repo → **Deploy**.

Netlify detecta `netlify/functions/track.js` como función automáticamente.

## Conectar tu dominio `droppergt.com` (desde GoDaddy)

Como la landing NO está en Vercel, no hay "claim". Solo apuntas el DNS:

1. En Netlify → **Domain settings → Add a domain** → escribe `droppergt.com`.
2. Netlify te dará los registros. Con DNS en GoDaddy, lo normal es:
   - Apex `@`: registro **A** → `75.2.60.5`  (usa el valor que te muestre Netlify)
   - `www`: **CNAME** → `<tu-sitio>.netlify.app`
3. En **GoDaddy → DNS**, crea/edita esos registros.
   - **NO toques el registro de `app`** — ese es el sistema en Vercel y se queda igual.
4. Espera la propagación (minutos a ~1h). Netlify activa el HTTPS solo.

> `app.droppergt.com` sigue en la cuenta de Vercel de tu developer, intacto:
> tú solo cambias los registros `@` y `www`, no el de `app`.

## Probar

Pestaña **Rastrear** → ingresa una guía real. Debe mostrar la línea de tiempo con
fechas reales. Prueba directa de la función:
`https://tudominio.com/api/v1/tracking/DR-XXXXXXXX` → debe devolver un JSON.
