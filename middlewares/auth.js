const jwt = require('jsonwebtoken');

const isAuthenticated = async (req, res, next) => {
    if (typeof req.headers.authorization !== 'undefined') {
      const token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, 'screct', {algorithm: 'HS256'}, async (err, user) => {
        if (err) {
          res.status(404).json({'message': 'Provide valid token'});
        }
        else {
          req.tokenData = user;
          return next();
        }
      });
    } else {
      res.status(404).json({
        'message': 'user unauthorized to access',
      });
    }
  };
  
  module.exports = {
    isAuthenticated: isAuthenticated,
  };