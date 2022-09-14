const allowedCors = [
  'https://mesto.frontend.nomoredomains.sbs',
  'http://mesto.frontend.nomoredomains.sbs',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

const DEFAULT_ALLOWED_METHODS = ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'];

const cors = (req, res, next) => {
  const { method } = req;
  const { origin } = req.headers;
  const reqHeaders = req.headers['access-control-request-headers'];

  res.header('Access-Control-Allow-Credentials', true);

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', reqHeaders);
    return res.end();
  }

  return next();
};

module.exports = cors;