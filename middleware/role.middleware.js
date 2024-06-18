const APIError = require('../utils/errors');

const roleMiddleware = (...requiredRole) => {
    return (req, res, next) => {
        if (!req.user || !requiredRole.includes(req.user.role)) {
            return next(new APIError('Access denied', 403));
        }
        next();
    }
}

module.exports = roleMiddleware;