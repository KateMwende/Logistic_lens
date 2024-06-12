const jwt = require('jsonwebtoken');
const APIError = require('../utils/errors');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    authHeader = req.headers.authorization;
    //if error with token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new APIError('Authentication token invalid', 401));
    }
      const token = authHeader.split(' ')[1];

      jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
          return next(new APIError('Token is not valid', 401));
        }
        req.user = decodedToken;
       next();
    });
};


module.exports = authMiddleware;