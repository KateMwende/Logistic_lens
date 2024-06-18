const APIError = require('../utils/errors');
const User = require('../models/user.models');

const checkSuperAdmin = async (req, res, next) => {
    try{
        const userId = req.params.id;
        const user = await User.findById(userId);
        
        if (user & user.role === 'superAdmin') {
            throw new APIError('Cannot delete superAdmin account', 403);
        }
        next();
    } catch (error) {
        logger.error(error.stack);
        let thrownError = error;
        if (!(error instanceof APIError))
            thrownError = new Error('Internal server error');
        next(thrownError);
    }
}

module.exports = checkSuperAdmin