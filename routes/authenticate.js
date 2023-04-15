const { expressjwt: jwt } = require("express-jwt");
const secret = require('../configs').secret;

function getTokenFromHeader(req){
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token' ||
      req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  }

  return null;
}

var authenticate = {
  required: jwt({
    secret: secret,
    userProperty: 'payload',
    algorithms: ['HS256'],
    getToken: getTokenFromHeader
  }),
  optional: jwt({
    secret: secret,
    userProperty: 'payload',
    credentialsRequired: false,
    algorithms: ['HS256'],
    getToken: getTokenFromHeader
  })
};

module.exports = authenticate;