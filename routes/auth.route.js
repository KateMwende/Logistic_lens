const router = require('express').Router();
const authController = require('../controller/auth.controller');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

//Get signup page
router.get('/signup', authController.getSignup);

//Post signup details
router.post('/register', authController.createUser);

//Login a user
router.post('/login', authController.loginUser);

//Logout a user
router.post('/logout', authController.logoutUser);

//Get users
router.get('/users', authMiddleware, roleMiddleware('admin', 'superAdmin'), authController.listUsers);

module.exports = router;