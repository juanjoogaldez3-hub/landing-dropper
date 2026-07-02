// Proxy de rastreo Dropper -> Sendabox (Netlify Function)
// El sitio llama a /api/v1/tracking/<GUIA> (redirigido aqui por netlify.toml).
// Extrae la guia del query, del path o de la URL original (robusto ante el :splat de Netlify).
// Usa el modulo https nativo. Servidor-a-servidor = sin CORS.

const https = require('https');

function extractGuia(event) {
  var q = event.queryStringParameters && event.queryStringParameters.guia;
  if (q) return q;
  var candidates = [event.rawUrl, event.path];
  for (var i = 0; i < candidates.length; i++) {
    var u = candidates[i];
    if (!u) continue;
    var m = u.match(/\/tracking\/([^\/?#]+)/);
    if (m && m[1]) {
      try { return decodeURIComponent(m[1]); } catch (e) { return m[1]; }
    }
  }
  return '';
}

exports.handler = async (event) => {
  const guia = (extractGuia(event) || '').trim();
  if (!guia) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Falta el numero de guia' }) };
  }
  const options = {
    hostname: 'api.sendabox.app',
    path: '/v1/tracking/' + encodeURIComponent(guia),
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
