// Proxy de rastreo Dropper → Sendabox (Vercel Serverless Function)
// Ruta pública: /api/v1/tracking/<GUIA>
// El endpoint de Sendabox es público (no requiere token); solo agregamos el
// header x-tenant-id. Al llamarse servidor-a-servidor NO hay restricción CORS,
// así que funciona desde cualquier dominio sin pedir cambios a Sendabox.

export default async function handler(req, res) {
  const { guia } = req.query;
  if (!guia) {
    res.status(400).json({ error: 'Falta el número de guía' });
    return;
  }
  try {
    const upstream = await fetch(
      `https://api.sendabox.app/v1/tracking/${encodeURIComponent(guia)}`,
      { headers: { 'x-tenant-id': 'droppergt' } }
    );
    const body = await upstream.text();
    res.setHeader('content-type', 'application/json; charset=utf-8');
    // cache corto para no golpear la API en cada refresco
    res.setHeader('cache-control', 's-maxage=15, stale-while-revalidate=30');
    res.status(upstream.status).send(body);
  } catch (e) {
    res.status(502).json({ error: 'No se pudo consultar el rastreo' });
  }
}
