const http = require('http');
const htmlHandler = require('./htmlHandler.js');
const responses = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// router for the urls
const urlStruct = {
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getCSS,
  '/client.js': htmlHandler.getScript,
  '/success': responses.success,
  '/badRequest': responses.badRequest,
  '/unauthorized': responses.unauthorized,
  '/forbidden': responses.forbidden,
  '/internal': responses.internal,
  '/notImplemented': responses.notImplemented,
  notFound: responses.notFound,
};
const onRequest = (req, res) => {
  console.log(req.url);
  const protocol = req.connection.encrypted ? 'https' : 'http';
  const parsesUrl = new URL(req.url, `${protocol}://${req.headers.host}`);

  // parse & store the query params
  req.query = Object.fromEntries(parsesUrl.searchParams);

  // do the same for accepted types
  req.acceptedTypes = req.headers.accept.split(',');
  // console.log(req.acceptedTypes);

  // call corresponding functions
  const url = urlStruct[parsesUrl.pathname];
  if (url) {
    urlStruct[parsesUrl.pathname](req, res);
  } else {
    urlStruct.notFound(req, res);
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Server running on 127.0.0.1:${port}`);
});
