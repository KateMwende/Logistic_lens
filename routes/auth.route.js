const router = require('express').Router();
const authController = require('../controller/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const checkSuperAdmin = require('../middleware/superadmin.middleware');


//Get signup page
router.get('/signup', authController.getSignup);

//Create an account
router.post('/register', authMiddleware, roleMiddleware('superAdmin'), authController.createUser);

//Login a user
router.post('/login', authController.loginUser);

//Logout a user
router.post('/logout', authController.logoutUser);

//Get users
router.get('/users', authMiddleware, roleMiddleware('admin', 'superAdmin'), authController.listUsers);

//Delete users
router.delete('/deleteUsers/:id', authMiddleware, roleMiddleware('admin', 'superAdmin'), checkSuperAdmin, authController.deleteUsers)

module.exports = router;