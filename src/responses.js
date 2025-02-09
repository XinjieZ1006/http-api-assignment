const respondJSON = (req, res, status, object) => {
  const content = JSON.stringify(object);
  const headers = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  };
  res.writeHead(status, headers);
  res.write(content);
  res.end();
};

const respondXML = (req, res, status, object) => {
  const headers = {
    'Content-Type': 'text/xml',
    'Content-Length': Buffer.byteLength(object, 'utf8'),
  };
  res.writeHead(status, headers);
  res.write(object);
  res.end();
};

const success = (req, res) => {
  // console.log(`Accepted types: ${req.acceptedTypes}`);
  if (req.acceptedTypes.includes('text/xml')) {
    // add xml
    const responseXML = `
        <response>
            <message>This is a successful response (xml).</message>
        </response>`;
    return respondXML(req, res, 200, responseXML);
  }

  const responseJSON = {
    message: 'This is a successful response (json).',
  };
  return respondJSON(req, res, 200, responseJSON);
};

const badRequest = (req, res) => {
  // if there is a valid=true, return 200
  let statusCode = 200;
  let responseJSON = { message: 'Bad request with valid query parameter set to true' };
  let responseXML = `
        <response>
            <message>Bad request with valid query parameter set to true.</message>
        </response>`;
    // if the request is missing valid=true query parameter, return 400
  if (!req.query.valid || req.query.valid !== 'true') {
    statusCode = 400;
    if (req.acceptedTypes.includes('text/xml')) {
      responseXML = `
        <response>
            <message>Missing valid query paramater set to true.</message>
            <id>badRequest</id>
        </response>`;
    } else {
      responseJSON = {
        id: 'badRequest',
        message: 'Missing valid query paramater set to true',
      };
    }
  }
  if (req.acceptedTypes.includes('text/xml')) {
    return respondXML(req, res, statusCode, responseXML);
  }

  return respondJSON(req, res, statusCode, responseJSON);
};

const unauthorized = (req, res) => {
  // if there is a loggedIn=true, return 200
  let statusCode = 200;
  let responseJSON = { message: 'yay you have access to the content' };
  let responseXML = `
        <response>
            <message>yay you have access to the content</message>
        </response>`;
    // if the request is missing loggedIn=true query parameter, return 400
  if (!req.query.loggedIn || req.query.loggedIn !== 'yes') {
    statusCode = 401;
    if (req.acceptedTypes.includes('text/xml')) {
      responseXML = `
        <response>
            <message>Missing loggedIn query paramater set to yes.</message>
            <id>unauthorized</id>
        </response>`;
    } else {
      responseJSON = {
        id: 'unauthorized',
        message: 'Missing loggedIn query paramater set to yes',
      };
    }
  }
  if (req.acceptedTypes.includes('text/xml')) {
    return respondXML(req, res, statusCode, responseXML);
  }

  return respondJSON(req, res, statusCode, responseJSON);
};

const forbidden = (req, res) => {
  if (req.acceptedTypes.includes('text/xml')) {
    // add xml
    const responseXML = `
        <response>
            <id>forbidden</id>
            <message>You do not have access to this content.</message>
        </response>`;
    return respondXML(req, res, 403, responseXML);
  }

  const responseJSON = {
    id: 'forbidden',
    message: 'You do not have access to this content.',
  };
  return respondJSON(req, res, 403, responseJSON);
};

const internal = (req, res) => {
  if (req.acceptedTypes.includes('text/xml')) {
    // add xml
    const responseXML = `
        <response>
            <id>internalError</id>
            <message>Internal Server Error. Something went wrong</message>
        </response>`;
    return respondXML(req, res, 500, responseXML);
  }

  const responseJSON = {
    id: 'internalError',
    message: 'Internal Server Error. Something went wrong.',
  };
  return respondJSON(req, res, 500, responseJSON);
};

const notImplemented = (req, res) => {
  if (req.acceptedTypes.includes('text/xml')) {
    // add xml
    const responseXML = `
        <response>
            <id>notImplemented</id>
            <message>A get request for this page has not been implemented yet. Check again later for updated content.</message>
        </response>`;
    return respondXML(req, res, 501, responseXML);
  }

  const responseJSON = {
    id: 'notImplemented',
    message: 'A get request for this page has not been implemented yet. Check again later for updated content.',
  };
  return respondJSON(req, res, 501, responseJSON);
};

const notFound = (req, res) => {
  if (req.acceptedTypes.includes('text/xml')) {
    // add xml
    const responseXML = `
        <response>
            <id>notFound</id>
            <message>Page not found</message>
        </response>`;
    return respondXML(req, res, 404, responseXML);
  }

  const responseJSON = {
    id: 'notFound',
    message: 'Page not found.',
  };
  return respondJSON(req, res, 404, responseJSON);
};

module.exports = {
  respondJSON,
  success,
  badRequest,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
  notFound,
};
