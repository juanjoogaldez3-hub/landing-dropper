// Proxy de rastreo Dropper -> Sendabox (Netlify Function)
// El sitio llama a /api/v1/tracking/<GUIA>; netlify.toml lo redirige aqui con ?guia=<GUIA>.
// Usa el modulo https nativo (no depende de fetch/Node version). Servidor-a-servidor = sin CORS.

const https = require('https');

exports.handler = async (event) => {
  const guia = (event.queryStringParameters && event.queryStringParameters.guia) || '';
  if (!guia) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Falta el numero de guia' }) };
  }
  const path = '/v1/tracking/' + encodeURIComponent(guia);
  const options = {
    hostname: 'api.sendabox.app',
    path: path,
    method: 'GET',
    headers: { 'x-tenant-id': 'droppergt', 'Accept': 'application/json' }
  };
  return new Promise((resolve) => {
    const req = https.request(options, (r) => {
      let data = '';
      r.on('data', (chunk) => { data += chunk; });
      r.on('end', () => {
        resolve({
          statusCode: r.statusCode || 200,
          headers: {
            'content-type': 'application/json; charset=utf-8',
            'cache-control': 's-maxage=15, stale-while-revalidate=30'
          },
          body: data
        });
      });
    });
    req.on('error', () => {
      resolve({ statusCode: 502, body: JSON.stringify({ error: 'No se pudo consultar el rastreo' }) });
    });
    req.setTimeout(10000, () => { req.destroy(); });
    req.end();
  });
};
